package seeders

import (
	"github.com/rickywizard/TraveloHI-TPA-Web/backend/models"
	"gorm.io/gorm"
)

func SeedFacility(db *gorm.DB) {
	facilities := []models.Facility{
		{
			Name: "AC",
		},
		{
			Name: "Restaurant",
		},
		{
			Name: "Swimming Pool",
		},
		{
			Name: "24-Hour Front Desk",
		},
		{
			Name: "Parking",
		},
		{
			Name: "Elevator",
		},
		{
			Name: "WiFi",
		},
		{
			Name: "Gym",
		},
		{
			Name: "Desk",
		},
		{
			Name: "Hairdryer",
		},
		{
			Name: "In-room safe",
		},
		{
			Name: "Refrigerator",
		},
		{
			Name: "Shower",
		},
		{
			Name: "TV",
		},
		{
			Name: "Mini bar",
		},
	}

	db.Create(&facilities)
}
