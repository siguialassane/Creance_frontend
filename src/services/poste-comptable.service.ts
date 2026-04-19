import { PosteComptable, PosteComptableApiResponse, PosteComptableCreateRequest, PosteComptableUpdateRequest } from "@/types/poste-comptable";

export class PosteComptableService {
  private static readonly BASE_URL = "/postes-comptables";

  static async getAll(apiClient: any): Promise<PosteComptableApiResponse> {
    const response = await apiClient.get<PosteComptableApiResponse>(PosteComptableService.BASE_URL);
    return response.data;
  }

  static async getByCode(apiClient: any, code: string): Promise<PosteComptable> {
    const response = await apiClient.get<PosteComptableApiResponse>(`${PosteComptableService.BASE_URL}/${code}`);
    const data = response.data.data;
    if (!data || Array.isArray(data)) {
      throw new Error("Poste comptable non trouvé");
    }
    return data;
  }

  static async create(apiClient: any, poste: PosteComptableCreateRequest): Promise<PosteComptableApiResponse> {
    const response = await apiClient.post<PosteComptableApiResponse>(PosteComptableService.BASE_URL, poste);
    return response.data;
  }

  static async update(apiClient: any, code: string, poste: PosteComptableUpdateRequest): Promise<PosteComptableApiResponse> {
    const response = await apiClient.put<PosteComptableApiResponse>(`${PosteComptableService.BASE_URL}/${code}`, poste);
    return response.data;
  }

  static async delete(apiClient: any, code: string): Promise<PosteComptableApiResponse> {
    const response = await apiClient.delete<PosteComptableApiResponse>(`${PosteComptableService.BASE_URL}/${code}`);
    return response.data;
  }

  static async search(apiClient: any, searchTerm: string): Promise<PosteComptableApiResponse> {
    const response = await apiClient.get<PosteComptableApiResponse>(`${PosteComptableService.BASE_URL}/search`, {
      params: { libelle: searchTerm }
    });
    return response.data;
  }
}

