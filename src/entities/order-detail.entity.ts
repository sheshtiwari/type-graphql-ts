import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { OrderEntity } from "./order.entity";
import { Product, ProductVariant } from "./product.entity";

@ObjectType()
@Entity({ name: "orders_products" })
export class OrderDetailEntity extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  productId: number;

  @Field()
  @Column()
  orderId: number;

  @Field()
  @Column()
  quantity: number;

  @Field()
  @Column()
  staticPrice: string;

  @Field(() => ProductVariant, { nullable: true })
  @Column({ type: "jsonb", nullable: true })
  variant?: ProductVariant;

  @ManyToOne(() => OrderEntity, o => o.detailConnection)
  order: OrderEntity;

  @Field(() => Product)
  product(): Promise<Product> {
    return Product.findOne({ id: this.productId });
  }
}
