package models

import "gorm.io/gorm"

func Migrate(db *gorm.DB) {
	// 1. Drop tabel yang memiliki foreign key dari tabel lain
	db.Migrator().DropTable(&Review{})

	// 2. Drop tabel yang diacu oleh foreign key pada tabel pertama
	db.Migrator().DropTable(&User{})
	db.Migrator().DropTable(&RoomImage{})
	db.Migrator().DropTable(&HotelImage{})

	// 3. Drop tabel-tabel lain yang tidak memiliki foreign key
	db.Migrator().DropTable(&Facility{})
	db.Migrator().DropTable(&Room{})
	db.Migrator().DropTable(&Hotel{})

	db.Migrator().DropTable(&OTPData{})
	db.Migrator().DropTable(&Promo{})
	// db.Migrator().DropTable(&Hotel{})

	db.AutoMigrate(&Promo{})
	db.AutoMigrate(&OTPData{})
	db.AutoMigrate(&User{})

	db.AutoMigrate(&Review{})
	db.AutoMigrate(&Hotel{})
	db.AutoMigrate(&HotelImage{})
	db.AutoMigrate(&Room{})
	db.AutoMigrate(&RoomImage{})
	db.AutoMigrate(&Facility{})
}
