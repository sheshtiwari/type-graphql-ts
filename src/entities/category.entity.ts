import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { CategoryProduct } from "./category-product.entity";

@ObjectType()
@Entity("categories")
export class CategoryEntity extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  title: string;

  @Field()
  @Column({ unique: true })
  url: string;

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

  @OneToMany(() => CategoryProduct, cp => cp.category)
  productConnection: Promise<CategoryProduct[]>;

  @Field()
  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: string;

  @Field()
  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: string;
}
