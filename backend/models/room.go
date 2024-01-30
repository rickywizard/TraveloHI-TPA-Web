package models

import (
	"time"
)

type Room struct {
	ID         uint
	RoomNumber string
	RoomImages []RoomImage `gorm:"foreignKey:RoomID"`
	Price      uint
	Capacity   uint
	HotelID    uint
	Hotel      Hotel `gorm:"foreignKey:HotelID"`
	CreatedAt  time.Time
	UpdatedAt  time.Time
}

type RoomImage struct {
	ID        uint
	RoomID    uint
	Room      Room `gorm:"foreignKey:RoomID"`
	ImageURL  string
	CreatedAt time.Time
	UpdatedAt time.Time
}
