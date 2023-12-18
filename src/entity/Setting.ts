import 'reflect-metadata';
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { dataTypes } from '../utils/enums';
import { Attribute } from './Attribute';
import { AttributeProduct } from './AttributeProduct';
import { Order } from './Order';
import { ProductGroup } from './ProductGroup';

@Entity()
export class Setting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(dataTypes.text)
  key: string;

  @Column(dataTypes.text)
  value: string;

  @Column(dataTypes.datetime)
  @CreateDateColumn()
  createdAt: Date;

  @Column(dataTypes.datetime)
  @UpdateDateColumn()
  updatedAt: Date;

}
