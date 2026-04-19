import { Param, ParamCreateRequest, ParamUpdateRequest, ParamApiResponse } from "@/types/param"
import { ApiClient } from "@/lib/api"

export class ParamService {
  private static readonly BASE_URL = "/params"

  static async getAll(apiClient: ApiClient): Promise<ParamApiResponse> {
    const response = await apiClient.get<ParamApiResponse>(`${ParamService.BASE_URL}/all`)
    return response.data
  }

  static async getAllPaginated(apiClient: ApiClient, params: {
    page?: number
    size?: number
    search?: string
    sortBy?: string
    sortDirection?: string
  }): Promise<ParamApiResponse> {
    const response = await apiClient.get<ParamApiResponse>(ParamService.BASE_URL, {
      params: {
        page: params.page || 0,
        size: params.size || 50,
        ...(params.search && { search: params.search }),
        ...(params.sortBy && { sortBy: params.sortBy }),
        ...(params.sortDirection && { sortDirection: params.sortDirection }),
      },
    })
    return response.data
  }

  static async getByCode(apiClient: ApiClient, code: number): Promise<Param> {
    const response = await apiClient.get<ParamApiResponse>(`${ParamService.BASE_URL}/${code}`)
    if (!response.data.data || Array.isArray(response.data.data)) {
      throw new Error("Paramètre non trouvé")
    }
    return response.data.data as Param
  }

  static async create(apiClient: ApiClient, param: ParamCreateRequest): Promise<ParamApiResponse> {
    const response = await apiClient.post<ParamApiResponse>(ParamService.BASE_URL, param)
    return response.data
  }

  static async update(apiClient: ApiClient, code: number, param: ParamUpdateRequest): Promise<ParamApiResponse> {
    const response = await apiClient.put<ParamApiResponse>(`${ParamService.BASE_URL}/${code}`, param)
    return response.data
  }

  static async delete(apiClient: ApiClient, code: number): Promise<ParamApiResponse> {
    const response = await apiClient.delete<ParamApiResponse>(`${ParamService.BASE_URL}/${code}`)
    return response.data
  }

  static async search(apiClient: ApiClient, searchTerm: string): Promise<ParamApiResponse> {
    const response = await apiClient.get<ParamApiResponse>(`${ParamService.BASE_URL}/search`, {
      params: { libelle: searchTerm }
    })
    return response.data
  }
}