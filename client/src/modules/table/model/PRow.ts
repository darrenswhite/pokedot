export type PValue =
  | string
  | number
  | boolean
  | Date
  | null
  | undefined
  | object;

export type PRowId = string | number;

export type PRow = {
  id: PRowId;
  [key: string]: PValue;
};
