import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany, OneToOne,

} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { dataTypes } from '../utils/enums';
import { Address } from './Address';
import { Discount } from './Discount';
import { Order } from './Order';
import 'reflect-metadata';
import { ProductFavorite } from './ProductFavorite';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(dataTypes.text)
  phoneNumber: string;

  @Column(dataTypes.text, {
    nullable: true
  })
  name: string;

  @Column(dataTypes.text, {
    nullable: true
  })
  lastName: string;

  @Column(dataTypes.text, {
    nullable: true
  })
  companyName: string;

  @Column(dataTypes.text, {
    nullable: true
  })
  email: string;

  @Column(dataTypes.text, {
    nullable: true
  })
  nationalCode: string;

  @Column(dataTypes.text, {
    nullable: true
  })
  bankCard: string;

  @Column(dataTypes.boolean, { default: true })
  isActive: boolean

  @Column(dataTypes.text)
  password: string;

  @Column(dataTypes.integer)
  status: number;

  @Column(dataTypes.integer, { default: 0 })
  specialPercent: number;

  @Column(dataTypes.varchar, { default: 'USER' })
  role: string;

  @Column(dataTypes.datetime)
  @CreateDateColumn()
  createdAt: Date;

  @Column(dataTypes.datetime)
  @CreateDateColumn()
  lastEntrance: Date;

  @Column(dataTypes.datetime)
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Address, address => address.user, {
    eager: true,
    onDelete: 'CASCADE'
  })
  address: Address;

  @OneToMany(() => Order, order => order.user, {
    onDelete: 'CASCADE'
  })
  orders: Order[];

  @OneToMany(() => ProductFavorite, productFavorite => productFavorite.user, { onDelete: 'CASCADE' })
  favorites: ProductFavorite[]

  @OneToMany(() => Discount, discount => discount.user, {
    eager: true,
    onDelete: 'CASCADE'
  })
  discounts: Discount[];

  hashPassword = async (): Promise<void> => {
    this.password = bcrypt.hashSync(this.password, 10);
  };

  checkIfUnencryptedPasswordIsValid(unencryptedPassword: string): boolean {
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }
}
