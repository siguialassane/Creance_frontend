import { TypeEffet, TypeEffetApiResponse, TypeEffetCreateRequest, TypeEffetUpdateRequest } from "@/types/type-effet";
import { ApiClient } from "@/lib/api";

export class TypeEffetService {
  private static readonly BASE_URL = "/types/AC_TYPE_EFFET";

  static async getAll(apiClient: ApiClient): Promise<TypeEffetApiResponse> {
    const response = await apiClient.get<TypeEffetApiResponse>(this.BASE_URL);
    return response.data;
  }

  static async getByCode(apiClient: ApiClient, code: string): Promise<TypeEffet> {
    const response = await apiClient.get<TypeEffetApiResponse>(`${this.BASE_URL}/${code}`);
    if (!response.data.data || response.data.data.length === 0) {
      throw new Error("TypeEffet non trouvé");
    }
    return response.data.data[0];
  }

  static async create(apiClient: ApiClient, type: TypeEffetCreateRequest): Promise<TypeEffetApiResponse> {
    const response = await apiClient.post<TypeEffetApiResponse>(this.BASE_URL, type);
    return response.data;
  }

  static async update(apiClient: ApiClient, code: string, type: TypeEffetUpdateRequest): Promise<TypeEffetApiResponse> {
    const response = await apiClient.put<TypeEffetApiResponse>(`${this.BASE_URL}/${code}`, type);
    return response.data;
  }

  static async delete(apiClient: ApiClient, code: string): Promise<TypeEffetApiResponse> {
    const response = await apiClient.delete<TypeEffetApiResponse>(`${this.BASE_URL}/${code}`);
    return response.data;
  }

  static async search(apiClient: ApiClient, searchTerm: string): Promise<TypeEffetApiResponse> {
    const response = await apiClient.get<TypeEffetApiResponse>(`${this.BASE_URL}/search`, {
      params: { libelle: searchTerm }
    });
    return response.data;
  }
}
