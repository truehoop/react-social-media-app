import { User } from '@helpers/types/user';

// 초기 사용자 목록
const initialUsers: User[] = [
  {
    id: 1,
    profilePicture: 'assets/person/1.jpeg',
    userName: 'Berk Yaşar',
    online: true,
    closeFriend: false,
    currentUser: true,
    following: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    name: '',
    profileImage: '',
    provider: 'google',
    rating: 0,
    regionInfo: [],
  },
  {
    id: 2,
    profilePicture: 'assets/person/2.jpeg',
    userName: 'Janell Shrum',
    online: false,
    closeFriend: true,
    currentUser: false,
    following: [1, 2, 3, 4, 5, 11],
    name: '',
    profileImage: '',
    provider: 'google',
    rating: 0,
    regionInfo: [],
  },
  {
    id: 3,
    profilePicture: 'assets/person/3.jpeg',
    userName: 'Alex Durden',
    online: true,
    closeFriend: true,
    name: '',
    profileImage: '',
    provider: 'google',
    rating: 0,
    regionInfo: [],
  },
  {
    id: 4,
    profilePicture: 'assets/person/4.jpeg',
    userName: 'Dora Hawks',
    online: true,
    closeFriend: true,
    name: '',
    profileImage: '',
    provider: 'google',
    rating: 0,
    regionInfo: [],
  },
  {
    id: 5,
    profilePicture: 'assets/person/5.jpeg',
    userName: 'Thomas Holden',
    online: true,
    closeFriend: true,
    name: '',
    profileImage: '',
    provider: 'google',
    rating: 0,
    regionInfo: [],
  },
  {
    id: 6,
    profilePicture: 'assets/person/6.jpeg',
    userName: 'Shirley Beauchamp',
    online: false,
    closeFriend: true,
    name: '',
    profileImage: '',
    provider: 'google',
    rating: 0,
    regionInfo: [],
  },
  {
    id: 7,
    profilePicture: 'assets/person/7.jpeg',
    userName: 'Travis Bennett',
    online: false,
    closeFriend: true,
    name: '',
    profileImage: '',
    provider: 'google',
    rating: 0,
    regionInfo: [],
  },
  {
    id: 8,
    profilePicture: 'assets/person/8.jpeg',
    userName: 'Kristen Thomas',
    online: true,
    closeFriend: true,
    name: '',
    profileImage: '',
    provider: 'google',
    rating: 0,
    regionInfo: [],
  },
  {
    id: 9,
    profilePicture: 'assets/person/9.jpeg',
    userName: 'Gary Duty',
    online: true,
    closeFriend: true,
    name: '',
    profileImage: '',
    provider: 'google',
    rating: 0,
    regionInfo: [],
  },
  {
    id: 10,
    profilePicture: 'assets/person/lebron-james.jpg',
    userName: 'Lebron James',
    online: false,
    closeFriend: true,
    name: '',
    profileImage: '',
    provider: 'google',
    rating: 0,
    regionInfo: [],
  },
];

// localStorage에서 users 불러오기
const loadUsers = (): User[] => {
  const storedUsers = localStorage.getItem('users');
  return storedUsers ? JSON.parse(storedUsers) : initialUsers;
};

// users 배열 초기화
export const users: User[] = loadUsers();

// users 배열 저장
const saveUsers = (): void => {
  localStorage.setItem('users', JSON.stringify(users));
};

// 새로운 사용자 추가
export const addUser = (user: User): void => {
  // 이미 존재하는 사용자인지 확인
  const existingUserIndex = users.findIndex((u) => u.id === user.id);

  if (existingUserIndex === -1) {
    // 새로운 사용자 추가
    users.push({
      ...user,
      online: true,
      closeFriend: false,
      currentUser: true,
      following: [],
    });
  } else {
    // 기존 사용자 정보 업데이트
    users[existingUserIndex] = {
      ...users[existingUserIndex],
      ...user,
      online: true,
      currentUser: true,
    };
  }

  // 변경사항을 localStorage에 저장
  saveUsers();
};

// 사용자 ID로 사용자 찾기
export const getUserById = (id: string | number): User | undefined => {
  return users.find((user) => user.id.toString() === id.toString());
};
