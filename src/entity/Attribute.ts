import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany, ManyToMany, JoinTable, TreeChildren, Tree, TreeParent
} from 'typeorm';
import { Length } from "class-validator";
import { dataTypes } from '../utils/enums';
import { AttributeGroup } from './AttributeGroup';
import { AttributeProduct } from './AttributeProduct';
import { AttributeValue } from './AttributeValue';
import { Order } from "./Order";
import { Product } from './Product';
import { User } from "./User";
import "reflect-metadata";
@Entity()
@Tree('materialized-path')
export class Attribute {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(dataTypes.text)
  title: string;

  @Column('varchar', { unique: true , length: 50})
  slug: string;

  @Column(dataTypes.text)
  description: string;

  @Column(dataTypes.text, { nullable: true })
  parentId: string;

  @Column(dataTypes.datetime)
  @CreateDateColumn()
  createdAt: Date;

  @Column(dataTypes.datetime)
  @UpdateDateColumn()
  updatedAt: Date;

  @TreeChildren()
  children: Attribute[]

  @TreeParent()
  parent: Attribute

  @OneToMany(() => AttributeProduct, attributeProduct => attributeProduct.attributes, { onDelete: 'CASCADE' })
  products: Product[]

  @OneToMany(() => AttributeValue, attributeValue => attributeValue.attribute, { onDelete: 'CASCADE', eager: true })
  attributeValues: AttributeValue[]

  @ManyToMany(() => AttributeGroup, attributeGroup => attributeGroup.attributes, { onDelete: 'CASCADE' })
  @JoinTable({
    name: 'attribute_group_attribute'
  })
  attributeGroups: AttributeGroup[]
}
