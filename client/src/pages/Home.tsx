import { Box } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import BookCard from '@components/BookCard';
import BottomNavigation from '@components/BottomNavigation';
import CategoryFilter from '@components/CategoryFilter';
import Header from '@components/Header';
import SortFilter from '@components/SortFilter';
import { RegionInfo } from '@helpers/api/kakao';

const referenceLocation = { lat: 37.5006, lng: 127.0364 }; // 강남구 역삼동 기준 좌표

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

// 서울시 내 임의의 좌표 생성 함수
function getRandomSeoulLocation() {
  const lat = 37.5 + Math.random() * 0.1; // 37.5 ~ 37.6
  const lng = 126.9 + Math.random() * 0.2; // 126.9 ~ 127.1
  return { lat: parseFloat(lat.toFixed(6)), lng: parseFloat(lng.toFixed(6)) };
}

// Define the type for mockData to allow regionInfo to be optional initially
interface BookData {
  title: string;
  image: string;
  genres: string[];
  condition: string;
  status: string;
  registeredDate: string;
  geolocation: { lat: number; lng: number };
  regionInfo: RegionInfo[];
}

const staticRegionInfoPairs: [string, string][] = [
  ['아현동', '공덕동'],
  ['도화동', '용강동'],
  ['대흥동', '염리동'],
  ['신수동', '서강동'],
  ['서교동', '합정동'],
  ['망원동', '연남동'],
  ['성산동', '상암동'],
  ['공덕동', '아현동'],
  ['용강동', '도화동'],
  ['염리동', '대흥동'],
  ['서강동', '신수동'],
  ['합정동', '서교동'],
  ['연남동', '망원동'],
  ['상암동', '성산동'],
];

