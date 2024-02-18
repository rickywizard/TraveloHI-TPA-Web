package controllers

import (
	"fmt"
	"net/smtp"

	"github.com/gofiber/fiber/v2"
	"github.com/rickywizard/TraveloHI-TPA-Web/backend/models"
	"gorm.io/gorm"
)

func SendNewsLetter(ctx *fiber.Ctx, db *gorm.DB) error {
	// Validate subject and body
	var newsInput models.NewsInput

	if err := ctx.BodyParser(&newsInput); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request format",
		})
	}

	if newsInput.Subject == "" || newsInput.Body == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Subject and body cannot be empty",
		})
	}

	// Fetch subscribers
	var subscribers []models.User
	db.Where("is_subscriber = ?", true).Find(&subscribers)

	// SMTP configuration
	smtpHost := "smtp.gmail.com"
	smtpPort := 587
	smtpUsername := "id.vladapp@gmail.com"
	smtpPassword := "rqgrnlruynbuuvsr"

	auth := smtp.PlainAuth("", smtpUsername, smtpPassword, smtpHost)

	// Prepare email
	from := "id.vladapp@gmail.com"
	message := fmt.Sprintf("From: %s\r\nTo: ", from)

	// Add all subscriber emails to the 'To' field
	for _, user := range subscribers {
		message += user.Email + ","
	}

	message = message[:len(message)-1] // Remove the trailing comma
	message += "\r\nSubject: " + newsInput.Subject + "\r\n\r\n" + newsInput.Body

	// Send email to subscribers
	var toEmails []string
	for _, user := range subscribers {
		toEmails = append(toEmails, user.Email)
	}

	err := smtp.SendMail(fmt.Sprintf("%s:%d", smtpHost, smtpPort), auth, from, toEmails, []byte(message))
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err,
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Newsletter sent successfully",
	})
}
