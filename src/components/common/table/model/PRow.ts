export type PValue =
  | string
  | number
  | boolean
  | Date
  | null
  | undefined
  // eslint-disable-next-line @typescript-eslint/ban-types
  | object;
export type PRowId = string | number;

export type PRow = {
  id: PRowId;
  [key: string]: PValue;
};
