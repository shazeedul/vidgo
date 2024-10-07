package main

import (
	"log"

	server "github.com/shazeedul/vidgo/server/internal"
)

func main() {
	if err := server.Run(); err != nil {
		log.Fatalln(err.Error())
	}
}
