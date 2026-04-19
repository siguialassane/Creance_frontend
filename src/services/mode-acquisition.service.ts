import { ModeAcquisition, ModeAcquisitionApiResponse, ModeAcquisitionCreateRequest, ModeAcquisitionUpdateRequest } from "@/types/mode-acquisition";

export class ModeAcquisitionService {
  private static readonly BASE_URL = "/modes-acquisition";

  static async getAll(apiClient: any): Promise<ModeAcquisitionApiResponse> {
    // Utiliser /all pour obtenir une liste simple sans pagination
    const response = await apiClient.get<ModeAcquisitionApiResponse>(`${ModeAcquisitionService.BASE_URL}/all`);
    return response.data;
  }

  static async getByCode(apiClient: any, code: string): Promise<ModeAcquisition> {
    // The backend GET /{code} returns a single object wrapped in ApiResult, not an array
    const response = await apiClient.get<ModeAcquisitionApiResponse>(`${ModeAcquisitionService.BASE_URL}/${code}`);
    if (!response.data.data) {
      throw new Error("Mode d'acquisition non trouvé");
    }
    return response.data.data;
  }

  static async create(apiClient: any, mode: ModeAcquisitionCreateRequest): Promise<ModeAcquisitionApiResponse> {
    const response = await apiClient.post<ModeAcquisitionApiResponse>(ModeAcquisitionService.BASE_URL, mode);
    return response.data;
  }

  static async update(apiClient: any, code: string, mode: ModeAcquisitionUpdateRequest): Promise<ModeAcquisitionApiResponse> {
    const response = await apiClient.put<ModeAcquisitionApiResponse>(`${ModeAcquisitionService.BASE_URL}/${code}`, mode);
    return response.data;
  }

  static async delete(apiClient: any, code: string): Promise<ModeAcquisitionApiResponse> {
    const response = await apiClient.delete<ModeAcquisitionApiResponse>(`${ModeAcquisitionService.BASE_URL}/${code}`);
    return response.data;
  }

  static async search(apiClient: any, searchTerm: string): Promise<ModeAcquisitionApiResponse> {
    const response = await apiClient.get<ModeAcquisitionApiResponse>(`${ModeAcquisitionService.BASE_URL}/search`, {
      params: { q: searchTerm }
    });
    return response.data;
  }
}
