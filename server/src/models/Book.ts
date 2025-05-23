import { Table, Column, Model, DataType, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { User } from './User';

export interface IRegionInfo {
  regionType: string;
  code: string;
  addressName: string;
  region1: string;
  region2: string;
  region3: string;
}

@Table({
  tableName: 'books',
  timestamps: true,
})
export class Book extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  image!: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
  })
  genres!: string[];

  @Column({
    type: DataType.ENUM('최상', '상', '중', '하'),
    allowNull: false,
  })
  condition!: '최상' | '상' | '중' | '하';

  @Column({
    type: DataType.ENUM('교환가능', '교환예약', '교환완료'),
    allowNull: false,
  })
  status!: '교환가능' | '교환예약' | '교환완료';

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  registeredDate!: Date;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  geolocation!: {
    lat: number;
    lng: number;
  };

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  regionInfo!: IRegionInfo[];

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  ownerId!: number;

  @BelongsTo(() => User, { constraints: false })
  owner!: User;
} 