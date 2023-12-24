import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany, ManyToMany, JoinTable, TreeChildren, Tree, TreeParent, ManyToOne, JoinColumn,
} from 'typeorm';
import { Length } from "class-validator";
import { dataTypes } from '../utils/enums';
import { Order } from "./Order";
import { OrderProduct } from './OrderProduct';
import { OrderStatus } from './OrderStatus';
import { Product } from './Product';
import { ProductGroup } from './ProductGroup';
import { User } from "./User";
import "reflect-metadata";
@Entity()
export class OrderStatusOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(dataTypes.integer)
  orderId: number;

  @Column(dataTypes.integer)
  statusId: number;

  @Column(dataTypes.text, { nullable: true })
  description: string;

  @ManyToOne(() => OrderStatus, orderStatus => orderStatus.orders, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'statusId',
    referencedColumnName: 'id'
  })
  orderStatus: OrderStatus

  @ManyToOne(() => Order, order => order.orderStatuses, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'orderId',
    referencedColumnName: 'id'
  })
  order: Order

}
