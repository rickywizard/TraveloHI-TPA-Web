package controllers

import (
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/rickywizard/TraveloHI-TPA-Web/backend/models"
	"gorm.io/gorm"
)

func CreateAirline(ctx *fiber.Ctx, db *gorm.DB) error {
	// Membaca data yang dikirim dari request
	var requestData struct {
		Name     string `json:"name"`
		ImageUrl string `json:"image_url"`
	}

	if err := ctx.BodyParser(&requestData); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request payload"})
	}

	// Validasi koson
	if requestData.Name == "" || requestData.ImageUrl == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Airline name and image url cannot be empty",
		})
	}

	// Validasi nama airline harus unik
	var existingAirline models.Airline
	if err := db.Where("name = ?", requestData.Name).First(&existingAirline).Error; err == nil {
		return ctx.Status(fiber.StatusConflict).JSON(fiber.Map{
			"error": "Airline name must be unique",
		})
	}

	// Menambahkan airline baru ke database
	newAirline := models.Airline{
		Name:            requestData.Name,
		AirlineImageUrl: requestData.ImageUrl,
		CreatedAt:       time.Now(),
		UpdatedAt:       time.Now(),
	}

	if err := db.Create(&newAirline).Error; err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create airline"})
	}

	// Mengembalikan respons sukses
	return ctx.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Successfully created airline",
	})
}

func GetAirlines(ctx *fiber.Ctx, db *gorm.DB) error {
	// Mengambil semua airlines dari database
	var airlines []models.Airline
	if err := db.Find(&airlines).Error; err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to retrieve airlines",
		})
	}

	// Mengembalikan daftar airlines sebagai respons
	return ctx.Status(fiber.StatusOK).JSON(airlines)
}

// Add flight
func CreateFlight(ctx *fiber.Ctx, db *gorm.DB) error {
	id := ctx.Params("id")
	airlineId, error := strconv.Atoi(id)
	if error != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid airline ID",
		})
	}
	newId := uint(airlineId)

	var requestData struct {
		FlightNumber      string   `json:"flight_number"`
		Price             string   `json:"price"`
		DepartureAirport  string   `json:"departure_airport"`
		DepartureDatetime string   `json:"departure_datetime"`
		ArrivalAirport    string   `json:"arrival_airport"`
		ArrivalDatetime   string   `json:"arrival_datetime"`
		IsTransit         bool     `json:"is_transit"`
		TransitAirport    []string `json:"transit_airport"`
		TransitDatetime   []string `json:"transit_datetime"`
	}

	if err := ctx.BodyParser(&requestData); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request payload",
		})
	}

	// Validasi kosong
	if requestData.FlightNumber == "" || requestData.Price == "" || requestData.DepartureAirport == "" || requestData.DepartureDatetime == "" || requestData.ArrivalAirport == "" || requestData.ArrivalDatetime == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "All fields cannot be empty",
		})
	}
	if requestData.IsTransit {
		for _, transitAirport := range requestData.TransitAirport {
			if transitAirport == "" {
				return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
					"error": "Transit airport cannot be empty",
				})
			}
		}
		for _, transitDatetime := range requestData.TransitDatetime {
			if transitDatetime == "" {
				return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
					"error": "Transit datetime cannot be empty",
				})
			}
		}
	}

	// Cek apakah nomor penerbangan sudah ada di database
	var existingFlight models.Flight
	if err := db.Where("flight_number = ?", requestData.FlightNumber).First(&existingFlight).Error; err == nil {
		return ctx.Status(fiber.StatusConflict).JSON(fiber.Map{
			"error": "Flight number must be unique",
		})
	}

	// Konversi string datetime ke tipe time.Time
	departureTime, err := time.Parse("2006-01-02T15:04", requestData.DepartureDatetime)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid departure datetime format"})
	}
	departureTime = departureTime.Add(-7 * time.Hour)

	arrivalTime, err := time.Parse("2006-01-02T15:04", requestData.ArrivalDatetime)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid arrival datetime format"})
	}
	arrivalTime = arrivalTime.Add(-7 * time.Hour)

	// Hitung durasi penerbangan
	duration := uint(arrivalTime.Sub(departureTime).Minutes())

	intPrice, _ := strconv.Atoi(requestData.Price)

	// Membuat objek Flight
	newFlight := models.Flight{
		FlightNumber:      requestData.FlightNumber,
		AirlineID:         newId,
		Price:             uint(intPrice),
		TotalSeat:         30,
		DepartureAirport:  requestData.DepartureAirport,
		DepartureDatetime: departureTime,
		ArrivalAirport:    requestData.ArrivalAirport,
		ArrivalDatetime:   arrivalTime,
		Duration:          duration,
		CreatedAt:         time.Now(),
		UpdatedAt:         time.Now(),
	}

	// Menambahkan penerbangan ke database
	if err := db.Create(&newFlight).Error; err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create flight"})
	}

	// Menambahkan transit jika ada
	for i, airport := range requestData.TransitAirport {
		transitTime, err := time.Parse("2006-01-02T15:04", requestData.TransitDatetime[i])
		if err != nil {
			return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid transit datetime format"})
		}
		transitTime = transitTime.Add(-7 * time.Hour)

		transit := models.Transit{
			FlightID:        newFlight.ID,
			Airport:         airport,
			ArrivalDatetime: transitTime,
			CreatedAt:       time.Now(),
			UpdatedAt:       time.Now(),
		}

		if err := db.Create(&transit).Error; err != nil {
			return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create transit"})
		}
	}

	return ctx.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Successfully created new flight",
	})
}

func GetFlights(ctx *fiber.Ctx, db *gorm.DB) error {
	// Mengambil semua penerbangan dari database termasuk informasi airline dan transit
	var flights []models.Flight
	if err := db.Preload("Airline").Preload("Transits").Find(&flights).Error; err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to retrieve flights"})
	}

	// Mengembalikan daftar penerbangan sebagai respons
	return ctx.Status(fiber.StatusOK).JSON(flights)
}

func GetPopularFlights(ctx *fiber.Ctx, db *gorm.DB) error {
	var popularFlights []models.Flight

	// Menggunakan subquery untuk menghitung jumlah transaksi untuk setiap penerbangan
	subquery := db.Model(&models.FlightTransaction{}).
		Select("flight_id, COUNT(id) as transaction_count").
		Group("flight_id").
		Order("transaction_count DESC").
		Limit(5)

	// Mengambil 5 penerbangan dengan transaksi terbanyak
	if err := db.
		Preload("Airline").
		Preload("Transits").
		Preload("BookedSeats").
		Table("flights").
		Joins("LEFT JOIN (?) AS transaction_counts ON flights.id = transaction_counts.flight_id", subquery).
		Order("transaction_counts.transaction_count DESC").
		Limit(5).
		Find(&popularFlights).Error; err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to retrieve popular flights",
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(popularFlights)
}

func GetFlightDetail(ctx *fiber.Ctx, db *gorm.DB) error {
	// Ambil ID flight dari parameter URL
	flightID := ctx.Params("id")

	// Cek apakah ID flight ada
	if flightID == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "No flight id",
		})
	}

	// Konversi string ID flight ke tipe uint
	id, err := strconv.ParseUint(flightID, 10, 64)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid flight id",
		})
	}

	// Mengambil detail penerbangan berdasarkan ID
	var flight models.Flight
	if err := db.
		Preload("Airline").
		Preload("Transits").
		Preload("BookedSeats").
		First(&flight, id).Error; err != nil {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Flight not found",
		})
	}

	// Mengembalikan detail penerbangan sebagai respons
	return ctx.Status(fiber.StatusOK).JSON(flight)
}
