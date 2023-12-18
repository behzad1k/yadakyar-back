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

  @Column(dataTypes.text)
  title: string;

  @Column(dataTypes.text)
  slug: string;

  @Column(dataTypes.text)
  code: string;

  @Column(dataTypes.text)
  bank: string;

  @Column(dataTypes.text)
  date: string;

  @Column(dataTypes.integer)
  paymentMethodId: number;

  @Column(dataTypes.datetime)
  @CreateDateColumn()
  createdAt: Date;

  @Column(dataTypes.datetime)
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Order, order => order.payment)
  orders: Order[];

  @ManyToOne(() => PaymentMethod, (paymentMethod) => paymentMethod.payments, { onDelete: 'CASCADE' })
  @JoinColumn({name: 'paymentMethodId', referencedColumnName: 'id'})
  paymentMethod: PaymentMethod
}
