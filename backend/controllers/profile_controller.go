package controllers

import (
	"fmt"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/rickywizard/TraveloHI-TPA-Web/backend/models"
	"gorm.io/gorm"
)

func UpdateProfile(ctx *fiber.Ctx, db *gorm.DB) error {
	userId := GetUserID(ctx, db)

	var requestData struct {
		FirstName         string `json:"first_name"`
		LastName          string `json:"last_name"`
		Email             string `json:"email"`
		DateOfBirth       string `json:"date_of_birth"`
		Phone             string `json:"phone"`
		Address           string `json:"address"`
		ProfilePictureUrl string `json:"profile_picture_url"`
		IsSubscriber      bool   `json:"is_subscriber"`
	}

	// Parse body request ke struct requestData
	if err := ctx.BodyParser(&requestData); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// Validasi kosong
	if requestData.FirstName == "" || requestData.LastName == "" || requestData.Email == "" || requestData.DateOfBirth == "" || requestData.Phone == "" || requestData.Address == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "All fields cannot be empty",
		})
	}

	// Validasi email harus unik
	var existingUser models.User
	if err := db.Where("email = ?", requestData.Email).First(&existingUser).Error; err == nil && existingUser.ID != userId {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Email is already taken",
		})
	}

	// Validasi phone harus unik
	if err := db.Where("phone = ?", requestData.Phone).First(&existingUser).Error; err == nil && existingUser.ID != userId {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Phone number is already taken",
		})
	}

	// Validasi umur lebih dari 17 tahun
	dateOfBirth, err := time.Parse("2006-01-02", requestData.DateOfBirth)
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

	// Update profile di database
	var user models.User
	if err := db.First(&user, userId).Error; err != nil {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "User not found",
		})
	}

	user.FirstName = requestData.FirstName
	user.LastName = requestData.LastName
	user.Email = requestData.Email
	user.DateOfBirth = requestData.DateOfBirth
	user.Phone = requestData.Phone
	user.Address = requestData.Address
	user.IsSubscriber = requestData.IsSubscriber

	// Save changes to the database
	if err := db.Save(&user).Error; err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update profile",
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Profile updated successfully",
	})
}

func AddCreditCard(ctx *fiber.Ctx, db *gorm.DB) error {
	userId := GetUserID(ctx, db)

	var requestData struct {
		Bank       string `json:"bank"`
		CreditCard string `json:"credit_card"`
	}

	// Parse body request ke struct requestData
	if err := ctx.BodyParser(&requestData); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// Hilangkan spasi pada bank dan nomor kartu kredit
	requestData.Bank = strings.ReplaceAll(requestData.Bank, " ", "")
	requestData.CreditCard = strings.ReplaceAll(requestData.CreditCard, " ", "")

	// Validasi kosong
	if requestData.Bank == "" || requestData.CreditCard == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "All fields cannot be empty",
		})
	}

	// Validasi bank harus unik
	var existingUser models.User
	if err := db.Where("bank = ?", requestData.Bank).First(&existingUser).Error; err == nil && existingUser.ID != userId {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Bank is already associated with another user",
		})
	}

	// Validasi nomor kartu kredit harus unik
	if err := db.Where("credit_card = ?", requestData.CreditCard).First(&existingUser).Error; err == nil && existingUser.ID != userId {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Credit card number is already associated with another user",
		})
	}

	// Update data kredit di database
	var user models.User
	if err := db.First(&user, userId).Error; err != nil {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "User not found",
		})
	}

	user.Bank = requestData.Bank
	user.CreditCard = requestData.CreditCard

	// Save changes to the database
	if err := db.Save(&user).Error; err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to add credit card",
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Credit card added successfully",
	})
}
