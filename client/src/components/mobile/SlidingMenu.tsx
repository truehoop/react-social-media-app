import { Box } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from '@base/store';
import Sidebar from '@components/Sidebar';
import { selectIsMobileNavbarActive } from '@helpers/selectors/appSelector';

export default function SlidingMenu() {
  const { t } = useTranslation();
  const isMobileNavbarActive = useAppSelector(selectIsMobileNavbarActive);

  if (isMobileNavbarActive) {
    return (
      <Box
        id="drawer-navigation"
        className={`shadow-card top-[56] left-[250px] z-40 w-64 h-screen transition-transform -translate-x-full bg-white overflow-y-auto absolute`}
        tab-index="-1"
        aria-labelledby="drawer-navigation-label"
        position="fixed"
      >
        <Sidebar />
      </Box>
    );
  } else {
    return null;
  }
}
