package models

import "time"

type Search struct {
	ID         uint      `json:"id"`
	SearchWord string    `json:"search_word"`
	UserID     uint      `json:"user_id"`
	User       User      `gorm:"foreignKey:UserID" json:"-"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}
