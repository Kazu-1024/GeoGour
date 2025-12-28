package config

import (
	"log"
	"os"
)

type Config struct {
	Port            string
	HotPepperAPIKey string
}

func Load() *Config {
	apiKey := os.Getenv("HOTPEPPER_API_KEY")
	if apiKey == "" {
		log.Fatal("HOTPEPPER_API_KEY is required")
	}

	return &Config{
		Port:            os.Getenv("PORT"),
		HotPepperAPIKey: apiKey,
	}
}
