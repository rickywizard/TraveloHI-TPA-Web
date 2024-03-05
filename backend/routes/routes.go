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
		if err := controllers.Logout(ctx, db); err != nil {
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

	// Profile user
	authGroup.Put("/update_profile", func(ctx *fiber.Ctx) error {
		if err := controllers.UpdateProfile(ctx, db); err != nil {
			return err
		}
		return nil
	})

	authGroup.Post("/add_credit_card", func(ctx *fiber.Ctx) error {
		if err := controllers.AddCreditCard(ctx, db); err != nil {
			return err
		}
		return nil
	})

	// Search
	app.Post("/api/save_search", func(ctx *fiber.Ctx) error {
		if err := controllers.SaveSearch(ctx, db); err != nil {
			return err
		}
		return nil
	})

	app.Get("/api/get_recent_search", func(ctx *fiber.Ctx) error {
		if err := controllers.GetRecentSearches(ctx, db); err != nil {
			return err
		}
		return nil
	})

	app.Get("/api/get_popular_search", func(ctx *fiber.Ctx) error {
		if err := controllers.GetPopularSearches(ctx, db); err != nil {
			return err
		}
		return nil
	})

	// Game
	authGroup.Post("/game_reward", func(ctx *fiber.Ctx) error {
		if err := controllers.GiveReward(ctx, db); err != nil {
			return err
		}
		return nil
	})

	// Cart
	authGroup.Get("/get_cart", func(ctx *fiber.Ctx) error {
		if err := controllers.GetAllCart(ctx, db); err != nil {
			return err
		}
		return nil
	})

	authGroup.Post("/add_hotel_cart", func(ctx *fiber.Ctx) error {
		if err := controllers.AddHotelCart(ctx, db); err != nil {
			return err
		}
		return nil
	})

	authGroup.Put("/update_hotel_cart/:id", func(ctx *fiber.Ctx) error {
		if err := controllers.UpdateHotelCart(ctx, db); err != nil {
			return err
		}
		return nil
	})

	authGroup.Delete("/remove_hotel_cart/:id", func(ctx *fiber.Ctx) error {
		if err := controllers.RemoveHotelCart(ctx, db); err != nil {
			return err
		}
		return nil
	})

	// Transaction
	authGroup.Get("/get_ongoing_hotel", func(ctx *fiber.Ctx) error {
		if err := controllers.GetOnGoingHotelTickets(ctx, db); err != nil {
			return err
		}
		return nil
	})

	authGroup.Get("/get_past_hotel", func(ctx *fiber.Ctx) error {
		if err := controllers.GetPastHotelTickets(ctx, db); err != nil {
			return err
		}
		return nil
	})

	authGroup.Post("/add_hotel_transaction", func(ctx *fiber.Ctx) error {
		if err := controllers.AddHotelTransaction(ctx, db); err != nil {
			return err
		}
		return nil
	})

	authGroup.Get("/get_ongoing_flight", func(ctx *fiber.Ctx) error {
		if err := controllers.GetOnGoingFlightTickets(ctx, db); err != nil {
			return err
		}
		return nil
	})

	authGroup.Get("/get_past_flight", func(ctx *fiber.Ctx) error {
		if err := controllers.GetPastFlightTickets(ctx, db); err != nil {
			return err
		}
		return nil
	})

	authGroup.Post("/add_flight_transaction", func(ctx *fiber.Ctx) error {
		if err := controllers.AddFlightTransaction(ctx, db); err != nil {
			return err
		}
		return nil
	})

	// (admin + user) GET
	app.Get("/api/search", func(ctx *fiber.Ctx) error {
		if err := controllers.Search(ctx, db); err != nil {
			return err
		}
		return nil
	})

	app.Get("/api/get_promos", func(ctx *fiber.Ctx) error {
		if err := controllers.GetPromos(ctx, db); err != nil {
			return err
		}
		return nil
	})

	app.Get("/api/get_hotels", func(ctx *fiber.Ctx) error {
		if err := controllers.GetHotels(ctx, db); err != nil {
			return err
		}
		return nil
	})

	app.Get("/api/get_popular_hotels", func(ctx *fiber.Ctx) error {
		if err := controllers.GetPopularHotels(ctx, db); err != nil {
			return err
		}
		return nil
	})

	app.Get("/api/get_hotel_detail/:id", func(ctx *fiber.Ctx) error {
		if err := controllers.GetHotelDetail(ctx, db); err != nil {
			return err
		}
		return nil
	})

	app.Get("/api/get_flights", func(ctx *fiber.Ctx) error {
		if err := controllers.GetFlights(ctx, db); err != nil {
			return err
		}
		return nil
	})

	app.Get("/api/get_popular_flights", func(ctx *fiber.Ctx) error {
		if err := controllers.GetPopularFlights(ctx, db); err != nil {
			return err
		}
		return nil
	})

	app.Get("/api/get_flight_detail/:id", func(ctx *fiber.Ctx) error {
		if err := controllers.GetFlightDetail(ctx, db); err != nil {
			return err
		}
		return nil
	})

	// ADMIN
	// blast newsletter email
	authGroup.Post("/send_newsletter", func(ctx *fiber.Ctx) error {
		if err := controllers.SendNewsLetter(ctx, db); err != nil {
			return err
		}
		return nil
	})

	// manage users
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

	// manage airlines and flight
	authGroup.Post("/add_airline", func(ctx *fiber.Ctx) error {
		if err := controllers.CreateAirline(ctx, db); err != nil {
			return err
		}
		return nil
	})

	authGroup.Get("/get_airlines", func(ctx *fiber.Ctx) error {
		if err := controllers.GetAirlines(ctx, db); err != nil {
			return err
		}
		return nil
	})

	authGroup.Post("/add_flight/:id", func(ctx *fiber.Ctx) error {
		if err := controllers.CreateFlight(ctx, db); err != nil {
			return err
		}
		return nil
	})

	// manage hotels
	authGroup.Post("/add_hotel", func(ctx *fiber.Ctx) error {
		if err := controllers.CreateHotel(ctx, db); err != nil {
			return err
		}
		return nil
	})

	authGroup.Post("/add_room/:id", func(ctx *fiber.Ctx) error {
		if err := controllers.CreateRoom(ctx, db); err != nil {
			return err
		}
		return nil
	})

	// manage promos
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
