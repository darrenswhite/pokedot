import {SortableTableRow} from './SortableTable';

export enum Order {
  ASCENDING = 'asc',
  DESCENDING = 'desc',
}

export type RowComparator = (
  left: SortableTableRow,
  right: SortableTableRow
) => number;

const ascendingComparator = (
  left: SortableTableRow,
  right: SortableTableRow,
  orderBy: keyof SortableTableRow
): number => {
  let result;
  const leftValue = left[orderBy].sortValue;
  const rightValue = right[orderBy].sortValue;

  if (leftValue > rightValue) {
    result = 1;
  } else if (leftValue < rightValue) {
    result = -1;
  } else {
    result = 0;
  }

  return result;
};

export const getComparator = (
  order: Order,
  orderBy: keyof SortableTableRow
): RowComparator => {
  return order === Order.ASCENDING
    ? (left, right) => ascendingComparator(left, right, orderBy)
    : (left, right) => -ascendingComparator(left, right, orderBy);
};

export const sortRows = (
  rows: SortableTableRow[],
  order: Order,
  orderBy: keyof SortableTableRow
): SortableTableRow[] => {
  const comparator = getComparator(order, orderBy);
  const indexedRows: [SortableTableRow, number][] = rows.map((el, index) => [
    el,
    index,
  ]);

  indexedRows.sort((left, right) => {
    let result;
    const compare = comparator(left[0], right[0]);

    if (compare !== 0) {
      result = compare;
    } else {
      result = left[1] - right[1];
    }

    return result;
  });

  return indexedRows.map(el => el[0]);
};