const mockData: BookData[] = [
  {
    title: '아주 평범한 행복',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    genres: ['소설', '로맨스'],
    condition: '최상',
    status: '교환가능',
    registeredDate: '2024-05-01',
    geolocation: getRandomSeoulLocation(),
    regionInfo: staticRegionInfoPairs[0 % staticRegionInfoPairs.length].map((dong) => ({
      regionType: 'B',
      code: '114401',
      addressName: `서울특별시 마포구 ${dong}`,
      region1: '서울특별시',
      region2: '마포구',
      region3: dong,
    })),
  },
  {
    title: '미래를 만드는 기술',
    image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    genres: ['자기계발', '인문학'],
    condition: '상',
    status: '교환예약',
    registeredDate: '2024-04-28',
    geolocation: getRandomSeoulLocation(),
    regionInfo: staticRegionInfoPairs[1 % staticRegionInfoPairs.length].map((dong) => ({
      regionType: 'B',
      code: '114401',
      addressName: `서울특별시 마포구 ${dong}`,
      region1: '서울특별시',
      region2: '마포구',
      region3: dong,
    })),
  },
  {
    title: '세상의 모든 아침',
    image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    genres: ['소설', '현대문학'],
    condition: '중',
    status: '교환완료',
    registeredDate: '2024-04-25',
    geolocation: getRandomSeoulLocation(),
    regionInfo: staticRegionInfoPairs[2 % staticRegionInfoPairs.length].map((dong) => ({
      regionType: 'B',
      code: '114401',
      addressName: `서울특별시 마포구 ${dong}`,
      region1: '서울특별시',
      region2: '마포구',
      region3: dong,
    })),
  },
  {
    title: '인생의 방향을 바꾸는 선택',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    genres: ['자기계발', '인문학'],
    condition: '하',
    status: '교환가능',
    registeredDate: '2024-04-20',
    geolocation: getRandomSeoulLocation(),
    regionInfo: staticRegionInfoPairs[3 % staticRegionInfoPairs.length].map((dong) => ({
      regionType: 'B',
      code: '114401',
      addressName: `서울특별시 마포구 ${dong}`,
      region1: '서울특별시',
      region2: '마포구',
      region3: dong,
    })),
  },
  {
    title: '데미안',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    genres: ['고전문학', '소설'],
    condition: '최상',
    status: '교환예약',
    registeredDate: '2024-04-18',
    geolocation: getRandomSeoulLocation(),
    regionInfo: staticRegionInfoPairs[4 % staticRegionInfoPairs.length].map((dong) => ({
      regionType: 'B',
      code: '114401',
      addressName: `서울특별시 마포구 ${dong}`,
      region1: '서울특별시',
      region2: '마포구',
      region3: dong,
    })),
  },
  {
    title: '1984',
    image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    genres: ['SF', '고전문학'],
    condition: '상',
    status: '교환가능',
    registeredDate: '2024-04-15',
    geolocation: getRandomSeoulLocation(),
    regionInfo: staticRegionInfoPairs[5 % staticRegionInfoPairs.length].map((dong) => ({
      regionType: 'B',
      code: '114401',
      addressName: `서울특별시 마포구 ${dong}`,
      region1: '서울특별시',
      region2: '마포구',
      region3: dong,
    })),
  },
  {
    title: '해리포터와 마법사의 돌',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    genres: ['판타지', '소설'],
    condition: '중',
    status: '교환완료',
    registeredDate: '2024-04-12',
    geolocation: getRandomSeoulLocation(),
    regionInfo: staticRegionInfoPairs[6 % staticRegionInfoPairs.length].map((dong) => ({
      regionType: 'B',
      code: '114401',
      addressName: `서울특별시 마포구 ${dong}`,
      region1: '서울특별시',
      region2: '마포구',
      region3: dong,
    })),
  },
  {
    title: '어린 왕자',
    image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    genres: ['고전문학', '동화'],
    condition: '하',
    status: '교환가능',
    registeredDate: '2024-04-10',
    geolocation: getRandomSeoulLocation(),
    regionInfo: staticRegionInfoPairs[7 % staticRegionInfoPairs.length].map((dong) => ({
      regionType: 'B',
      code: '114401',
      addressName: `서울특별시 마포구 ${dong}`,
      region1: '서울특별시',
      region2: '마포구',
      region3: dong,
    })),
  },
  {
    title: '노인과 바다',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    genres: ['고전문학', '소설'],
    condition: '최상',
    status: '교환예약',
    registeredDate: '2024-04-08',
    geolocation: getRandomSeoulLocation(),
    regionInfo: staticRegionInfoPairs[8 % staticRegionInfoPairs.length].map((dong) => ({
      regionType: 'B',
      code: '114401',
      addressName: `서울특별시 마포구 ${dong}`,
      region1: '서울특별시',
      region2: '마포구',
      region3: dong,
    })),
  },
  {
    title: '작은 아씨들',
    image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    genres: ['고전문학', '소설'],
    condition: '상',
    status: '교환가능',
    registeredDate: '2024-04-05',
    geolocation: getRandomSeoulLocation(),
    regionInfo: staticRegionInfoPairs[9 % staticRegionInfoPairs.length].map((dong) => ({
      regionType: 'B',
      code: '114401',
      addressName: `서울특별시 마포구 ${dong}`,
      region1: '서울특별시',
      region2: '마포구',
      region3: dong,
    })),
  },
  {
    title: '위대한 개츠비',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    genres: ['고전문학', '소설'],
    condition: '중',
    status: '교환완료',
    registeredDate: '2024-04-03',
    geolocation: getRandomSeoulLocation(),
    regionInfo: staticRegionInfoPairs[10 % staticRegionInfoPairs.length].map((dong) => ({
      regionType: 'B',
      code: '114401',
      addressName: `서울특별시 마포구 ${dong}`,
      region1: '서울특별시',
      region2: '마포구',
      region3: dong,
    })),
  },
  {
    title: '오만과 편견',
    image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    genres: ['고전문학', '로맨스'],
    condition: '하',
    status: '교환가능',
    registeredDate: '2024-04-01',
    geolocation: getRandomSeoulLocation(),
    regionInfo: staticRegionInfoPairs[11 % staticRegionInfoPairs.length].map((dong) => ({
      regionType: 'B',
      code: '114401',
      addressName: `서울특별시 마포구 ${dong}`,
      region1: '서울특별시',
      region2: '마포구',
      region3: dong,
    })),
  },
  {
    title: '호밀밭의 파수꾼',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    genres: ['고전문학', '소설'],
    condition: '최상',
    status: '교환예약',
    registeredDate: '2024-03-28',
    geolocation: getRandomSeoulLocation(),
    regionInfo: staticRegionInfoPairs[12 % staticRegionInfoPairs.length].map((dong) => ({
      regionType: 'B',
      code: '114401',
      addressName: `서울특별시 마포구 ${dong}`,
      region1: '서울특별시',
      region2: '마포구',
      region3: dong,
    })),
  },
  {
    title: '죄와 벌',
    image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    genres: ['고전문학', '소설'],
    condition: '상',
    status: '교환가능',
    registeredDate: '2024-03-25',
    geolocation: getRandomSeoulLocation(),
    regionInfo: staticRegionInfoPairs[13 % staticRegionInfoPairs.length].map((dong) => ({
      regionType: 'B',
      code: '114401',
      addressName: `서울특별시 마포구 ${dong}`,
      region1: '서울특별시',
      region2: '마포구',
      region3: dong,
    })),
  },
  {
    title: '안네의 일기',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    genres: ['자서전', '역사'],
    condition: '중',
    status: '교환완료',
    registeredDate: '2024-03-22',
    geolocation: getRandomSeoulLocation(),
    regionInfo: staticRegionInfoPairs[14 % staticRegionInfoPairs.length].map((dong) => ({
      regionType: 'B',
      code: '114401',
      addressName: `서울특별시 마포구 ${dong}`,
      region1: '서울특별시',
      region2: '마포구',
      region3: dong,
    })),
  },
  {
    title: '동물농장',
    image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    genres: ['고전문학', '알레고리'],
    condition: '하',
    status: '교환가능',
    registeredDate: '2024-03-20',
    geolocation: getRandomSeoulLocation(),
    regionInfo: staticRegionInfoPairs[15 % staticRegionInfoPairs.length].map((dong) => ({
      regionType: 'B',
      code: '114401',
      addressName: `서울특별시 마포구 ${dong}`,
      region1: '서울특별시',
      region2: '마포구',
      region3: dong,
    })),
  },
  {
    title: '백년의 고독',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    genres: ['현대문학', '마술적 사실주의'],
    condition: '최상',
    status: '교환예약',
    registeredDate: '2024-03-18',
    geolocation: getRandomSeoulLocation(),
    regionInfo: staticRegionInfoPairs[16 % staticRegionInfoPairs.length].map((dong) => ({
      regionType: 'B',
      code: '114401',
      addressName: `서울특별시 마포구 ${dong}`,
      region1: '서울특별시',
      region2: '마포구',
      region3: dong,
    })),
  },
  {
    title: '파우스트',
    image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    genres: ['고전문학', '희곡'],
    condition: '상',
    status: '교환가능',
    registeredDate: '2024-03-15',
    geolocation: getRandomSeoulLocation(),
    regionInfo: staticRegionInfoPairs[17 % staticRegionInfoPairs.length].map((dong) => ({
      regionType: 'B',
      code: '114401',
      addressName: `서울특별시 마포구 ${dong}`,
      region1: '서울특별시',
      region2: '마포구',
      region3: dong,
    })),
  },
  {
    title: '변신',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    genres: ['현대문학', '소설'],
    condition: '중',
    status: '교환완료',
    registeredDate: '2024-03-12',
    geolocation: getRandomSeoulLocation(),
    regionInfo: staticRegionInfoPairs[18 % staticRegionInfoPairs.length].map((dong) => ({
      regionType: 'B',
      code: '114401',
      addressName: `서울특별시 마포구 ${dong}`,
      region1: '서울특별시',
      region2: '마포구',
      region3: dong,
    })),
  },
  {
    title: '이방인',
    image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    genres: ['현대문학', '실존주의'],
    condition: '하',
    status: '교환가능',
    registeredDate: '2024-03-10',
    geolocation: getRandomSeoulLocation(),
    regionInfo: staticRegionInfoPairs[19 % staticRegionInfoPairs.length].map((dong) => ({
      regionType: 'B',
      code: '114401',
      addressName: `서울특별시 마포구 ${dong}`,
      region1: '서울특별시',
      region2: '마포구',
      region3: dong,
    })),
  },
  {
    title: '파리의 아파트',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    genres: ['현대문학', '소설'],
    condition: '최상',
    status: '교환예약',
    registeredDate: '2024-03-08',
    geolocation: getRandomSeoulLocation(),
    regionInfo: staticRegionInfoPairs[20 % staticRegionInfoPairs.length].map((dong) => ({
      regionType: 'B',
      code: '114401',
      addressName: `서울특별시 마포구 ${dong}`,
      region1: '서울특별시',
      region2: '마포구',
      region3: dong,
    })),
  },
  {
    title: '노르웨이의 숲',
    image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    genres: ['현대문학', '소설'],
    condition: '상',
    status: '교환가능',
    registeredDate: '2024-03-05',
    geolocation: getRandomSeoulLocation(),
    regionInfo: staticRegionInfoPairs[21 % staticRegionInfoPairs.length].map((dong) => ({
      regionType: 'B',
      code: '114401',
      addressName: `서울특별시 마포구 ${dong}`,
      region1: '서울특별시',
      region2: '마포구',
      region3: dong,
    })),
  },
  {
    title: '무라카미 하루키의 여행',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    genres: ['에세이', '여행'],
    condition: '중',
    status: '교환완료',
    registeredDate: '2024-03-03',
    geolocation: getRandomSeoulLocation(),
    regionInfo: staticRegionInfoPairs[22 % staticRegionInfoPairs.length].map((dong) => ({
      regionType: 'B',
      code: '114401',
      addressName: `서울특별시 마포구 ${dong}`,
      region1: '서울특별시',
      region2: '마포구',
      region3: dong,
    })),
  },
  {
    title: '1Q84',
    image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    genres: ['현대문학', '소설'],
    condition: '하',
    status: '교환가능',
    registeredDate: '2024-03-01',
    geolocation: getRandomSeoulLocation(),
    regionInfo: staticRegionInfoPairs[23 % staticRegionInfoPairs.length].map((dong) => ({
      regionType: 'B',
      code: '114401',
      addressName: `서울특별시 마포구 ${dong}`,
      region1: '서울특별시',
      region2: '마포구',
      region3: dong,
    })),
  },
  {
    title: '해변의 카프카',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    genres: ['현대문학', '소설'],
    condition: '최상',
    status: '교환예약',
    registeredDate: '2024-02-28',
    geolocation: getRandomSeoulLocation(),
    regionInfo: staticRegionInfoPairs[24 % staticRegionInfoPairs.length].map((dong) => ({
      regionType: 'B',
      code: '114401',
      addressName: `서울특별시 마포구 ${dong}`,
      region1: '서울특별시',
      region2: '마포구',
      region3: dong,
    })),
  },
  {
    title: '색채가 없는 다자키 쓰쿠루',
    image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    genres: ['현대문학', '소설'],
    condition: '상',
    status: '교환가능',
    registeredDate: '2024-02-25',
    geolocation: getRandomSeoulLocation(),
    regionInfo: staticRegionInfoPairs[25 % staticRegionInfoPairs.length].map((dong) => ({
      regionType: 'B',
      code: '114401',
      addressName: `서울특별시 마포구 ${dong}`,
      region1: '서울특별시 마포구',
      region2: '마포구',
      region3: dong,
    })),
  },
  {
    title: '스푸트니크의 연인',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    genres: ['현대문학', '소설'],
    condition: '중',
    status: '교환완료',
    registeredDate: '2024-02-22',
    geolocation: getRandomSeoulLocation(),
    regionInfo: staticRegionInfoPairs[26 % staticRegionInfoPairs.length].map((dong) => ({
      regionType: 'B',
      code: '114401',
      addressName: `서울특별시 마포구 ${dong}`,
      region1: '서울특별시',
      region2: '마포구',
      region3: dong,
    })),
  },
  {
    title: '상실의 시대',
    image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    genres: ['현대문학', '소설'],
    condition: '하',
    status: '교환가능',
    registeredDate: '2024-02-20',
    geolocation: getRandomSeoulLocation(),
    regionInfo: staticRegionInfoPairs[27 % staticRegionInfoPairs.length].map((dong) => ({
      regionType: 'B',
      code: '114401',
      addressName: `서울특별시 마포구 ${dong}`,
      region1: '서울특별시',
      region2: '마포구',
      region3: dong,
    })),
  },
  {
    title: '댄싱 댄싱 댄싱',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    genres: ['현대문학', '소설'],
    condition: '최상',
    status: '교환예약',
    registeredDate: '2024-02-18',
    geolocation: getRandomSeoulLocation(),
    regionInfo: staticRegionInfoPairs[28 % staticRegionInfoPairs.length].map((dong) => ({
      regionType: 'B',
      code: '114401',
      addressName: `서울특별시 마포구 ${dong}`,
      region1: '서울특별시',
      region2: '마포구',
      region3: dong,
    })),
  },
  {
    title: '세계의 끝과 하드보일드 원더랜드',
    image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    genres: ['현대문학', '소설'],
    condition: '상',
    status: '교환가능',
    registeredDate: '2024-02-15',
    geolocation: getRandomSeoulLocation(),
    regionInfo: staticRegionInfoPairs[29 % staticRegionInfoPairs.length].map((dong) => ({
      regionType: 'B',
      code: '114401',
      addressName: `서울특별시 마포구 ${dong}`,
      region1: '서울특별시',
      region2: '마포구',
      region3: dong,
    })),
  },
  {
    title: '카프카 해변에서',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    genres: ['현대문학', '소설'],
    condition: '중',
    status: '교환완료',
    registeredDate: '2024-02-12',
    geolocation: getRandomSeoulLocation(),
    regionInfo: staticRegionInfoPairs[30 % staticRegionInfoPairs.length].map((dong) => ({
      regionType: 'B',
      code: '114401',
      addressName: `서울특별시 마포구 ${dong}`,
      region1: '서울특별시',
      region2: '마포구',
      region3: dong,
    })),
  },
  {
    title: '슬픈 외국어',
    image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    genres: ['에세이', '인문학'],
    condition: '하',
    status: '교환가능',
    registeredDate: '2024-02-10',
    geolocation: getRandomSeoulLocation(),
    regionInfo: staticRegionInfoPairs[31 % staticRegionInfoPairs.length].map((dong) => ({
      regionType: 'B',
      code: '114401',
      addressName: `서울특별시 마포구 ${dong}`,
      region1: '서울특별시',
      region2: '마포구',
      region3: dong,
    })),
  },
  {
    title: '직업으로서의 소설가',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    genres: ['에세이', '인문학'],
    condition: '최상',
    status: '교환예약',
    registeredDate: '2024-02-08',
    geolocation: getRandomSeoulLocation(),
    regionInfo: staticRegionInfoPairs[32 % staticRegionInfoPairs.length].map((dong) => ({
      regionType: 'B',
      code: '114401',
      addressName: `서울특별시 마포구 ${dong}`,
      region1: '서울특별시',
      region2: '마포구',
      region3: dong,
    })),
  },
  {
    title: '무라카미 하루키의 음악 이야기',
    image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    genres: ['에세이', '음악'],
    condition: '상',
    status: '교환가능',
    registeredDate: '2024-02-05',
    geolocation: getRandomSeoulLocation(),
    regionInfo: staticRegionInfoPairs[33 % staticRegionInfoPairs.length].map((dong) => ({
      regionType: 'B',
      code: '114401',
      addressName: `서울특별시 마포구 ${dong}`,
      region1: '서울특별시',
      region2: '마포구',
      region3: dong,
    })),
  },
  {
    title: '무라카미 하루키의 러닝 에세이',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    genres: ['에세이', '스포츠'],
    condition: '중',
    status: '교환완료',
    registeredDate: '2024-02-03',
    geolocation: getRandomSeoulLocation(),
    regionInfo: staticRegionInfoPairs[34 % staticRegionInfoPairs.length].map((dong) => ({
      regionType: 'B',
      code: '114401',
      addressName: `서울특별시 마포구 ${dong}`,
      region1: '서울특별시',
      region2: '마포구',
      region3: dong,
    })),
  },
];

