import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import { Box, IconButton } from '@mui/material';
import React from 'react';

export default function Header() {
  return (
    <Box className="flex justify-between items-center p-4 bg-white">
      <Box className="flex items-center">
        <LocationOnIcon className="text-green-700" />
        <span className="ml-1 font-medium">강남구 역삼동</span>
        <KeyboardArrowDownIcon />
      </Box>
      <Box className="flex gap-2">
        <IconButton>
          <SearchIcon />
        </IconButton>
        <IconButton>
          <NotificationsIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
