import { TypeEcheancier, TypeEcheancierApiResponse, TypeEcheancierCreateRequest, TypeEcheancierUpdateRequest } from "@/types/type-echeancier";
import { ApiClient } from "@/lib/api";

export class TypeEcheancierService {
  private static readonly BASE_URL = "/types/AC_TYPE_ECHEANCIER";

  static async getAll(apiClient: ApiClient): Promise<TypeEcheancierApiResponse> {
    const response = await apiClient.get<TypeEcheancierApiResponse>(TypeEcheancierService.BASE_URL);
    return response.data;
  }

  static async getByCode(apiClient: ApiClient, code: string): Promise<TypeEcheancier> {
    const response = await apiClient.get<TypeEcheancierApiResponse>(`${TypeEcheancierService.BASE_URL}/${code}`);
    if (!response.data.data) {
      throw new Error("TypeEcheancier non trouvé");
    }
    return response.data.data as unknown as TypeEcheancier;
  }

  static async create(apiClient: ApiClient, type: TypeEcheancierCreateRequest): Promise<TypeEcheancierApiResponse> {
    const response = await apiClient.post<TypeEcheancierApiResponse>(TypeEcheancierService.BASE_URL, type);
    return response.data;
  }

  static async update(apiClient: ApiClient, code: string, type: TypeEcheancierUpdateRequest): Promise<TypeEcheancierApiResponse> {
    const response = await apiClient.put<TypeEcheancierApiResponse>(`${TypeEcheancierService.BASE_URL}/${code}`, type);
    return response.data;
  }

  static async delete(apiClient: ApiClient, code: string): Promise<TypeEcheancierApiResponse> {
    const response = await apiClient.delete<TypeEcheancierApiResponse>(`${TypeEcheancierService.BASE_URL}/${code}`);
    return response.data;
  }

  static async search(apiClient: ApiClient, searchTerm: string): Promise<TypeEcheancierApiResponse> {
    const response = await apiClient.get<TypeEcheancierApiResponse>(`${TypeEcheancierService.BASE_URL}/search`, {
      params: { libelle: searchTerm }
    });
    return response.data;
  }
}
