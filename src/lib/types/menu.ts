import React from 'react';

type MenuLoaderParams = Record<string, unknown>;
type MenuActionPayload = unknown;
type MenuDataProvider = unknown;

export interface ParameterColumnType {
  label: string;
  key: string;
  sortable?: boolean;
}

export interface SubMenuType {
  name: string;
  nameHeader?: string
  nameColumn?: string
  loader?: (params: MenuLoaderParams) => unknown
  dataProvider?: MenuDataProvider
  columns?: ParameterColumnType[]
  headers?: ParameterColumnType[]
  handleDelete?: (data: MenuActionPayload) => Promise<void>,
  handleEdit?: (data: MenuActionPayload) => Promise<void>,
  create?: (data: MenuActionPayload) => Promise<unknown>,
  additionalHeaderRender?: () => React.JSX.Element,
  render?: () => React.JSX.Element,
  subMenu?: SubMenuItem[];
}

export interface MenuItem {
  name: string
  id: number
  path?: string
  icon?: string | { src: string }
  subMenus?: SubMenuItem[]
  render?: () => React.JSX.Element,
}

export interface SubMenuItem {
  name: string
  nameHeader?: string
  nameColumn?: string
  subMenuType?: SubMenuType
  id: number
  viewName?: 'parameter' | undefined
  customPath?: boolean
  columns?: ParameterColumnType[]
  headers?: ParameterColumnType[]
  loader?: (params: MenuLoaderParams) => unknown[],
  render?: () => React.JSX.Element,
  path: string
  subMenus?: SubMenuItem[]
}
