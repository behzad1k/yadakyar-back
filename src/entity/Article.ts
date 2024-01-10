import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany, ManyToMany, JoinTable, TreeChildren, Tree, TreeParent, ManyToOne, JoinColumn,
} from 'typeorm';
import { Length } from "class-validator";
import { dataTypes } from '../utils/enums';
import { ArticleCategory } from './ArticleCategory';
import { Media } from './Media';
import { Order } from "./Order";
import { Product } from './Product';
import { ProductGroup } from './ProductGroup';
import { User } from "./User";
import "reflect-metadata";
@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(dataTypes.text)
  title: string;

  @Column(dataTypes.text)
  slug: string;

  @Column(dataTypes.text)
  keywords: string;

  @Column(dataTypes.text)
  short: string;

  @Column(dataTypes.text)
  long: string;

  @Column(dataTypes.integer)
  authorId: number;

  @Column(dataTypes.integer, {nullable:true})
  mediaId: number;

  @Column(dataTypes.datetime)
  @CreateDateColumn()
  createdAt: Date;

  @Column(dataTypes.datetime)
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Media, media => media.articles,{ eager: true })
  @JoinColumn({
    name: 'mediaId',
    referencedColumnName: 'id'
  })
  media: Media

  @ManyToMany(() => ArticleCategory, articleCategory => articleCategory.articles, { onDelete: 'CASCADE', eager: true })
  @JoinTable({
    name: 'article_category_article'
  })
  categories: ArticleCategory[]
}
