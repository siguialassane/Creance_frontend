import { DebiteurCreateRequest, DebiteurApiResponse, DebiteurResponse } from "@/types/debiteur";

export class DebiteurService {
  private static readonly BASE_URL = "/debiteurs";

  /**
   * Nettoie les champs numériques en supprimant les espaces de formatage
   * pour éviter l'erreur ORA-01722 (nombre non valide)
   */
  private static cleanNumericFields(data: any): any {
    const cleaned = { ...data };
    
    // Champs numériques connus qui peuvent avoir des espaces de formatage
    const numericFields = ['capitalSocial', 'nombreEnfant'];
    
    numericFields.forEach(field => {
      if (cleaned[field] && typeof cleaned[field] === 'string') {
        // Supprimer tous les espaces et caractères non numériques sauf les points et virgules
        cleaned[field] = cleaned[field].replace(/\s/g, '');
      }
    });
    
    return cleaned;
  }

  static async getAll(apiClient: any): Promise<any> {
    const response = await apiClient.get(`${this.BASE_URL}`);
    return response.data;
  }

  static async getByCode(apiClient: any, code: string): Promise<DebiteurResponse> {
    const response = await apiClient.get(`${this.BASE_URL}/${code}`);
    if (!response.data.data) {
      throw new Error("Débiteur non trouvé");
    }
    return response.data.data;
  }

  static async create(apiClient: any, debiteur: DebiteurCreateRequest): Promise<DebiteurApiResponse> {
    const cleanedDebiteur = this.cleanNumericFields(debiteur);
    const response = await apiClient.post(this.BASE_URL, cleanedDebiteur);
    return response.data;
  }

  static async update(apiClient: any, code: string, debiteur: Partial<DebiteurCreateRequest>): Promise<DebiteurApiResponse> {
    const cleanedDebiteur = this.cleanNumericFields(debiteur);
    const response = await apiClient.put(`${this.BASE_URL}/${code}`, cleanedDebiteur);
    return response.data;
  }

  static async delete(apiClient: any, code: string): Promise<DebiteurApiResponse> {
    const response = await apiClient.delete(`${this.BASE_URL}/${code}`);
    return response.data;
  }
}
