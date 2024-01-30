package middleware

import (
	"github.com/dgrijalva/jwt-go"
	"github.com/gofiber/fiber/v2"
)

// RequireAuth middleware memeriksa apakah request memiliki token JWT yang valid
func RequireAuth() fiber.Handler {
	return func(ctx *fiber.Ctx) error {
		// Ambil token dari cookie atau header Authorization
		tokenString := ctx.Cookies("jwt")

		if tokenString == "" {
			return ctx.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Unauthorized - Missing JWT token",
			})
		}

		// Verifikasi token
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return []byte("secret"), nil // secret key?
		})

		if err != nil || !token.Valid {
			return ctx.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Unauthorized - Invalid JWT token",
			})
		}

		// Token valid, lanjutkan ke handler berikutnya
		return ctx.Next()
	}
}
