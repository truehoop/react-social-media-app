import { Table, Column, Model, DataType, HasMany, PrimaryKey, AutoIncrement } from 'sequelize-typescript';
import { Book } from './Book';
import { RegionInfo } from './RegionInfo';

@Table({
  tableName: 'users',
  timestamps: true,
})
export class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  password?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  profileImage?: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  rating!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 'local',
  })
  provider!: string;

  @HasMany(() => Book)
  books!: Book[];

  @HasMany(() => RegionInfo)
  regionInfos!: RegionInfo[];
} 