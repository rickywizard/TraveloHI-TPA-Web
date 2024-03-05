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
	"regexp"
	"strconv"
	"strings"
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

func isValidPassword(password string) bool {
	// Persyaratan password: minimal 1 huruf kapital, 1 huruf kecil, 1 angka, 1 simbol, panjang 8-30 karakter
	hasUpperCase := false
	hasLowerCase := false
	hasDigit := false
	hasSymbol := false

	symbols := "!@#$%^&*()-_+="

	for _, char := range password {
		switch {
		case 'A' <= char && char <= 'Z':
			hasUpperCase = true
		case 'a' <= char && char <= 'z':
			hasLowerCase = true
		case '0' <= char && char <= '9':
			hasDigit = true
		case strings.ContainsRune(symbols, char):
			hasSymbol = true
		}
	}

	return hasUpperCase && hasLowerCase && hasDigit && hasSymbol && (8 <= len(password) && len(password) <= 30)
}

func containsSymbolOrDigit(s string) bool {
	for _, char := range s {
		if (char >= '0' && char <= '9') || (char >= 33 && char <= 47) || (char >= 58 && char <= 64) || (char >= 91 && char <= 96) || (char >= 123 && char <= 126) {
			return true
		}
	}
	return false
}

func calculateAge(birthdate time.Time) int {
	now := time.Now()
	age := now.Year() - birthdate.Year()
	if now.YearDay() < birthdate.YearDay() {
		age--
	}
	return age
}

// ---------------------------------------------------

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
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// Validasi field yang tidak boleh kosong
	if data["first_name"] == "" || data["last_name"] == "" || data["email"] == "" || data["password"] == "" || data["date_of_birth"] == "" || data["gender"] == "" || data["security_question"] == "" || data["security_answer"] == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "All fields cannot be empty",
		})
	}

	// Validasi first_name dan last_name
	if len(data["first_name"].(string)) < 5 || len(data["last_name"].(string)) < 5 {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "First name and last name must be at least 5 characters long",
		})
	}
	if containsSymbolOrDigit(data["first_name"].(string)) || containsSymbolOrDigit(data["last_name"].(string)) {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "First name and last name cannot contain symbols or digits",
		})
	}

	// Validasi umur lebih dari 17 tahun
	dateOfBirth, err := time.Parse("2006-01-02", data["date_of_birth"].(string))
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid date of birth format. Use 'yyyy-mm-dd'",
		})
	}
	minimumAge := 17
	if age := calculateAge(dateOfBirth); age <= minimumAge {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": fmt.Sprintf("Age must be greater than %d years", minimumAge),
		})
	}

	// Validasi gender harus pria dan wanita
	if data["gender"].(string) != "Pria" && data["gender"].(string) != "Wanita" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Gender must be 'Pria' or 'Wanita'",
		})
	}

	// Validasi security_question harus salah satu opsi yang diizinkan
	allowedSecurityQuestions := map[string]bool{
		"What is your favorite childhood pet's name?":             true,
		"In which city where you born?":                           true,
		"What is the name of your favorite book or movie?":        true,
		"What is the name of the elementary school you attended?": true,
		"What is the model of your first car?":                    true,
	}

	if _, ok := allowedSecurityQuestions[data["security_question"].(string)]; !ok {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid security question",
		})
	}

	// Validasi password memenuhi kriteria tertentu
	if !isValidPassword(data["password"].(string)) {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid password format. It must contain at least 1 uppercase letter, 1 lowercase letter, 1 digit, 1 symbol, and be 8-30 characters long.",
		})
	}

	// Validasi email
	emailRegex := regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,4}$`)
	if !emailRegex.MatchString(data["email"].(string)) {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid email format. Use [email name]@[domain].com",
		})
	}

	// Cek apakah email sudah ada dalam database
	existingUser := models.User{}
	if err := db.Where("email = ?", data["email"].(string)).First(&existingUser).Error; err == nil {
		// Jika email sudah ada, kirim respons bahwa email harus unik
		return ctx.Status(fiber.StatusConflict).JSON(fiber.Map{
			"error": "Email must be unique. Choose a different email.",
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
		IsActive:          true,
		IsLoggedIn:        false,
		OTPDataID:         otpDataID,
		CreatedAt:         time.Now(),
		UpdatedAt:         time.Now(),
	}

	db.Create(&user)

	err = SendSuccessMail(data["email"].(string))
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Error sending email.",
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

	// Validasi email
	emailRegex := regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$`)
	if !emailRegex.MatchString(data["email"]) {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid email format. Use [email name]@[domain].com",
		})
	}

	var user models.User

	db.Where("email = ?", data["email"]).First(&user)

	if user.ID == 0 || bcrypt.CompareHashAndPassword(user.Password, []byte(data["password"])) != nil {
		return ctx.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Wrong credentials",
		})
	}

	if !user.IsActive {
		return ctx.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Account is not active",
		})
	}

	// Jika pengguna sudah login, kembalikan respons user sudah login
	if user.IsLoggedIn {
		return ctx.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "User is already logged in",
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
			"error": "Could not login",
		})
	}

	cookie := fiber.Cookie{
		Name:     "jwt",
		Value:    token,
		Expires:  time.Now().Add(time.Hour * 24),
		HTTPOnly: true,
	}

	ctx.Cookie(&cookie)

	if err := db.Model(&user).Update("is_logged_in", true).Error; err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to logged in, try again later.",
		})
	}

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
			"error": "Unauthenticated",
		})
	}

	claims := token.Claims.(*jwt.StandardClaims)

	var user models.User

	db.Where("id = ?", claims.Issuer).First(&user)

	return ctx.Status(fiber.StatusOK).JSON(user)
}

