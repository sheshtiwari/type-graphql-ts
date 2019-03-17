import { CategoryEntity } from "../entities";
import { CategoryProduct } from "../entities/category-product.entity";
import {
  CategoriesWhereInput,
  CategoryAddInput,
  CategoryUpdateInput,
  CategoryWhereInput
} from "../resolvers/categories.resolver";
import { Service } from "typedi";
import { Repository, EntityRepository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";

@Service()
export class CategoriesService {
  @InjectRepository(CategoryEntity)
  private repository: Repository<CategoryEntity>;

  @InjectRepository(CategoryProduct)
  private relationRepository: Repository<CategoryProduct>;

  find({
    title,
    url,
    skip,
    take
  }: CategoriesWhereInput & {
    skip?: number;
    take?: number;
  }) {
    const qb = this.repository.createQueryBuilder("category");

    if (title) {
      qb.andWhere("category.title ILIKE :title", { title: `${title}%` });
    }

    if (url) {
      qb.andWhere("category.url ILIKE :url", { url: `${url}%` });
    }

    qb.skip(skip);
    qb.take(take);

    return qb.getManyAndCount();
  }

  findOne(where: CategoryWhereInput) {
    return this.repository.findOne(where);
  }

  async create(dto: CategoryAddInput) {
    const { id } = await this.repository.create(dto).save();

    return this.findOne({ id });
  }

  async update({ id, ...dto }: CategoryUpdateInput) {
    await this.repository.update({ id }, dto);

    return this.findOne({ id });
  }

  async remove(where: CategoryWhereInput) {
    return this.repository.delete(where);
  }
}
