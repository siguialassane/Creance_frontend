import { PosteComptable, PosteComptableApiResponse, PosteComptableCreateRequest, PosteComptableUpdateRequest } from "@/types/poste-comptable";

export class PosteComptableService {
  private static readonly BASE_URL = "/postes-comptables";

  static async getAll(apiClient: any): Promise<PosteComptableApiResponse> {
    const response = await apiClient.get<PosteComptableApiResponse>(this.BASE_URL);
    return response.data;
  }

  static async getByCode(apiClient: any, code: string): Promise<PosteComptable> {
    const response = await apiClient.get<PosteComptableApiResponse>(`${this.BASE_URL}/${code}`);
    if (!response.data.data || response.data.data.length === 0) {
      throw new Error("Poste comptable non trouvé");
    }
    return response.data.data[0];
  }

  static async create(apiClient: any, poste: PosteComptableCreateRequest): Promise<PosteComptableApiResponse> {
    const response = await apiClient.post<PosteComptableApiResponse>(this.BASE_URL, poste);
    return response.data;
  }

  static async update(apiClient: any, code: string, poste: PosteComptableUpdateRequest): Promise<PosteComptableApiResponse> {
    const response = await apiClient.put<PosteComptableApiResponse>(`${this.BASE_URL}/${code}`, poste);
    return response.data;
  }

  static async delete(apiClient: any, code: string): Promise<PosteComptableApiResponse> {
    const response = await apiClient.delete<PosteComptableApiResponse>(`${this.BASE_URL}/${code}`);
    return response.data;
  }

  static async search(apiClient: any, searchTerm: string): Promise<PosteComptableApiResponse> {
    const response = await apiClient.get<PosteComptableApiResponse>(`${this.BASE_URL}/search`, {
      params: { q: searchTerm }
    });
    return response.data;
  }
}

