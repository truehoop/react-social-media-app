import SettingsIcon from '@mui/icons-material/Settings';
import { Box } from '@mui/material';
import React from 'react';

import LanguageSelectorPopover from './LanguageSelectorPopover';
import TopbarPopover from './TopbarPopover';

interface TopbarProps {
  title?: string;
}

export default function Topbar({ title }: TopbarProps) {
  return (
    <Box className="h-14 w-full bg-green-800 flex items-center justify-between px-4 relative">
      <span className="text-white text-xl font-bold absolute left-1/2 -translate-x-1/2">{title || 'bookSwap'}</span>
      <TopbarPopover
        title="언어 선택"
        icon={<SettingsIcon className="text-white ml-auto cursor-pointer" />}
      >
        <LanguageSelectorPopover />
      </TopbarPopover>
    </Box>
  );
}
