import { isEmpty } from "lodash";
import { Image } from "../graphql-types";
import { Field, ID, InputType, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  In,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { CategoryProduct } from "./category-product.entity";
import { CategoryEntity } from "./category.entity";

@InputType("ProductVariantInput")
@ObjectType()
export class ProductVariant {
  @Field()
  description: string;

  @Field()
  count: number;

  @Field()
  price: string;
}

@ObjectType()
@Entity("products")
export class Product extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  title: string;

  @Field()
  @Column({ unique: true })
  url: string;

  @Field()
  @Column()
  price: string;

  @Field(() => Image, { nullable: true })
  @Column({ type: "jsonb", nullable: true })
  logo?: object;

  @Field(() => [Image], { nullable: true })
  @Column({ type: "jsonb", nullable: true })
  gallery?: object[];

  @Field(() => [ProductVariant])
  @Column({ type: "jsonb", default: [] })
  variants: object[];

  @Field({ nullable: true })
  @Column({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  seoTitle?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  seoDescription?: string;

  @Field(() => [String])
  @Column({ type: "jsonb", default: [] })
  seoKeywords: string[];

  @OneToMany(() => CategoryProduct, cp => cp.product)
  categoryConnection: Promise<CategoryProduct[]>;

  @Field(() => [CategoryEntity])
  async categories(): Promise<CategoryEntity[]> {
    const categoriesIds = (await CategoryProduct.find({
      productId: this.id
    })).map(cp => cp.categoryId);

    if (isEmpty(categoriesIds)) {
      return [];
    }

    return CategoryEntity.find({ id: In(categoriesIds) });
  }

  @Field()
  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: string;

  @Field()
  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: string;
}
