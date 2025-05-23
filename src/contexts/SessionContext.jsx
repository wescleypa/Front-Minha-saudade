'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useSocket } from './SocketContext';
import axios from 'axios';

const SessionContext = createContext(null);

export const SessionProvider = ({ children }) => {
  const { socket } = useSocket();
  const [error, setError] = useState();
  const [loadingUser, setLoadingUser] = useState(true);
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
      if (localStorage.getItem('token') !== user?.token) {
        localStorage.setItem('token', user?.token);
      }
      if (localStorage.getItem('user') !== user?.id) {
        localStorage.setItem('user', user?.id);
      }
      console.log('userdefinido ', user);
    }
  }, [user])

  useEffect(() => {
    const token = localStorage.getItem('token');

    const start = async () => {
      if (!socket) return;

      if (token) {
        setLoadingUser(true);
        try {
          const response = await new Promise((resolve, reject) => {
            socket.emit('verifyToken', { user, token }, (response) => {
              if (!response) reject(new Error('Sem resposta do servidor'));
              else resolve(response);
            });

            // Timeout adicional para evitar espera infinita
            setTimeout(() => reject(new Error('Timeout na verificação')), 10000);
          });

          if (response.status === 'success') {
            setError(null);
            setUser(response.data);
          } else {
            throw new Error(response.error || 'Sessão inválida');
          }
        } catch (err) {
          console.error(err);
          setError(err.message);
          setUser(null);
          localStorage.clear();
        } finally {
          setLoadingUser(false);
        }
      } else setLoadingUser(false);
    };

    start();
  }, [socket]);

  const logout = () => {
    localStorage.clear();
    setUser({
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
  };

  const update = async (column, value) => {
    if (socket) {
      const backup = user[column];

      setUser((prev) => ({ ...prev, [column]: value }));
      await socket.emit('user:update:profile', { column, value }, (response) => {
        if (!response?.success) {
          setUser((prev) => ({ ...prev, [column]: backup }));
          setError(response?.error ?? 'Houve uma falha ao tentar se conectar com servidor, tente novamente.');
        }
      });
    } else {
      setError('Houve uma falha ao tentar se conectar com servidor, tente novamente.');
    }
  };

  const updateConfig = async (column, value) => {
    if (socket) {
      const backup = user[column];

      setUser((prev) => ({ ...prev, [column]: value }));
      await socket.emit('user:update:config', { column, value }, (response) => {
        if (!response?.success) {
          setUser((prev) => ({ ...prev, [column]: backup }));
          setError(response?.error ?? 'Houve uma falha ao tentar se conectar com servidor, tente novamente.');
        }
      });
    } else {
      setError('Houve uma falha ao tentar se conectar com servidor, tente novamente.');
    }
  };

  return (
    <SessionContext.Provider value={{ user, setUser, error, setError, logout, loadingUser, update, updateConfig }}>
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