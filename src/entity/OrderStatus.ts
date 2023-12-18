import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany, ManyToMany, JoinTable, TreeChildren, Tree, TreeParent, 
} from 'typeorm';
import { Length } from "class-validator";
import { dataTypes } from '../utils/enums';
import { Order } from "./Order";
import { Product } from './Product';
import { ProductGroup } from './ProductGroup';
import { User } from "./User";
import "reflect-metadata";
@Entity()
export class Menu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(dataTypes.text)
  title: string;

  @Column(dataTypes.integer)
  code: number;

  @Column(dataTypes.text)
  description: string;

}
