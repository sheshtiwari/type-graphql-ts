import {
  DELIVERY_STATUS,
  DELIVERY_TYPES,
  PAYMENT_STATUS,
  PAYMENT_TYPES
} from "../constants";
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
import { OrderDetailEntity } from "./order-detail.entity";

@ObjectType()
@Entity("orders")
export class OrderEntity extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  number: string;

  @Field(() => DELIVERY_TYPES)
  @Column({ type: "enum", enum: DELIVERY_TYPES })
  deliveryType: string;

  @Field(() => DELIVERY_STATUS)
  @Column({ type: "enum", enum: DELIVERY_STATUS })
  deliveryStatus: string;

  @Field(() => PAYMENT_TYPES)
  @Column({ type: "enum", enum: PAYMENT_TYPES })
  paymentType: string;

  @Field(() => PAYMENT_STATUS)
  @Column({ type: "enum", enum: PAYMENT_STATUS })
  paymentStatus: string;

  @Field()
  @Column()
  customerName: string;

  @Field()
  @Column()
  address: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  comment?: string;

  @OneToMany(() => OrderDetailEntity, op => op.order, { cascade: true })
  detailConnection: Promise<OrderDetailEntity[]>;

  @Field(() => [OrderDetailEntity])
  async details(): Promise<OrderDetailEntity[]> {
    return OrderDetailEntity.find({ orderId: this.id });
  }

  @Field()
  @CreateDateColumn()
  createdAt: string;

  @Field()
  @UpdateDateColumn()
  updatedAt: string;
}
