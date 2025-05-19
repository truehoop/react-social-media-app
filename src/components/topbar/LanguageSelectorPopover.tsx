import { Box } from '@mui/system';
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageSelectorPopover() {
  const { i18n } = useTranslation();
  const selectedLanguage = i18n.language;

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={0.5}
    >
      <button
        className={`cursor-pointer hover:bg-[#3333331c] p-2 rounded-lg ${selectedLanguage === 'ko' ? 'bg-[#0000000D]' : ''}`}
        onClick={() => i18n.changeLanguage('ko')}
      >
        한국어
      </button>
      <button
        className={`cursor-pointer hover:bg-[#3333331c] p-2 rounded-lg ${selectedLanguage === 'en' ? 'bg-[#0000000D]' : ''}`}
        onClick={() => i18n.changeLanguage('en')}
      >
        English
      </button>
    </Box>
  );
}
