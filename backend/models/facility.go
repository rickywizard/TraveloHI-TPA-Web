package models

import "time"

type Facility struct {
	ID        uint
	Name      string
	CreatedAt time.Time
	UpdatedAt time.Time
}
