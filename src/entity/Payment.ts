import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn, OneToMany
} from 'typeorm';
import { dataTypes } from '../utils/enums';
import { Order } from './Order';
import { PaymentMethod } from './PaymentMethod';
@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(dataTypes.integer)
  price: number;

  @Column(dataTypes.integer)
  percent: number;

  @Column(dataTypes.integer)
  havale: number;

  @Column(dataTypes.text, { nullable: true })
  code: string;

  @Column(dataTypes.text, { nullable: true })
  bank: string;

  @Column(dataTypes.datetime, { nullable: true })
  date: string;

  @Column(dataTypes.boolean, { default: true })
  isPre: boolean;

  @Column(dataTypes.boolean, { default: false })
  isPaid: boolean;

  @Column(dataTypes.integer, { default: 1 })
  paymentMethodId: number;

  @Column(dataTypes.datetime)
  @CreateDateColumn()
  createdAt: Date;

  @Column(dataTypes.datetime)
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Order, order => order.payments)
  orders: Order[];

  @ManyToOne(() => PaymentMethod, (paymentMethod) => paymentMethod.payments, { onDelete: 'CASCADE' })
  @JoinColumn({name: 'paymentMethodId', referencedColumnName: 'id'})
  paymentMethod: PaymentMethod
}