func Logout(ctx *fiber.Ctx, db *gorm.DB) error {
	// Cari user dengan jwt
	tokenCookie := ctx.Cookies("jwt")

	token, err := jwt.ParseWithClaims(
		tokenCookie,
		&jwt.StandardClaims{},
		func(token *jwt.Token) (interface{}, error) {
			return []byte(SecretKey), nil
		},
	)

	if err != nil {
		ctx.Status(fiber.StatusUnauthorized)
		return ctx.JSON(fiber.Map{
			"error": "Unauthenticated",
		})
	}

	claims := token.Claims.(*jwt.StandardClaims)

	var user models.User

	db.Where("id = ?", claims.Issuer).First(&user)

	if err := db.Model(&user).Update("is_logged_in", false).Error; err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to logout, try again later.",
		})
	}

	// Buat jwt jadi expired
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
			"error": "User not found",
		})
	}

	// Jika pengguna sudah login, kembalikan respons user sudah login
	if user.IsLoggedIn {
		return ctx.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "User is already logged in",
		})
	}

	// Ambil data OTP yang terkait dengan user
	var otpData models.OTPData
	if err := db.Where("id = ?", user.OTPDataID).First(&otpData).Error; err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Error retrieving OTP data, try again later.",
		})
	}

	// Periksa apakah OTP sesuai
	if data["otp"] != otpData.OTP || time.Now().After(otpData.ExpiryTime) {
		return ctx.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid OTP or OTP has expired",
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
			"error": "Could not generate JWT token",
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

	if err := db.Model(&user).Update("otp_data_id", 1).Update("is_logged_in", true).Error; err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Error updating user data, try again later.",
		})
	}

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

	// Validasi status IsActive user
	if !user.IsActive {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "User is not active",
		})
	}

	// Validasi password memenuhi kriteria tertentu
	if !isValidPassword(newPassword) {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid password format. It must contain at least 1 uppercase letter, 1 lowercase letter, 1 digit, 1 symbol, and be 8-30 characters long.",
		})
	}

	// Validasi agar password baru tidak sama dengan password lama
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(newPassword)); err == nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "New password must be different from the current password",
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

func GetUserID(ctx *fiber.Ctx, db *gorm.DB) uint {
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
		return 0
	}

	claims := token.Claims.(*jwt.StandardClaims)

	var user models.User

	db.Where("id = ?", claims.Issuer).First(&user)

	return user.ID
}
