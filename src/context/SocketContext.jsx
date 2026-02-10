import React, { createContext, useContext } from "react";
import { io } from "socket.io-client";

const socketBaseUrl = import.meta.env.VITE_SOCKET_BASE;

// Create a context for Socket.io
const SocketContext = createContext(null);

// Custom hook to use the socket context
export const useSocket = () => useContext(SocketContext);

// Socket provider component
export const SocketProvider = ({ children }) => {
  const socket = io(socketBaseUrl, {
    transports: ["websocket"],
  });

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
