import { Box } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function HomePageRightBar() {
  const { t } = useTranslation();

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={3}
      className="h-fit sticky top-[80px]"
    >
      <Box display="flex">
        <Box
          display="flex"
          className="w-12 h-12 flex-none"
          mr={2}
        >
          <img
            loading="lazy"
            className="flex-none w-full "
            width="100%"
            height="100%"
            aria-label={t('a11y.birthDayPresentBox')}
            src="/assets/gift.png"
            alt={t('a11y.birthDayPresentBox')}
          />
        </Box>

        <p className="flex-1 font-light text-base text-sm">
          <b>Anthony Davis</b> {t('components.rightbar.and')} <b>3 {t('components.rightbar.others')}</b>
          {` ${t('components.rightbar.birthdayMessage')}`}
        </p>
      </Box>

      <img
        loading="lazy"
        className="w-full rounded-xl"
        src="/assets/ad.webp"
        width="100%"
        height="100%"
        aria-label={t('a11y.advertisement')}
        alt={t('a11y.advertisement')}
      />
    </Box>
  );
}
