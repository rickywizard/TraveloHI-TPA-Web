package models

import (
	"time"
)

type Room struct {
	ID         uint        `json:"id"`
	RoomType   string      `json:"room_type"`
	RoomImages []RoomImage `gorm:"foreignKey:RoomID" json:"room_images"`
	Price      uint        `json:"price"`
	Total      uint        `json:"total"`
	HotelID    uint        `json:"hotel_id"`
	Facilities []Facility  `gorm:"many2many:room_facilities;" json:"facilities"`
	HotelCarts []HotelCart `gorm:"foreignKey:RoomID" json:"-"`
	CreatedAt  time.Time   `json:"created_at"`
	UpdatedAt  time.Time   `json:"updated_at"`
}

type RoomImage struct {
	ID        uint      `json:"id"`
	RoomID    uint      `json:"room_id"`
	ImageURL  string    `json:"image_url"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
