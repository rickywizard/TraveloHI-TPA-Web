package seeders

import (
	"github.com/rickywizard/TraveloHI-TPA-Web/backend/models"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func SeedUser(db *gorm.DB) {
	var otpData models.OTPData
	db.Create(&otpData)

	users := []models.User{
		{
			FirstName:         "Ricky",
			LastName:          "Wijaya",
			Email:             "rickywijayaplay@gmail.com",
			DateOfBirth:       "2003-10-19",
			Password:          hashPassword("password123"),
			Gender:            "Male",
			ProfilePictureUrl: "https://firebasestorage.googleapis.com/v0/b/travelohi-f39a6.appspot.com/o/profile_images%2Fayano.jpg?alt=media&token=154b225b-f425-4129-bfc3-fd76d00b534d",
			SecurityQuestion:  "What is the name of your favorite book or movie?",
			SecurityAnswer:    "The Divergent Series",
			IsActive:          true,
			IsSubscriber:      true,
			IsAdmin:           true,
			IsLoggedIn:        false,
			Points:            0,
			OTPDataID:         otpData.ID,
		},
		{
			FirstName:         "Raja",
			LastName:          "Kasino",
			Email:             "rickywijayatatando@gmail.com",
			DateOfBirth:       "2000-05-05",
			Password:          hashPassword("gacorkang123"),
			Gender:            "Female",
			ProfilePictureUrl: "https://firebasestorage.googleapis.com/v0/b/travelohi-f39a6.appspot.com/o/profile_images%2Fdummy.webp?alt=media&token=987e1dd5-9224-4d88-b522-9065cb958bb9",
			SecurityQuestion:  "What is your favorite childhood pet's name?",
			SecurityAnswer:    "Piqui",
			IsSubscriber:      false,
			IsActive:          true,
			IsAdmin:           false,
			IsLoggedIn:        false,
			Points:            0,
			OTPDataID:         otpData.ID,
		},
		{
			FirstName:         "Kentang",
			LastName:          "Goreng",
			Email:             "rickywijaya009@outlook.com",
			DateOfBirth:       "1995-03-13",
			Password:          hashPassword("Test123$"),
			Gender:            "Male",
			ProfilePictureUrl: "https://firebasestorage.googleapis.com/v0/b/travelohi-f39a6.appspot.com/o/profile_images%2Fdummy.webp?alt=media&token=987e1dd5-9224-4d88-b522-9065cb958bb9",
			SecurityQuestion:  "What is the model of your first car?",
			SecurityAnswer:    "BMW 1",
			IsSubscriber:      true,
			IsActive:          true,
			IsAdmin:           false,
			IsLoggedIn:        false,
			Points:            0,
			OTPDataID:         otpData.ID,
		},
		{
			FirstName:         "Rose",
			LastName:          "Blekping",
			Email:             "ricky.wijaya009@binus.ac.id",
			DateOfBirth:       "1992-06-30",
			Password:          hashPassword("Test123$"),
			Gender:            "Female",
			ProfilePictureUrl: "https://firebasestorage.googleapis.com/v0/b/travelohi-f39a6.appspot.com/o/profile_images%2Fdummy.webp?alt=media&token=987e1dd5-9224-4d88-b522-9065cb958bb9",
			SecurityQuestion:  "What is the name of the elementary school you attended?",
			SecurityAnswer:    "Oxford",
			IsSubscriber:      true,
			IsActive:          true,
			IsAdmin:           false,
			IsLoggedIn:        false,
			Points:            0,
			OTPDataID:         otpData.ID,
		},
	}

	db.Create(&users)
}

func hashPassword(password string) []byte {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return []byte{}
	}
	return hashedPassword
}
