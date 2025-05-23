import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { Box } from '@mui/material';
import React from 'react';

interface ExchangeHistoryCardProps {
  givenBookTitle: string;
  givenBookImage: string;
  receivedBookTitle: string;
  receivedBookImage: string;
  partnerName: string;
  partnerProfileImage: string;
  exchangedAt: string;
  myProfileImage: string;
}

export default function ExchangeHistoryCard({
  givenBookTitle,
  givenBookImage,
  receivedBookTitle,
  receivedBookImage,
  partnerName,
  partnerProfileImage,
  exchangedAt,
  myProfileImage,
}: ExchangeHistoryCardProps) {
  return (
    <Box className="bg-white rounded-lg overflow-hidden p-3 shadow mb-2">
      <Box className="flex items-center justify-between">
        {/* 내가 준 책 */}
        <Box className="flex flex-col items-center w-2/5">
          <img
            src={givenBookImage}
            alt={givenBookTitle}
            className="w-20 h-24 object-cover rounded"
          />
          <div className="text-sm mt-2 text-center line-clamp-2">{givenBookTitle}</div>
          <div className="flex items-center mt-2">
            <img
              src={myProfileImage}
              alt="내 프로필"
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="ml-1 text-xs text-gray-500">내 책</span>
          </div>
        </Box>
        {/* 중앙: 스왑 아이콘과 교환일시 */}
        <Box className="flex flex-col items-center justify-center px-2">
          <SwapHorizIcon
            className="text-gray-400"
            fontSize="large"
          />
          <span className="text-xs text-gray-400 mt-1">{exchangedAt}</span>
        </Box>
        {/* 내가 받은 책 */}
        <Box className="flex flex-col items-center w-2/5">
          <img
            src={receivedBookImage}
            alt={receivedBookTitle}
            className="w-20 h-24 object-cover rounded"
          />
          <div className="text-sm mt-2 text-center line-clamp-2">{receivedBookTitle}</div>
          <div className="flex items-center mt-2">
            <img
              src={partnerProfileImage}
              alt={partnerName}
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="ml-1 text-xs text-gray-500">{partnerName}</span>
          </div>
        </Box>
      </Box>
    </Box>
  );
}
