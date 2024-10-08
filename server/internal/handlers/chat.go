package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/shazeedul/vidgo/server/discover/chat"
	w "github.com/shazeedul/vidgo/server/discover/webrtc"
)

func RoomChatWebsocket(c *gin.Context) {
	uuid := c.Param("uuid")
	if uuid == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "uuid is required"})
		return
	}

	conn, err := chat.Upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to upgrade connection"})
		return
	}
	w.RoomsLock.Lock()
	room := w.Rooms[uuid]
	w.RoomsLock.Unlock()
	if room == nil || room.Hub == nil {
		c.AbortWithStatus(http.StatusNotFound)
		return
	}
	chat.PeerChatConn(conn, room.Hub)
}

func StreamChatWebsocket(c *gin.Context) {
	suuid := c.Param("suuid")
	if suuid == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "suuid is required"})
		return
	}

	// Upgrade the connection to a WebSocket
	conn, err := chat.Upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to upgrade connection"})
		return
	}

	w.RoomsLock.Lock()
	if stream, ok := w.Streams[suuid]; ok {
		w.RoomsLock.Unlock()
		if stream.Hub == nil {
			hub := chat.NewHub()
			stream.Hub = hub
			go hub.Run()
		}
		chat.PeerChatConn(conn, stream.Hub)
		return
	}
	w.RoomsLock.Unlock()
}
