import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany, 
} from 'typeorm';
import { dataTypes } from '../utils/enums';
import { Delivery } from './Delivery';
import "reflect-metadata";
@Entity()
export class DeliveryMethod {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(dataTypes.text)
  title: string;

  @Column(dataTypes.text)
  slug: string;

  @Column(dataTypes.text)
  code: string;

  @Column(dataTypes.datetime)
  @CreateDateColumn()
  createdAt: Date;

  @Column(dataTypes.datetime)
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Delivery, (delivery) => delivery.deliveryMethod, { onDelete: 'CASCADE' })
  deliveries: Delivery[]

}