export default function Home() {
  const [sortBy, setSortBy] = useState<'distance' | 'date'>('distance');
  const [selectedGenres, setSelectedGenres] = useState(['전체']);
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // localStorage에서 사용자 정보와 토큰 확인
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (!storedUser || !storedToken) {
      // 사용자 정보나 토큰이 없으면 로그인 페이지로 리다이렉트
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const filteredData = mockData.filter((book) => {
    if (selectedGenres.includes('전체')) return true;
    return selectedGenres.some((genre) => book.genres.includes(genre));
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortBy === 'distance') {
      const distanceA = getDistanceFromLatLonInKm(referenceLocation.lat, referenceLocation.lng, a.geolocation.lat, a.geolocation.lng);
      const distanceB = getDistanceFromLatLonInKm(referenceLocation.lat, referenceLocation.lng, b.geolocation.lat, b.geolocation.lng);
      return distanceA - distanceB;
    } else {
      return new Date(b.registeredDate).getTime() - new Date(a.registeredDate).getTime();
    }
  });

  // 새 도서가 등록된 경우, 리스트 맨 앞에 추가
  const newBook = location.state?.newBook;
  const displayData = newBook
    ? [
        {
          ...newBook,
          regionInfo: newBook.regionInfo ? [newBook.regionInfo] : [], // 단일 RegionInfo를 배열로 변환
          geolocation: newBook.geolocation || getRandomSeoulLocation(), // 위치 정보가 없으면 랜덤 위치 생성
        },
        ...sortedData,
      ]
    : sortedData;

  return (
    <Box className="pb-16">
      <Header />
      <CategoryFilter
        selectedGenres={selectedGenres}
        onGenreChange={setSelectedGenres}
      />
      <SortFilter
        onSortChange={setSortBy}
        value={sortBy}
      />

      <Box className="grid grid-cols-2 gap-4 p-4">
        {displayData.length === 0 ? (
          <Box className="col-span-2 text-center text-gray-400 py-8">{t('home.noBooks')}</Box>
        ) : (
          displayData.map((book, index) => (
            <BookCard
              key={index}
              {...book}
              id={String(index + 1)}
              regionInfo={book.regionInfo?.[0]} // 첫 번째 지역 정보 사용
            />
          ))
        )}
      </Box>

      <BottomNavigation />
    </Box>
  );
}

export { mockData };
