package models

import "time"

type HotelCart struct {
	ID         uint      `json:"id"`
	RoomID     uint      `json:"room_id"`
	Room       Room      `gorm:"foreignKey:RoomID" json:"room"`
	UserID     uint      `json:"user_id"`
	User       User      `gorm:"foreignKey:UserID" json:"-"`
	CheckIn    string    `json:"check_in"`
	CheckOut   string    `json:"check_out"`
	TotalPrice uint      `json:"total_price"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}
