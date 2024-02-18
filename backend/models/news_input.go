package models

type NewsInput struct {
	Subject string `json:"subject"`
	Body    string `json:"body"`
}
