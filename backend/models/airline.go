package models

import "time"

type Airline struct {
	ID              uint      `json:"id"`
	Name            string    `json:"name"`
	AirlineImageUrl string    `json:"airline_image_url"`
	Flights         []Flight  `gorm:"foreignKey:AirlineID" json:"flight"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}
