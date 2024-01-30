package controllers

import (
	"crypto/rand"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"math/big"
	"net/http"
	"net/smtp"
	"net/url"
	"strconv"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gofiber/fiber/v2"
	"github.com/rickywizard/TraveloHI-TPA-Web/backend/models"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

const (
	SecretKey  = "secret"
	SiteSecret = "6Le7aFkpAAAAAD4tOqdWH8uavxctsAffRDx1U7pu"
)

func SendSuccessMail(recipientEmail string) error {
	smtpHost := "smtp.gmail.com"
	smtpPort := 587
	smtpUsername := "id.vladapp@gmail.com"
	smtpPassword := "rqgrnlruynbuuvsr"

	to := []string{recipientEmail}
	subject := "TraveLoHI Account"
	body := "Your account successfully created, please login."

	message := []byte("To: " + recipientEmail + "\r\n" +
		"Subject: " + subject + "\r\n" +
		"\r\n" +
		body + "\r\n")

	auth := smtp.PlainAuth("", smtpUsername, smtpPassword, smtpHost)
	err := smtp.SendMail(smtpHost+":"+fmt.Sprint(smtpPort), auth, smtpUsername, to, message)
	if err != nil {
		return err
	}

	return nil
}

func Register(ctx *fiber.Ctx, db *gorm.DB) error {
	var data map[string]interface{}

	if err := ctx.BodyParser(&data); err != nil {
		return err
	}

	// Cek apakah email sudah ada dalam database
	existingUser := models.User{}
	if err := db.Where("email = ?", data["email"].(string)).First(&existingUser).Error; err == nil {
		// Jika email sudah ada, kirim respons bahwa email harus unik
		return ctx.Status(fiber.StatusConflict).JSON(fiber.Map{
			"message": "Email must be unique. Choose a different email.",
		})
	}

	profilePicture := data["profile_picture_url"].(string)
	if profilePicture == "" {
		profilePicture = "https://firebasestorage.googleapis.com/v0/b/travelohi-f39a6.appspot.com/o/profile_images%2Fdummy.webp?alt=media&token=987e1dd5-9224-4d88-b522-9065cb958bb9"
	}

	password, _ := bcrypt.GenerateFromPassword([]byte(data["password"].(string)), 14)

	otpDataID, ok := data["otp"].(uint)
	if !ok || otpDataID == 0 {
		otpDataID = 1 // Nilai default
	}

	user := models.User{
		FirstName:         data["first_name"].(string),
		LastName:          data["last_name"].(string),
		Email:             data["email"].(string),
		DateOfBirth:       data["date_of_birth"].(string),
		Password:          password,
		Gender:            data["gender"].(string),
		ProfilePictureUrl: data["profile_picture_url"].(string),
		SecurityQuestion:  data["security_question"].(string),
		SecurityAnswer:    data["security_answer"].(string),
		IsSubscriber:      data["is_subscriber"].(bool),
		IsActive:          data["is_active"].(bool),
		OTPDataID:         otpDataID,
		CreatedAt:         time.Now(),
		UpdatedAt:         time.Now(),
	}

	db.Create(&user)

	err := SendSuccessMail(data["email"].(string))
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Error sending email.",
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Account successfully registered. Check your email.",
	})
}

func Login(ctx *fiber.Ctx, db *gorm.DB) error {
	var data map[string]string

	if err := ctx.BodyParser(&data); err != nil {
		return err
	}

	var user models.User

	db.Where("email = ?", data["email"]).First(&user)

	if user.ID == 0 || bcrypt.CompareHashAndPassword(user.Password, []byte(data["password"])) != nil {
		return ctx.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "Wrong credentials",
		})
	}

	if !user.IsActive {
		return ctx.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "Account is not active",
		})
	}

	claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.StandardClaims{
		Issuer:    strconv.Itoa(int(user.ID)),
		ExpiresAt: time.Now().Add(time.Hour * 24).Unix(), // 1 day exp
	})

	token, err := claims.SignedString([]byte(SecretKey))

	if err != nil {
		ctx.Status(fiber.StatusInternalServerError)
		return ctx.JSON(fiber.Map{
			"message": "Could not login",
		})
	}

	cookie := fiber.Cookie{
		Name:     "jwt",
		Value:    token,
		Expires:  time.Now().Add(time.Hour * 24),
		HTTPOnly: true,
	}

	ctx.Cookie(&cookie)

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Login success",
	})
}

