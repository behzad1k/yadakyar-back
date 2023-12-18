import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany, ManyToMany, JoinTable, TreeChildren, Tree, TreeParent, 
} from 'typeorm';
import { Length } from "class-validator";
import { CategoryEnum, dataTypes } from '../utils/enums';
import { Article } from './Article';
import { AttributeGroup } from './AttributeGroup';
import { AttributeProduct } from './AttributeProduct';
import { Order } from "./Order";
import { Product } from './Product';
import { ProductGroup } from './ProductGroup';
import { User } from "./User";
import "reflect-metadata";
@Entity()
@Tree('materialized-path')
export class ArticleCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(dataTypes.text)
  title: string;

  @Column(dataTypes.text)
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
  children: ArticleCategory[]

  @TreeParent()
  parent: ArticleCategory

  @ManyToMany(() => Article, article => article.categories, { onDelete: 'CASCADE' })
  @JoinTable({
    name: 'article_category_article'
  })
  articles: Article[]
}
