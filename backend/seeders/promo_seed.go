package seeders

import (
	"time"

	"github.com/rickywizard/TraveloHI-TPA-Web/backend/models"
	"gorm.io/gorm"
)

func SeedPromo(db *gorm.DB) {
	promos := []models.Promo{
		{
			Name:        "Tahun Baruan Hotel TraveLoHI",
			Code:        "NYH234",
			ExpiredDate: time.Date(2024, time.February, 31, 23, 59, 59, 0, time.Local),
			ImageUrl:    "",
		},
		{
			Name:        "Nginep Gajian Akhir Bulan",
			Code:        "YAY987",
			ExpiredDate: time.Date(2024, time.March, 31, 23, 59, 59, 0, time.Local),
			ImageUrl:    "",
		},
		{
			Name:        "Kiong Hi Jalan-Jalan",
			Code:        "CNY777",
			ExpiredDate: time.Date(2024, time.February, 31, 23, 59, 59, 0, time.Local),
			ImageUrl:    "https://firebasestorage.googleapis.com/v0/b/travelohi-f39a6.appspot.com/o/promos%2Fpromo3.webp?alt=media&token=0cce9fa9-b45b-4278-b809-2e815dbff928",
		},
		{
			Name:        "Pulkam Pemilu 2024",
			Code:        "PUL123",
			ExpiredDate: time.Date(2024, time.February, 31, 23, 59, 59, 0, time.Local),
			ImageUrl:    "",
		},
	}

	db.Create(&promos)
}
