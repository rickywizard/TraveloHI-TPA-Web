package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/rickywizard/TraveloHI-TPA-Web/backend/models"
	"gorm.io/gorm"
)

func GiveReward(ctx *fiber.Ctx, db *gorm.DB) error {
	var requestData struct {
		UserID uint `json:"user_id"`
	}

	// Parse body request ke struct requestData
	if err := ctx.BodyParser(&requestData); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	if requestData.UserID == 0 {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Missing user id",
		})
	}

	// Mencari pengguna berdasarkan ID
	var user models.User
	if err := db.Where("id = ?", requestData.UserID).First(&user).Error; err != nil {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "User not found",
		})
	}

	// Menambahkan HIWallet sejumlah 10000 pada HIWallet pengguna
	user.HIWallet += 10000

	// Memperbarui rekam data pengguna di database
	if err := db.Save(&user).Error; err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update user",
		})
	}

	return ctx.JSON(fiber.Map{"message": "Reward added successfully"})
}
