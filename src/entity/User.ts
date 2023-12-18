import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { dataTypes } from '../utils/enums';
import { Address } from './Address';
import { Discount } from './Discount';
import { Order } from './Order';
import 'reflect-metadata';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(dataTypes.text)
  phoneNumber: string;

  @Column(dataTypes.text)
  username: string;

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
  isActive

  @Column(dataTypes.text, { nullable: false })
  password: string;

  @Column(dataTypes.integer)
  status: number;

  @Column(dataTypes.integer)
  postalCode: number;

  @Column(dataTypes.text, { nullable: false })
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

  @OneToMany(() => Address, address => address.user, {
    eager: true,
    onDelete: 'CASCADE'
  })
  addresses: Address[];

  @OneToMany(() => Order, order => order.user, {
    eager: true,
    onDelete: 'CASCADE'
  })
  orders: Order[];

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
