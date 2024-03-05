package models

import "time"

type Flight struct {
	ID                uint         `json:"id"`
	AirlineID         uint         `json:"-"`
	Airline           Airline      `gorm:"foreignKey:AirlineID" json:"airline"`
	FlightNumber      string       `json:"flight_number"`
	TotalSeat         uint         `json:"total_seat"`
	Price             uint         `json:"price"`
	DepartureDatetime time.Time    `json:"departure_datetime"`
	ArrivalDatetime   time.Time    `json:"arrival_datetime"`
	DepartureAirport  string       `json:"departure_airport"`
	ArrivalAirport    string       `json:"arrival_airport"`
	Duration          uint         `json:"duration"`
	Transits          []Transit    `gorm:"foreignKey:FlightID" json:"transits"`
	FlightCarts       []FlightCart `gorm:"foreignKey:FlightID" json:"-"`
	BookedSeats       []BookedSeat `gorm:"foreignKey:FlightID" json:"booked_seats"`
	CreatedAt         time.Time    `json:"created_at"`
	UpdatedAt         time.Time    `json:"updated_at"`
}

type Transit struct {
	ID              uint      `json:"id"`
	FlightID        uint      `json:"flight_id"`
	Airport         string    `json:"transit_airport"`
	ArrivalDatetime time.Time `json:"arrival_transit_time"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}

type BookedSeat struct {
	ID         uint      `json:"id"`
	FlightID   uint      `json:"flight_id"`
	SeatNumber uint      `json:"seat_number"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}
