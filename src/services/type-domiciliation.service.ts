import { TypeDomiciliation, TypeDomiciliationApiResponse, TypeDomiciliationCreateRequest, TypeDomiciliationUpdateRequest } from "@/types/type-domiciliation";
import { ApiClient } from "@/lib/api";

export class TypeDomiciliationService {
  private static readonly BASE_URL = "/types/AC_TYPE_DOMICIL";

  static async getAll(apiClient: ApiClient): Promise<TypeDomiciliationApiResponse> {
    const response = await apiClient.get<TypeDomiciliationApiResponse>(this.BASE_URL);
    return response.data;
  }

  static async getByCode(apiClient: ApiClient, code: string): Promise<TypeDomiciliation> {
    const response = await apiClient.get<TypeDomiciliationApiResponse>(`${this.BASE_URL}/${code}`);
    if (!response.data.data || response.data.data.length === 0) {
      throw new Error("TypeDomiciliation non trouvé");
    }
    return response.data.data[0];
  }

  static async create(apiClient: ApiClient, type: TypeDomiciliationCreateRequest): Promise<TypeDomiciliationApiResponse> {
    const response = await apiClient.post<TypeDomiciliationApiResponse>(this.BASE_URL, type);
    return response.data;
  }

  static async update(apiClient: ApiClient, code: string, type: TypeDomiciliationUpdateRequest): Promise<TypeDomiciliationApiResponse> {
    const response = await apiClient.put<TypeDomiciliationApiResponse>(`${this.BASE_URL}/${code}`, type);
    return response.data;
  }

  static async delete(apiClient: ApiClient, code: string): Promise<TypeDomiciliationApiResponse> {
    const response = await apiClient.delete<TypeDomiciliationApiResponse>(`${this.BASE_URL}/${code}`);
    return response.data;
  }

  static async search(apiClient: ApiClient, searchTerm: string): Promise<TypeDomiciliationApiResponse> {
    const response = await apiClient.get<TypeDomiciliationApiResponse>(`${this.BASE_URL}/search`, {
      params: { libelle: searchTerm }
    });
    return response.data;
  }
}
