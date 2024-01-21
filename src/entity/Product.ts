import 'reflect-metadata';
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { dataTypes } from '../utils/enums';
import { Attribute } from './Attribute';
import { AttributeProduct } from './AttributeProduct';
import { Media } from './Media';
import { Order } from './Order';
import { OrderProduct } from './OrderProduct';
import { ProductFavorite } from './ProductFavorite';
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
  priceToman: number;

  @Column(dataTypes.integer, { nullable: true })
  wholesomePrice: number;

  @Column(dataTypes.integer, { nullable: true })
  discountPrice: number;

  @Column(dataTypes.integer)
  status: number;

  @Column(dataTypes.boolean, { default: false })
  isPre: boolean;

  @Column(dataTypes.integer, { nullable: true })
  productGroupId: number;

  @Column(dataTypes.integer, { nullable: true })
  mediaId: number;

  @Column(dataTypes.text)
  sku: string;

  @Column(dataTypes.varchar, { default: null })
  nextAvailable: string;

  @Column(dataTypes.datetime)
  @CreateDateColumn()
  createdAt: Date;

  @Column(dataTypes.datetime)
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => AttributeProduct, attributeProduct => attributeProduct.products, { onDelete: 'CASCADE'  })
  attributes: AttributeProduct[]

  @ManyToOne(() => ProductGroup, productGroup => productGroup.products, { onDelete: 'CASCADE'})
  @JoinColumn({
    name: 'productGroupId',
    referencedColumnName: 'id'
  })
  productGroup: ProductGroup

  @ManyToOne(() => Media, media => media.products,{ eager: true, onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'mediaId',
    referencedColumnName: 'id'
  })
  media: Media

  @OneToMany(() => OrderProduct, orderProduct => orderProduct.product, { onDelete: 'CASCADE' })
  orders: Order[]

  @OneToMany(() => ProductFavorite, productFavorite => productFavorite.product, { onDelete: 'CASCADE' })
  favorites: ProductFavorite[]


}
