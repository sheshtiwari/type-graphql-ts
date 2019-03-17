import {
  Connection,
  FindConditions,
  FindManyOptions,
  FindOneOptions,
  SelectQueryBuilder
} from "typeorm";
import { FindOptionsUtils } from "typeorm/find-options/FindOptionsUtils";

import { Service } from "typedi";
import { InjectConnection } from "typeorm-typedi-extensions";
import { ListQueryOptions, Type } from "./common-types";
import { parseSortParams } from "./parse-sort-params";
import { parseFilterParams } from "./parse-filter-params";

export type ExtendedListQueryOptions<T> = {
  relations?: string[];
  channelId?: string;
  where?: FindConditions<T>;
  orderBy?: FindOneOptions<T>["order"];
};

@Service()
export class ListQueryBuilder {
  constructor(@InjectConnection() private connection: Connection) {}

  /**
   * Creates and configures a SelectQueryBuilder for queries that return paginated lists of entities.
   */
  build<T>(
    entity: Type<T>,
    options: ListQueryOptions<T> = {},
    extendedOptions: ExtendedListQueryOptions<T> = {}
  ): SelectQueryBuilder<T> {
    const skip = options.skip;
    let take = options.take;
    if (options.skip !== undefined && options.take === undefined) {
      take = Number.MAX_SAFE_INTEGER;
    }
    const sort = parseSortParams(
      this.connection,
      entity,
      Object.assign({}, options.sort, extendedOptions.orderBy)
    );
    const filter = parseFilterParams(this.connection, entity, options.filter);

    const qb = this.connection.createQueryBuilder<T>(
      entity,
      entity.name.toLowerCase()
    );
    FindOptionsUtils.applyFindManyOptionsOrConditionsToQueryBuilder(qb, {
      relations: extendedOptions.relations,
      take,
      skip,
      where: extendedOptions.where || {}
    } as FindManyOptions<T>);
    // tslint:disable-next-line:no-non-null-assertion
    FindOptionsUtils.joinEagerRelations(
      qb,
      qb.alias,
      qb.expressionMap.mainAlias!.metadata
    );

    filter.forEach(({ clause, parameters }, index) => {
      if (index === 0) {
        qb.where(clause, parameters);
      } else {
        qb.andWhere(clause, parameters);
      }
    });
    console.log(qb);
    return qb.orderBy(sort);
  }
}
