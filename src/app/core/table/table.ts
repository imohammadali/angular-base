import {BehaviorSubject, Observable} from "rxjs";

export interface ITable {
  columns: IColumn[];
  setting: ITableSetting;
  mapData?: Function;
}

export interface IFilter {
  type: 'text'|'dropdown'|'boolean'|'range_date';
  key: string;
  option?: {
    data?: any;
    optionLabel?: string;
    optionValue?: string;
  }
}

export interface IColumn {
  label: string;
  field: string;
  filter?: IFilter;
  sort?: boolean;
  sort_key?: string;
  renderer?: string;
  renderer_option?: any;
  with?: number;
  is_hidden?: boolean;
}

export interface ITableSetting {
  tableName: string;
  title?: string;
  pagination?: boolean;
  toggleColumns?: boolean;
  reOrderColumns?: boolean;
  actionButton?: IActionButton[],
  actionButtonMap?: Function;
  onClick?: Function;
  selection?: boolean;
  reorder?: boolean;
  globalFilter?: boolean;
  dataKeyRow?: string;
  clickableRow?: boolean;
}

export interface IPaginate {
  page?: number;
  first?: number;
  rows?: number;
  pageCount?: number;
}

export interface IActionButton {
  button: string;
  is_hidden?: boolean;
  disabled?: boolean;
}
