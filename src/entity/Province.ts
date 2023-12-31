import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany, ManyToMany, JoinTable, TreeChildren, Tree, TreeParent , ManyToOne, JoinColumn
} from 'typeorm';
import { Length } from "class-validator";
import { dataTypes } from '../utils/enums';
import { Address } from './Address';
import { City } from './City';
import { Order } from "./Order";
import { PaymentMethod } from './PaymentMethod';
import { Product } from './Product';
import { User } from "./User";
import "reflect-metadata";
@Entity()
export class Province {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(dataTypes.text)
  title: string;

  @Column(dataTypes.text)
  slug: string;

  @OneToMany(() => City, city => city.province, { eager: true })
  cities: City[]

  @OneToMany(() => Address, address => address.province, { eager: true })
  addresses: Address[]

}
