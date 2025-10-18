import { TypeDebiteur, TypeDebiteurApiResponse, TypeDebiteurCreateRequest, TypeDebiteurUpdateRequest } from "@/types/type-debiteur";

export class TypeDebiteurService {
  private static readonly BASE_URL = "/types/AC_TYPE_DEBITEUR";

  static async getAll(apiClient: any): Promise<TypeDebiteurApiResponse> {
    const response = await apiClient.get<TypeDebiteurApiResponse>(this.BASE_URL);
    return response.data;
  }

  static async getByCode(apiClient: any, code: string): Promise<TypeDebiteur> {
    const response = await apiClient.get<TypeDebiteurApiResponse>(`${this.BASE_URL}/${code}`);
    if (!response.data.data || response.data.data.length === 0) {
      throw new Error("Type débiteur non trouvé");
    }
    return response.data.data[0];
  }

  static async create(apiClient: any, type: TypeDebiteurCreateRequest): Promise<TypeDebiteurApiResponse> {
    const response = await apiClient.post<TypeDebiteurApiResponse>(this.BASE_URL, type);
    return response.data;
  }

  static async update(apiClient: any, code: string, type: TypeDebiteurUpdateRequest): Promise<TypeDebiteurApiResponse> {
    const response = await apiClient.put<TypeDebiteurApiResponse>(`${this.BASE_URL}/${code}`, type);
    return response.data;
  }

  static async delete(apiClient: any, code: string): Promise<TypeDebiteurApiResponse> {
    const response = await apiClient.delete<TypeDebiteurApiResponse>(`${this.BASE_URL}/${code}`);
    return response.data;
  }

  static async search(apiClient: any, searchTerm: string): Promise<TypeDebiteurApiResponse> {
    const response = await apiClient.get<TypeDebiteurApiResponse>(`${this.BASE_URL}/search`, {
      params: { q: searchTerm }
    });
    return response.data;
  }
}

