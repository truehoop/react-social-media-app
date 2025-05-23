import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import HomeIcon from '@mui/icons-material/Home';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SearchIcon from '@mui/icons-material/Search';
import { Box } from '@mui/material';
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { useUser } from '@contexts/UserContext';

export default function BottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();

  const handleHome = () => {
    navigate('/');
  };

  const handleMy = () => {
    if (user) {
      navigate(`/profile/${user.id}`);
    } else {
      navigate('/login');
    }
  };

  const handleRegister = () => {
    navigate('/book-register');
  };

  const isHome = location.pathname === '/';
  const isRegister = location.pathname === '/book-register';
  const isMy = location.pathname.startsWith('/profile');

  return (
    <Box className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center py-2">
      <button
        className="flex flex-col items-center"
        onClick={handleHome}
      >
        <HomeIcon className={isHome ? 'text-green-700' : ''} />
        <span className={`text-xs mt-1 ${isHome ? 'text-green-700 font-bold' : ''}`}>홈</span>
      </button>
      <button className="flex flex-col items-center">
        <SearchIcon />
        <span className="text-xs mt-1">검색</span>
      </button>
      <button
        className="flex flex-col items-center"
        onClick={handleRegister}
      >
        <AddCircleOutlineIcon className={isRegister ? 'text-green-700' : ''} />
        <span className={`text-xs mt-1 ${isRegister ? 'text-green-700 font-bold' : ''}`}>등록</span>
      </button>
      <button className="flex flex-col items-center">
        <ChatBubbleOutlineIcon />
        <span className="text-xs mt-1">채팅</span>
      </button>
      <button
        className="flex flex-col items-center"
        onClick={handleMy}
      >
        <PersonOutlineIcon className={isMy ? 'text-green-700' : ''} />
        <span className={`text-xs mt-1 ${isMy ? 'text-green-700 font-bold' : ''}`}>마이</span>
      </button>
    </Box>
  );
}
