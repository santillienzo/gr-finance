import {
  Entity as TypeORMEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { EntityType } from '../types';
import { Transaction } from './Transaction';

@TypeORMEntity('entities')
export class Entity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({
    type: 'enum',
    enum: EntityType,
  })
  type!: EntityType;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  balance!: number;

  @Column({ type: 'boolean', default: true })
  active!: boolean;

  @OneToMany(() => Transaction, (transaction) => transaction.entity)
  transactions!: Transaction[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
