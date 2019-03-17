import { isEmpty, isNil } from "lodash";
import { Product } from "../entities";
import { CategoryProduct } from "../entities/category-product.entity";
import {
  ProductAddInput,
  ProductsWhereInput,
  ProductUpdateInput,
  ProductWhereInput,
  PaginationOption,
  ProductResponse
} from "../resolvers/products.resolver";
import { Service, Inject } from "typedi";
import { Repository, Connection } from "typeorm";
import { InjectRepository, InjectConnection } from "typeorm-typedi-extensions";
import { ListQueryBuilder } from "../Utils/list-query-builder";

@Service()
export class ProductsService {
  @InjectRepository(Product)
  private repository: Repository<Product>;

  @Inject()
  private listQueryBuilder: ListQueryBuilder;

  @InjectConnection()
  private connection: Connection;

  find({
    title,
    url,
    categoryId,
    skip,
    take
  }: ProductsWhereInput & {
    skip?: number;
    take?: number;
  }) {
    const qb = this.repository.createQueryBuilder("product");

    if (categoryId) {
      qb.innerJoin(
        "product.categoryConnection",
        "categoryConnection",
        "categoryConnection.categoryId = :categoryId",
        { categoryId }
      );
    }

    if (title) {
      qb.andWhere("product.title ILIKE :title", { title: `${title}%` });
    }

    if (url) {
      qb.andWhere("product.url ILIKE :url", { url: `${url}%` });
    }

    qb.skip(skip);
    qb.take(take);

    return qb.getManyAndCount();
  }

  findOne(where: ProductWhereInput) {
    return this.repository.findOne(where);
  }

  findAll(options?: PaginationOption): Promise<ProductResponse> {
    try {
      const res = this.listQueryBuilder
        .build(Product, options, {})
        .getManyAndCount()
        .then(([items, total]) => ({
          items,
          total
        }));
      return res;
    } catch (err) {
      console.log(err);
    }
    return undefined;
  }

  async create({ categories, ...dto }: ProductAddInput) {
    const { id } = await this.repository.create(dto).save();

    if (!isNil(categories) && !isEmpty(categories)) {
      await this.addCategories(id, categories.map(c => c.id));
    }

    return this.findOne({ id });
  }

  async update({ id, categories, ...dto }: ProductUpdateInput) {
    await this.repository.update({ id }, dto);

    if (!isNil(categories) && !isEmpty(categories)) {
      await this.addCategories(id, categories.map(c => c.id));
    }

    return this.findOne({ id });
  }

  remove(where: ProductWhereInput) {
    return this.repository.delete(where);
  }

  async addCategories(productId: number, categoriesIds: number[]) {
    await CategoryProduct.delete({ productId });

    return Promise.all(
      categoriesIds.map(categoryId =>
        CategoryProduct.create({ productId, categoryId }).save()
      )
    );
  }
}
