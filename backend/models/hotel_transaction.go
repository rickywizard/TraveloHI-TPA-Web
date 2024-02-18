package models

import "time"

type HotelTransaction struct {
	ID            uint      `json:"id"`
	RoomID        uint      `json:"room_id"`
	Room          Room      `gorm:"foreignKey:RoomID" json:"room"`
	UserID        uint      `json:"user_id"`
	User          User      `gorm:"foreignKey:UserID" json:"-"`
	CheckIn       string    `json:"check_in"`
	CheckOut      string    `json:"check_out"`
	PaymentMethod string    `json:"payment_method"`
	PromoCode     string    `json:"promo_code"`
	TotalPrice    uint      `json:"total_price"`
	IsPaid        bool      `json:"is_paid"`
	IsExpired     bool      `json:"is_expired"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}
