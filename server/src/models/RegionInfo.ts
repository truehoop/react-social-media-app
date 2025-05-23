import { Table, Column, Model, DataType, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { User } from './User';

@Table({
  tableName: 'region_infos',
  timestamps: true,
})
export class RegionInfo extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  type!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  code!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  address!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  region1!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  region2!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  region3!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId!: number;

  @BelongsTo(() => User, { constraints: false })
  user!: User;
} 