package models

import "time"

type Flight struct {
	ID               uint         `json:"id"`
	AirlineID        uint         `json:"airline_id"`
	FlightNumber     string       `json:"flight_number"`
	TotalSeat        uint         `json:"total_seat"`
	FlightDate       string       `json:"flight_date"`
	Price            uint         `json:"price"`
	DepartureTime    time.Time    `json:"departure_time"`
	ArrivalTime      time.Time    `json:"arrival_time"`
	DepartureAirport string       `json:"departure_airport"`
	ArrivalAirport   string       `json:"arrival_airport"`
	Transits         []Transit    `gorm:"foreignKey:FlightID" json:"transits"`
	FlightCarts      []FlightCart `gorm:"foreignKey:FlightID" json:"-"`
	CreatedAt        time.Time    `json:"created_at"`
	UpdatedAt        time.Time    `json:"updated_at"`
}

type Transit struct {
	ID          uint      `json:"id"`
	FlightID    uint      `json:"flight_id"`
	Airport     string    `json:"transit_airport"`
	ArrivalTime time.Time `json:"arrival_transit_time"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}
