export type ReadOnlyRequired<T> = { +readonly [K in keyof T]-?: T[K] };

export type Mutable<T> = { -readonly [K in keyof T]: T[K] };

export type UnwrappedArray<T extends any[]> = T[number];

export interface Type<T> extends Function {
  new (...args: any[]): T;
}

/**
 * Parameters for list queries
 */
export interface ListQueryOptions<T> {
  take?: number | null;
  skip?: number | null;
  sort?: NullOptionals<SortParameter<T>> | null;
  filter?: NullOptionals<FilterParameter<T>> | null;
}

export type NullOptionals<T> = {
  [K in keyof T]: undefined extends T[K]
    ? NullOptionals<T[K]> | null
    : NullOptionals<T[K]>
};

export type SortOrder = "ASC" | "DESC";

// prettier-ignore
export type PrimitiveFields<T> = {
    [K in keyof T]: T[K] extends number | string | boolean | Date ? K : never
}[keyof T];

// prettier-ignore
export type SortParameter<T> = {
    [K in PrimitiveFields<T>]?: SortOrder
};

// prettier-ignore
export type CustomFieldSortParameter = {
    [customField: string]: SortOrder;
};

// prettier-ignore
export type FilterParameter<T> = {
    [K in PrimitiveFields<T>]?: T[K] extends string ? StringOperators
        : T[K] extends number ? NumberOperators
            : T[K] extends boolean ? BooleanOperators
                : T[K] extends Date ? DateOperators : StringOperators;
};

export interface StringOperators {
  eq?: string;
  contains?: string;
}

export interface BooleanOperators {
  eq?: boolean;
}

export interface NumberRange {
  start: number;
  end: number;
}

export interface NumberOperators {
  eq?: number;
  lt?: number;
  lte?: number;
  gt?: number;
  gte?: number;
  between?: NumberRange;
}

export interface DateRange {
  start: string;
  end: string;
}

export interface DateOperators {
  eq?: string;
  before?: string;
  after?: string;
  between?: DateRange;
}
