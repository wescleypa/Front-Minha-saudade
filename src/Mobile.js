import React, { useEffect, useState } from 'react';
import { useSession } from './contexts/SessionContext';
import EmptyChat from './Mobile/chat/Empty';
import { LoginModal } from './components/Auth/loginModal';
import MobileBar from './Mobile/chat/components/AppBar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import { Alert, Box, Collapse, Snackbar } from '@mui/material';
import ChatUser from './Mobile/chat/User';
import ChatMessage from './Mobile/chat/components/ChatMessage';
import ChatInput from './Mobile/chat/components/Input';
import UserProfile from './Mobile/chat/components/UserProfile';
import SettingsPage from './Mobile/chat/components/Settings';
import HelpPage from './Mobile/chat/components/Help';
import ChatProfile from './Mobile/chat/components/ChatProfile';
import ChatSettingsPage from './Mobile/chat/components/ChatSettings';
import VerifyPhone from './Mobile/chat/components/VerifyPhone';

const Mobile = () => {
  const { user, loadingUser, error, setError } = useSession();
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

  const handleCloseError = () => setError(null);

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

      {!!user?.token && selected === null && (page === '' || !page) && (
        <Collapse in={!!user?.token && selected === null && (page === '' || !page)} sx={{ mt: '64px' }}>
          <ChatUser setSelected={setSelected} />
        </Collapse>
      )}

      {selected !== null && (!page || page === '') && (
        <Collapse in={selected !== null && (!page || page === '')}>
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
      )}

      {page === 'profile' && selected === null && !!user?.token && (
        <Collapse in={page === 'profile' && selected === null && !!user?.token}>
          <UserProfile setPage={setPage} />
        </Collapse>
      )}

      {page === 'settings' && selected === null && !!user?.token && (
        <Collapse in={page === 'settings' && selected === null && !!user?.token}>
          <SettingsPage setPage={setPage} />
        </Collapse>
      )}

      {page === 'help' && selected === null && !!user?.token && (
        <Collapse in={page === 'help' && selected === null && !!user?.token}>
          <HelpPage />
        </Collapse>
      )}

      {page === 'profile-chat' && selected !== null && !!user?.token && (
        <Collapse in={page === 'profile-chat' && selected !== null && !!user?.token}>
          <ChatProfile selected={selected} />
        </Collapse>
      )}

      {page === 'settings-chat' && selected !== null && !!user?.token && (
        <Collapse in={page === 'settings-chat' && selected !== null && !!user?.token}>
          <ChatSettingsPage selected={selected} />
        </Collapse>
      )}

      {page === 'verify_phone' && selected === null && !!user?.token && (
        <Collapse in={page === 'verify_phone' && selected === null && !!user?.token}>
          <VerifyPhone setPage={setPage} />
        </Collapse>
      )}
      questTwoFactor

      <Snackbar
        anchorOrigin={{ vertical: 'center', horizontal: 'bottom' }}
        open={!!error}
        onClose={handleCloseError}
        autoHideDuration={5000}
      >
        <Alert severity="error">{error}</Alert>
      </ Snackbar>
    </Box>
  );
};

export default Mobile;