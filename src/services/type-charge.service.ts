import { TypeCharge, TypeChargeApiResponse, TypeChargeCreateRequest, TypeChargeUpdateRequest } from "@/types/type-charge";
import { ApiClient } from "@/lib/api";

export class TypeChargeService {
  private static readonly BASE_URL = "/types/AC_TYPE_CHARGE";

  static async getAll(apiClient: ApiClient): Promise<TypeChargeApiResponse> {
    const response = await apiClient.get<TypeChargeApiResponse>(this.BASE_URL);
    return response.data;
  }

  static async getByCode(apiClient: ApiClient, code: string): Promise<TypeCharge> {
    const response = await apiClient.get<TypeChargeApiResponse>(`${this.BASE_URL}/${code}`);
    if (!response.data.data || response.data.data.length === 0) {
      throw new Error("TypeCharge non trouvé");
    }
    return response.data.data[0];
  }

  static async create(apiClient: ApiClient, type: TypeChargeCreateRequest): Promise<TypeChargeApiResponse> {
    const response = await apiClient.post<TypeChargeApiResponse>(this.BASE_URL, type);
    return response.data;
  }

  static async update(apiClient: ApiClient, code: string, type: TypeChargeUpdateRequest): Promise<TypeChargeApiResponse> {
    const response = await apiClient.put<TypeChargeApiResponse>(`${this.BASE_URL}/${code}`, type);
    return response.data;
  }

  static async delete(apiClient: ApiClient, code: string): Promise<TypeChargeApiResponse> {
    const response = await apiClient.delete<TypeChargeApiResponse>(`${this.BASE_URL}/${code}`);
    return response.data;
  }

  static async search(apiClient: ApiClient, searchTerm: string): Promise<TypeChargeApiResponse> {
    const response = await apiClient.get<TypeChargeApiResponse>(`${this.BASE_URL}/search`, {
      params: { libelle: searchTerm }
    });
    return response.data;
  }
}
