import {ReactElement} from 'react';
import {PValue} from './PRow';

export interface PCol {
  field: string;
  headerName?: string;
  fixed?: boolean;
  hide?: boolean;
  mapValue?: (value: PValue) => PValue;
  renderCell?: (value: PValue) => ReactElement;
  renderHeader?: (field: string) => ReactElement;
}
