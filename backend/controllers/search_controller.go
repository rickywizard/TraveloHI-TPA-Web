package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/rickywizard/TraveloHI-TPA-Web/backend/models"
	"gorm.io/gorm"
)

func Search(ctx *fiber.Ctx, db *gorm.DB) error {
	// Get the search term from the query parameter
	searchTerm := ctx.Query("term")

	// Perform the search for hotels, flights, and airlines based on the search term
	hotels := []models.Hotel{}
	flights := []models.Flight{}

	// Use your Gorm queries here to search for hotels and flights based on the search term
	db.Where("name LIKE ? OR address LIKE ?", "%"+searchTerm+"%", "%"+searchTerm+"%").Preload("Rooms").Preload("HotelImages").Preload("Facilities").Preload("Reviews").Preload("Reviews.User").Find(&hotels)

	// Search flights based on flight number, departure airport, arrival airport, or airline name
	db.Joins("JOIN airlines ON flights.airline_id = airlines.id").
		Where("flight_number LIKE ? OR departure_airport LIKE ? OR arrival_airport LIKE ? OR airlines.name LIKE ?", "%"+searchTerm+"%", "%"+searchTerm+"%", "%"+searchTerm+"%", "%"+searchTerm+"%").
		Preload("Transits", func(db *gorm.DB) *gorm.DB {
			return db.Where("airport LIKE ?", "%"+searchTerm+"%")
		}).Preload("Airline").Find(&flights)

	return ctx.JSON(fiber.Map{
		"hotels":  hotels,
		"flights": flights,
	})
}

func GetRecentSearches(ctx *fiber.Ctx, db *gorm.DB) error {
	// Ambil ID user
	userID := GetUserID(ctx, db)

	// Validasi keberadaan user
	var user models.User
	if err := db.First(&user, userID).Error; err != nil {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "User not found",
		})
	}

	// Query untuk mengambil 3 pencarian terbaru dari user
	var recentSearches []models.Search
	if err := db.Where("user_id = ?", userID).
		Order("created_at desc").
		Limit(3).
		Find(&recentSearches).Error; err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch recent searches",
		})
	}

	// Berhasil mengambil data pencarian terbaru
	return ctx.Status(fiber.StatusOK).JSON(recentSearches)
}

func GetPopularSearches(ctx *fiber.Ctx, db *gorm.DB) error {
	// Query untuk mengambil 5 pencarian terpopuler
	var popularSearches []models.Search
	if err := db.Table("searches").
		Select("search_word, COUNT(search_word) as search_count").
		Group("search_word").
		Order("search_count desc").
		Limit(5).
		Find(&popularSearches).Error; err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch popular searches",
		})
	}

	// Berhasil mengambil data pencarian terpopuler
	return ctx.Status(fiber.StatusOK).JSON(popularSearches)
}

func SaveSearch(ctx *fiber.Ctx, db *gorm.DB) error {
	// Baca kata kunci pencarian dari request body
	var requestData struct {
		SearchWord string `json:"search_word"`
	}
	if err := ctx.BodyParser(&requestData); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request format",
		})
	}

	// Ambil user
	userID := GetUserID(ctx, db)

	// Validasi keberadaan user
	var user models.User
	if err := db.First(&user, userID).Error; err != nil {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "No search history saved",
		})
	}

	// Simpan kata kunci pencarian ke dalam database
	search := models.Search{
		SearchWord: requestData.SearchWord,
		UserID:     userID,
	}
	if err := db.Create(&search).Error; err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to save search",
		})
	}

	// Berhasil menyimpan search history
	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Search history saved",
	})
}
