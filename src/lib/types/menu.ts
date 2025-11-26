import React from 'react';

export interface ParameterColumnType {
  label: string;
  key: string;
}

export interface SubMenuType {
  name: string;
  nameHeader?: string
  nameColumn?: string
  loader?: (e: any) => any
  dataProvider?: any
  columns?: ParameterColumnType[]
  headers?: ParameterColumnType[]
  handleDelete?: (data: any) => Promise<void>,
  handleEdit?: (data: any) => Promise<void>,
  create?: (data: any) => Promise<any>,
  additionalHeaderRender?: () => React.JSX.Element,
  render?: () => React.JSX.Element,
  subMenu?: SubMenuItem[];
}

export interface MenuItem {
  name: string
  id: number
  path?: string
  icon: string | { src: string }
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
  columns?: ParameterColumnType[]
  headers?: ParameterColumnType[]
  loader?: (params: any) => any[],
  render?: () => React.JSX.Element,
  path: string
  subMenus?: SubMenuItem[]
}
