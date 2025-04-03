'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Conexão com o servidor Socket.IO
    const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || 'http://localhost:3000', {
      transports: ['websocket'],
      autoConnect: true,
      auth: {
        token: localStorage.getItem("token"),
        teste: "teste",
      },
    });

    setSocket(socketInstance);

    // Event listeners
    socketInstance.on('connect', () => {
      setIsConnected(true);
      console.log('Conectado ao servidor Socket.IO');
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
      console.log('Desconectado do servidor Socket.IO');
    });

    socketInstance.on('connect_error', (err) => {
      console.error('Erro de conexão:', err.message);
    });

    // Conecta quando o componente monta
    socketInstance.connect();

    // Limpeza ao desmontar
    return () => {
      socketInstance.disconnect();
      socketInstance.off('connect');
      socketInstance.off('disconnect');
      socketInstance.off('connect_error');
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket deve ser usado dentro de um SocketProvider');
  }
  return context;
};