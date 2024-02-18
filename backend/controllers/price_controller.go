package controllers

import (
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/rickywizard/TraveloHI-TPA-Web/backend/models"
	"gorm.io/gorm"
)

func CountHotelNightPrice(price uint, checkIn string, checkOut string) uint {
	// Hitung total harga berdasarkan harga room dan durasi menginap
	checkInDate, _ := time.Parse("2006-01-02", checkIn)
	checkOutDate, _ := time.Parse("2006-01-02", checkOut)
	days := int(checkOutDate.Sub(checkInDate).Hours() / 24)
	totalPrice := price * uint(days)

	return totalPrice
}

func SumHotelSubPrice(ctx *fiber.Ctx, db *gorm.DB) error {
	var request struct {
		RoomID   uint   `json:"room_id"`
		CheckIn  string `json:"check_in"`
		CheckOut string `json:"check_out"`
	}

	if err := ctx.BodyParser(&request); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// Validasi data
	if request.RoomID == 0 || request.CheckIn == "" || request.CheckOut == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Room ID, check-in, and check-out are required",
		})
	}

	// Query untuk mendapatkan informasi room yang dipilih
	var room models.Room
	if err := db.First(&room, request.RoomID).Error; err != nil {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Room not found",
		})
	}

	totalPrice := CountHotelNightPrice(room.Price, request.CheckIn, request.CheckOut)

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{
		"price": totalPrice,
	})
}
