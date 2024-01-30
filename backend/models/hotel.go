package models

import (
	"time"
)

type Hotel struct {
	ID          uint
	Name        string
	HotelImages []HotelImage `gorm:"foreignKey:HotelID"`
	Address     string
	Star        string
	Rooms       []Room     `gorm:"foreignKey:HotelID"`
	Facilities  []Facility `gorm:"many2many:hotel_facilities;"`
	Reviews     []Review   `gorm:"foreignKey:HotelID"`
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

type HotelImage struct {
	ID        uint
	HotelID   uint
	Hotel     Hotel `gorm:"foreignKey:HotelID"`
	ImageURL  string
	CreatedAt time.Time
	UpdatedAt time.Time
}
