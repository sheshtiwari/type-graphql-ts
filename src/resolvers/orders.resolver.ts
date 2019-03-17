import {
  DELIVERY_STATUS,
  DELIVERY_TYPES,
  PAYMENT_STATUS,
  PAYMENT_TYPES
} from "../constants";
import { OrderEntity, ProductVariant } from "../entities";
import { OrdersService } from "../services/orders.service";
import {
  Arg,
  Authorized,
  Field,
  ID,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver
} from "type-graphql";
import { Service } from "typedi";

@InputType()
export class OrderDetail {
  @Field()
  productId: number;

  @Field()
  quantity: number;

  @Field(() => ProductVariant, { nullable: true })
  variant?: ProductVariant;
}

@InputType()
export class OrderAddInput {
  @Field(() => DELIVERY_TYPES)
  deliveryType: string;

  @Field(() => DELIVERY_STATUS)
  deliveryStatus: string;

  @Field(() => PAYMENT_TYPES)
  paymentType: string;

  @Field(() => PAYMENT_STATUS)
  paymentStatus: string;

  @Field()
  customerName: string;

  @Field()
  address: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  comment?: string;

  @Field(() => [OrderDetail], { nullable: true })
  details?: OrderDetail[];
}

@InputType()
export class OderUpdateInput {
  @Field(() => ID)
  id: number;

  @Field(() => DELIVERY_TYPES, { nullable: true })
  deliveryType?: string;

  @Field(() => DELIVERY_STATUS, { nullable: true })
  deliveryStatus?: string;

  @Field(() => PAYMENT_TYPES, { nullable: true })
  paymentType?: string;

  @Field(() => PAYMENT_STATUS, { nullable: true })
  paymentStatus?: string;

  @Field({ nullable: true })
  customerName?: string;

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  comment?: string;

  @Field(() => [OrderDetail], { nullable: true })
  details?: OrderDetail[];
}

@InputType()
export class OrderWhereInput {
  @Field(() => ID, { nullable: true })
  id?: number;

  @Field({ nullable: true })
  number?: string;
}

@InputType()
export class OrdersWhereInput {
  @Field({ nullable: true })
  deliveryType?: string;

  @Field({ nullable: true })
  paymentType?: string;

  @Field({ nullable: true })
  deliveryStatus?: string;

  @Field({ nullable: true })
  paymentStatus?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  number?: number;
}

@ObjectType()
class OrdersPayload {
  @Field(() => [OrderEntity])
  data: OrderEntity[];

  @Field()
  count: number;
}

@Service()
@Resolver()
export class OrdersResolver {
  constructor(private readonly ordersService: OrdersService) {}

  @Mutation(() => OrderEntity)
  async createOrder(@Arg("data") data: OrderAddInput): Promise<OrderEntity> {
    return this.ordersService.create(data);
  }

  @Authorized()
  @Mutation(() => OrderEntity)
  async updateOrder(@Arg("data") data: OderUpdateInput): Promise<OrderEntity> {
    return this.ordersService.update(data);
  }

  @Query(() => OrderEntity, { nullable: true })
  async order(
    @Arg("where") where: OrderWhereInput
  ): Promise<OrderEntity | null> {
    return this.ordersService.findOne(where);
  }

  @Query(() => OrdersPayload)
  async searchProducts(
    @Arg("where", { nullable: true, defaultValue: {} })
    where: OrdersWhereInput,
    @Arg("skip", { nullable: true, defaultValue: 0 }) skip: number,
    @Arg("take", { nullable: true, defaultValue: 20 }) take: number
  ): Promise<OrdersPayload> {
    const [data, count] = await this.ordersService.find({
      ...where,
      skip,
      take
    });

    return {
      data,
      count
    };
  }
}
