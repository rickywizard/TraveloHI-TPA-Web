package controllers

import (
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/rickywizard/TraveloHI-TPA-Web/backend/models"
	"gorm.io/gorm"
)

func CreateHotel(ctx *fiber.Ctx, db *gorm.DB) error {
	var requestData struct {
		Name        string   `json:"name"`
		Address     string   `json:"address"`
		Star        string   `json:"star"`
		Description string   `json:"description"`
		ImageURLs   []string `json:"image_urls"`
		Facilities  []uint   `json:"facilities"`
	}

	// Parse body request ke struct requestData
	if err := ctx.BodyParser(&requestData); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// Validasi data input
	if requestData.Name == "" || requestData.Address == "" || requestData.Star == "" || requestData.Description == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Name, Address, Star, and Description cannot be empty",
		})
	}

	// Validasi nama hotel unik
	var existingHotel models.Hotel
	if err := db.Where("name = ?", requestData.Name).First(&existingHotel).Error; err == nil {
		return ctx.Status(fiber.StatusConflict).JSON(fiber.Map{
			"error": "Hotel name must be unique",
		})
	}

	// Membuat objek Hotel berdasarkan requestData
	hotel := models.Hotel{
		Name:        requestData.Name,
		Address:     requestData.Address,
		Star:        requestData.Star,
		Description: requestData.Description,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	// Adding facilities to the Hotel
	for _, facilityID := range requestData.Facilities {
		var facility models.Facility
		// Fetch the facility from the database
		if err := db.First(&facility, facilityID).Error; err != nil {
			return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid facility ID",
			})
		}
		hotel.Facilities = append(hotel.Facilities, facility)
	}

	// Memasukkan data Hotel ke database
	if err := db.Create(&hotel).Error; err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create hotel",
		})
	}

	// Memasukkan data ImageURLs ke tabel HotelImage
	for _, imageURL := range requestData.ImageURLs {
		// Validasi ImageURL
		if imageURL == "" {
			return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "ImageURL cannot be empty",
			})
		}

		hotelImage := models.HotelImage{
			HotelID:   hotel.ID,
			ImageURL:  imageURL,
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		}

		if err := db.Create(&hotelImage).Error; err != nil {
			return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to create hotel image",
			})
		}
	}

	// Mengembalikan respons berhasil
	return ctx.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Hotel created successfully",
	})
}

func GetHotels(ctx *fiber.Ctx, db *gorm.DB) error {
	// Membuat variabel untuk menyimpan hasil query database
	var hotels []models.Hotel

	// Mengambil data hotel dari database
	if err := db.Preload("Rooms").Preload("HotelImages").Preload("Facilities").Preload("Reviews").Preload("Reviews.User").Find(&hotels).Error; err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch hotels"})
	}
	for i := range hotels {
		// Menghitung harga terendah dari seluruh kamarnya
		var lowestPrice uint
		if len(hotels[i].Rooms) > 0 {
			lowestPrice = hotels[i].Rooms[0].Price
			for _, room := range hotels[i].Rooms {
				if room.Price < lowestPrice {
					lowestPrice = room.Price
				}
			}
		}

		// Menambahkan informasi harga terendah ke dalam hotel
		hotels[i].StartingPrice = lowestPrice
	}

	// Mengembalikan daftar hotel sebagai respons
	return ctx.Status(fiber.StatusOK).JSON(hotels)
}

func GetPopularHotels(ctx *fiber.Ctx, db *gorm.DB) error {
	var popularHotels []models.Hotel

	// Menggunakan subquery untuk menghitung jumlah review untuk setiap hotel
	subquery := db.Model(&models.Review{}).
		Select("hotel_id, COUNT(*) as review_count").
		Group("hotel_id").
		Order("review_count DESC").
		Limit(5)

	// Mengambil 5 hotel dengan jumlah review terbanyak
	if err := db.
		Preload("HotelImages").
		Preload("Rooms").
		Joins("LEFT JOIN (?) AS review_counts ON hotels.id = review_counts.hotel_id", subquery).
		Order("review_counts.review_count DESC").
		Limit(5).
		Find(&popularHotels).Error; err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to retrieve popular hotels",
		})
	}

	for i := range popularHotels {
		// Menghitung harga terendah dari seluruh kamarnya
		var lowestPrice uint
		if len(popularHotels[i].Rooms) > 0 {
			lowestPrice = popularHotels[i].Rooms[0].Price
			for _, room := range popularHotels[i].Rooms {
				if room.Price < lowestPrice {
					lowestPrice = room.Price
				}
			}
		}

		// Menambahkan informasi harga terendah ke dalam hotel
		popularHotels[i].StartingPrice = lowestPrice
	}

	return ctx.Status(fiber.StatusOK).JSON(popularHotels)
}

