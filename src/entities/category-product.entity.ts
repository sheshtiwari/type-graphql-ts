import {
  BaseEntity,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn
} from "typeorm";
import { CategoryEntity } from "./category.entity";
import { Product } from "./product.entity";

@Entity("categories_products")
export class CategoryProduct extends BaseEntity {
  @PrimaryColumn()
  categoryId: number;

  @PrimaryColumn()
  productId: number;

  @ManyToOne(() => CategoryEntity, category => category.productConnection, {
    onDelete: "CASCADE"
  })
  @JoinColumn({ name: "categoryId" })
  category: Promise<CategoryEntity>;

  @ManyToOne(() => Product, product => product.categoryConnection, {
    onDelete: "CASCADE"
  })
  @JoinColumn({ name: "productId" })
  product: Promise<Product>;
}
