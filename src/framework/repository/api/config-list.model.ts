export interface ConfigList {
  queryList?: WhereConfig[];
  orderByConfigList?: OrderByConfig [];
}

export interface OrderByConfig {
  field: string;

  direction: string;
}

export interface WhereConfig {
  field: string | any;

  operation: string;

  value: string[] | string | boolean | any;
}
