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
import { Order } from "./Order";
import { PaymentMethod } from './PaymentMethod';
import { Product } from './Product';
import { Province } from './Province';
import { User } from "./User";
import "reflect-metadata";
@Entity()
export class City {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(dataTypes.text)
  title: string;

  @Column(dataTypes.text)
  slug: string;

  @Column(dataTypes.integer)
  provinceId: number;

  @ManyToOne(() => Province, province => province.cities)
  @JoinColumn({
    name: "provinceId",
    referencedColumnName: "id"
  })
  province: Province

  @OneToMany(() => Address, address => address.city)
  addresses: Address[]

}
