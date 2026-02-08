import {
  Entity as TypeORMEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { BoxType } from '../types';
import { Transaction } from './Transaction';

@TypeORMEntity('boxes')
export class Box {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({
    type: 'enum',
    enum: BoxType,
  })
  type!: BoxType;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  balance!: number;

  @OneToMany(() => Transaction, (transaction) => transaction.box)
  transactions!: Transaction[];

  @OneToMany(() => Transaction, (transaction) => transaction.targetBox)
  incomingTransfers!: Transaction[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
