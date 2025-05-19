import { Box, Button, Container, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useUser } from '@contexts/UserContext';
import { addUser } from '@helpers/api/users';
import { User, createUserFromGoogle } from '@helpers/types/user';
import { loadKakaoSDK } from '@utils/kakaoSDK';

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: { client_id: string; callback: (response: any) => void }) => void;
          renderButton: (element: HTMLElement, options: any) => void;
        };
      };
    };
  }
}

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [isGoogleSDKLoaded, setIsGoogleSDKLoaded] = useState(false);

  useEffect(() => {
    // Load Kakao SDK
    loadKakaoSDK().catch(console.error);

    // Load Google SDK
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setIsGoogleSDKLoaded(true);
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (isGoogleSDKLoaded && window.google?.accounts?.id) {
      window.google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID || '',
        callback: handleGoogleLogin,
      });

      const googleButton = document.getElementById('googleLoginButton');
      if (googleButton) {
        window.google.accounts.id.renderButton(googleButton, {
          theme: 'outline',
          size: 'large',
          width: 250,
        });
      }
    }
  }, [isGoogleSDKLoaded]);

  const handleKakaoLogin = () => {
    if (!window.Kakao?.Auth) {
      console.error('Kakao SDK not initialized');
      return;
    }

    window.Kakao.Auth.login({
      throughTalk: false,
      success: (authObj) => {
        window.Kakao.API.request({
          url: '/v2/user/me',
          success: (res) => {
            const kakaoAccount = res.kakao_account;
            const user: User = {
              id: res.id.toString(),
              name: kakaoAccount.profile.nickname,
              profileImage: kakaoAccount.profile.profile_image_url,
              provider: 'kakao',
              rating: 0,
              regionInfo: [],
            };

            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', authObj.access_token);
            setUser(user);
            navigate('/');
          },
          fail: (err) => {
            console.error('Failed to get user info:', err);
          },
        });
      },
      fail: (err) => {
        console.error('Failed to login:', err);
      },
    });
  };

  const handleGoogleLogin = async (response: any) => {
    try {
      const credential = response.credential;
      const decodedToken = JSON.parse(atob(credential.split('.')[1]));

      // 구글 데이터로 User 객체 생성
      const user = createUserFromGoogle({
        ...decodedToken,
        name: decodeURIComponent(escape(decodedToken.name)), // 한글 디코딩
      });

      // users.ts에 사용자 추가
      addUser(user);

      // Store user info and token
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', credential);
      setUser(user);

      // Navigate to home page
      navigate('/');
    } catch (error) {
      console.error('Google login failed:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3,
          background: 'linear-gradient(180deg, #FFFFFF 0%, #F5F5F5 100%)',
          padding: '20px',
        }}
      >
        <Box
          component="img"
          src="https://cdn.pixabay.com/photo/2016/09/10/17/18/book-1659717_1280.jpg"
          alt="Book Swap"
          sx={{
            width: '200px',
            height: '200px',
            objectFit: 'cover',
            borderRadius: '50%',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            marginBottom: 2,
          }}
        />

        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          북스왑
        </Typography>
        <Typography
          variant="subtitle1"
          color="text.secondary"
          gutterBottom
          sx={{
            textAlign: 'center',
            maxWidth: '300px',
            lineHeight: 1.6,
          }}
        >
          책을 교환하고 새로운 이야기를 만나보세요
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: '100%',
            maxWidth: 300,
            marginTop: 2,
          }}
        >
          <Button
            variant="contained"
            onClick={handleKakaoLogin}
            sx={{
              backgroundColor: '#FEE500',
              color: '#000000',
              '&:hover': {
                backgroundColor: '#FDD835',
              },
              height: '48px',
              fontSize: '1rem',
              fontWeight: 'bold',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            카카오로 시작하기
          </Button>

          <Box
            id="googleLoginButton"
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              minHeight: '48px',
              '& > div': {
                width: '100% !important',
                height: '48px !important',
              },
            }}
          />
        </Box>
      </Box>
    </Container>
  );
}
