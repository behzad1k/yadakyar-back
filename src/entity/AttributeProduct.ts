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
import { Product } from './Product';
@Entity()
export class AttributeProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(dataTypes.integer)
  productId: number;

  @Column('varchar')
  attributeValueSlug: string;

  @Column({ type: 'text' })
  attributeSlug: string;

  @ManyToOne(() => Product, product => product.attributes, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'productId',
    referencedColumnName: 'id'
  })
  products: Product[]

  @ManyToOne(() => Attribute, attribute => attribute.products, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'attributeSlug',
    referencedColumnName: 'slug'
  })
  attributes: Attribute[]

  // @ManyToOne(() => AttributeValue, attributeValue => attributeValue.attributeProducts, { onDelete: 'CASCADE' })
  // @JoinColumn({
  //   name: 'attributeValueSlug',
  //   referencedColumnName: 'slug'
  // })
  // attributeValue: AttributeValue

}
