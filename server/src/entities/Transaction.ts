import {
  Entity as TypeORMEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TransactionType } from '../types';
import { Box } from './Box';
import { Entity } from './Entity';
import { User } from './User';

@TypeORMEntity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @CreateDateColumn()
  date!: Date;

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  type!: TransactionType;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount!: number;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({ nullable: true })
  boxId!: string;

  @ManyToOne(() => Box, (box) => box.transactions, { nullable: true })
  @JoinColumn({ name: 'boxId' })
  box!: Box;

  @Column({ nullable: true })
  targetBoxId!: string;

  @ManyToOne(() => Box, (box) => box.incomingTransfers, { nullable: true })
  @JoinColumn({ name: 'targetBoxId' })
  targetBox!: Box;

  @Column({ nullable: true })
  entityId!: string;

  @ManyToOne(() => Entity, (entity) => entity.transactions, { nullable: true })
  @JoinColumn({ name: 'entityId' })
  entity!: Entity;

  @Column({ nullable: true })
  userId!: string;

  @ManyToOne(() => User, (user) => user.transactions, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user!: User;
}
