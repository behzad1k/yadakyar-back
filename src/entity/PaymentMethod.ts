import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany, ManyToMany, JoinTable, TreeChildren, Tree, TreeParent, 
} from 'typeorm';
import { Length } from "class-validator";
import { dataTypes } from '../utils/enums';
import { Order } from "./Order";
import { Payment } from './Payment';
import { Product } from './Product';
import { User } from "./User";
import "reflect-metadata";
@Entity()
export class PaymentMethod {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(dataTypes.text)
  title: string;

  @Column(dataTypes.text)
  description: string;

  @OneToMany(() => Payment, (payment) => payment.paymentMethod, { onDelete: 'CASCADE' })
  payments: Payment[]

}
