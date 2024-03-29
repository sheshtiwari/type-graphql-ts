import { Connection, OrderByCondition } from "typeorm";
import { ColumnMetadata } from "typeorm/metadata/ColumnMetadata";

import { Type, NullOptionals, SortParameter } from "./common-types";
import { unique } from "./unique";

/**
 * Parses the provided SortParameter array against the metadata of the given entity, ensuring that only
 * valid fields are being sorted against. The output assumes
 * @param connection
 * @param entity
 * @param sortParams
 */
export function parseSortParams<T>(
  connection: Connection,
  entity: Type<T>,
  sortParams?: NullOptionals<SortParameter<T>> | null
): OrderByCondition {
  if (!sortParams || Object.keys(sortParams).length === 0) {
    return {};
  }

  const metadata = connection.getMetadata(entity);
  const columns = metadata.columns;
  let translationColumns: ColumnMetadata[] = [];
  const relations = metadata.relations;

  const translationRelation = relations.find(
    r => r.propertyName === "translations"
  );
  if (translationRelation) {
    const translationMetadata = connection.getMetadata(
      translationRelation.type
    );
    translationColumns = columns.concat(
      translationMetadata.columns.filter(c => !c.relationMetadata)
    );
  }

  const output = {};
  const alias = metadata.name.toLowerCase();

  for (const [key, order] of Object.entries(sortParams)) {
    if (columns.find(c => c.propertyName === key)) {
      output[`${alias}.${key}`] = order;
    } else if (translationColumns.find(c => c.propertyName === key)) {
      output[`${alias}_translations.${key}`] = order;
    } else {
      throw new Error("Invalid User Input");
    }
  }
  return output;
}

function getValidSortFields(columns: ColumnMetadata[]): string {
  return unique(columns.map(c => c.propertyName)).join(", ");
}
