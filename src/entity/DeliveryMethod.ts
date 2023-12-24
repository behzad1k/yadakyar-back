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
  description: string;

  @OneToMany(() => Delivery, (delivery) => delivery.deliveryMethod, { onDelete: 'CASCADE' })
  deliveries: Delivery[]

}
