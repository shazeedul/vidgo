package server

import (
	"flag"
	"os"

	"github.com/gin-gonic/gin"
)

var (
	addr = flag.String("addr", ":"+os.Getenv("PORT"), "")
	cert = flag.String("cert", "", "")
	key  = flag.String("key", "", "")
)

func Run() error {
	flag.Parse()

	if *addr == ":" {
		*addr = ":8080"
	}
	router := gin.Default()
	if *cert != "" {
		return router.RunTLS(*addr, *cert, *key)
	}
	return router.Run(*addr)
}
