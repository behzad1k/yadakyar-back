import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne, JoinColumn, OneToMany, OneToOne,
} from 'typeorm';
import { dataTypes } from '../utils/enums';
import { City } from './City';
import { Order } from "./Order";
import { Province } from './Province';
import { User } from "./User";

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(dataTypes.text, { nullable: true })
  title: string;

  @Column(dataTypes.number)
  userId: number;

  @Column(dataTypes.number)
  cityId: number;

  @Column(dataTypes.number)
  provinceId: number;

  @Column(dataTypes.text)
  text: string;

  @Column(dataTypes.text)
  postalCode: string;

  @Column(dataTypes.text, {
    nullable: true
  })
  phoneNumber: string;

  @Column(dataTypes.text, { nullable: true })
  longitude: string;

  @Column(dataTypes.text, { nullable: true })
  latitude: string;

  @Column(dataTypes.datetime)
  @CreateDateColumn()
  createdAt: Date;

  @Column(dataTypes.datetime)
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => City, (city) => city.addresses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: "cityId", referencedColumnName: "id"})
  city: City

  @ManyToOne(() => Province, (province) => province.addresses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: "provinceId", referencedColumnName: "id"})
  province: Province

  @OneToOne(() => User, (user) => user.address, { onDelete: 'CASCADE' })
  @JoinColumn({ name: "userId", referencedColumnName: "id"})
  user: User

  @OneToMany(() => Order, (order) => order.address, { onDelete: 'CASCADE' })
  order: Order

}
