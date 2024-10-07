/* eslint-disable react-refresh/only-export-components */
import React, { useMemo } from "react";
import { io, Socket } from "socket.io-client";

const SocketContext = React.createContext<Socket | null>(null);

const useSocket = () => {
    const socket = React.useContext(SocketContext);
    if (!socket) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return socket;
}

const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const socket = useMemo(() =>
        io({
            host: "localhost",
            port: 8001,
        }), []
    )
    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
}

export { SocketProvider, useSocket };