func User(ctx *fiber.Ctx, db *gorm.DB) error {
	cookie := ctx.Cookies("jwt")

	token, err := jwt.ParseWithClaims(
		cookie,
		&jwt.StandardClaims{},
		func(token *jwt.Token) (interface{}, error) {
			return []byte(SecretKey), nil
		},
	)

	if err != nil {
		ctx.Status(fiber.StatusUnauthorized)
		return ctx.JSON(fiber.Map{
			"message": "Unauthenticated",
		})
	}

	claims := token.Claims.(*jwt.StandardClaims)

	var user models.User

	db.Where("id = ?", claims.Issuer).First(&user)

	return ctx.Status(fiber.StatusOK).JSON(user)
}

func Logout(ctx *fiber.Ctx) error {
	cookie := fiber.Cookie{
		Name:     "jwt",
		Value:    "",
		Expires:  time.Now().Add(-time.Hour * 24),
		HTTPOnly: true,
	}

	ctx.Cookie(&cookie)

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Logout success",
	})
}

func VerifyCaptcha(ctx *fiber.Ctx) error {
	var captchaRequest models.CaptchaRequest

	if err := ctx.BodyParser(&captchaRequest); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	captchaValue := captchaRequest.CaptchaValue

	if captchaValue == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Missing captchaValue parameter",
		})
	}

	verifyURL := fmt.Sprintf("https://www.google.com/recaptcha/api/siteverify?secret=%s&response=%s", SiteSecret, captchaValue)

	resp, err := http.PostForm(verifyURL, url.Values{})

	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error verifying captcha"})
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return ctx.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": "Error reading response body",
		})
	}

	var recaptchaResponse models.RecaptchaResponse
	err = json.Unmarshal(body, &recaptchaResponse)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error parsing JSON response"})
	}

	// Kirim kembali response ke klien
	return ctx.JSON(recaptchaResponse)
}

func GenerateOTP() string {
	otp, err := rand.Int(rand.Reader, big.NewInt(999999))
	if err != nil {
		panic(err)
	}

	return fmt.Sprintf("%06d", otp)
}

func SendToEmail(recipientEmail, otp string) error {
	smtpHost := "smtp.gmail.com"
	smtpPort := 587
	smtpUsername := "id.vladapp@gmail.com"
	smtpPassword := "rqgrnlruynbuuvsr"

	to := []string{recipientEmail}
	subject := "TraveLoHI OTP Code"
	body := fmt.Sprintf("Your OTP Code is: %s.\nPlease verify to login.", otp)

	message := []byte("To: " + recipientEmail + "\r\n" +
		"Subject: " + subject + "\r\n" +
		"\r\n" +
		body + "\r\n")

	auth := smtp.PlainAuth("", smtpUsername, smtpPassword, smtpHost)
	err := smtp.SendMail(smtpHost+":"+fmt.Sprint(smtpPort), auth, smtpUsername, to, message)
	if err != nil {
		return err
	}

	return nil
}

