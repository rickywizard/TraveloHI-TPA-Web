package models

import "time"

type OTPData struct {
	ID         uint
	OTP        string
	ExpiryTime time.Time
}
