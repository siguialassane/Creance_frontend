import { ApiClient } from "@/lib/api";
import { PaginationParams } from "@/types/pagination";

export class PaiementService {
    private static readonly BASE_URL = "/paiements";

    static async create(apiClient: ApiClient, data: any): Promise<any> {
        const response = await apiClient.post(PaiementService.BASE_URL, data);
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
}
