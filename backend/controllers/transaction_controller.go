package controllers

import (
	"fmt"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/rickywizard/TraveloHI-TPA-Web/backend/models"
	"gorm.io/gorm"
)

// HOTEL
func GetOnGoingHotelTickets(ctx *fiber.Ctx, db *gorm.DB) error {
	var hotelTransactions []models.HotelTransaction

	// Mendapatkan informasi pengguna dari sesi atau tempat lain
	userID := GetUserID(ctx, db)

	if err := db.Preload("Room").Preload("Room.RoomImages").
		Where("user_id = ?", userID).
		Find(&hotelTransactions).Error; err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch hotel transactions",
		})
	}

	// Filter hotelTransactions yang masih berlaku (CheckOut belum melebihi waktu hari ini)
	var onGoingHotelTransactions []models.HotelTransaction
	today := time.Now()
	for _, transaction := range hotelTransactions {
		checkOutTime, err := time.Parse("2006-01-02", transaction.CheckOut)
		if err != nil {
			return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to parse CheckOut date",
			})
		}

		if !checkOutTime.Before(today) {
			onGoingHotelTransactions = append(onGoingHotelTransactions, transaction)
		}
	}

	return ctx.Status(fiber.StatusOK).JSON(onGoingHotelTransactions)
}

func GetPastHotelTickets(ctx *fiber.Ctx, db *gorm.DB) error {
	var hotelTransactions []models.HotelTransaction

	// Mendapatkan informasi pengguna dari sesi atau tempat lain
	userID := GetUserID(ctx, db)

	if err := db.Preload("Room").Preload("Room.RoomImages").
		Where("user_id = ?", userID).
		Find(&hotelTransactions).Error; err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch hotel transactions"})
	}

	// Filter hotelTransactions yang sudah berlalu (CheckOut sudah lewat dari tanggal hari ini)
	var pastHotelTransactions []models.HotelTransaction
	today := time.Now()
	for _, transaction := range hotelTransactions {
		checkOutTime, err := time.Parse("2006-01-02", transaction.CheckOut)
		if err != nil {
			return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to parse CheckOut date"})
		}

		if checkOutTime.Before(today) {
			pastHotelTransactions = append(pastHotelTransactions, transaction)
		}
	}

	return ctx.Status(fiber.StatusOK).JSON(pastHotelTransactions)
}

func AddHotelTransaction(ctx *fiber.Ctx, db *gorm.DB) error {
	var request struct {
		HotelID       uint   `json:"hotel_id"`
		RoomID        uint   `json:"room_id"`
		CheckIn       string `json:"check_in"`
		CheckOut      string `json:"check_out"`
		PaymentMethod string `json:"payment_method"`
		PromoCode     string `json:"promo_code"`
	}

	if err := ctx.BodyParser(&request); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// Ambil user
	userID := GetUserID(ctx, db)

	// Validasi data
	if request.RoomID == 0 || request.CheckIn == "" || request.CheckOut == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Room ID, check-in, and check-out are required",
		})
	}

	if request.PaymentMethod == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Payment method is required",
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

	// Discount if there is promo
	// Validasi PromoCode
	if request.PromoCode != "" {
		var promo models.Promo
		if err := db.Where("code = ?", request.PromoCode).First(&promo).Error; err != nil {
			return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid Promo Code",
			})
		}

		discount, _ := strconv.Atoi(promo.Discount)

		// Kurangi totalPrice dengan diskon promo
		totalPrice -= uint(discount)
	}

	// Query untuk mendapatkan informasi pengguna
	var user models.User
	if err := db.First(&user, userID).Error; err != nil {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "User not found",
		})
	}

	// Check Available Payment Method
	// Validasi credit card ada
	if request.PaymentMethod == "Credit Card" {
		if user.CreditCard == "" {
			return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "You have not add credit card",
			})
		}
	} else if request.PaymentMethod == "HI Wallet" {
		// Validasi HI Wallet
		if user.HIWallet < totalPrice {
			return ctx.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"error": "Insufficient HIWallet balance",
			})
		}

		// Mengurangkan saldo HIWallet
		user.HIWallet -= totalPrice
		if err := db.Save(&user).Error; err != nil {
			return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to update HIWallet balance",
			})
		}
	}

	transaction := models.HotelTransaction{
		HotelID:    request.HotelID,
		UserID:     userID,
		RoomID:     request.RoomID,
		CheckIn:    request.CheckIn,
		CheckOut:   request.CheckOut,
		TotalPrice: totalPrice,
	}

	if err := db.Create(&transaction).Error; err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to book hotel room",
		})
	}

	return ctx.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Hotel booking success",
	})
}

// FLIGHT
func GetOnGoingFlightTickets(ctx *fiber.Ctx, db *gorm.DB) error {
	// Ambil user ID dari token atau sesi, sesuai dengan implementasi autentikasi Anda
	userID := GetUserID(ctx, db)

	// Mengambil transaksi yang belum terbang (tanggal penerbangan lebih besar dari hari ini)
	var onGoingFlightTickets []models.FlightTransaction
	if err := db.
		Preload("Flight.Airline").
		Where("user_id = ? AND flights.departure_datetime > ?", userID, time.Now()).
		Joins("JOIN flights ON flight_transactions.flight_id = flights.id").
		Find(&onGoingFlightTickets).Error; err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch on-going flight tickets",
		})
	}

	// Mengembalikan response dengan data transaksi
	return ctx.Status(fiber.StatusOK).JSON(onGoingFlightTickets)
}

