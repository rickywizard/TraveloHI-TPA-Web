package controllers

import (
	"fmt"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/rickywizard/TraveloHI-TPA-Web/backend/models"
	"gorm.io/gorm"
)

func GetAllUser(ctx *fiber.Ctx, db *gorm.DB) error {
	var users []models.User
	result := db.Find(&users)

	if result.Error != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Internal Server Error"})
	}

	return ctx.Status(fiber.StatusOK).JSON(users)
}

func BanUnbanUser(ctx *fiber.Ctx, db *gorm.DB) error {
	userId, err := strconv.Atoi(ctx.Params("id"))
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid user ID",
		})
	}

	var user models.User
	if err := db.First(&user, userId).Error; err != nil {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "User not found",
		})
	}

	// Toggle the is_active status
	user.IsActive = !user.IsActive
	if err := db.Save(&user).Error; err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update user status",
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": fmt.Sprintf("User status updated. New status: %t", user.IsActive),
	})
}
