package models

import (
	"time"
)

type Hotel struct {
	ID          uint         `json:"id"`
	Name        string       `json:"name"`
	HotelImages []HotelImage `gorm:"foreignKey:HotelID" json:"hotel_images"`
	Address     string       `json:"address"`
	Star        string       `json:"star"`
	Description string       `json:"description"`
	Rooms       []Room       `gorm:"foreignKey:HotelID" json:"rooms"`
	Facilities  []Facility   `gorm:"many2many:hotel_facilities;" json:"facilities"`
	Reviews     []Review     `gorm:"foreignKey:HotelID" json:"reviews"`
	CreatedAt   time.Time    `json:"created_at"`
	UpdatedAt   time.Time    `json:"updated_at"`
}

type HotelImage struct {
	ID        uint      `json:"id"`
	HotelID   uint      `json:"hotel_id"`
	ImageURL  string    `json:"image_url"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
