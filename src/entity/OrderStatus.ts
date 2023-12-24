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
import { OrderProduct } from './OrderProduct';
import { OrderStatusOrder } from './OrderStatusOrder';
import { Product } from './Product';
import { ProductGroup } from './ProductGroup';
import { User } from "./User";
import "reflect-metadata";
@Entity()
export class OrderStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(dataTypes.text)
  title: string;

  @Column(dataTypes.text)
  color: string;

  @Column(dataTypes.text)
  backColor: string;

  @Column(dataTypes.text)
  description: string;

  @OneToMany(() => OrderStatusOrder, orderStatusOrder => orderStatusOrder.orderStatus, { onDelete: 'CASCADE' })
  orders: Order[];

}
