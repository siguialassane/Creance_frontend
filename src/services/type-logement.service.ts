import { TypeLogement, TypeLogementApiResponse, TypeLogementCreateRequest, TypeLogementUpdateRequest } from "@/types/type-logement";
import { ApiClient } from "@/lib/api";

export class TypeLogementService {
  private static readonly BASE_URL = "/types/AC_TYPE_LOGEMENT";

  static async getAll(apiClient: ApiClient): Promise<TypeLogementApiResponse> {
    const response = await apiClient.get<TypeLogementApiResponse>(this.BASE_URL);
    return response.data;
  }

  static async getByCode(apiClient: ApiClient, code: string): Promise<TypeLogement> {
    const response = await apiClient.get<TypeLogementApiResponse>(`${this.BASE_URL}/${code}`);
    if (!response.data.data || response.data.data.length === 0) {
      throw new Error("TypeLogement non trouvé");
    }
    return response.data.data[0];
  }

  static async create(apiClient: ApiClient, type: TypeLogementCreateRequest): Promise<TypeLogementApiResponse> {
    const response = await apiClient.post<TypeLogementApiResponse>(this.BASE_URL, type);
    return response.data;
  }

  static async update(apiClient: ApiClient, code: string, type: TypeLogementUpdateRequest): Promise<TypeLogementApiResponse> {
    const response = await apiClient.put<TypeLogementApiResponse>(`${this.BASE_URL}/${code}`, type);
    return response.data;
  }

  static async delete(apiClient: ApiClient, code: string): Promise<TypeLogementApiResponse> {
    const response = await apiClient.delete<TypeLogementApiResponse>(`${this.BASE_URL}/${code}`);
    return response.data;
  }

  static async search(apiClient: ApiClient, searchTerm: string): Promise<TypeLogementApiResponse> {
    const response = await apiClient.get<TypeLogementApiResponse>(`${this.BASE_URL}/search`, {
      params: { libelle: searchTerm }
    });
    return response.data;
  }
}
