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

func Run() {
	router := gin.Default()

	return 
}
