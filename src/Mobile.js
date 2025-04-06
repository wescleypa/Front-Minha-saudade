import React, { useEffect, useRef, useState } from 'react';
import { useSession } from './contexts/SessionContext';
import EmptyChat from './Mobile/chat/Empty';
import { LoginModal } from './components/Auth/loginModal';
import MobileBar from './Mobile/chat/components/AppBar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import { Box, Collapse } from '@mui/material';
import ChatUser from './Mobile/chat/User';
import ChatMessage from './Mobile/chat/components/ChatMessage';
import ChatInput from './Mobile/chat/components/Input';
import UserProfile from './Mobile/chat/components/UserProfile';
import SettingsPage from './Mobile/chat/components/Settings';

const Mobile = () => {
  const { user, loadingUser } = useSession();
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState('');
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [codeAuth, setCodeAuth] = useState(false);
  const closeLoginModal = () => setOpenLoginModal(false);

  useEffect(() => {
    if (!loadingUser) {
      setOpenLoginModal(current => {
        const shouldClose = user?.id && current;
        const shouldOpen = !user?.id && !current;
        return shouldClose ? false : shouldOpen ? true : current;
      });
    }
  }, [loadingUser, user?.id]);

  return (
    <Box component="div" className="App" sx={{ minHeight: '100vh', bgcolor: 'background.paper' }}>
      <Collapse in={page !== 'login' && page !== 'register'} timeout={300}>
        <MobileBar page={page} setPage={setPage} selected={selected} setSelected={setSelected} />
      </Collapse>

      {!user?.token && (<>
        <LoginModal open={openLoginModal} close={closeLoginModal} setPage={setPage} />

        <Collapse in={page === 'login'} timeout={300}>
          <Login setPage={setPage} setCodeAuth={setCodeAuth} />
        </Collapse>

        <Collapse in={page === 'register'} timeout={300}>
          <Register setPage={setPage} />
        </Collapse>
      </>)}

      {!user?.token && (!page || page === '') && (
        <EmptyChat setOpenLoginModal={setOpenLoginModal} />
      )}

      <Collapse in={!!user?.token && selected === null && (page === '' || !page)} sx={{ mt: '64px' }}>
        <ChatUser setSelected={setSelected} />
      </Collapse>

      <Collapse in={selected !== null}>
        <ChatMessage
          chat={user?.chats?.find(c => c?.id === selected)}
          onRetry={(e) => alert(e)}
          onLike={(e) => alert(e)}
          onUnlike={(e) => alert(e)}
        />

        {/* ChatInput fixo na parte inferior */}
        <Box sx={{ width: '100%' }}>
          <ChatInput onSend={(e) => alert(e)} />
        </Box>
      </Collapse>

      <Collapse in={page === 'profile' && selected === null && !!user?.token}>
        <UserProfile />
      </Collapse>

      <Collapse in={page === 'settings' && selected === null && !!user?.token}>
        <SettingsPage />
      </Collapse>

    </Box>
  );
};

export default Mobile;