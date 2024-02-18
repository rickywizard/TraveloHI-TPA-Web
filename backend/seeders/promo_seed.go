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
			Discount:    "20000",
			ExpiredDate: time.Date(2024, time.February, 31, 23, 59, 59, 0, time.Local),
			ImageUrl:    "https://firebasestorage.googleapis.com/v0/b/travelohi-f39a6.appspot.com/o/promos%2Fpromo1.webp?alt=media&token=41941922-0a54-49d3-bf72-f0415cd4b54c",
		},
		{
			Name:        "Nginep Gajian Akhir Bulan",
			Code:        "YAY987",
			Discount:    "30000",
			ExpiredDate: time.Date(2024, time.March, 31, 23, 59, 59, 0, time.Local),
			ImageUrl:    "https://firebasestorage.googleapis.com/v0/b/travelohi-f39a6.appspot.com/o/promos%2Fpromo2.webp?alt=media&token=be647d3c-cd8e-430e-a74d-ed8b74a60492",
		},
		{
			Name:        "Kiong Hi Jalan-Jalan",
			Code:        "CNY777",
			Discount:    "20000",
			ExpiredDate: time.Date(2024, time.February, 31, 23, 59, 59, 0, time.Local),
			ImageUrl:    "https://firebasestorage.googleapis.com/v0/b/travelohi-f39a6.appspot.com/o/promos%2Fpromo3.webp?alt=media&token=0cce9fa9-b45b-4278-b809-2e815dbff928",
		},
		{
			Name:        "Pulkam Pemilu 2024",
			Code:        "PUL123",
			Discount:    "24000",
			ExpiredDate: time.Date(2024, time.February, 31, 23, 59, 59, 0, time.Local),
			ImageUrl:    "https://firebasestorage.googleapis.com/v0/b/travelohi-f39a6.appspot.com/o/promos%2Fpromo4.webp?alt=media&token=45d1b65c-9fb2-4440-909d-32db27c5f1c5",
		},
	}

	db.Create(&promos)
}
