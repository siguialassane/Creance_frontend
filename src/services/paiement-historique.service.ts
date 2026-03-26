import { ApiClient } from "@/lib/api";

export class PaiementHistoriqueService {
    private static readonly BASE_URL = "/paiements/historique";

    /**
     * Récupère tous les paiements d'une créance (tous types confondus)
     */
    static async getAllByCreance(apiClient: ApiClient, creanceCode: string): Promise<any> {
        const response = await apiClient.get(`${PaiementHistoriqueService.BASE_URL}/creance/${creanceCode}`);
        return response.data;
    }
}


