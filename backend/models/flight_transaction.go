package models

import "time"

type FlightTransaction struct {
	ID            uint      `json:"id"`
	FlightID      uint      `json:"flight_id"`
	Flight        Flight    `gorm:"foreignKey:FlightID" json:"flight"`
	UserID        uint      `json:"user_id"`
	User          User      `gorm:"foreignKey:UserID" json:"-"`
	SeatNumber    uint      `json:"seat_number"`
	AddBaggage    bool      `json:"add_baggage"`
	TotalPrice    uint      `json:"total_price"`
	PaymentMethod string    `json:"payment_method"`
	PromoCode     string    `json:"promo_code"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}
