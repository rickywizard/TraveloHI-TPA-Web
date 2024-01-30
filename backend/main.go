package main

import (
	"log"

	swagger "github.com/arsmn/fiber-swagger/v2"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/rickywizard/TraveloHI-TPA-Web/backend/database"
	_ "github.com/rickywizard/TraveloHI-TPA-Web/backend/docs"
	"github.com/rickywizard/TraveloHI-TPA-Web/backend/models"
	"github.com/rickywizard/TraveloHI-TPA-Web/backend/routes"
	"github.com/rickywizard/TraveloHI-TPA-Web/backend/seeders"
)

// @title Fiber Swagger Example API
// @version 2.0
// @description This is a sample server server.
// @termsOfService http://swagger.io/terms/

// @contact.name API Support
// @contact.url http://www.swagger.io/support
// @contact.email support@swagger.io

// @license.name Apache 2.0
// @license.url http://www.apache.org/licenses/LICENSE-2.0.html

// @host localhost:8000
// @BasePath /
// @schemes http
func main() {
	db := database.Connection()

	// Fiber instance
	app := fiber.New()

	// Migrate and Seed
	models.Migrate(db)
	seeders.SeedUser(db)
	seeders.SeedPromo(db)

	// Middleware
	app.Use(recover.New())
	app.Use(cors.New(cors.Config{
		AllowCredentials: true,
		AllowOrigins:     "http://127.0.0.1:5173",
		AllowMethods:     "GET, POST, PUT, DELETE",
	}))

	// Routes
	app.Get("/swagger/*", swagger.HandlerDefault) // default
	routes.Setup(app, db)

	// Start Server
	if err := app.Listen(":8000"); err != nil {
		log.Fatal(err)
	}
}
