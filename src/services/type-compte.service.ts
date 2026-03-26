import { TypeCompte, TypeCompteApiResponse, TypeCompteCreateRequest, TypeCompteUpdateRequest } from "@/types/type-compte";
import { ApiClient } from "@/lib/api";

export class TypeCompteService {
  private static readonly BASE_URL = "/types/AC_TYPE_CPT";

  static async getAll(apiClient: ApiClient): Promise<TypeCompteApiResponse> {
    const response = await apiClient.get<TypeCompteApiResponse>(TypeCompteService.BASE_URL);
    return response.data;
  }

  static async getByCode(apiClient: ApiClient, code: string): Promise<TypeCompte> {
    const response = await apiClient.get<TypeCompteApiResponse>(`${TypeCompteService.BASE_URL}/${code}`);
    if (!response.data.data || response.data.data.length === 0) {
      throw new Error("TypeCompte non trouvé");
    }
    return response.data.data[0];
  }

  static async create(apiClient: ApiClient, type: TypeCompteCreateRequest): Promise<TypeCompteApiResponse> {
    const response = await apiClient.post<TypeCompteApiResponse>(TypeCompteService.BASE_URL, type);
    return response.data;
  }

  static async update(apiClient: ApiClient, code: string, type: TypeCompteUpdateRequest): Promise<TypeCompteApiResponse> {
    const response = await apiClient.put<TypeCompteApiResponse>(`${TypeCompteService.BASE_URL}/${code}`, type);
    return response.data;
  }

  static async delete(apiClient: ApiClient, code: string): Promise<TypeCompteApiResponse> {
    const response = await apiClient.delete<TypeCompteApiResponse>(`${TypeCompteService.BASE_URL}/${code}`);
    return response.data;
  }

  static async search(apiClient: ApiClient, searchTerm: string): Promise<TypeCompteApiResponse> {
    const response = await apiClient.get<TypeCompteApiResponse>(`${TypeCompteService.BASE_URL}/search`, {
      params: { libelle: searchTerm }
    });
    return response.data;
  }
}
