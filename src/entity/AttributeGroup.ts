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
import { Attribute } from './Attribute';
import { Order } from "./Order";
import { Product } from './Product';
import { ProductGroup } from './ProductGroup';
import { User } from "./User";
import "reflect-metadata";
@Entity()
export class AttributeGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(dataTypes.text)
  title: string;

  @Column(dataTypes.text)
  slug: string;

  @Column(dataTypes.text)
  description: string;

  @Column(dataTypes.datetime)
  @CreateDateColumn()
  createdAt: Date;

  @Column(dataTypes.datetime)
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Attribute, attribute => attribute.attributeGroups, { onDelete: 'CASCADE', eager: true })
  @JoinTable({
    name: 'attribute_group_attribute'
  })
  attributes: Attribute[]

  @OneToMany(() => ProductGroup, (productGroup) => productGroup.attributeGroup, { onDelete: 'CASCADE' })
  products: Product[]

}
