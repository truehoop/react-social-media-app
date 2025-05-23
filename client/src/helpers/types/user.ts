import { RegionInfo } from '@helpers/api/kakao';

export interface User {
  id: string | number;
  name: string;
  email?: string;
  profileImage: string;
  provider: 'google' | 'kakao';
  rating: number;
  regionInfo: RegionInfo[];

  // Optional fields
  profilePicture?: string;
  userName?: string;
  online?: boolean;
  info?: string;
  closeFriend?: boolean;
  currentUser?: boolean;
  following?: number[];
}

export interface UserInfo extends User {
  name: string;
  email?: string;
  profileImage: string;
  rating: number;
  regionInfo: RegionInfo[];
  provider: 'google' | 'kakao';
}

// 카카오 로그인 데이터로 User 객체 생성
export const createUserFromKakao = (kakaoData: any): User => {
  const kakaoAccount = kakaoData.kakao_account;
  return {
    id: kakaoData.id.toString(),
    name: kakaoAccount.profile.nickname,
    profileImage: kakaoAccount.profile.profile_image_url,
    provider: 'kakao',
    rating: 0, // 초기값
    regionInfo: [], // 초기값
    ...(kakaoAccount.email && { email: kakaoAccount.email }),
    // Optional fields 초기값
    online: false,
    closeFriend: false,
    currentUser: false,
    following: [],
  };
};

// 구글 로그인 데이터로 User 객체 생성
export const createUserFromGoogle = (googleData: any): User => {
  return {
    id: googleData.sub,
    name: googleData.name,
    profileImage: googleData.picture,
    provider: 'google',
    rating: 0,
    regionInfo: [],
    ...(googleData.email && { email: googleData.email }),
    online: false,
    closeFriend: false,
    currentUser: false,
    following: [],
  };
};
