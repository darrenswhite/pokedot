import {flow, groupBy, identity, mapValues} from 'lodash/fp';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MatrixValue = Record<string, any>;

export type GroupedMatrixValue<
  T extends MatrixValue,
  K extends keyof T,
  R
> = Record<T[K], R>;

export class Matrix<T extends MatrixValue> {
  values: T[];

  constructor(values: T[] = []) {
    this.values = values;
  }

  transform(func: (values: T[]) => T[]): this {
    this.values = func(this.values);
    return this;
  }

  groupBy<K1 extends keyof T, K2 extends keyof T>(
    k1: K1,
    k2: K2
  ): GroupedMatrixValue<T, K1, GroupedMatrixValue<T, K2, T[]>>;

  groupBy<K1 extends keyof T>(k1: K1): GroupedMatrixValue<T, K1, T[]>;

  groupBy(...keys: (keyof T)[]): GroupedMatrixValue<T, keyof T, unknown> {
    return this.groupByRecursive(keys);
  }

  private groupByRecursive(
    keys: (keyof T)[],
    value: GroupedMatrixValue<T, keyof T, unknown> | T[] = this.values
  ): GroupedMatrixValue<T, keyof T, unknown> {
    const key = keys[0];
    let grouped;

    if (key) {
      const rest = keys.slice(1);

      grouped = flow(
        groupBy(key),
        mapValues(
          rest.length > 0
            ? values => this.groupByRecursive(rest, values)
            : identity
        )
      )(value) as GroupedMatrixValue<T, keyof T, unknown>;
    } else {
      grouped = value;
    }

    return grouped;
  }
}
