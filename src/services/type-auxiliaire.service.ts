import { TypeAuxiliaire, TypeAuxiliaireApiResponse, TypeAuxiliaireCreateRequest, TypeAuxiliaireUpdateRequest } from "@/types/type-auxiliaire";
import { ApiClient } from "@/lib/api";

export class TypeAuxiliaireService {
  private static readonly BASE_URL = "/types/AC_TYPE_AUXIL";

  static async getAll(apiClient: ApiClient): Promise<TypeAuxiliaireApiResponse> {
    const response = await apiClient.get<TypeAuxiliaireApiResponse>(this.BASE_URL);
    return response.data;
  }

  static async getByCode(apiClient: ApiClient, code: string): Promise<TypeAuxiliaire> {
    const response = await apiClient.get<TypeAuxiliaireApiResponse>(`${this.BASE_URL}/${code}`);
    if (!response.data.data || response.data.data.length === 0) {
      throw new Error("Type d'auxiliaire non trouvé");
    }
    return response.data.data[0];
  }

  static async create(apiClient: ApiClient, type: TypeAuxiliaireCreateRequest): Promise<TypeAuxiliaireApiResponse> {
    const response = await apiClient.post<TypeAuxiliaireApiResponse>(this.BASE_URL, type);
    return response.data;
  }

  static async update(apiClient: ApiClient, code: string, type: TypeAuxiliaireUpdateRequest): Promise<TypeAuxiliaireApiResponse> {
    const response = await apiClient.put<TypeAuxiliaireApiResponse>(`${this.BASE_URL}/${code}`, type);
    return response.data;
  }

  static async delete(apiClient: ApiClient, code: string): Promise<TypeAuxiliaireApiResponse> {
    const response = await apiClient.delete<TypeAuxiliaireApiResponse>(`${this.BASE_URL}/${code}`);
    return response.data;
  }

  static async search(apiClient: ApiClient, searchTerm: string): Promise<TypeAuxiliaireApiResponse> {
    const response = await apiClient.get<TypeAuxiliaireApiResponse>(`${this.BASE_URL}/search`, {
      params: { libelle: searchTerm }
    });
    return response.data;
  }
}
