import { TypeSaisie, TypeSaisieApiResponse, TypeSaisieCreateRequest, TypeSaisieUpdateRequest } from "@/types/type-saisie";
import { ApiClient } from "@/lib/api";

export class TypeSaisieService {
  private static readonly BASE_URL = "/types/AC_TYPE_SAISIE";

  static async getAll(apiClient: ApiClient): Promise<TypeSaisieApiResponse> {
    const response = await apiClient.get<TypeSaisieApiResponse>(this.BASE_URL);
    return response.data;
  }

  static async getByCode(apiClient: ApiClient, code: string): Promise<TypeSaisie> {
    const response = await apiClient.get<TypeSaisieApiResponse>(`${this.BASE_URL}/${code}`);
    if (!response.data.data || response.data.data.length === 0) {
      throw new Error("TypeSaisie non trouvé");
    }
    return response.data.data[0];
  }

  static async create(apiClient: ApiClient, type: TypeSaisieCreateRequest): Promise<TypeSaisieApiResponse> {
    const response = await apiClient.post<TypeSaisieApiResponse>(this.BASE_URL, type);
    return response.data;
  }

  static async update(apiClient: ApiClient, code: string, type: TypeSaisieUpdateRequest): Promise<TypeSaisieApiResponse> {
    const response = await apiClient.put<TypeSaisieApiResponse>(`${this.BASE_URL}/${code}`, type);
    return response.data;
  }

  static async delete(apiClient: ApiClient, code: string): Promise<TypeSaisieApiResponse> {
    const response = await apiClient.delete<TypeSaisieApiResponse>(`${this.BASE_URL}/${code}`);
    return response.data;
  }

  static async search(apiClient: ApiClient, searchTerm: string): Promise<TypeSaisieApiResponse> {
    const response = await apiClient.get<TypeSaisieApiResponse>(`${this.BASE_URL}/search`, {
      params: { libelle: searchTerm }
    });
    return response.data;
  }
}
