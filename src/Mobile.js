import React, { useEffect, useState } from 'react';
import { useSession } from './contexts/SessionContext';
import EmptyChat from './Mobile/chat/Empty';
import { LoginModal } from './components/Auth/loginModal';
import MobileBar from './Mobile/chat/components/AppBar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import { Collapse } from '@mui/material';

const Mobile = () => {
  const { user, loadingUser } = useSession();
  const [page, setPage] = useState('');
  const [openLoginModal, setOpenLoginModal] = useState(false);
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
    <div className="App" style={{ backgroundColor: 'RGB(237, 237, 237) !important' }}>
      <Collapse in={page !== 'login' && page !== 'register'} timeout={300}>
        <MobileBar setPage={setPage} />
      </Collapse>

      <LoginModal open={openLoginModal} close={closeLoginModal} setPage={setPage} />

      <Collapse in={page === 'login'} timeout={300}>
        <Login setPage={setPage} />
      </Collapse>

      <Collapse in={page === 'register'} timeout={300}>
        <Register setPage={setPage} />
      </Collapse>

      {!!user?.id && (!page || page === '' || page === 'chat') && (
        <></>
      )}

      {!user?.id && (!page || page === '') && (
        <EmptyChat setOpenLoginModal={setOpenLoginModal} />
      )}

    </div>
  );
};

export default Mobile;