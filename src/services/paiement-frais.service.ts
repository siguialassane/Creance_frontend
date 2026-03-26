import { ApiClient } from "@/lib/api";

/**
 * Service pour la gestion des paiements de frais (Module M4)
 */
export class PaiementFraisService {
    private static readonly BASE_URL = "/paiements/frais";

    /**
     * Crée un nouveau frais
     */
    static async createFrais(apiClient: ApiClient, data: {
        creanceCode: string;
        typeFrais: string;
        montant: number;
        libelle: string;
    }): Promise<any> {
        const response = await apiClient.post(`${PaiementFraisService.BASE_URL}/frais`, data);
        return response.data;
    }

    /**
     * Crée un paiement de frais
     */
    static async create(apiClient: ApiClient, data: {
        creanceCode: string;
        fraisCode: number;
        recuManuel: string;
        montantPaye: number;
        datePaiement: string;
        modePaiement: "EFFET" | "ESPECE";

        // Si modePaiement = "EFFET"
        typeEffet?: string;
        numeroEffet?: string;
        banqueAgence?: string;
        montantEffet?: number;

        // Optionnel (paiement par aval)
        typePayeur?: "DEBITEUR_PRINCIPAL" | "AVAL";
        garantiePhysCode?: string;
    }): Promise<any> {
        const response = await apiClient.post(PaiementFraisService.BASE_URL, data);
        return response.data;
    }

    /**
     * Récupère tous les frais d'une créance
     */
    static async getByCreance(apiClient: ApiClient, creanceCode: string): Promise<any> {
        const response = await apiClient.get(`${PaiementFraisService.BASE_URL}/creance/${creanceCode}`);
        return response.data;
    }

    /**
     * Récupère les frais non payés d'une créance
     */
    static async getFraisNonPayes(apiClient: ApiClient, creanceCode: string): Promise<any> {
        const response = await apiClient.get(`${PaiementFraisService.BASE_URL}/creance/${creanceCode}/non-payes`);
        return response.data;
    }

    /**
     * Récupère un frais par son code
     */
    static async getByCode(apiClient: ApiClient, fraisCode: number): Promise<any> {
        const response = await apiClient.get(`${PaiementFraisService.BASE_URL}/${fraisCode}`);
        return response.data;
    }

    /**
     * Récupère les types de frais disponibles
     */
    static async getTypeFrais(apiClient: ApiClient): Promise<any> {
        const response = await apiClient.get(`${PaiementFraisService.BASE_URL}/referentiels/types-frais`);
        return response.data;
    }
}
