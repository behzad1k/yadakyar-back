import 'reflect-metadata';
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { dataTypes } from '../utils/enums';
import { Attribute } from './Attribute';
import { AttributeProduct } from './AttributeProduct';
import { Media } from './Media';
import { Order } from './Order';
import { OrderProduct } from './OrderProduct';
import { ProductGroup } from './ProductGroup';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(dataTypes.integer)
  count: number;

  @Column(dataTypes.integer)
  price: number;

  @Column(dataTypes.integer)
  euroPrice: number;

  @Column(dataTypes.integer)
  wholesomePrice: number;

  @Column(dataTypes.integer)
  discountPrice: number;

  @Column(dataTypes.integer)
  status: number;

  @Column(dataTypes.integer)
  productGroupId: number;

  @Column(dataTypes.integer)
  mediaId: number;

  @Column(dataTypes.text)
  sku: string;

  @Column(dataTypes.datetime)
  @CreateDateColumn()
  createdAt: Date;

  @Column(dataTypes.datetime)
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => AttributeProduct, attributeProduct => attributeProduct.products, { onDelete: 'CASCADE'  })
  attributes: AttributeProduct[]

  @ManyToOne(() => ProductGroup, productGroup => productGroup.products)
  @JoinColumn({
    name: 'productGroupId',
    referencedColumnName: 'id'
  })
  productGroup: ProductGroup

  @ManyToOne(() => Media, media => media.products,{ eager: true })
  @JoinColumn({
    name: 'mediaId',
    referencedColumnName: 'id'
  })
  media: Media

  @OneToMany(() => OrderProduct, orderProduct => orderProduct.product, { onDelete: 'CASCADE' })
  orders: Order[]


}
