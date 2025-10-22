import { Exercice, ExerciceApiResponse, ExerciceCreateRequest, ExerciceUpdateRequest } from "@/types/exercice";

export class ExerciceService {
  private static readonly BASE_URL = "/exercices";

  static async getAll(apiClient: any): Promise<ExerciceApiResponse> {
    const response = await apiClient.get<ExerciceApiResponse>(`${this.BASE_URL}/all`);
    return response.data;
  }

  static async getByCode(apiClient: any, code: string): Promise<Exercice> {
    const response = await apiClient.get<ExerciceApiResponse>(`${this.BASE_URL}/${code}`);
    if (!response.data.data || response.data.data.length === 0) {
      throw new Error("Exercice non trouvé");
    }
    return response.data.data[0];
  }

  static async create(apiClient: any, exercice: ExerciceCreateRequest): Promise<ExerciceApiResponse> {
    const response = await apiClient.post<ExerciceApiResponse>(this.BASE_URL, exercice);
    return response.data;
  }

  static async update(apiClient: any, code: string, exercice: ExerciceUpdateRequest): Promise<ExerciceApiResponse> {
    const response = await apiClient.put<ExerciceApiResponse>(`${this.BASE_URL}/${code}`, exercice);
    return response.data;
  }

  static async delete(apiClient: any, code: string): Promise<ExerciceApiResponse> {
    const response = await apiClient.delete<ExerciceApiResponse>(`${this.BASE_URL}/${code}`);
    return response.data;
  }

  static async search(apiClient: any, searchTerm: string): Promise<ExerciceApiResponse> {
    const response = await apiClient.get<ExerciceApiResponse>(`${this.BASE_URL}/search`, {
      params: { q: searchTerm }
    });
    return response.data;
  }
}