func CreateRoom(ctx *fiber.Ctx, db *gorm.DB) error {
	id := ctx.Params("id")
	hotelId, error := strconv.Atoi(id)
	if error != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid hotel ID",
		})
	}
	newId := uint(hotelId)

	var requestData struct {
		Type       string   `json:"type"`
		Price      string   `json:"price"`
		Total      string   `json:"total"`
		ImageURLs  []string `json:"image_urls"`
		Facilities []uint   `json:"facilities"`
	}

	// Parse body request ke struct requestData
	if err := ctx.BodyParser(&requestData); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// Validasi data input
	if requestData.Type == "" || requestData.Price == "" || requestData.Total == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Room type, price, and total room cannot be empty",
		})
	}

	intPrice, _ := strconv.Atoi(requestData.Price)
	intTotal, _ := strconv.Atoi(requestData.Total)

	// Membuat objek Hotel berdasarkan requestData
	room := models.Room{
		HotelID:   newId,
		RoomType:  requestData.Type,
		Price:     uint(intPrice),
		Total:     uint(intTotal),
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	// Adding facilities to the Room
	for _, facilityID := range requestData.Facilities {
		var facility models.Facility
		// Fetch the facility from the database
		if err := db.First(&facility, facilityID).Error; err != nil {
			return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid facility ID",
			})
		}
		room.Facilities = append(room.Facilities, facility)
	}

	// Memasukkan data Hotel ke database
	if err := db.Create(&room).Error; err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create room",
		})
	}

	// Memasukkan data ImageURLs ke tabel HotelImage
	for _, imageURL := range requestData.ImageURLs {
		// Validasi ImageURL
		if imageURL == "" {
			return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "ImageURL cannot be empty",
			})
		}

		roomImage := models.RoomImage{
			RoomID:    room.ID,
			ImageURL:  imageURL,
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		}

		if err := db.Create(&roomImage).Error; err != nil {
			return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to create room image",
			})
		}
	}

	// Mengembalikan respons berhasil
	return ctx.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Room created successfully",
	})
}

func GetHotelDetail(ctx *fiber.Ctx, db *gorm.DB) error {
	// Ambil ID hotel dari parameter URL
	hotelID := ctx.Params("id")

	// Cek apakah ID hotel ada
	if hotelID == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "No hotel id",
		})
	}

	// Query untuk mendapatkan detail hotel berdasarkan ID
	var hotel models.Hotel
	if err := db.
		Preload("HotelImages").
		Preload("Rooms.RoomImages").
		Preload("Rooms.Facilities").
		Preload("Facilities").
		Preload("Reviews").
		Preload("Reviews.User").
		First(&hotel, hotelID).Error; err != nil {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Hotel not found",
		})
	}

	// Hitung harga minimum dari seluruh kamar miliki hotel
	var startingPrice uint
	if len(hotel.Rooms) > 0 {
		startingPrice = hotel.Rooms[0].Price
		for _, room := range hotel.Rooms {
			if room.Price < startingPrice {
				startingPrice = room.Price
			}
		}
	}

	// Hitung rata-rata rating dari ulasan (reviews)
	var totalCleanRating, totalComfortRating, totalLocationRating, totalServiceRating float32
	for _, review := range hotel.Reviews {
		totalCleanRating += review.CleanRating
		totalComfortRating += review.ComfortRating
		totalLocationRating += review.LocationRating
		totalServiceRating += review.ServiceRating
	}

	// Hitung rata-rata rating tiap kategori
	var averageCleanRating, averageComfortRating, averageLocationRating, averageServiceRating float32
	if len(hotel.Reviews) > 0 {
		averageCleanRating = totalCleanRating / float32(len(hotel.Reviews))
		averageComfortRating = totalComfortRating / float32(len(hotel.Reviews))
		averageLocationRating = totalLocationRating / float32(len(hotel.Reviews))
		averageServiceRating = totalServiceRating / float32(len(hotel.Reviews))
	}

	// Hitung rata-rata total
	var totalRatings float32
	for _, review := range hotel.Reviews {
		totalRatings += (review.CleanRating + review.ComfortRating + review.LocationRating + review.ServiceRating) / 4
	}

	// Hitung rata-rata total
	var averageTotalRating float32
	if len(hotel.Reviews) > 0 {
		averageTotalRating = totalRatings / float32(len(hotel.Reviews))
	}

	// Tambahkan informasi starting_price pada JSON hotel
	hotelWithStartingPrice := struct {
		models.Hotel
		StartingPrice         uint    `json:"starting_price"`
		AverageCleanRating    float32 `json:"average_clean_rating"`
		AverageComfortRating  float32 `json:"average_comfort_rating"`
		AverageLocationRating float32 `json:"average_location_rating"`
		AverageServiceRating  float32 `json:"average_service_rating"`
		AverageTotalRating    float32 `json:"average_total_rating"`
	}{
		Hotel:                 hotel,
		StartingPrice:         startingPrice,
		AverageCleanRating:    averageCleanRating,
		AverageComfortRating:  averageComfortRating,
		AverageLocationRating: averageLocationRating,
		AverageServiceRating:  averageServiceRating,
		AverageTotalRating:    averageTotalRating,
	}

	// Kirim response dengan detail hotel dan kamar
	return ctx.Status(fiber.StatusOK).JSON(hotelWithStartingPrice)
}