func SendOTP(ctx *fiber.Ctx, db *gorm.DB) error {
	email := ctx.Query("email")

	if email == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Missing email",
		})
	}

	otp := GenerateOTP()

	expiryTime := time.Now().Add(1 * time.Minute)

	// Cari user berdasarkan email
	var user models.User
	if err := db.Where("email = ?", email).First(&user).Error; err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "User not found",
		})
	}

	// Save OTPData to database
	otpData := models.OTPData{
		OTP:        otp,
		ExpiryTime: expiryTime,
	}
	if err := db.Create(&otpData).Error; err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Error saving OTP data, try again later.",
		})
	}

	// Update OTPDataID in User
	user.OTPDataID = otpData.ID
	if err := db.Save(&user).Error; err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Error updating user data, try again later.",
		})
	}

	// Kirim ke email
	err := SendToEmail(email, otp)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Error sending OTP email, try again later.",
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "OTP sent successfully",
	})
}

func VerifyOTP(ctx *fiber.Ctx, db *gorm.DB) error {
	var data map[string]string

	if err := ctx.BodyParser(&data); err != nil {
		return err
	}

	// Cari user berdasarkan email
	var user models.User
	if err := db.Where("email = ?", data["email"]).First(&user).Error; err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "User not found",
		})
	}

	// Ambil data OTP yang terkait dengan user
	var otpData models.OTPData
	if err := db.Where("id = ?", user.OTPDataID).First(&otpData).Error; err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Error retrieving OTP data, try again later.",
		})
	}

	// Periksa apakah OTP sesuai
	if data["otp"] != otpData.OTP || time.Now().After(otpData.ExpiryTime) {
		return ctx.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "Invalid OTP or OTP has expired",
		})
	}

	// OTP valid, buat token JWT
	claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.StandardClaims{
		Issuer:    strconv.Itoa(int(user.ID)),
		ExpiresAt: time.Now().Add(time.Hour * 24).Unix(), // 1 day exp
	})

	token, err := claims.SignedString([]byte(SecretKey))
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Could not generate JWT token",
		})
	}

	// Set cookie JWT
	cookie := fiber.Cookie{
		Name:     "jwt",
		Value:    token,
		Expires:  time.Now().Add(time.Hour * 24),
		HTTPOnly: true,
	}
	ctx.Cookie(&cookie)

	if err := db.Delete(&otpData).Error; err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Error deleting OTP data, try again later.",
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Login success",
	})
}

func GetSecurityQuestion(ctx *fiber.Ctx, db *gorm.DB) error {
	email := ctx.Query("email")

	if email == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Missing email",
		})
	}

	// Cari user berdasarkan email
	var user models.User
	if err := db.Where("email = ?", email).First(&user).Error; err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "User not found",
		})
	}

	// Kirim pertanyaan keamanan sebagai respons
	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{
		"security_question": user.SecurityQuestion,
	})
}

func CheckSecurityAnswer(ctx *fiber.Ctx, db *gorm.DB) error {
	var data map[string]string

	if err := ctx.BodyParser(&data); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	email := data["email"]
	securityAnswer := data["security_answer"]

	if email == "" || securityAnswer == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Email and security answer are required",
		})
	}

	// Cari user berdasarkan email
	var user models.User
	if err := db.Where("email = ?", email).First(&user).Error; err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "User not found",
		})
	}

	// Periksa apakah jawaban keamanan sesuai
	if securityAnswer != user.SecurityAnswer {
		return ctx.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Incorrect security answer",
		})
	}

	// Jawaban keamanan sesuai, set status dan pesan yang sesuai
	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Correct security answer",
	})
}

func UpdatePassword(ctx *fiber.Ctx, db *gorm.DB) error {
	var data map[string]string

	if err := ctx.BodyParser(&data); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	email := data["email"]
	newPassword := data["new_password"]

	if email == "" || newPassword == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Email and new password are required",
		})
	}

	// Cari user berdasarkan email
	var user models.User
	if err := db.Where("email = ?", email).First(&user).Error; err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "User not found",
		})
	}

	// Hash password baru dengan bcrypt
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Error hashing the new password",
		})
	}

	// Update password di database
	user.Password = hashedPassword
	if err := db.Save(&user).Error; err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Error updating password",
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Password updated successfully, please login",
	})
}
