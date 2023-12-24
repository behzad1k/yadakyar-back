import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne, JoinColumn
} from 'typeorm';
import { dataTypes } from '../utils/enums';
import { Attribute } from './Attribute';
import { AttributeValue } from './AttributeValue';
import { Category } from './Category';
import { Order } from './Order';
import { Product } from './Product';
@Entity()
export class OrderProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(dataTypes.integer)
  productId: number;

  @Column(dataTypes.integer)
  orderId: number;

  @Column(dataTypes.integer)
  count: number;

  @Column(dataTypes.integer)
  price: number;

  @Column(dataTypes.integer)
  priceToman: number;

  @Column(dataTypes.integer, { default: 0 })
  discountPrice: number;

  @ManyToOne(() => Product, product => product.attributes, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({
    name: 'productId',
    referencedColumnName: 'id'
  })
  product: Product

  @ManyToOne(() => Order, order => order.products, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'orderId',
    referencedColumnName: 'id'
  })
  order: Order

  // @ManyToOne(() => AttributeValue, attributeValue => attributeValue.attributeProducts, { onDelete: 'CASCADE' })
  // @JoinColumn({
  //   name: 'attributeValueSlug',
  //   referencedColumnName: 'slug'
  // })
  // attributeValue: AttributeValue

}
