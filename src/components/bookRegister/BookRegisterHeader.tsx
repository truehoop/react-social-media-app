import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Box, Button, IconButton } from '@mui/material';
import React from 'react';

interface BookRegisterHeaderProps {
  onBack: () => void;
  onSubmit: () => void;
}

export default function BookRegisterHeader({ onBack, onSubmit }: BookRegisterHeaderProps) {
  return (
    <Box className="flex justify-between items-center p-4 fixed top-0 left-0 right-0 bg-white z-10 border-b">
      <IconButton onClick={onBack}>
        <ArrowBackIosNewIcon />
      </IconButton>
      <span className="text-lg font-medium absolute left-1/2 transform -translate-x-1/2">도서 등록</span>
      <div className="w-10" /> {/* Spacer to balance the back button */}
    </Box>
  );
}
