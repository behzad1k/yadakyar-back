import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany, ManyToMany, JoinTable, TreeChildren, Tree, TreeParent , ManyToOne
} from 'typeorm';
import { Length } from "class-validator";
import { dataTypes } from '../utils/enums';
import { Attribute } from './Attribute';
import { AttributeProduct } from './AttributeProduct';
import { Order } from "./Order";
import { Product } from './Product';
import { User } from "./User";
import "reflect-metadata";
@Entity()
export class AttributeValue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(dataTypes.text)
  title: string;

  @Column('varchar', { unique: true, length: 50})
  slug: string;

  @Column(dataTypes.text)
  description: string;

  @Column(dataTypes.integer)
  attributeId: number;

  @Column(dataTypes.datetime)
  @CreateDateColumn()
  createdAt: Date;

  @Column(dataTypes.datetime)
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Attribute, (attribute) => attribute.attributeValues, { onDelete: 'CASCADE' })
  attribute: Attribute
  //
  // @OneToMany(() => AttributeProduct, (attributeProduct) => attributeProduct.attributeValue, { onDelete: 'CASCADE' })
  // attributeProducts: AttributeProduct[]

}
