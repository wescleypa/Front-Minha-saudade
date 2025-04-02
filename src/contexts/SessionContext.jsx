'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useSocket } from './SocketContext';

const SessionContext = createContext(null);

export const SessionProvider = ({ children }) => {
  const { socket } = useSocket();
  const [error, setError] = useState();
  const [user, setUser] = useState({
    id: null,
    name: null,
    email: null,
    token: null,
    nPlataforma: true,
    nEmail: false,
    mCrud: true,
    chats: [],
    skills: []
  });

  useEffect(() => {
    if (user?.id) {
      localStorage.setItem('token', user?.token);
      localStorage.setItem('user', user?.id);
      console.log('userdefinido ', user);
    }
  }, [user])

  useEffect(() => {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (socket && user && token) {
      socket.emit('verifyToken', { user, token }, (response) => {
        console.log(response)
        if (response.status === 'success') {
          setError();
          setUser(response?.data);
        } else {
          setError(response?.error ?? 'Sessão inválida ou expirada, faça login novamente.');
          setUser();
          localStorage.clear();
        }
      });
    }
  }, [socket]);

  const logout = () => {
    localStorage.clear();
    setUser();
  };

  return (
    <SessionContext.Provider value={{ user, setUser, error, setError, logout }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession deve ser usado dentro de um SessionProvider');
  }
  return context;
};