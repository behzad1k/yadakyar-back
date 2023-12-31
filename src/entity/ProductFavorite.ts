import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany, ManyToMany, JoinTable, TreeChildren, Tree, TreeParent, ManyToOne, JoinColumn,
} from 'typeorm';
import { Length } from "class-validator";
import { dataTypes } from '../utils/enums';
import { Order } from "./Order";
import { Product } from './Product';
import { ProductGroup } from './ProductGroup';
import { User } from "./User";
import "reflect-metadata";
@Entity()
export class ProductFavorite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(dataTypes.integer)
  productId: number;

  @Column(dataTypes.integer)
  userId: number;

  @Column(dataTypes.datetime)
  @CreateDateColumn()
  createdAt: Date;

  @Column(dataTypes.datetime)
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Product, product => product.favorites, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({
    name: 'productId'
  })
  product: Product

  @ManyToOne(() => User, user => user.favorites, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'userId'
  })
  user: User
}
