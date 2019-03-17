import { Field, InputType, ObjectType, registerEnumType } from "type-graphql";
import {
  DELIVERY_STATUS,
  DELIVERY_TYPES,
  PAYMENT_STATUS,
  PAYMENT_TYPES
} from "./constants";

@InputType("ImageInputType")
@ObjectType()
export class Image {
  @Field({ nullable: true })
  uuid?: string;

  @Field({ nullable: true })
  name?: string;

  @Field()
  url: string;
}

@InputType()
export class Relation {
  @Field()
  id: number;
}

registerEnumType(DELIVERY_STATUS, {
  name: "DeliveryStatus",
  description: "Order delivery status"
});
registerEnumType(DELIVERY_TYPES, {
  name: "DeliveryTypes",
  description: "Order delivery types"
});

registerEnumType(PAYMENT_STATUS, {
  name: "PaymentStatus",
  description: "Order payment status"
});
registerEnumType(PAYMENT_TYPES, {
  name: "PaymentTypes",
  description: "Order payment types"
});
