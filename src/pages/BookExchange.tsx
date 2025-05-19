import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ShareIcon from '@mui/icons-material/Share';
import StarIcon from '@mui/icons-material/Star';
import { Box, IconButton } from '@mui/material';
import React from 'react';
import { useNavigate, Link, useLocation, useParams } from 'react-router-dom';

import { mockData } from './Home';

// mockData 구조에 맞는 타입
interface BookDetailProps {
  title: string;
  image: string;
  genres: string[];
  condition: string;
  status: string;
  registeredDate: string;
  distance?: string;
  id?: string;
}

export default function BookExchange() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  // state로 book 정보가 넘어오면 사용, 아니면 id로 mockData에서 찾아서 사용
  let book: BookDetailProps | undefined = location.state?.book;
  if (!book && params.id) {
    book = mockData[Number(params.id) - 1];
  }
  if (!book) {
    return <Box className="p-8">도서 정보를 찾을 수 없습니다.</Box>;
  }

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Box className="min-h-screen bg-white">
      {/* Header */}
      <Box className="flex justify-between items-center p-4 fixed top-0 left-0 right-0 bg-white z-10">
        <IconButton onClick={handleBack}>
          <ArrowBackIosNewIcon />
        </IconButton>
        <span className="text-lg font-medium">도서 상세</span>
        <IconButton>
          <ShareIcon />
        </IconButton>
      </Box>

      <Box className="pt-16 pb-20">
        {/* Main Image */}
        <img
          src={book.image}
          alt={book.title}
          className="w-full h-64 object-cover"
        />

        {/* Book Info */}
        <Box className="p-4">
          <h1 className="text-xl font-medium mb-1">{book.title}</h1>
          <Box className="text-gray-600 text-sm mb-2">{book.genres.join(', ')}</Box>
          <Box className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm inline-block mb-2">{book.status}</Box>
          <Box className="text-gray-500 text-sm">{book.registeredDate}</Box>
        </Box>

        {/* User Profile (임시) */}
        <Link
          to={`/profile/1`}
          className="no-underline text-inherit"
        >
          <Box className="p-4 flex items-center">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
              alt="책사랑독서인"
              className="w-12 h-12 rounded-full object-cover"
            />
            <Box className="ml-3 flex-1">
              <Box className="flex items-center gap-2">
                <span className="font-medium">책사랑독서인</span>
                <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs">인증된 회원</span>
              </Box>
              <Box className="flex items-center text-sm text-gray-600">
                <StarIcon
                  className="text-yellow-400"
                  fontSize="small"
                />
                <span className="mr-2">4.8</span>
                <LocationOnIcon fontSize="small" />
                <span>{book.distance ?? '1.2km'}</span>
              </Box>
            </Box>
          </Box>
        </Link>

        {/* Book Status (이미지 대체) */}
        <Box className="p-4">
          <h2 className="font-medium mb-3">도서 상태</h2>
          <Box className="grid grid-cols-2 gap-2">
            <img
              src={book.image}
              alt={book.title}
              className="w-full h-40 object-cover rounded-lg"
            />
            <img
              src={book.image}
              alt={book.title}
              className="w-full h-40 object-cover rounded-lg"
            />
          </Box>
        </Box>

        {/* Exchange Preferences (임시) */}
        <Box className="p-4">
          <h2 className="font-medium mb-3">교환 희망 도서</h2>
          <Box className="flex flex-wrap gap-2">
            <span className="bg-yellow-50 text-yellow-800 px-3 py-1 rounded-full text-sm">예시 태그</span>
          </Box>
        </Box>

        {/* Description (임시) */}
        <Box className="p-4">
          <h2 className="font-medium mb-3">상세 설명</h2>
          <Box className="text-gray-600 text-sm">상세 설명 예시입니다.</Box>
        </Box>
      </Box>

      {/* Bottom Button */}
      <Box className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <button className="w-full bg-green-700 text-white py-3 rounded-lg font-medium">교환 신청하기</button>
      </Box>
    </Box>
  );
}
