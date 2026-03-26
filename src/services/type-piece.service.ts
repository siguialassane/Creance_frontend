import { TypePiece, TypePieceApiResponse, TypePieceCreateRequest, TypePieceUpdateRequest } from "@/types/type-piece";
import { ApiClient } from "@/lib/api";

export class TypePieceService {
  private static readonly BASE_URL = "/types/AC_TYPE_PIECE";

  static async getAll(apiClient: ApiClient): Promise<TypePieceApiResponse> {
    const response = await apiClient.get<TypePieceApiResponse>(TypePieceService.BASE_URL);
    return response.data;
  }

  static async getByCode(apiClient: ApiClient, code: string): Promise<TypePiece> {
    const response = await apiClient.get<TypePieceApiResponse>(`${TypePieceService.BASE_URL}/${code}`);
    if (!response.data.data || response.data.data.length === 0) {
      throw new Error("TypePiece non trouvé");
    }
    return response.data.data[0];
  }

  static async create(apiClient: ApiClient, type: TypePieceCreateRequest): Promise<TypePieceApiResponse> {
    const response = await apiClient.post<TypePieceApiResponse>(TypePieceService.BASE_URL, type);
    return response.data;
  }

  static async update(apiClient: ApiClient, code: string, type: TypePieceUpdateRequest): Promise<TypePieceApiResponse> {
    const response = await apiClient.put<TypePieceApiResponse>(`${TypePieceService.BASE_URL}/${code}`, type);
    return response.data;
  }

  static async delete(apiClient: ApiClient, code: string): Promise<TypePieceApiResponse> {
    const response = await apiClient.delete<TypePieceApiResponse>(`${TypePieceService.BASE_URL}/${code}`);
    return response.data;
  }

  static async search(apiClient: ApiClient, searchTerm: string): Promise<TypePieceApiResponse> {
    const response = await apiClient.get<TypePieceApiResponse>(`${TypePieceService.BASE_URL}/search`, {
      params: { libelle: searchTerm }
    });
    return response.data;
  }
}
