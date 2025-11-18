import { TypeGarantieReelle, TypeGarantieReelleApiResponse, TypeGarantieReelleCreateRequest, TypeGarantieReelleUpdateRequest } from "@/types/type-garantie-reelle";
import { ApiClient } from "@/lib/api";

export class TypeGarantieReelleService {
  private static readonly BASE_URL = "/types/AC_TYPGAR_REELLE";

  static async getAll(apiClient: ApiClient): Promise<TypeGarantieReelleApiResponse> {
    const response = await apiClient.get<TypeGarantieReelleApiResponse>(this.BASE_URL);
    return response.data;
  }

  static async getByCode(apiClient: ApiClient, code: string): Promise<TypeGarantieReelle> {
    const response = await apiClient.get<TypeGarantieReelleApiResponse>(`${this.BASE_URL}/${code}`);
    if (!response.data.data || response.data.data.length === 0) {
      throw new Error("TypeGarantieReelle non trouvé");
    }
    return response.data.data[0];
  }

  static async create(apiClient: ApiClient, type: TypeGarantieReelleCreateRequest): Promise<TypeGarantieReelleApiResponse> {
    const response = await apiClient.post<TypeGarantieReelleApiResponse>(this.BASE_URL, type);
    return response.data;
  }

  static async update(apiClient: ApiClient, code: string, type: TypeGarantieReelleUpdateRequest): Promise<TypeGarantieReelleApiResponse> {
    const response = await apiClient.put<TypeGarantieReelleApiResponse>(`${this.BASE_URL}/${code}`, type);
    return response.data;
  }

  static async delete(apiClient: ApiClient, code: string): Promise<TypeGarantieReelleApiResponse> {
    const response = await apiClient.delete<TypeGarantieReelleApiResponse>(`${this.BASE_URL}/${code}`);
    return response.data;
  }

  static async search(apiClient: ApiClient, searchTerm: string): Promise<TypeGarantieReelleApiResponse> {
    const response = await apiClient.get<TypeGarantieReelleApiResponse>(`${this.BASE_URL}/search`, {
      params: { libelle: searchTerm }
    });
    return response.data;
  }
}
