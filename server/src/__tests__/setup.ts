import { sequelize } from '../config/database';
import seedData from '../seeders/seed';

beforeAll(async () => {
  try {
    // 데이터베이스 연결 확인
    await sequelize.authenticate();
    console.log('Database connection established for tests');
    
    // 테이블 동기화 (force: true로 모든 테이블 재생성)
    await sequelize.sync({ force: true });
    
    // 시드 데이터 삽입
    await seedData();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
});

afterAll(async () => {
  try {
    // 모든 테이블 삭제
    await sequelize.drop();
    // 데이터베이스 연결 종료
    await sequelize.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error closing database connection:', error);
  }
});

// 각 테스트 전에 데이터베이스 초기화
beforeEach(async () => {
  try {
    // 모든 테이블의 데이터 삭제
    await sequelize.truncate({ cascade: true });
    // 시드 데이터 다시 삽입
    await seedData();
  } catch (error) {
    console.error('Error resetting database:', error);
  }
}); 