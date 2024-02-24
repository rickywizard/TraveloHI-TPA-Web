package models

import "time"

type User struct {
	ID                 uint                `json:"id"`
	FirstName          string              `json:"first_name"`
	LastName           string              `json:"last_name"`
	Email              string              `json:"email" gorm:"unique"`
	DateOfBirth        string              `json:"date_of_birth"`
	Password           []byte              `json:"-"`
	Gender             string              `json:"gender"`
	ProfilePictureUrl  string              `json:"profile_picture_url"`
	SecurityQuestion   string              `json:"security_question"`
	SecurityAnswer     string              `json:"-"`
	IsSubscriber       bool                `json:"is_subscriber"`
	IsActive           bool                `json:"is_active"`
	IsAdmin            bool                `json:"is_admin"`
	IsLoggedIn         bool                `json:"is_login"`
	Points             uint                `json:"points"`
	Reviews            []Review            `gorm:"foreignKey:UserID"`
	HotelCarts         []HotelCart         `gorm:"foreignKey:UserID"`
	HotelTransactions  []HotelTransaction  `gorm:"foreignKey:UserID"`
	FlightCarts        []FlightCart        `gorm:"foreignKey:UserID"`
	FlightTransactions []FlightTransaction `gorm:"foreignKey:UserID"`
	OTPDataID          uint
	OTPData            OTPData   `gorm:"foreignKey:OTPDataID"`
	CreatedAt          time.Time `json:"created_at"`
	UpdatedAt          time.Time `json:"updated_at"`
}
