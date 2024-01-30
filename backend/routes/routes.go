package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/rickywizard/TraveloHI-TPA-Web/backend/controllers"
	"github.com/rickywizard/TraveloHI-TPA-Web/backend/middleware"
	"gorm.io/gorm"
)

func Setup(app *fiber.App, db *gorm.DB) {

	authGroup := app.Group("/api/auth", middleware.RequireAuth())

	authGroup.Get("/user", func(ctx *fiber.Ctx) error {
		if err := controllers.User(ctx, db); err != nil {
			return err
		}
		return nil
	})

	authGroup.Post("/logout", func(ctx *fiber.Ctx) error {
		if err := controllers.Logout(ctx); err != nil {
			return err
		}
		return nil
	})

	// public
	app.Post("/api/register", func(ctx *fiber.Ctx) error {
		if err := controllers.Register(ctx, db); err != nil {
			return err
		}
		return nil
	})

	app.Post("/api/login", func(ctx *fiber.Ctx) error {
		if err := controllers.Login(ctx, db); err != nil {
			return err
		}
		return nil
	})

	app.Post("/api/verify_captcha", func(ctx *fiber.Ctx) error {
		if err := controllers.VerifyCaptcha(ctx); err != nil {
			return err
		}
		return nil
	})

	app.Get("/api/send_otp", func(ctx *fiber.Ctx) error {
		if err := controllers.SendOTP(ctx, db); err != nil {
			return err
		}
		return nil
	})

	app.Post("/api/verify_otp", func(ctx *fiber.Ctx) error {
		if err := controllers.VerifyOTP(ctx, db); err != nil {
			return err
		}
		return nil
	})

	app.Get("/api/get_security_question", func(ctx *fiber.Ctx) error {
		if err := controllers.GetSecurityQuestion(ctx, db); err != nil {
			return err
		}
		return nil
	})

	app.Post("/api/check_security_answer", func(ctx *fiber.Ctx) error {
		if err := controllers.CheckSecurityAnswer(ctx, db); err != nil {
			return err
		}
		return nil
	})

	app.Post("/api/update_password", func(ctx *fiber.Ctx) error {
		if err := controllers.UpdatePassword(ctx, db); err != nil {
			return err
		}
		return nil
	})

	// (admin + user) GET
	authGroup.Get("/get_promos", func(ctx *fiber.Ctx) error {
		if err := controllers.GetPromos(ctx, db); err != nil {
			return err
		}
		return nil
	})

	// admin
	authGroup.Get("/get_users", func(ctx *fiber.Ctx) error {
		if err := controllers.GetAllUser(ctx, db); err != nil {
			return err
		}
		return nil
	})

	authGroup.Post("/ban_unban_user/:id", func(ctx *fiber.Ctx) error {
		if err := controllers.BanUnbanUser(ctx, db); err != nil {
			return err
		}
		return nil
	})

	authGroup.Post("/add_promo", func(ctx *fiber.Ctx) error {
		if err := controllers.CreatePromo(ctx, db); err != nil {
			return err
		}
		return nil
	})

	authGroup.Get("/get_promo/:id", func(ctx *fiber.Ctx) error {
		if err := controllers.GetPromo(ctx, db); err != nil {
			return err
		}
		return nil
	})

	authGroup.Put("/update_promo/:id", func(ctx *fiber.Ctx) error {
		if err := controllers.UpdatePromo(ctx, db); err != nil {
			return err
		}
		return nil
	})

	authGroup.Delete("/delete_promo/:id", func(ctx *fiber.Ctx) error {
		if err := controllers.DeletePromo(ctx, db); err != nil {
			return err
		}
		return nil
	})
}
