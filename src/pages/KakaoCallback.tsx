import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useUser } from '@contexts/UserContext';
import { addUser } from '@helpers/api/users';
import { User, createUserFromKakao } from '@helpers/types/user';
import { loadKakaoSDK } from '@utils/kakaoSDK';

export default function KakaoCallback() {
  const navigate = useNavigate();
  const { setUser } = useUser();

  useEffect(() => {
    const handleKakaoLogin = async () => {
      try {
        await loadKakaoSDK();

        // Get authorization code from URL
        const code = new URL(window.location.href).searchParams.get('code');
        if (!code) {
          throw new Error('No authorization code');
        }

        // Exchange code for access token
        window.Kakao.Auth.login({
          success: (authObj: any) => {
            // Get user info
            window.Kakao.API.request({
              url: '/v2/user/me',
              success: (res: any) => {
                // 카카오 데이터로 User 객체 생성
                const user = createUserFromKakao(res);

                // users.ts에 사용자 추가
                addUser(user);

                // Store user info and token
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('token', authObj.access_token);
                setUser(user);

                // Navigate to home page
                navigate('/');
              },
              fail: (err: any) => {
                console.error('Failed to get user info:', err);
                navigate('/login');
              },
            });
          },
          fail: (err: any) => {
            console.error('Failed to get access token:', err);
            navigate('/login');
          },
        });
      } catch (error) {
        console.error('Kakao login failed:', error);
        navigate('/login');
      }
    };

    handleKakaoLogin();
  }, [navigate, setUser]);

  return null;
}
