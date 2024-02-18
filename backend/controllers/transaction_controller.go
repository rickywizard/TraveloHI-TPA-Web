package controllers

import (
	"strconv"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gofiber/fiber/v2"
	"github.com/rickywizard/TraveloHI-TPA-Web/backend/models"
	"gorm.io/gorm"
)

// HOTEL
func GetAllHotelTransaction(ctx *fiber.Ctx, db *gorm.DB) error {
	var hotelTransactions []models.HotelTransaction

	// Mendapatkan informasi pengguna dari sesi atau tempat lain
	userID := GetUserID(ctx, db)

	if err := db.Preload("Room").Preload("Room.RoomImages").
		Where("user_id = ?", userID).
		Find(&hotelTransactions).Error; err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch hotel transactions"})
	}

	// Pengecekan waktu expired (30 menit setelah created_at)
	for _, transaction := range hotelTransactions {
		expirationTime := transaction.CreatedAt.Add(30 * time.Minute)

		if time.Now().After(expirationTime) {
			// Jika waktu hari ini sudah melewati created_date + 30 menit
			// Set IsExpired pada transaksi menjadi true
			transaction.IsExpired = true
			if err := db.Save(&transaction).Error; err != nil {
				return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update transaction expiration"})
			}
		}
	}

	return ctx.Status(fiber.StatusOK).JSON(hotelTransactions)
}

func AddHotelTransaction(ctx *fiber.Ctx, db *gorm.DB) error {
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

	userID := user.ID

	// Query untuk mendapatkan informasi room yang dipilih
	var room models.Room
	if err := db.First(&room, request.RoomID).Error; err != nil {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Room not found",
		})
	}

	// Pengecekan apakah kamar sudah dibooking pada rentang tanggal check_in sampai check_out
	var existingTransaction models.HotelTransaction
	if err := db.Where("room_id = ? AND ((check_in <= ? AND check_out >= ?) OR (check_in <= ? AND check_out >= ?) OR (check_in >= ? AND check_out <= ?))",
		request.RoomID, request.CheckIn, request.CheckIn, request.CheckOut, request.CheckOut, request.CheckIn, request.CheckOut).
		First(&existingTransaction).Error; err == nil {
		return ctx.Status(fiber.StatusConflict).JSON(fiber.Map{
			"error": "Room is already booked for the specified dates",
		})
	}

	// Total price
	totalPrice := CountHotelNightPrice(room.Price, request.CheckIn, request.CheckOut)

	transaction := models.HotelTransaction{
		UserID:     userID,
		RoomID:     request.RoomID,
		CheckIn:    request.CheckIn,
		CheckOut:   request.CheckOut,
		TotalPrice: totalPrice,
		IsPaid:     false,
		IsExpired:  false,
	}

	if err := db.Create(&transaction).Error; err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to book hotel room",
		})
	}

	return ctx.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Hotel booking success, Please pay",
		"id":      transaction.ID,
	})
}

func PayHotel(ctx *fiber.Ctx, db *gorm.DB) error {
	var request struct {
		TransactionID uint   `json:"transaction_id"`
		PaymentMethod string `json:"payment_method"`
		PromoCode     string `json:"promo_code"`
	}

	if err := ctx.BodyParser(&request); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// Validasi data
	if request.TransactionID == 0 {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Transaction ID is required",
		})
	}
	if request.PaymentMethod == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Payment method is required",
		})
	}

	// Ambil data transaksi
	userID := GetUserID(ctx, db)

	var transaction models.HotelTransaction
	if err := db.Where("user_id = ?", userID).Preload("User").First(&transaction).Error; err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to get transaction detail",
		})
	}

	// Validasi apakah transaksi telah kadaluarsa
	if transaction.IsExpired {
		return ctx.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"error": "Transaction has expired",
		})
	}

	// Validasi waktu kadaluarsa
	expirationTime := transaction.CreatedAt.Add(30 * time.Minute)
	if time.Now().After(expirationTime) {
		// Jika waktu hari ini sudah melewati created_date + 30 menit
		// Set IsExpired pada transaksi menjadi true
		transaction.IsExpired = true
		if err := db.Save(&transaction).Error; err != nil {
			return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to update transaction expiration",
			})
		}

		return ctx.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"error": "Transaction has expired",
		})
	}

	// Validasi PromoCode
	if request.PromoCode != "" {
		var existingTransactions []models.HotelTransaction
		if err := db.
			Where("user_id = ? AND promo_code = ?", userID, request.PromoCode).
			Find(&existingTransactions).Error; err == nil {
			if len(existingTransactions) > 0 {
				return ctx.Status(fiber.StatusConflict).JSON(fiber.Map{
					"error": "Promo Code has already been used",
				})
			}
		} else {
			return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to check Promo Code",
			})
		}
	}

	// Ubah data transaksi
	transaction.PaymentMethod = request.PaymentMethod
	transaction.PromoCode = request.PromoCode
	transaction.IsPaid = true

	// Simpan perubahan ke database
	if err := db.Save(&transaction).Error; err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update transaction",
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Transaction paid successfully",
	})
}

func GetHotelTransactionDetail(ctx *fiber.Ctx, db *gorm.DB) error {
	// Ambil transaction_id dari parameter URL
	transactionID, err := strconv.ParseUint(ctx.Params("id"), 10, 64)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid transaction_id",
		})
	}

	// Ambil userID dari sesi atau sesuai dengan kebutuhan aplikasi Anda
	userID := GetUserID(ctx, db)

	var transaction models.HotelTransaction
	if err := db.Where("id = ? AND user_id = ?", transactionID, userID).
		Preload("User").
		Preload("Room").
		Preload("Room.RoomImages").
		Preload("Room.Facilities").First(&transaction).Error; err != nil {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Transaction not found",
		})
	}

	// Validasi apakah transaksi telah kadaluarsa
	if transaction.IsExpired {
		return ctx.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"error": "Transaction has expired",
		})
	}

	// Validasi waktu kadaluarsa
	expirationTime := transaction.CreatedAt.Add(30 * time.Minute)
	if time.Now().After(expirationTime) {
		// Jika waktu hari ini sudah melewati created_date + 30 menit
		// Set IsExpired pada transaksi menjadi true
		transaction.IsExpired = true
		if err := db.Save(&transaction).Error; err != nil {
			return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to update transaction expiration",
			})
		}

		return ctx.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"error": "Transaction has expired",
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(transaction)
}

// FLIGHT
// func GetAllFlightTransaction(ctx *fiber.Ctx, db *gorm.DB) error {

// }

// func AddFlightTransaction(ctx *fiber.Ctx, db *gorm.DB) error {

// }

// func PayFlight(ctx *fiber.Ctx, db *gorm.DB) erro {

// }

// func GetFlightTransactionDetail(ctx *fiber.Ctx, db *gorm.DB) error {

// }

// func AddAllCartTransaction(ctx *fiber.Ctx, db *gorm.DB) error {

// }
