package seeders

import (
	"time"

	"github.com/rickywizard/TraveloHI-TPA-Web/backend/models"
	"gorm.io/gorm"
)

func SeedFlights(db *gorm.DB) {
	airline := []models.Airline{
		{
			Name:            "Garuda Indonesia",
			AirlineImageUrl: "https://firebasestorage.googleapis.com/v0/b/travelohi-f39a6.appspot.com/o/airlines%2Fgaruda-indonesia.png?alt=media&token=5b288763-556d-4b63-beea-b1fd12d03728",
			Flights: []models.Flight{
				{
					FlightNumber:      "GI123",
					TotalSeat:         30,
					Price:             2000000,
					DepartureDatetime: time.Date(2024, time.March, 20, 8, 0, 0, 0, time.Local),
					DepartureAirport:  "Jakarta",
					ArrivalDatetime:   time.Date(2024, time.March, 20, 9, 45, 0, 0, time.Local),
					ArrivalAirport:    "Singapore",
					Duration:          95,
					Transits: []models.Transit{
						{
							Airport:         "Pekanbaru",
							ArrivalDatetime: time.Date(2024, time.March, 20, 9, 0, 0, 0, time.Local),
						},
					},
					BookedSeats: []models.BookedSeat{
						{
							SeatNumber: 25,
						},
						{
							SeatNumber: 5,
						},
						{
							SeatNumber: 17,
						},
					},
				},
				{
					FlightNumber:      "GI789",
					TotalSeat:         30,
					Price:             1000000,
					DepartureDatetime: time.Date(2024, time.March, 20, 14, 0, 0, 0, time.Local),
					DepartureAirport:  "Jakarta",
					ArrivalDatetime:   time.Date(2024, time.March, 20, 15, 15, 0, 0, time.Local),
					ArrivalAirport:    "Denpasar",
					Duration:          75,
					BookedSeats: []models.BookedSeat{
						{
							SeatNumber: 7,
						},
						{
							SeatNumber: 15,
						},
						{
							SeatNumber: 10,
						},
					},
				},
			},
		},
		{
			Name:            "Qatar Airways",
			AirlineImageUrl: "https://firebasestorage.googleapis.com/v0/b/travelohi-f39a6.appspot.com/o/airlines%2Fqatar-airways.png?alt=media&token=984a2737-81e7-490b-8b44-84fd767dcc93",
			Flights: []models.Flight{
				{
					FlightNumber:      "QA123",
					TotalSeat:         30,
					Price:             5500000,
					DepartureDatetime: time.Date(2024, time.March, 20, 21, 0, 0, 0, time.Local),
					DepartureAirport:  "Jakarta",
					ArrivalDatetime:   time.Date(2024, time.March, 21, 7, 45, 0, 0, time.Local),
					ArrivalAirport:    "Doha",
					Duration:          645,
					Transits: []models.Transit{
						{
							Airport:         "Kuala Lumpur",
							ArrivalDatetime: time.Date(2024, time.March, 21, 2, 45, 0, 0, time.Local),
						},
						{
							Airport:         "Bangkok",
							ArrivalDatetime: time.Date(2024, time.March, 21, 4, 30, 0, 0, time.Local),
						},
					},
					BookedSeats: []models.BookedSeat{
						{
							SeatNumber: 1,
						},
						{
							SeatNumber: 3,
						},
						{
							SeatNumber: 10,
						},
					},
				},
				{
					FlightNumber:      "QA691",
					TotalSeat:         30,
					Price:             4000000,
					DepartureDatetime: time.Date(2024, time.March, 2, 6, 0, 0, 0, time.Local),
					DepartureAirport:  "Bandung",
					ArrivalDatetime:   time.Date(2024, time.March, 2, 12, 15, 0, 0, time.Local),
					ArrivalAirport:    "Tokyo",
					Duration:          375,
				},
				{
					FlightNumber:      "QA878",
					TotalSeat:         30,
					Price:             4000000,
					DepartureDatetime: time.Date(2024, time.March, 24, 6, 0, 0, 0, time.Local),
					DepartureAirport:  "Bandung",
					ArrivalDatetime:   time.Date(2024, time.March, 24, 12, 15, 0, 0, time.Local),
					ArrivalAirport:    "Japan",
					Duration:          375,
				},
				{
					FlightNumber:      "QA456",
					TotalSeat:         30,
					Price:             4000000,
					DepartureDatetime: time.Date(2024, time.March, 24, 6, 0, 0, 0, time.Local),
					DepartureAirport:  "Bandung",
					ArrivalDatetime:   time.Date(2024, time.March, 24, 12, 15, 0, 0, time.Local),
					ArrivalAirport:    "Finland",
					Duration:          375,
				},
				{
					FlightNumber:      "QA852",
					TotalSeat:         30,
					Price:             4000000,
					DepartureDatetime: time.Date(2024, time.March, 24, 6, 0, 0, 0, time.Local),
					DepartureAirport:  "Bandung",
					ArrivalDatetime:   time.Date(2024, time.March, 24, 12, 15, 0, 0, time.Local),
					ArrivalAirport:    "Brazil",
					Duration:          375,
				},
				{
					FlightNumber:      "QA333",
					TotalSeat:         30,
					Price:             4000000,
					DepartureDatetime: time.Date(2024, time.March, 24, 6, 0, 0, 0, time.Local),
					DepartureAirport:  "Bandung",
					ArrivalDatetime:   time.Date(2024, time.March, 24, 12, 15, 0, 0, time.Local),
					ArrivalAirport:    "Canada",
					Duration:          375,
				},
				{
					FlightNumber:      "QA111",
					TotalSeat:         30,
					Price:             4000000,
					DepartureDatetime: time.Date(2024, time.March, 24, 6, 0, 0, 0, time.Local),
					DepartureAirport:  "Bandung",
					ArrivalDatetime:   time.Date(2024, time.March, 24, 12, 15, 0, 0, time.Local),
					ArrivalAirport:    "United Kingdom",
					Duration:          375,
				},
				{
					FlightNumber:      "QA222",
					TotalSeat:         30,
					Price:             4000000,
					DepartureDatetime: time.Date(2024, time.March, 24, 6, 0, 0, 0, time.Local),
					DepartureAirport:  "Bandung",
					ArrivalDatetime:   time.Date(2024, time.March, 24, 12, 15, 0, 0, time.Local),
					ArrivalAirport:    "United States",
					Duration:          375,
				},
			},
		},
	}

	db.Create(&airline)
}