func GetPastFlightTickets(ctx *fiber.Ctx, db *gorm.DB) error {
	// Ambil user ID dari token atau sesi, sesuai dengan implementasi autentikasi Anda
	userID := GetUserID(ctx, db)

	// Mengambil transaksi yang sudah terbang (tanggal penerbangan lebih kecil atau sama dengan hari ini)
	var pastFlightTickets []models.FlightTransaction
	if err := db.
		Preload("Flight.Airline").
		Where("user_id = ? AND flights.departure_datetime <= ?", userID, time.Now()).
		Joins("JOIN flights ON flight_transactions.flight_id = flights.id").
		Find(&pastFlightTickets).Error; err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch past flight tickets",
		})
	}

	// Mengembalikan response dengan data transaksi
	return ctx.Status(fiber.StatusOK).JSON(pastFlightTickets)
}

func isSeatBooked(db *gorm.DB, flightID, seatNumber uint) bool {
	var bookedSeat models.BookedSeat
	if err := db.
		Where("flight_id = ? AND seat_number = ?", flightID, seatNumber).
		First(&bookedSeat).
		Error; err != nil {
		return false // Seat belum dibooking
	}
	return true // Seat sudah dibooking
}

func AddFlightTransaction(ctx *fiber.Ctx, db *gorm.DB) error {
	var request struct {
		FlightID      uint   `json:"flight_id"`
		Seats         []uint `json:"seats"`
		AddLuggage    bool   `json:"add_luggage"`
		PaymentMethod string `json:"payment_method"`
		PromoCode     string `json:"promo_code"`
	}

	if err := ctx.BodyParser(&request); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// Validasi data yang diterima dari frontend
	if request.FlightID == 0 || len(request.Seats) == 0 || request.PaymentMethod == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Seat and Payment Method cannot be empty",
		})
	}

	// Ambil user
	userID := GetUserID(ctx, db)

	// Mengambil data harga dari flight
	var flight models.Flight
	if err := db.Select("price").First(&flight, request.FlightID).Error; err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch flight data",
		})
	}

	// Menghitung total harga berdasarkan jumlah seat dan harga flight
	totalPrice := flight.Price * uint(len(request.Seats))

	// Menambahkan biaya tambahan jika add_luggage true
	if request.AddLuggage {
		totalPrice += 300000
	}

	// Discount if there is promo
	// Validasi PromoCode
	if request.PromoCode != "" {
		var promo models.Promo
		if err := db.Where("code = ?", request.PromoCode).First(&promo).Error; err != nil {
			return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid Promo Code",
			})
		}

		discount, _ := strconv.Atoi(promo.Discount)

		// Kurangi totalPrice dengan diskon promo
		totalPrice -= uint(discount)
	}

	// Query untuk mendapatkan informasi pengguna
	var user models.User
	if err := db.First(&user, userID).Error; err != nil {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "User not found",
		})
	}

	// Check Available Payment Method
	// Validasi credit card ada
	if request.PaymentMethod == "Credit Card" {
		if user.CreditCard == "" {
			return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "You have not add credit card",
			})
		}
	} else if request.PaymentMethod == "HI Wallet" {
		// Validasi HI Wallet
		if user.HIWallet < totalPrice {
			return ctx.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"error": "Insufficient HIWallet balance",
			})
		}

		// Mengurangkan saldo HIWallet
		user.HIWallet -= totalPrice
		if err := db.Save(&user).Error; err != nil {
			return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to update HIWallet balance",
			})
		}
	}

	// Membuat Flight Transaction sejumlah seat yang dikirimkan
	for _, seatNumber := range request.Seats {
		// Cek apakah seatNumber sudah dibooking
		if isSeatBooked(db, request.FlightID, seatNumber) {
			return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": fmt.Sprintf("Seat %d has been booked", seatNumber),
			})
		}

		flightTransaction := models.FlightTransaction{
			FlightID:      request.FlightID,
			UserID:        userID,
			SeatNumber:    seatNumber,
			AddLuggage:    request.AddLuggage,
			PaymentMethod: request.PaymentMethod,
			PromoCode:     request.PromoCode,
			TotalPrice:    totalPrice,
		}

		// Menambahkan seat ke BookedSeats
		bookedSeat := models.BookedSeat{
			FlightID:   request.FlightID,
			SeatNumber: seatNumber,
		}

		if err := db.Create(&flightTransaction).Error; err != nil {
			return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to book flight",
			})
		}

		if err := db.Create(&bookedSeat).Error; err != nil {
			return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to book flight",
			})
		}

	}

	// Mengembalikan response sukses
	return ctx.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Flight Transactions created successfully",
	})
}

// CART
// func AddAllCartTransaction(ctx *fiber.Ctx, db *gorm.DB) error {

// }
