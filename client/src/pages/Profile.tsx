import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';
import { Box, Chip } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import BottomNavigation from '@components/BottomNavigation';
import ExchangeHistoryCard from '@components/ExchangeHistoryCard';
import { useUser } from '@contexts/UserContext';
import { getAddressFromCoordinates, RegionInfo } from '@helpers/api/kakao';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

export default function Profile() {
  const [tabValue, setTabValue] = useState(0);
  const [locations, setLocations] = useState<RegionInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  // Initialize locations from user.regionInfo when component mounts
  useEffect(() => {
    if (user?.regionInfo) {
      setLocations(user.regionInfo);
    }
  }, [user]);

  const mockBooks = [
    {
      title: '당신의 인생을 바꾸는 작은 습관',
      author: '제임스 클리어',
      date: '2024.02.01',
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    },
    {
      title: '미래를 만드는 기술',
      author: '케빈 켈리',
      date: '2024.01.28',
      image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    },
    {
      title: '생각을 바꾸는 심리학',
      author: '김철수',
      date: '2024.01.15',
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    },
    {
      title: '세상을 바꾸는 디자인',
      author: '이영희',
      date: '2024.01.10',
      image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    },
  ];

  const getCurrentLocation = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
      } else {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      }
    });
  };

  const addCurrentLocation = async () => {
    if (locations.length >= 2) {
      alert('활동지역은 최대 2개까지만 지정할 수 있습니다.');
      return;
    }
    setIsLoading(true);
    try {
      const position = await getCurrentLocation();
      const location = await getAddressFromCoordinates(position.coords.latitude, position.coords.longitude);
      if (
        location &&
        !locations.some((loc) => loc.region1 === location.region1 && loc.region2 === location.region2 && loc.region3 === location.region3)
      ) {
        const updatedLocations = [...locations, location];
        setLocations(updatedLocations);

        // Update user context and localStorage
        if (user) {
          const updatedUser = {
            ...user,
            regionInfo: updatedLocations,
          };
          setUser(updatedUser);
        }
      }
    } catch (error) {
      alert('위치 정보를 가져오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const removeLocation = (index: number) => {
    const updatedLocations = locations.filter((_, i) => i !== index);
    setLocations(updatedLocations);

    // Update user context and localStorage
    if (user) {
      const updatedUser = {
        ...user,
        regionInfo: updatedLocations,
      };
      setUser(updatedUser);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <Box className="min-h-screen bg-white pb-16">
      {/* Profile Info */}
      <Box className="bg-yellow-100 p-6">
        <Box className="flex items-center gap-4">
          <img
            src={user.profileImage}
            alt={user.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <Box>
            <h2 className="text-xl font-medium">{user.name}</h2>
            <Box className="flex items-center">
              <StarIcon className="text-yellow-400" />
              <span className="ml-1">4.8</span>
            </Box>
          </Box>
        </Box>
        <button
          onClick={handleLogout}
          className="mt-4 px-4 py-2 bg-gray-200 rounded text-gray-700 hover:bg-gray-300"
        >
          로그아웃
        </button>

        {/* Location Section */}
        <Box className="mt-4">
          <Box className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium flex items-center">
              <LocationOnIcon
                className="text-gray-600 mr-1"
                style={{ fontSize: '1.2rem' }}
              />
              활동지역
            </h3>
            <button
              onClick={addCurrentLocation}
              disabled={isLoading || locations.length >= 2}
              className="text-sm text-green-800 hover:text-green-900 disabled:text-gray-400"
            >
              {isLoading ? '위치 확인 중...' : '+ 현재 위치 추가'}
            </button>
          </Box>
          <Box className="flex flex-wrap gap-2">
            {locations.map((location, index) => (
              <Chip
                key={index}
                label={`${location.region1} ${location.region2} ${location.region3}`}
                onDelete={() => removeLocation(index)}
                className="bg-white"
              />
            ))}
            {locations.length === 0 && <p className="text-sm text-gray-500">활동지역을 추가해주세요</p>}
          </Box>
        </Box>
      </Box>

      {/* Tabs */}
      <Box className="border-b">
        <Box className="flex">
          <button
            className={`flex-1 py-3 text-center ${
              tabValue === 0 ? 'border-b-2 border-green-800 text-green-800 font-medium' : 'text-gray-500'
            }`}
            onClick={() => setTabValue(0)}
          >
            보유도서
          </button>
          <button
            className={`flex-1 py-3 text-center ${
              tabValue === 1 ? 'border-b-2 border-green-800 text-green-800 font-medium' : 'text-gray-500'
            }`}
            onClick={() => setTabValue(1)}
          >
            교환내역
          </button>
          <button
            className={`flex-1 py-3 text-center ${
              tabValue === 2 ? 'border-b-2 border-green-800 text-green-800 font-medium' : 'text-gray-500'
            }`}
            onClick={() => setTabValue(2)}
          >
            받은후기
          </button>
        </Box>
      </Box>

      {/* Tab Panels */}
      <TabPanel
        value={tabValue}
        index={0}
      >
        <Box className="grid grid-cols-2 gap-4 p-4">
          {mockBooks.map((book, index) => (
            <Box
              key={index}
              className="bg-white rounded-lg overflow-hidden"
            >
              <img
                src={book.image}
                alt={book.title}
                className="w-full h-40 object-cover"
              />
              <Box className="p-3">
                <h3 className="font-medium text-sm line-clamp-2">{book.title}</h3>
                <p className="text-gray-500 text-sm mt-1">{book.author}</p>
                <p className="text-gray-400 text-xs mt-1">{book.date}</p>
              </Box>
            </Box>
          ))}
        </Box>
      </TabPanel>
      <TabPanel
        value={tabValue}
        index={1}
      >
        <Box className="p-4">
          <ExchangeHistoryCard
            givenBookTitle="미래를 만드는 기술"
            givenBookImage="https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
            receivedBookTitle="당신의 인생을 바꾸는 작은 습관"
            receivedBookImage="https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
            partnerName="책친구"
            partnerProfileImage="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
            exchangedAt="2024.01.28"
            myProfileImage={user.profileImage}
          />
          <ExchangeHistoryCard
            givenBookTitle="생각을 바꾸는 심리학"
            givenBookImage="https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
            receivedBookTitle="세상을 바꾸는 디자인"
            receivedBookImage="https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
            partnerName="독서왕"
            partnerProfileImage="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
            exchangedAt="2024.01.15"
            myProfileImage={user.profileImage}
          />
        </Box>
      </TabPanel>
      <TabPanel
        value={tabValue}
        index={2}
      >
        <Box className="p-4">
          <p className="text-center text-gray-500">받은 후기가 없습니다.</p>
        </Box>
      </TabPanel>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </Box>
  );
}
