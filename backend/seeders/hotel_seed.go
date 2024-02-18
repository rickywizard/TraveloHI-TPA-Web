package seeders

import (
	"github.com/rickywizard/TraveloHI-TPA-Web/backend/models"
	"gorm.io/gorm"
)

func SeedHotel(db *gorm.DB) {
	hotel := models.Hotel{
		Name:        "M Hotel Singapore City Centre",
		Address:     "81 Anson Road, Chinatown, Singapore, 079908",
		Star:        "5",
		Description: "Whether you are planning an event or other special occasions, M Hotel Singapore City Centre is a great choice for you with a large and well-equipped function room to suit your requirements. From business event to corporate gathering, M Hotel Singapore City Centre provides complete services and facilities that you and your colleagues need. Have fun with various entertaining facilities for you and the whole family at M Hotel Singapore City Centre, a wonderful accommodation for your family holiday.",
		Facilities: []models.Facility{
			{
				Name: "AC",
			},
			{
				Name: "Restaurant",
			},
			{
				Name: "Swimming Pool",
			},
			{
				Name: "24-Hour Front Desk",
			},
			{
				Name: "Parking",
			},
			{
				Name: "Elevator",
			},
			{
				Name: "WiFi",
			},
			{
				Name: "Gym",
			},
		},
		Reviews: []models.Review{
			{
				Rating:  10,
				UserID:  1,
				Comment: "Super comfy, breakfast was delicious and near access to public transportation and all of the staff is very kind. Very recommended to stay here, thank you m hotel",
			},
			{
				Rating:  9.7,
				UserID:  2,
				Comment: "Clean and tidy hotel with friendly staff, quite affordable price, close to local food centres. Great view from above. Great facilities. Such a great option for holiday.",
			},
		},
	}
	hotelImage := []models.HotelImage{
		{
			HotelID:  1,
			ImageURL: "https://firebasestorage.googleapis.com/v0/b/travelohi-f39a6.appspot.com/o/hotels%2Fhotel6.webp?alt=media&token=3bb3715d-6295-4763-a7e8-621266fcf12a",
		},
		{
			HotelID:  1,
			ImageURL: "https://firebasestorage.googleapis.com/v0/b/travelohi-f39a6.appspot.com/o/hotels%2Fhotel7.webp?alt=media&token=b4aa69a8-dcfa-4d62-94ee-2a192e486aec",
		},
		{
			HotelID:  1,
			ImageURL: "https://firebasestorage.googleapis.com/v0/b/travelohi-f39a6.appspot.com/o/hotels%2Fhotel8.webp?alt=media&token=1127c5f5-10c7-4cf3-a440-15df3a99c16e",
		},
		{
			HotelID:  1,
			ImageURL: "https://firebasestorage.googleapis.com/v0/b/travelohi-f39a6.appspot.com/o/hotels%2Fhotel9.webp?alt=media&token=212f0304-cc34-4a58-9061-6a48f5a4dc75",
		},
		{
			HotelID:  1,
			ImageURL: "https://firebasestorage.googleapis.com/v0/b/travelohi-f39a6.appspot.com/o/hotels%2Fhotel10.webp?alt=media&token=6d3c3599-39b9-4290-9e8a-0afb1d311e97",
		},
		{
			HotelID:  1,
			ImageURL: "https://firebasestorage.googleapis.com/v0/b/travelohi-f39a6.appspot.com/o/hotels%2Fhotel11.webp?alt=media&token=463e835f-eb81-4056-a0ea-0d75cf1c32ce",
		},
		{
			HotelID:  1,
			ImageURL: "https://firebasestorage.googleapis.com/v0/b/travelohi-f39a6.appspot.com/o/hotels%2Fhotel12.webp?alt=media&token=7b7ee1ca-d67f-48ee-bd36-a284dfa3735c",
		},
	}

	room := models.Room{
		HotelID:  1,
		RoomType: "Deluxe Double",
		Price:    2652701,
		Total:    15,
		Facilities: []models.Facility{
			{
				Name: "Desk",
			},
			{
				Name: "Hairdryer",
			},
			{
				Name: "In-room safe",
			},
			{
				Name: "Refrigerator",
			},
			{
				Name: "Shower",
			},
			{
				Name: "TV",
			},
			{
				Name: "Mini bar",
			},
		},
	}
	roomImage := []models.RoomImage{
		{
			RoomID:   1,
			ImageURL: "https://firebasestorage.googleapis.com/v0/b/travelohi-f39a6.appspot.com/o/hotels%2Froom1.webp?alt=media&token=0a926847-68e8-4217-a835-2ce5c99e982a",
		},
		{
			RoomID:   1,
			ImageURL: "https://firebasestorage.googleapis.com/v0/b/travelohi-f39a6.appspot.com/o/hotels%2Froom2.webp?alt=media&token=26485637-841d-477a-8005-1c33e77efc4c",
		},
		{
			RoomID:   1,
			ImageURL: "https://firebasestorage.googleapis.com/v0/b/travelohi-f39a6.appspot.com/o/hotels%2Froom3.webp?alt=media&token=550c7400-1f7c-42b8-9bff-ce08fce4dd0e",
		},
	}

	db.Create(&hotel)
	db.Create(&hotelImage)
	db.Create(&room)
	db.Create(&roomImage)
}
