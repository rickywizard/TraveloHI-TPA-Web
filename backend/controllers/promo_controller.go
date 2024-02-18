package controllers

import (
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/rickywizard/TraveloHI-TPA-Web/backend/models"
	"gorm.io/gorm"
)

func GetPromos(ctx *fiber.Ctx, db *gorm.DB) error {
	var promos []models.Promo

	if err := db.Find(&promos).Error; err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch promos",
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(promos)
}

func GetPromo(ctx *fiber.Ctx, db *gorm.DB) error {
	id := ctx.Params("id")

	var promo models.Promo

	// Cari promo dengan ID tertentu dalam database
	result := db.First(&promo, id)
	if result.Error != nil {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Promo not found",
		})
	}

	promo.ExpiredDate = promo.ExpiredDate.Add(7 * time.Hour)

	return ctx.Status(fiber.StatusOK).JSON(promo)
}

func CreatePromo(ctx *fiber.Ctx, db *gorm.DB) error {
	var data map[string]string

	if err := ctx.BodyParser(&data); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// Validasi field tidak boleh kosong
	requiredFields := map[string]string{
		"name":         "Name",
		"code":         "Code",
		"discount":     "Discount",
		"expired_date": "Expired Date",
		"image_url":    "Image",
	}

	for field, displayName := range requiredFields {
		if val, ok := data[field]; !ok || val == "" {
			return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": fmt.Sprintf("%s cannot be empty", displayName),
			})
		}
	}

	// Validasi promo code tidak duplikat
	existingPromo := models.Promo{}
	if err := db.Where("code = ?", data["code"]).First(&existingPromo).Error; err == nil {
		return ctx.Status(fiber.StatusConflict).JSON(fiber.Map{
			"error": "Promo code must be unique. Choose a different code.",
		})
	}

	expiredDate, err := time.Parse("2006-01-02T15:04:05", data["expired_date"])
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid format for expired_date",
		})
	}

	expiredDate = expiredDate.Add(-7 * time.Hour)

	// Set waktu pembuatan dan pembaruan
	now := time.Now()

	promo := models.Promo{
		Name:        data["name"],
		Code:        data["code"],
		Discount:    data["discount"],
		ExpiredDate: expiredDate,
		ImageUrl:    data["image_url"],
		CreatedAt:   now,
		UpdatedAt:   now,
	}

	// Simpan promo ke database
	db.Create(&promo)

	// Kembalikan respons sukses
	return ctx.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Promo created successfully",
	})
}

func UpdatePromo(ctx *fiber.Ctx, db *gorm.DB) error {
	id := ctx.Params("id")

	var promo models.Promo
	result := db.First(&promo, id)
	if result.Error != nil {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Promo not found",
		})
	}

	var promoUpdate map[string]string
	if err := ctx.BodyParser(&promoUpdate); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// Validasi field tidak boleh kosong
	requiredFields := map[string]string{
		"name":         "Name",
		"code":         "Code",
		"discount":     "Discount",
		"expired_date": "Expired Date",
		"image_url":    "Image",
	}

	for field, displayName := range requiredFields {
		if val, ok := promoUpdate[field]; !ok || val == "" {
			return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": fmt.Sprintf("%s cannot be empty", displayName),
			})
		}
	}

	// Validasi promo code tidak duplikat jika kode promo diubah
	if promoUpdate["code"] != promo.Code {
		existingPromo := models.Promo{}
		if err := db.Where("code = ?", promoUpdate["code"]).First(&existingPromo).Error; err == nil {
			return ctx.Status(fiber.StatusConflict).JSON(fiber.Map{
				"error": "Promo code must be unique. Choose a different code.",
			})
		}
	}

	expiredDate, err := time.Parse("2006-01-02T15:04:05", promoUpdate["expired_date"])
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid format for expired_date",
		})
	}
	expiredDate = expiredDate.Add(-7 * time.Hour)

	// Menggunakan Updates pada record yang sudah ada
	if err := db.Model(&promo).Updates(models.Promo{
		Name:        promoUpdate["name"],
		Code:        promoUpdate["code"],
		Discount:    promoUpdate["discount"],
		ExpiredDate: expiredDate,
		ImageUrl:    promoUpdate["image_url"],
		UpdatedAt:   time.Now(),
	}).Error; err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update promo",
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Update promo success",
	})
}

func DeletePromo(ctx *fiber.Ctx, db *gorm.DB) error {
	id := ctx.Params("id")

	var promo models.Promo

	// Temukan promo berdasarkan ID
	result := db.Where("id = ?", id).First(&promo)
	if result.Error != nil {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Promo not found",
		})
	}

	// Delete promonya
	err := db.Delete(&promo).Error
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to delete promo",
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Delete promo success",
	})
}
