package controllers

import (
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/rickywizard/TraveloHI-TPA-Web/backend/models"
	"gorm.io/gorm"
)

func AddHotelCart(ctx *fiber.Ctx, db *gorm.DB) error {
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

	// Validasi check out harus lebih besar dari check in
	checkInTime, err := time.Parse("2006-01-02", request.CheckIn)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid check-in date format",
		})
	}

	checkOutTime, err := time.Parse("2006-01-02", request.CheckOut)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid check-out date format",
		})
	}

	if checkOutTime.Before(checkInTime) || checkOutTime.Equal(checkInTime) {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Check-out date must be greater than check-in date",
		})
	}

	// Ambil user
	userID := GetUserID(ctx, db)

	// Query untuk mendapatkan informasi room yang dipilih
	var room models.Room
	if err := db.First(&room, request.RoomID).Error; err != nil {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Room not found",
		})
	}

	totalPrice := CountHotelNightPrice(room.Price, request.CheckIn, request.CheckOut)

	// Masukkan data ke dalam cart
	cart := models.HotelCart{
		UserID:     userID,
		RoomID:     request.RoomID,
		CheckIn:    request.CheckIn,
		CheckOut:   request.CheckOut,
		TotalPrice: totalPrice,
	}

	if err := db.Create(&cart).Error; err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to add room to cart",
		})
	}

	// Kirim respons dengan informasi cart
	return ctx.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Room added to cart successfully",
	})
}

func UpdateHotelCart(ctx *fiber.Ctx, db *gorm.DB) error {
	cartID, err := strconv.ParseUint(ctx.Params("id"), 10, 64)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid cart_id",
		})
	}

	var updateData struct {
		CheckIn  string `json:"check_in"`
		CheckOut string `json:"check_out"`
	}

	if err := ctx.BodyParser(&updateData); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// Validasi data
	if updateData.CheckIn == "" || updateData.CheckOut == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Check-in and check-out are required",
		})
	}

	// Validasi check out harus lebih besar dari check in
	checkInTime, err := time.Parse("2006-01-02", updateData.CheckIn)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid check-in date format",
		})
	}

	checkOutTime, err := time.Parse("2006-01-02", updateData.CheckOut)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid check-out date format",
		})
	}

	if checkOutTime.Before(checkInTime) || checkOutTime.Equal(checkInTime) {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Check-out date must be greater than check-in date",
		})
	}

	userID := GetUserID(ctx, db)

	// Cek cart user
	var existingCart models.HotelCart
	if err := db.Where("id = ? AND user_id = ?", cartID, userID).First(&existingCart).Error; err != nil {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Cart not found",
		})
	}

	// Update data check-in dan check-out
	if err := db.Model(&existingCart).Updates(models.HotelCart{CheckIn: updateData.CheckIn, CheckOut: updateData.CheckOut}).Error; err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update cart dates",
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Cart updated",
	})
}

func RemoveHotelCart(ctx *fiber.Ctx, db *gorm.DB) error {
	// Ambil ID cart dari parameter URL
	cartID := ctx.Params("id")

	// Cek apakah ID cart ada
	if cartID == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "No cart id",
		})
	}

	// Hapus cart berdasarkan ID
	if err := db.Where("id = ?", cartID).Delete(&models.HotelCart{}).Error; err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to remove hotel cart",
		})
	}

	// Kirim response sukses
	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Hotel cart removed successfully",
	})
}

// func AddFlightCart(ctx *fiber.Ctx, db *gorm.DB) error {

// }

func GetAllCart(ctx *fiber.Ctx, db *gorm.DB) error {
	userID := GetUserID(ctx, db)

	var hotelCarts []models.HotelCart
	if err := db.Where("user_id = ?", userID).Preload("Room").Preload("Room.RoomImages").Find(&hotelCarts).Error; err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch hotel cart data",
		})
	}

	// Kalkulasi CartTotalPrice dari seluruh TotalPrice
	var cartTotalPrice uint
	for _, cart := range hotelCarts {
		cartTotalPrice += cart.TotalPrice
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{
		"hotel_cart":       hotelCarts,
		"cart_total_price": cartTotalPrice,
	})
}
