import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne, JoinColumn, OneToMany, 
} from 'typeorm';
import { dataTypes } from '../utils/enums';
import { Order } from "./Order";
import { User } from "./User";

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(dataTypes.text, {})
  title: string;

  @Column(dataTypes.number)
  userId: number;

  @Column(dataTypes.text)
  description: string;

  @Column(dataTypes.text, {
    nullable: true
  })
  phoneNumber: string;

  @Column(dataTypes.text)
  longitude: string;

  @Column(dataTypes.text)
  latitude: string;

  @Column(dataTypes.integer)
  district?: number;

  @Column(dataTypes.datetime)
  @CreateDateColumn()
  createdAt: Date;

  @Column(dataTypes.datetime)
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.addresses, { onDelete: 'CASCADE' })
  @JoinColumn({ name:"userId", referencedColumnName: "id"})
  user: User

  @OneToMany(() => Order, (order) => order.address, { onDelete: 'CASCADE' })
  order: Order

}
