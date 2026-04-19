import { Operation, OperationApiResponse, OperationCreateRequest, OperationUpdateRequest } from "@/types/operation";

export class OperationService {
  private static readonly BASE_URL = "/operations";

  static async getAll(apiClient: any): Promise<OperationApiResponse> {
    const response = await apiClient.get<OperationApiResponse>(OperationService.BASE_URL);
    return response.data;
  }

  static async getAllPaginated(apiClient: any, params: {
    page?: number;
    size?: number;
    search?: string;
    sortBy?: string;
    sortDirection?: string;
  }): Promise<OperationApiResponse> {
    const response = await apiClient.get<OperationApiResponse>(OperationService.BASE_URL, {
      params: {
        page: params.page || 0,
        size: params.size || 50,
        ...(params.search && { search: params.search }),
        ...(params.sortBy && { sortBy: params.sortBy }),
        ...(params.sortDirection && { sortDirection: params.sortDirection }),
      },
    });
    return response.data;
  }

  static async getByCode(apiClient: any, code: string): Promise<Operation> {
    const response = await apiClient.get<OperationApiResponse>(`${OperationService.BASE_URL}/${code}`);
    if (!response.data.data) {
      throw new Error("Opération non trouvée");
    }
    return response.data.data;
  }

  static async create(apiClient: any, operation: OperationCreateRequest): Promise<OperationApiResponse> {
    const response = await apiClient.post<OperationApiResponse>(OperationService.BASE_URL, operation);
    return response.data;
  }

  static async update(apiClient: any, code: string, operation: OperationUpdateRequest): Promise<OperationApiResponse> {
    const response = await apiClient.put<OperationApiResponse>(`${OperationService.BASE_URL}/${code}`, operation);
    return response.data;
  }

  static async delete(apiClient: any, code: string): Promise<OperationApiResponse> {
    const response = await apiClient.delete<OperationApiResponse>(`${OperationService.BASE_URL}/${code}`);
    return response.data;
  }

  static async search(apiClient: any, searchTerm: string): Promise<OperationApiResponse> {
    const response = await apiClient.get<OperationApiResponse>(`${OperationService.BASE_URL}/search`, {
      params: { libelle: searchTerm }
    });
    return response.data;
  }
}

