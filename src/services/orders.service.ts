import { isNil } from "lodash";
import { OrderDetailEntity, OrderEntity, Product } from "../entities";
import {
  OderUpdateInput,
  OrderAddInput,
  OrderDetail,
  OrdersWhereInput,
  OrderWhereInput
} from "../resolvers/orders.resolver";
import { Service } from "typedi";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import uniqid from "uniqid";

@Service()
export class OrdersService {
  @InjectRepository(OrderEntity)
  private repository: Repository<OrderEntity>;

  find({
    number: orderNumber,
    deliveryType,
    deliveryStatus,
    paymentType,
    paymentStatus,
    phone,
    skip,
    take
  }: OrdersWhereInput & {
    skip?: number;
    take?: number;
  }) {
    const qb = this.repository.createQueryBuilder("order");

    if (orderNumber) {
      qb.andWhere("order.number = :number", { number: orderNumber });
    }

    if (phone) {
      qb.andWhere("order.phone = :phone", { phone });
    }

    if (deliveryType) {
      qb.andWhere("order.deliveryType = :deliveryType", { deliveryType });
    }

    if (deliveryStatus) {
      qb.andWhere("order.deliveryStatus = :deliveryStatus", { deliveryStatus });
    }

    if (paymentType) {
      qb.andWhere("order.paymentType = :paymentType", { paymentType });
    }

    if (paymentStatus) {
      qb.andWhere("order.paymentStatus = :paymentStatus", { paymentStatus });
    }

    qb.skip(skip);
    qb.take(take);

    return qb.getManyAndCount();
  }

  findOne(where: OrderWhereInput) {
    return this.repository.findOne(where);
  }

  async create({ details, ...dto }: OrderAddInput) {
    const { id } = await this.repository
      .create({
        ...dto,
        number: uniqid()
      })
      .save();

    if (!isNil(details)) {
      await this.addDetails(id, details);
    }

    return this.findOne({ id });
  }

  async update({ id, details, ...dto }: OderUpdateInput) {
    await this.repository.update({ id }, dto);

    if (!isNil(details)) {
      await this.addDetails(id, details);
    }

    return this.findOne({ id });
  }

  async addDetails(orderId: number, details: OrderDetail[]) {
    await OrderDetailEntity.delete({ orderId });

    return Promise.all(
      details.map(async d => {
        let staticPrice;

        if (isNil(d.variant)) {
          const product = await Product.findOne({ id: d.productId });

          staticPrice = product.price;
        } else {
          staticPrice = d.variant.price;
        }

        return OrderDetailEntity.create({ orderId, staticPrice, ...d }).save();
      })
    );
  }
}
