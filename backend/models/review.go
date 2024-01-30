package models

import "time"

type Review struct {
	ID        uint
	Rating    uint
	Comment   string
	HotelID   uint
	Hotel     Hotel `gorm:"foreignKey:HotelID"`
	UserID    uint
	User      User `gorm:"foreignKey:UserID"`
	CreatedAt time.Time
	UpdatedAt time.Time
}
