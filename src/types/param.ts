export interface Param {
  PARAM_CODE: number
  PARAM_LIB: string | null
  PARAM_COMMENT: string | null
  PARAM_VALEUR: number | null
}

export interface ParamPaginatedData {
  content: Param[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first?: boolean
  last?: boolean
  numberOfElements?: number
  hasNext?: boolean
  hasPrevious?: boolean
}

export interface ParamCreateRequest {
  PARAM_CODE: number
  PARAM_LIB?: string
  PARAM_COMMENT?: string
  PARAM_VALEUR?: number
}

export interface ParamUpdateRequest {
  PARAM_LIB?: string
  PARAM_COMMENT?: string
  PARAM_VALEUR?: number
}

export interface ParamApiResponse {
  data: Param | Param[] | ParamPaginatedData | null
  message: string
  status: string
}