/* tslint:disable:no-console */
import * as faker from "faker";
import { random, times } from "lodash";
import { CategoriesService, ProductsService, UsersService } from "src/services";
import { Container } from "typedi";
import { createConnection, useContainer as useTypeOrmContainer } from "typeorm";

useTypeOrmContainer(Container);

async function createUser() {
  const connection = await createConnection();
  try {
    const userService = Container.get(UsersService);

    await userService.create({ login: "user", password: "user" });
    const users = await Promise.all(
      times(50, () => ({
        login: `${faker.lorem
          .words(random(1, 7))
          .split(" ")
          .join("_")}_${random(1, 1000)}`,
        password: faker.internet.password()
      })).map(u => userService.create(u))
    );

    const categoriesService = Container.get(CategoriesService);
    const categories = await Promise.all(
      times(50, () => ({
        title: faker.lorem.words(random(1, 5)),
        url: `${faker.lorem.slug(random(1, 3))}-${faker.lorem.slug(
          random(1, 3)
        )}`
      })).map(c => categoriesService.create(c))
    );

    const productsService = Container.get(ProductsService);
    const products = await Promise.all(
      times(50, () => ({
        title: `${faker.lorem.words(random(1, 5))} ${faker.lorem.words(
          random(1, 5)
        )}`,
        url: `${faker.lorem.slug(random(1, 3))}-${faker.lorem.slug(
          random(1, 3)
        )}`,
        price: faker.commerce.price(),
        description: faker.lorem.paragraphs(3),
        variants: times(3, () => ({
          description: faker.lorem.paragraph(),
          price: faker.commerce.price(),
          count: faker.random.number()
        })),
        categories: categories.slice(
          random(random(0, categories.length - 1), categories.length - 1)
        )
      })).map(c => productsService.create(c))
    );

    console.log("Test data created");
  } catch (e) {
    throw e;
  } finally {
    await connection.close();
  }
}

// tslint:disable-next-line
createUser();
