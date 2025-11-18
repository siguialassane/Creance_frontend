import { TypeRegularisation, TypeRegularisationApiResponse, TypeRegularisationCreateRequest, TypeRegularisationUpdateRequest } from "@/types/type-regularisation";
import { ApiClient } from "@/lib/api";

export class TypeRegularisationService {
  private static readonly BASE_URL = "/types/AC_TYPE_REGUL";

  static async getAll(apiClient: ApiClient): Promise<TypeRegularisationApiResponse> {
    const response = await apiClient.get<TypeRegularisationApiResponse>(this.BASE_URL);
    return response.data;
  }

  static async getByCode(apiClient: ApiClient, code: string): Promise<TypeRegularisation> {
    const response = await apiClient.get<TypeRegularisationApiResponse>(`${this.BASE_URL}/${code}`);
    if (!response.data.data || response.data.data.length === 0) {
      throw new Error("TypeRegularisation non trouvé");
    }
    return response.data.data[0];
  }

  static async create(apiClient: ApiClient, type: TypeRegularisationCreateRequest): Promise<TypeRegularisationApiResponse> {
    const response = await apiClient.post<TypeRegularisationApiResponse>(this.BASE_URL, type);
    return response.data;
  }

  static async update(apiClient: ApiClient, code: string, type: TypeRegularisationUpdateRequest): Promise<TypeRegularisationApiResponse> {
    const response = await apiClient.put<TypeRegularisationApiResponse>(`${this.BASE_URL}/${code}`, type);
    return response.data;
  }

  static async delete(apiClient: ApiClient, code: string): Promise<TypeRegularisationApiResponse> {
    const response = await apiClient.delete<TypeRegularisationApiResponse>(`${this.BASE_URL}/${code}`);
    return response.data;
  }

  static async search(apiClient: ApiClient, searchTerm: string): Promise<TypeRegularisationApiResponse> {
    const response = await apiClient.get<TypeRegularisationApiResponse>(`${this.BASE_URL}/search`, {
      params: { libelle: searchTerm }
    });
    return response.data;
  }
}
