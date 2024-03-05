package models

import "time"

type Review struct {
	ID             uint      `json:"id"`
	CleanRating    float32   `json:"clean_rating"`
	ComfortRating  float32   `json:"comfort_rating"`
	LocationRating float32   `json:"location_rating"`
	ServiceRating  float32   `json:"service_rating"`
	Comment        string    `json:"comment_text"`
	HotelID        uint      `json:"hotel_id"`
	Hotel          Hotel     `gorm:"foreignKey:HotelID" json:"-"`
	UserID         uint      `json:"user_id"`
	User           User      `gorm:"foreignKey:UserID" json:"user"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}
