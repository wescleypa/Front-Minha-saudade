import React, { useEffect, useState } from 'react';
import { useSession } from './contexts/SessionContext';
import { Collapse } from '@mui/material';
import ChatDrawer from './components/Chat/ChatDrawer';
import { ChatEmptyState } from './components/Chat/ChatEmptyState';

//import ChatUI from './ChatUI';

import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import Forgot from './components/Auth/Forgot';
import Code from './components/Auth/Code';
import ProfilePage from './components/User/Profile';
import { LoginModal } from './components/Auth/loginModal';

const Home = () => {
  const { user } = useSession();
  const [page, setPage] = useState('');
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [codeAuth, setCodeAuth] = useState();

  const closeLoginModal = () => setOpenLoginModal(false);

  useEffect(() => {
    if (user?.id && !!openLoginModal) {
      setOpenLoginModal(false);
    }
    if (!user?.id & !openLoginModal) {
      setOpenLoginModal(true);
    }
  }, [user]);

  return (
    <div className="App" style={{ backgroundColor: 'RGB(237, 237, 237)' }}>
      {!!user?.id && (!page || page === '' || page === 'chat') && (
        <ChatDrawer setPage={setPage} />
      )}
      {!user?.id && (!page || page === '') && (
        <ChatEmptyState setPage={setPage} />
      )}
      {/*<ChatUI setPage={setPage} />*/}

      <Collapse in={page === 'register'}>
        <Register setPage={setPage} setCodeAuth={setCodeAuth} />
      </Collapse>
      <Collapse in={page === 'code'}>
        <Code setPage={setPage} codeAuth={codeAuth} setCodeAuth={setCodeAuth} />
      </Collapse>
      <Collapse in={page === 'login'}>
        <Login setPage={setPage} setCodeAuth={setCodeAuth} />
      </Collapse>
      <Collapse in={page === 'forgot'}>
        <Forgot setPage={setPage} setCodeAuth={setCodeAuth} />
      </Collapse>
      <Collapse in={page === 'profile'}>
        <ProfilePage setPage={setPage} />
      </Collapse>

      <LoginModal open={openLoginModal} close={closeLoginModal} setPage={setPage} />
    </div>
  );
};

export default Home;