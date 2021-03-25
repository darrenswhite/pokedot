import {PRow} from './PRow';

export type PSortDirection = 'asc' | 'desc' | undefined;

export interface PSortItem {
  field: keyof PRow;
  sort: PSortDirection;
}
