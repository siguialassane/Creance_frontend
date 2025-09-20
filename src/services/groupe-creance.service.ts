import { GroupeCreance, GroupeCreanceApiResponse, GroupeCreanceCreateRequest, GroupeCreanceUpdateRequest } from "@/types/groupe-creance";

export class GroupeCreanceService {
  private static readonly BASE_URL = "/groupes-creance";

  static async getAll(apiClient: any): Promise<GroupeCreanceApiResponse> {
    const response = await apiClient.get<GroupeCreanceApiResponse>(this.BASE_URL);
    return response.data;
  }

  static async getByCode(apiClient: any, code: string): Promise<GroupeCreance> {
    const response = await apiClient.get<GroupeCreanceApiResponse>(`${this.BASE_URL}/${code}`);
    if (!response.data.data || response.data.data.length === 0) {
      throw new Error("Groupe créance non trouvé");
    }
    return response.data.data[0];
  }

  static async create(apiClient: any, groupe: GroupeCreanceCreateRequest): Promise<GroupeCreanceApiResponse> {
    const response = await apiClient.post<GroupeCreanceApiResponse>(this.BASE_URL, groupe);
    return response.data;
  }

  static async update(apiClient: any, code: string, groupe: GroupeCreanceUpdateRequest): Promise<GroupeCreanceApiResponse> {
    const response = await apiClient.put<GroupeCreanceApiResponse>(`${this.BASE_URL}/${code}`, groupe);
    return response.data;
  }

  static async delete(apiClient: any, code: string): Promise<GroupeCreanceApiResponse> {
    const response = await apiClient.delete<GroupeCreanceApiResponse>(`${this.BASE_URL}/${code}`);
    return response.data;
  }

  static async search(apiClient: any, searchTerm: string): Promise<GroupeCreanceApiResponse> {
    const response = await apiClient.get<GroupeCreanceApiResponse>(`${this.BASE_URL}/search`, {
      params: { q: searchTerm }
    });
    return response.data;
  }
}

