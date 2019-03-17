import { CategoryEntity } from "../entities";
import { CategoriesService } from "../services";
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
export class CategoryAddInput {
  @Field()
  title: string;

  @Field()
  url: string;

  @Field()
  description?: string;

  @Field({ nullable: true })
  seoTitle?: string;

  @Field({ nullable: true })
  seoDescription?: string;

  @Field(() => [String], { nullable: true })
  seoKeywords?: string[];
}

@InputType()
export class CategoryUpdateInput {
  @Field(() => ID)
  id: number;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  url?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  seoTitle?: string;

  @Field({ nullable: true })
  seoDescription?: string;

  @Field(() => [String], { nullable: true })
  seoKeywords?: string[];
}

@InputType()
export class CategoryWhereInput {
  @Field(() => ID, { nullable: true })
  id?: number;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  url?: string;
}

@InputType()
export class CategoriesWhereInput {
  @Field(() => [ID], { nullable: true })
  id?: number[];

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  url?: string;
}

@ObjectType()
class CategoriesPayload {
  @Field(() => [CategoryEntity])
  data: CategoryEntity[];

  @Field()
  count: number;
}

@Service()
@Resolver()
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

  // @Authorized()
  @Mutation(() => CategoryEntity)
  async createCategory(
    @Arg("data") data: CategoryAddInput
  ): Promise<CategoryEntity> {
    return this.categoriesService.create(data);
  }

  @Authorized()
  @Mutation(() => CategoryEntity)
  async updateCategory(
    @Arg("data") data: CategoryUpdateInput
  ): Promise<CategoryEntity> {
    return this.categoriesService.update(data);
  }

  @Query(() => CategoryEntity, { nullable: true })
  async category(
    @Arg("where") where: CategoryWhereInput
  ): Promise<CategoryEntity | null> {
    return this.categoriesService.findOne(where);
  }

  @Authorized()
  @Mutation(() => Boolean)
  async removeCategory(
    @Arg("where") where: CategoryWhereInput
  ): Promise<boolean> {
    const { affected } = await this.categoriesService.remove(where);

    return Boolean(affected);
  }

  @Query(() => CategoriesPayload)
  async searchCategories(
    @Arg("where", { nullable: true, defaultValue: {} })
    where: CategoriesWhereInput,
    @Arg("skip", { nullable: true, defaultValue: 0 }) skip: number,
    @Arg("take", { nullable: true, defaultValue: 20 }) take: number
  ): Promise<CategoriesPayload> {
    const [data, count] = await this.categoriesService.find({
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
