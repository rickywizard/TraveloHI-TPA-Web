package seeders

import (
	"github.com/rickywizard/TraveloHI-TPA-Web/backend/models"
	"gorm.io/gorm"
)

func SeedHotel(db *gorm.DB) {
	hotel := []models.Hotel{
		{
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
					CleanRating:    9,
					ComfortRating:  9,
					LocationRating: 8,
					ServiceRating:  6,
					UserID:         1,
					Comment:        "Super comfy, breakfast was delicious and near access to public transportation and all of the staff is very kind. Very recommended to stay here, thank you m hotel",
				},
				{
					CleanRating:    7,
					ComfortRating:  7,
					LocationRating: 9,
					ServiceRating:  7,
					UserID:         2,
					Comment:        "Clean and tidy hotel with friendly staff, quite affordable price, close to local food centres. Great view from above. Great facilities. Such a great option for holiday.",
				},
			},
		},
		{
			Name:        "GH Universal Hotel",
			Address:     "Jl. Dr. Setiabudi No.376, Ledeng, Kec. Cidadap, Kota Bandung, Jawa Barat 40143",
			Star:        "5",
			Description: "Tak perlu repot-repot ke luar negeri untuk menikmati suasana ala kastel Eropa yang megah. Di Bandung, ada sebuah hotel yang dapat mewujudkan impian Anda. GH Universal Hotel adalah hotel terbaik di kawasan Bandung bagi Anda yang menginginkan pengalaman menginap berbeda serasa di kastel atau kerajaan Eropa. Terletak di perbatasan Lembang dan Bandung, hotel ini menyajikan suasana dan pemandangan sempurna kota dari ketinggian.",
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
					CleanRating:    9,
					ComfortRating:  9,
					LocationRating: 8,
					ServiceRating:  9,
					UserID:         3,
					Comment:        "Sangat pas buat liburan keluarga dan bersantai. Ruang meeting luas.",
				},
				{
					CleanRating:    9,
					ComfortRating:  8,
					LocationRating: 9,
					ServiceRating:  9,
					UserID:         2,
					Comment:        "Pengalaman yang menyenangkan di GH Universal, istri dan kedua anak saya sangat enjoy saat staycation di sini. Staffnya ramah-ramah, terutama buat Pak Usep yang sangat baik melayani keluarga saya. Hatur nuhun Pak Usep. Definitely will come back again to GH Universal.",
				},
				{
					CleanRating:    9,
					ComfortRating:  8,
					LocationRating: 9,
					ServiceRating:  9,
					UserID:         2,
					Comment:        "Pengalaman yang menyenangkan di GH Universal, istri dan kedua anak saya sangat enjoy saat staycation di sini. Staffnya ramah-ramah, terutama buat Pak Usep yang sangat baik melayani keluarga saya. Hatur nuhun Pak Usep. Definitely will come back again to GH Universal.",
				},
				{
					CleanRating:    9,
					ComfortRating:  8,
					LocationRating: 9,
					ServiceRating:  9,
					UserID:         2,
					Comment:        "Pengalaman yang menyenangkan di GH Universal, istri dan kedua anak saya sangat enjoy saat staycation di sini. Staffnya ramah-ramah, terutama buat Pak Usep yang sangat baik melayani keluarga saya. Hatur nuhun Pak Usep. Definitely will come back again to GH Universal.",
				},
			},
		},
		{
			Name:        "Hotel Bagus",
			Address:     "105-0001 Tokyo-to, Minato-ku Toranomon 2-10-4, Japan",
			Star:        "4",
			Description: "Composed of 2 buildings, The Okura Tokyo boasts a garden and bar. Among the facilities of this property are a restaurant, a 24-hour front desk and room service, along with free WiFi. The accommodation features a concierge, ticket service and currency exchange for guests.",
			Facilities: []models.Facility{
				{
					Name: "AC",
				},
				{
					Name: "Restaurant",
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
			},
			Reviews: []models.Review{
				{
					CleanRating:    9,
					ComfortRating:  9,
					LocationRating: 8,
					ServiceRating:  9,
					UserID:         3,
					Comment:        "Sangat pas buat liburan keluarga dan bersantai. Ruang meeting luas.",
				},
				{
					CleanRating:    9,
					ComfortRating:  8,
					LocationRating: 9,
					ServiceRating:  9,
					UserID:         2,
					Comment:        "Pengalaman yang menyenangkan di GH Universal, istri dan kedua anak saya sangat enjoy saat staycation di sini. Staffnya ramah-ramah, terutama buat Pak Usep yang sangat baik melayani keluarga saya. Hatur nuhun Pak Usep. Definitely will come back again to GH Universal.",
				},
				{
					CleanRating:    9,
					ComfortRating:  8,
					LocationRating: 9,
					ServiceRating:  9,
					UserID:         2,
					Comment:        "Pengalaman yang menyenangkan di GH Universal, istri dan kedua anak saya sangat enjoy saat staycation di sini. Staffnya ramah-ramah, terutama buat Pak Usep yang sangat baik melayani keluarga saya. Hatur nuhun Pak Usep. Definitely will come back again to GH Universal.",
				},
				{
					CleanRating:    9,
					ComfortRating:  8,
					LocationRating: 9,
					ServiceRating:  9,
					UserID:         2,
					Comment:        "Pengalaman yang menyenangkan di GH Universal, istri dan kedua anak saya sangat enjoy saat staycation di sini. Staffnya ramah-ramah, terutama buat Pak Usep yang sangat baik melayani keluarga saya. Hatur nuhun Pak Usep. Definitely will come back again to GH Universal.",
				},
			},
		},
		{
			Name:        "Hotel Inn Helsinki City Center",
			Address:     "Elielinaukio 5, Helsinki City Center, Helsinki, Finland, 00100",
			Star:        "3",
			Description: "Composed of 2 buildings, The Okura Tokyo boasts a garden and bar. Among the facilities of this property are a restaurant, a 24-hour front desk and room service, along with free WiFi. The accommodation features a concierge, ticket service and currency exchange for guests.",
			Facilities: []models.Facility{
				{
					Name: "AC",
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
			},
			Reviews: []models.Review{
				{
					CleanRating:    9,
					ComfortRating:  9,
					LocationRating: 8,
					ServiceRating:  9,
					UserID:         3,
					Comment:        "Sangat pas buat liburan keluarga dan bersantai. Ruang meeting luas.",
				},
				{
					CleanRating:    9,
					ComfortRating:  8,
					LocationRating: 9,
					ServiceRating:  9,
					UserID:         2,
					Comment:        "Pengalaman yang menyenangkan di GH Universal, istri dan kedua anak saya sangat enjoy saat staycation di sini. Staffnya ramah-ramah, terutama buat Pak Usep yang sangat baik melayani keluarga saya. Hatur nuhun Pak Usep. Definitely will come back again to GH Universal.",
				},
				{
					CleanRating:    9,
					ComfortRating:  8,
					LocationRating: 9,
					ServiceRating:  9,
					UserID:         2,
					Comment:        "Pengalaman yang menyenangkan di GH Universal, istri dan kedua anak saya sangat enjoy saat staycation di sini. Staffnya ramah-ramah, terutama buat Pak Usep yang sangat baik melayani keluarga saya. Hatur nuhun Pak Usep. Definitely will come back again to GH Universal.",
				},
				{
					CleanRating:    9,
					ComfortRating:  8,
					LocationRating: 9,
					ServiceRating:  9,
					UserID:         2,
					Comment:        "Pengalaman yang menyenangkan di GH Universal, istri dan kedua anak saya sangat enjoy saat staycation di sini. Staffnya ramah-ramah, terutama buat Pak Usep yang sangat baik melayani keluarga saya. Hatur nuhun Pak Usep. Definitely will come back again to GH Universal.",
				},
			},
		},
		{
			Name:        "Royal Rio Palace Hotel",
			Address:     "Rua Duvivier, 82, Copacabana, Rio de Janeiro, CEP 22020-020, Brazil",
			Star:        "4",
			Description: "Composed of 2 buildings, The Okura Tokyo boasts a garden and bar. Among the facilities of this property are a restaurant, a 24-hour front desk and room service, along with free WiFi. The accommodation features a concierge, ticket service and currency exchange for guests.",
			Facilities: []models.Facility{
				{
					Name: "AC",
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
			},
			Reviews: []models.Review{
				{
					CleanRating:    9,
					ComfortRating:  9,
					LocationRating: 8,
					ServiceRating:  9,
					UserID:         3,
					Comment:        "Sangat pas buat liburan keluarga dan bersantai. Ruang meeting luas.",
				},
				{
					CleanRating:    9,
					ComfortRating:  8,
					LocationRating: 9,
					ServiceRating:  9,
					UserID:         2,
					Comment:        "Pengalaman yang menyenangkan di GH Universal, istri dan kedua anak saya sangat enjoy saat staycation di sini. Staffnya ramah-ramah, terutama buat Pak Usep yang sangat baik melayani keluarga saya. Hatur nuhun Pak Usep. Definitely will come back again to GH Universal.",
				},
				{
					CleanRating:    9,
					ComfortRating:  8,
					LocationRating: 9,
					ServiceRating:  9,
					UserID:         2,
					Comment:        "Pengalaman yang menyenangkan di GH Universal, istri dan kedua anak saya sangat enjoy saat staycation di sini. Staffnya ramah-ramah, terutama buat Pak Usep yang sangat baik melayani keluarga saya. Hatur nuhun Pak Usep. Definitely will come back again to GH Universal.",
				},
				{
					CleanRating:    9,
					ComfortRating:  8,
					LocationRating: 9,
					ServiceRating:  9,
					UserID:         2,
					Comment:        "Pengalaman yang menyenangkan di GH Universal, istri dan kedua anak saya sangat enjoy saat staycation di sini. Staffnya ramah-ramah, terutama buat Pak Usep yang sangat baik melayani keluarga saya. Hatur nuhun Pak Usep. Definitely will come back again to GH Universal.",
				},
			},
		},
		{
			Name:        "Park Plaza Westminster Bridge London",
			Address:     "Westminster Bridge Road, Lambeth, London, SE1 7UT, United Kingdom",
			Star:        "4",
			Description: "Composed of 2 buildings, The Okura Tokyo boasts a garden and bar. Among the facilities of this property are a restaurant, a 24-hour front desk and room service, along with free WiFi. The accommodation features a concierge, ticket service and currency exchange for guests.",
			Facilities: []models.Facility{
				{
					Name: "AC",
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
			},
			Reviews: []models.Review{
				{
					CleanRating:    9,
					ComfortRating:  9,
					LocationRating: 8,
					ServiceRating:  9,
					UserID:         3,
					Comment:        "Sangat pas buat liburan keluarga dan bersantai. Ruang meeting luas.",
				},
				{
					CleanRating:    9,
					ComfortRating:  8,
					LocationRating: 9,
					ServiceRating:  9,
					UserID:         2,
					Comment:        "Pengalaman yang menyenangkan di GH Universal, istri dan kedua anak saya sangat enjoy saat staycation di sini. Staffnya ramah-ramah, terutama buat Pak Usep yang sangat baik melayani keluarga saya. Hatur nuhun Pak Usep. Definitely will come back again to GH Universal.",
				},
				{
					CleanRating:    9,
					ComfortRating:  8,
					LocationRating: 9,
					ServiceRating:  9,
					UserID:         2,
					Comment:        "Pengalaman yang menyenangkan di GH Universal, istri dan kedua anak saya sangat enjoy saat staycation di sini. Staffnya ramah-ramah, terutama buat Pak Usep yang sangat baik melayani keluarga saya. Hatur nuhun Pak Usep. Definitely will come back again to GH Universal.",
				},
				{
					CleanRating:    9,
					ComfortRating:  8,
					LocationRating: 9,
					ServiceRating:  9,
					UserID:         2,
					Comment:        "Pengalaman yang menyenangkan di GH Universal, istri dan kedua anak saya sangat enjoy saat staycation di sini. Staffnya ramah-ramah, terutama buat Pak Usep yang sangat baik melayani keluarga saya. Hatur nuhun Pak Usep. Definitely will come back again to GH Universal.",
				},
			},
		},
		{
			Name:        "One King West Hotel and Residence",
			Address:     "1 King Street West, M5H 1A1 Toronto, Canada",
			Star:        "4",
			Description: "Composed of 2 buildings, The Okura Tokyo boasts a garden and bar. Among the facilities of this property are a restaurant, a 24-hour front desk and room service, along with free WiFi. The accommodation features a concierge, ticket service and currency exchange for guests.",
			Facilities: []models.Facility{
				{
					Name: "AC",
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
			},
			Reviews: []models.Review{
				{
					CleanRating:    9,
					ComfortRating:  9,
					LocationRating: 8,
					ServiceRating:  9,
					UserID:         3,
					Comment:        "Sangat pas buat liburan keluarga dan bersantai. Ruang meeting luas.",
				},
				{
					CleanRating:    9,
					ComfortRating:  8,
					LocationRating: 9,
					ServiceRating:  9,
					UserID:         2,
					Comment:        "Pengalaman yang menyenangkan di GH Universal, istri dan kedua anak saya sangat enjoy saat staycation di sini. Staffnya ramah-ramah, terutama buat Pak Usep yang sangat baik melayani keluarga saya. Hatur nuhun Pak Usep. Definitely will come back again to GH Universal.",
				},
				{
					CleanRating:    9,
					ComfortRating:  8,
					LocationRating: 9,
					ServiceRating:  9,
					UserID:         2,
					Comment:        "Pengalaman yang menyenangkan di GH Universal, istri dan kedua anak saya sangat enjoy saat staycation di sini. Staffnya ramah-ramah, terutama buat Pak Usep yang sangat baik melayani keluarga saya. Hatur nuhun Pak Usep. Definitely will come back again to GH Universal.",
				},
				{
					CleanRating:    9,
					ComfortRating:  8,
					LocationRating: 9,
					ServiceRating:  9,
					UserID:         2,
					Comment:        "Pengalaman yang menyenangkan di GH Universal, istri dan kedua anak saya sangat enjoy saat staycation di sini. Staffnya ramah-ramah, terutama buat Pak Usep yang sangat baik melayani keluarga saya. Hatur nuhun Pak Usep. Definitely will come back again to GH Universal.",
				},
			},
		},
		{
			Name:        "Downtown Grand Hotel & Casino",
			Address:     "206 North 3rd Street , Las Vegas, NV 89101, United States",
			Star:        "3",
			Description: "Composed of 2 buildings, The Okura Tokyo boasts a garden and bar. Among the facilities of this property are a restaurant, a 24-hour front desk and room service, along with free WiFi. The accommodation features a concierge, ticket service and currency exchange for guests.",
			Facilities: []models.Facility{
				{
					Name: "AC",
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
			},
			Reviews: []models.Review{
				{
					CleanRating:    9,
					ComfortRating:  9,
					LocationRating: 8,
					ServiceRating:  9,
					UserID:         3,
					Comment:        "Sangat pas buat liburan keluarga dan bersantai. Ruang meeting luas.",
				},
				{
					CleanRating:    9,
					ComfortRating:  8,
					LocationRating: 9,
					ServiceRating:  9,
					UserID:         2,
					Comment:        "Pengalaman yang menyenangkan di GH Universal, istri dan kedua anak saya sangat enjoy saat staycation di sini. Staffnya ramah-ramah, terutama buat Pak Usep yang sangat baik melayani keluarga saya. Hatur nuhun Pak Usep. Definitely will come back again to GH Universal.",
				},
				{
					CleanRating:    9,
					ComfortRating:  8,
					LocationRating: 9,
					ServiceRating:  9,
					UserID:         2,
					Comment:        "Pengalaman yang menyenangkan di GH Universal, istri dan kedua anak saya sangat enjoy saat staycation di sini. Staffnya ramah-ramah, terutama buat Pak Usep yang sangat baik melayani keluarga saya. Hatur nuhun Pak Usep. Definitely will come back again to GH Universal.",
				},
				{
					CleanRating:    9,
					ComfortRating:  8,
					LocationRating: 9,
					ServiceRating:  9,
					UserID:         2,
					Comment:        "Pengalaman yang menyenangkan di GH Universal, istri dan kedua anak saya sangat enjoy saat staycation di sini. Staffnya ramah-ramah, terutama buat Pak Usep yang sangat baik melayani keluarga saya. Hatur nuhun Pak Usep. Definitely will come back again to GH Universal.",
				},
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
		{
			HotelID:  2,
			ImageURL: "https://firebasestorage.googleapis.com/v0/b/travelohi-f39a6.appspot.com/o/hotels%2Fhotel13.webp?alt=media&token=43ea2702-2571-4504-b81d-9cf77fc8410e",
		},
		{
			HotelID:  2,
			ImageURL: "https://firebasestorage.googleapis.com/v0/b/travelohi-f39a6.appspot.com/o/hotels%2Fhotel14.webp?alt=media&token=a07bfcf7-af85-4d20-a3db-0e0ec338e84a",
		},
		{
			HotelID:  2,
			ImageURL: "https://firebasestorage.googleapis.com/v0/b/travelohi-f39a6.appspot.com/o/hotels%2Fhotel15.webp?alt=media&token=643641d0-1eb6-4556-8eab-8d2e66bd6144",
		},
		{
			HotelID:  2,
			ImageURL: "https://firebasestorage.googleapis.com/v0/b/travelohi-f39a6.appspot.com/o/hotels%2Fhotel16.webp?alt=media&token=6d181045-6832-466b-aca6-3ffecb7d44bb",
		},
		{
			HotelID:  3,
			ImageURL: "https://firebasestorage.googleapis.com/v0/b/travelohi-f39a6.appspot.com/o/hotels%2Fhotel12.webp?alt=media&token=7b7ee1ca-d67f-48ee-bd36-a284dfa3735c",
		},
		{
			HotelID:  3,
			ImageURL: "https://firebasestorage.googleapis.com/v0/b/travelohi-f39a6.appspot.com/o/hotels%2Fhotel11.webp?alt=media&token=463e835f-eb81-4056-a0ea-0d75cf1c32ce",
		},
		{
			HotelID:  3,
			ImageURL: "https://firebasestorage.googleapis.com/v0/b/travelohi-f39a6.appspot.com/o/hotels%2Fhotel10.webp?alt=media&token=6d3c3599-39b9-4290-9e8a-0afb1d311e97",
		},
		{
			HotelID:  4,
			ImageURL: "https://firebasestorage.googleapis.com/v0/b/travelohi-f39a6.appspot.com/o/hotels%2Fhotel8.webp?alt=media&token=1127c5f5-10c7-4cf3-a440-15df3a99c16e",
		},
		{
			HotelID:  4,
			ImageURL: "https://firebasestorage.googleapis.com/v0/b/travelohi-f39a6.appspot.com/o/hotels%2Fhotel9.webp?alt=media&token=212f0304-cc34-4a58-9061-6a48f5a4dc75",
		},
		{
			HotelID:  5,
			ImageURL: "https://firebasestorage.googleapis.com/v0/b/travelohi-f39a6.appspot.com/o/hotels%2Fhotel8.webp?alt=media&token=1127c5f5-10c7-4cf3-a440-15df3a99c16e",
		},
		{
			HotelID:  6,
			ImageURL: "https://firebasestorage.googleapis.com/v0/b/travelohi-f39a6.appspot.com/o/hotels%2Fhotel9.webp?alt=media&token=212f0304-cc34-4a58-9061-6a48f5a4dc75",
		},
		{
			HotelID:  7,
			ImageURL: "https://firebasestorage.googleapis.com/v0/b/travelohi-f39a6.appspot.com/o/hotels%2Fhotel8.webp?alt=media&token=1127c5f5-10c7-4cf3-a440-15df3a99c16e",
		},
		{
			HotelID:  8,
			ImageURL: "https://firebasestorage.googleapis.com/v0/b/travelohi-f39a6.appspot.com/o/hotels%2Fhotel9.webp?alt=media&token=212f0304-cc34-4a58-9061-6a48f5a4dc75",
		},
	}

	room := []models.Room{
		{
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
		},
		{
			HotelID:  1,
			RoomType: "Deluxe Single",
			Price:    1652701,
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
			},
		},
		{
			HotelID:  2,
			RoomType: "Suite Castel",
			Price:    3652701,
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
		{
			RoomID:   2,
			ImageURL: "https://firebasestorage.googleapis.com/v0/b/travelohi-f39a6.appspot.com/o/hotels%2Froom2.webp?alt=media&token=26485637-841d-477a-8005-1c33e77efc4c",
		},
		{
			RoomID:   2,
			ImageURL: "https://firebasestorage.googleapis.com/v0/b/travelohi-f39a6.appspot.com/o/hotels%2Froom3.webp?alt=media&token=550c7400-1f7c-42b8-9bff-ce08fce4dd0e",
		},
		{
			RoomID:   2,
			ImageURL: "https://firebasestorage.googleapis.com/v0/b/travelohi-f39a6.appspot.com/o/hotels%2Froom1.webp?alt=media&token=0a926847-68e8-4217-a835-2ce5c99e982a",
		},
		{
			RoomID:   3,
			ImageURL: "https://firebasestorage.googleapis.com/v0/b/travelohi-f39a6.appspot.com/o/hotels%2Froom5.webp?alt=media&token=626d3903-0c7d-49e6-88b3-676696164843",
		},
		{
			RoomID:   3,
			ImageURL: "https://firebasestorage.googleapis.com/v0/b/travelohi-f39a6.appspot.com/o/hotels%2Froom6.webp?alt=media&token=8fbb6c73-ec14-4a9c-864c-3b8055e8a63a",
		},
	}

	db.Create(&hotel)
	db.Create(&hotelImage)
	db.Create(&room)
	db.Create(&roomImage)
}
