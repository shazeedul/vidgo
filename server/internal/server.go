package server

import (
	"flag"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	w "github.com/shazeedul/vidgo/server/discover/webrtc"
	"github.com/shazeedul/vidgo/server/internal/handlers"
)

var (
	addr = flag.String("addr", ":"+os.Getenv("PORT"), "")
	cert = flag.String("cert", "", "")
	key  = flag.String("key", "", "")
)

func Run() error {
	flag.Parse()

	if *addr == ":" {
		*addr = ":8090"
	}
	router := gin.Default()
	router.Use(gin.Logger())
	router.Use(cors.Default())
	router.GET("/room/:uuid/websocket", handlers.RoomWebsocket)
	router.GET("/room/:uuid/chat/websocket", handlers.RoomChatWebsocket)
	router.GET("/room/:uuid/viewer/websocket", handlers.RoomViewerWebsocket)
	router.GET("/stream/:suuid/websocket", handlers.StreamWebsocket)
	router.GET("/stream/:suuid/chat/websocket", handlers.StreamChatWebsocket)
	router.GET("/stream/:suuid/viewer/websocket", handlers.StreamViewerWebsocket)
	// router.GET("/room/:uuid/offer", handlers.RoomOffer)
	// router.GET("/room/:uuid/answer", handlers.RoomAnswer)
	// router.GET("/room/:uuid/icecandidate", handlers.RoomICECandidate)
	// router.GET("/room/:uuid/leave", handlers.RoomLeave)
	// router.GET("/stream/:suuid/offer", handlers.StreamOffer)
	// router.GET("/stream/:suuid/answer", handlers.StreamAnswer)
	// router.GET("/stream/:suuid/icecandidate", handlers.StreamICECandidate)
	w.Rooms = make(map[string]*w.Room)
	w.Streams = make(map[string]*w.Room)
	go dispatchKeyFrames()
	if *cert != "" {
		return router.RunTLS(*addr, *cert, *key)
	}
	return router.Run(*addr)
}

func dispatchKeyFrames() {
	for range time.NewTicker(time.Second * 3).C {
		for _, room := range w.Rooms {
			room.Peers.DispatchKeyFrame()
		}
	}
}
