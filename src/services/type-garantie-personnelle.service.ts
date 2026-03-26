import { TypeGarantiePersonnelle, TypeGarantiePersonnelleApiResponse, TypeGarantiePersonnelleCreateRequest, TypeGarantiePersonnelleUpdateRequest } from "@/types/type-garantie-personnelle";
import { ApiClient } from "@/lib/api";

export class TypeGarantiePersonnelleService {
  private static readonly BASE_URL = "/types/AC_TYPGAR_PHYS";

  static async getAll(apiClient: ApiClient): Promise<TypeGarantiePersonnelleApiResponse> {
    const response = await apiClient.get<TypeGarantiePersonnelleApiResponse>(TypeGarantiePersonnelleService.BASE_URL);
    return response.data;
  }

  static async getByCode(apiClient: ApiClient, code: string): Promise<TypeGarantiePersonnelle> {
    const response = await apiClient.get<TypeGarantiePersonnelleApiResponse>(`${TypeGarantiePersonnelleService.BASE_URL}/${code}`);
    if (!response.data.data || response.data.data.length === 0) {
      throw new Error("TypeGarantiePersonnelle non trouvé");
    }
    return response.data.data[0];
  }

  static async create(apiClient: ApiClient, type: TypeGarantiePersonnelleCreateRequest): Promise<TypeGarantiePersonnelleApiResponse> {
    const response = await apiClient.post<TypeGarantiePersonnelleApiResponse>(TypeGarantiePersonnelleService.BASE_URL, type);
    return response.data;
  }

  static async update(apiClient: ApiClient, code: string, type: TypeGarantiePersonnelleUpdateRequest): Promise<TypeGarantiePersonnelleApiResponse> {
    const response = await apiClient.put<TypeGarantiePersonnelleApiResponse>(`${TypeGarantiePersonnelleService.BASE_URL}/${code}`, type);
    return response.data;
  }

  static async delete(apiClient: ApiClient, code: string): Promise<TypeGarantiePersonnelleApiResponse> {
    const response = await apiClient.delete<TypeGarantiePersonnelleApiResponse>(`${TypeGarantiePersonnelleService.BASE_URL}/${code}`);
    return response.data;
  }

  static async search(apiClient: ApiClient, searchTerm: string): Promise<TypeGarantiePersonnelleApiResponse> {
    const response = await apiClient.get<TypeGarantiePersonnelleApiResponse>(`${TypeGarantiePersonnelleService.BASE_URL}/search`, {
      params: { libelle: searchTerm }
    });
    return response.data;
  }
}
