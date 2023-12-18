import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany, ManyToMany, JoinTable, TreeChildren, Tree, TreeParent, ManyToOne, JoinColumn, getRepository
} from 'typeorm';
import { dataTypes } from '../utils/enums';
import { Brand } from './Brand';
import { Category } from './Category';
import { PaymentMethod } from './PaymentMethod';
import { Product } from './Product';
import { Tag } from './Tag';
@Entity()
export class ProductGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(dataTypes.text)
  title: string;

  @Column(dataTypes.text)
  titleEng: string;

  @Column(dataTypes.text)
  slug: string;

  @Column(dataTypes.text)
  shortText: string;

  @Column(dataTypes.text)
  longText: string;

  @Column(dataTypes.text)
  status: string;

  @Column(dataTypes.integer)
  categoryId: number;

  @Column(dataTypes.integer)
  brandId: number;

  @Column(dataTypes.integer)
  attributeGroupId: number;

  @Column(dataTypes.datetime)
  @CreateDateColumn()
  createdAt: Date;

  @Column(dataTypes.datetime)
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Category, category => category.productGroups, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'categoryId',
    referencedColumnName: 'id'
  })
  category: Category;

  @ManyToOne(() => Brand, brand => brand.products, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'brandId',
    referencedColumnName: 'id'
  })
  brand: Brand;

  @ManyToOne(() => ProductGroup, attributeGroup => attributeGroup.products, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'attributeGroupId',
    referencedColumnName: 'id'
  })
  attributeGroup: PaymentMethod;

  @OneToMany(() => Product, product => product.productGroup, {
    onDelete: 'CASCADE',
    eager: true
  })
  products: Product[]

  @ManyToMany(() => Tag, tag => tag.products, { onDelete: 'CASCADE' })
  @JoinTable({
    name: 'product_tag'
  })
  tags: Tag[]
}