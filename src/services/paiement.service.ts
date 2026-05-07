import { ApiClient } from "@/lib/api";
import { PaginationParams } from "@/types/pagination";

export class PaiementService {
    private static readonly BASE_URL = "/paiements";

    static async create(apiClient: ApiClient, data: any): Promise<any> {
        const response = await apiClient.post(PaiementService.BASE_URL, data);
        return response.data;
    }

    static async update(apiClient: ApiClient, id: string, data: any): Promise<any> {
        const response = await apiClient.put(`${PaiementService.BASE_URL}/creance/${id}`, data);
        return response.data;
    }

    static async getById(apiClient: ApiClient, id: string): Promise<any> {
        const response = await apiClient.get(`${PaiementService.BASE_URL}/${id}`);
        return response.data;
    }

    static async getByCreance(apiClient: ApiClient, creanceCode: string, params?: PaginationParams): Promise<any> {
        const response = await apiClient.get(`${PaiementService.BASE_URL}/creance/${creanceCode}`, { params });
        return response.data;
    }

    static async getAll(apiClient: ApiClient, params?: PaginationParams): Promise<any> {
        const response = await apiClient.get(PaiementService.BASE_URL, { params });
        return response.data;
    }

    static async getRecuUrls(apiClient: ApiClient, effetNum: string): Promise<any> {
        const response = await apiClient.get(`${PaiementService.BASE_URL}/${effetNum}/recus`);
        return response.data;
    }

    static getRecuPdfUrl(effetNum: string, type: 'comptabilite' | 'debiteur' | 'archive'): string {
        // Retourne l'URL complète pour télécharger le PDF
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
        return `${baseUrl}/api/paiements/${effetNum}/recu/${type}`;
    }

    /**
     * Télécharge le reçu PDF combiné (3 pages) pour un paiement
     * Utilise le nouveau service backend RecuPaiementService avec JasperReports
     * @param paieCode Code du paiement (PAIE_CODE)
     * @param typePaiement Type : "CREANCE", "FACTURE", "FRAIS", "ALL" (défaut: ALL)
     * @returns Blob du PDF
     */
    static async getRecuCombine(
        apiClient: ApiClient, 
        paieCode: number, 
        typePaiement: 'CREANCE' | 'FACTURE' | 'FRAIS' | 'ALL' = 'ALL'
    ): Promise<Blob> {
        const response = await apiClient.get(
            `/paiements/creance/${paieCode}/recu-combine`, 
            {
                params: { type: typePaiement },
                responseType: 'blob'
            }
        );
        return response.data;
    }
}
