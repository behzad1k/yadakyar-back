import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { dataTypes } from '../utils/enums';
import { DeliveryMethod } from './DeliveryMethod';
import { Order } from "./Order";
import { PaymentMethod } from './PaymentMethod';
@Entity()
export class Delivery {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(dataTypes.text)
  title: string;

  @Column(dataTypes.text)
  slug: string;

  @Column(dataTypes.text)
  code: string;

  @Column(dataTypes.integer)
  price: number;

  @Column(dataTypes.datetime)
  @CreateDateColumn()
  createdAt: Date;

  @Column(dataTypes.datetime)
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Order, order => order.delivery)
  orders: Order[];

  @ManyToOne(() => DeliveryMethod, (deliveryMethod) => deliveryMethod.deliveries, { onDelete: 'CASCADE' })
  @JoinColumn({name: 'deliveryMethodId', referencedColumnName: 'id'})
  deliveryMethod: PaymentMethod
}
