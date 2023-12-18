import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn, JoinTable, ManyToMany,
  ManyToOne, OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { dataTypes } from '../utils/enums';
import { Address } from './Address';
import { Delivery } from './Delivery';
import { Discount } from './Discount';
import { OrderProduct } from './OrderProduct';
import { Payment } from './Payment';
import { Product } from './Product';
import { User } from './User';

@Entity()
export class Order {

  @PrimaryGeneratedColumn()
  id: number;

  @Column(dataTypes.integer)
  price: number;

  @Column(dataTypes.integer, {
    nullable: true
  })
  discountId?: number;

  @Column(dataTypes.integer, {
    nullable: true
  })
  discountPrice?: number;

  @Column(dataTypes.integer, {
    nullable: true
  })
  wholesomePrice?: number;

  @Column(dataTypes.integer, {
    default: 0
  })
  transportation?: number;

  @Column(dataTypes.integer)
  userId?: number;

  @Column(dataTypes.text)
  status: string;

  @Column(dataTypes.integer, { nullable: true })
  addressId: number;

  @Column(dataTypes.integer, { nullable: true })
  deliveryId: number;

  @Column(dataTypes.integer, { nullable: true })
  paymentId: number;

  @Column(dataTypes.text, { nullable: true })
  code: string;

  @Column(dataTypes.boolean, {
    default: true
  })
  inCart: boolean;

  @Column(dataTypes.datetime)
  @CreateDateColumn()
  createdAt: Date;

  @Column(dataTypes.datetime)
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.orders, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'userId',
    referencedColumnName: 'id'
  })
  user: User;

  @ManyToOne(() => Delivery, (delivery) => delivery.orders, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'deliveryId',
    referencedColumnName: 'id'
  })
  delivery: Delivery;

  @ManyToOne(() => Payment, (payment) => payment.orders, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'paymentId',
    referencedColumnName: 'id'
  })
  payment: Payment;

  @ManyToOne(() => Discount, (discount) => discount.orders, {
    nullable: true,
    onDelete: 'CASCADE'
  })
  @JoinColumn({
    name: 'discountId',
    referencedColumnName: 'id'
  })
  discount?: Discount;

  @ManyToOne(() => Address, (address) => address.order, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'addressId',
    referencedColumnName: 'id'
  })
  address: Address;

  @OneToMany(() => OrderProduct, orderProduct => orderProduct.order, { onDelete: 'CASCADE', eager: true })
  products: Product[];

}