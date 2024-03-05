package models

import "time"

type FlightCart struct {
	ID         uint      `json:"id"`
	FlightID   uint      `json:"flight_id"`
	Flight     Flight    `gorm:"foreignKey:FlightID" json:"flight"`
	UserID     uint      `json:"user_id"`
	User       User      `gorm:"foreignKey:UserID" json:"-"`
	SeatNumber uint      `json:"seat_number"`
	AddLuggage bool      `json:"add_luggage"`
	TotalPrice uint      `json:"total_price"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}
