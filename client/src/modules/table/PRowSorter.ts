import {orderBy} from 'lodash/fp';

import {PRow} from './model/PRow';
import {PSortItem} from './model/PSort';

export const sortRows = (
  rows: PRow[],
  sortItem: PSortItem | undefined
): PRow[] => {
  let sorted;

  if (!sortItem?.sort) {
    sorted = rows;
  } else {
    sorted = orderBy<PRow>([sortItem.field], [sortItem.sort])(rows);
  }

  return sorted;
};
