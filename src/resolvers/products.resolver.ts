import { Product, ProductVariant } from "../entities";
import { Image, Relation } from "../graphql-types";
import { ProductsService } from "../services";
import {
  Arg,
  Authorized,
  Field,
  ID,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  InterfaceType,
  Int
} from "type-graphql";
import { Service } from "typedi";
import PaginatedResponse from "src/types/Paginated-Response";

@InputType()
export class ProductAddInput {
  @Field()
  title: string;

  @Field()
  url: string;

  @Field()
  price: string;

  @Field(() => Image, { nullable: true })
  logo?: object;

  @Field(() => [Image], { nullable: true })
  gallery?: object[];

  @Field(() => [ProductVariant], { nullable: true })
  variants?: object[];

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  seoTitle?: string;

  @Field({ nullable: true })
  seoDescription?: string;

  @Field(() => [String], { nullable: true })
  seoKeywords?: string[];

  @Field(() => [Relation], { nullable: true })
  categories?: Relation[];
}

@InputType()
export class ProductUpdateInput {
  @Field(() => ID)
  id: number;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  url?: string;

  @Field({ nullable: true })
  price?: string;

  @Field(() => Image, { nullable: true })
  logo?: object;

  @Field(() => [Image], { nullable: true })
  gallery?: object[];

  @Field(() => [ProductVariant], { nullable: true })
  variants?: object[];

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  seoTitle?: string;

  @Field({ nullable: true })
  seoDescription?: string;

  @Field(() => [String], { nullable: true })
  seoKeywords?: string[];

  @Field(() => [Relation], { nullable: true })
  categories?: Relation[];
}

@InputType()
export class ProductWhereInput {
  @Field(() => ID, { nullable: true })
  id?: number;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  url?: string;
}

@InputType()
export class ProductsWhereInput {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  url?: string;

  @Field(() => String, { nullable: true })
  categoryId: string;
}

@ObjectType()
class ProductsPayload {
  @Field(() => [Product])
  data: Product[];

  @Field()
  count: number;
}

@ObjectType()
export class ProductResponse extends PaginatedResponse(Product) {
  constructor(productResponse: ProductResponse) {
    super();
    Object.assign(this, productResponse);
  }
}

@InputType()
export class PaginationOption {
  @Field(() => Int)
  skip?: number;

  @Field(() => Int)
  take?: number;
}

@Service()
@Resolver()
export class ProductResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Query(() => [Product], { nullable: true })
  async products(
    @Arg("input") input: PaginationOption
  ): Promise<ProductResponse> {
    return this.productsService.findAll(input);
  }

  // @Authorized()
  @Mutation(() => Product)
  async createProduct(@Arg("data") data: ProductAddInput): Promise<Product> {
    return this.productsService.create(data);
  }

  @Authorized()
  @Mutation(() => Product)
  async updateProduct(@Arg("data") data: ProductUpdateInput): Promise<Product> {
    return this.productsService.update(data);
  }

  @Query(() => Product, { nullable: true })
  async product(
    @Arg("where") where: ProductWhereInput
  ): Promise<Product | null> {
    return this.productsService.findOne(where);
  }

  @Authorized()
  @Mutation(() => Boolean)
  async removeProduct(
    @Arg("where") where: ProductWhereInput
  ): Promise<boolean> {
    const { affected } = await this.productsService.remove(where);

    return Boolean(affected);
  }

  @Query(() => ProductsPayload)
  async searchProducts(
    @Arg("where", { nullable: true, defaultValue: {} })
    where: ProductsWhereInput,
    @Arg("skip", { nullable: true, defaultValue: 0 }) skip: number,
    @Arg("take", { nullable: true, defaultValue: 20 }) take: number
  ): Promise<ProductsPayload> {
    const [data, count] = await this.productsService.find({
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
