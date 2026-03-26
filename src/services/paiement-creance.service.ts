import { ApiClient } from "@/lib/api";

/**
 * Service pour la gestion des paiements de créance (Module M3)
 */
export class PaiementCreanceService {
    private static readonly BASE_URL = "/paiements/creance";

    /**
     * Crée un nouveau paiement de créance
     */
    static async create(apiClient: ApiClient, data: {
        creanceCode: string;
        libellePaiement: string;
        montantPaiement: number;
        datePaiement: string;
        modePaiement: "EFFET" | "ESPECE" | "BANQUE_REMBOURSEMENT";

        // Si modePaiement = "EFFET"
        typeEffet?: string;
        numeroEffet?: string;
        banqueAgence?: string;
        montantEffet?: number;

        // Si modePaiement = "BANQUE_REMBOURSEMENT"
        compteOperation?: string;
        recuManuel?: string;

        // Optionnel (paiement par aval)
        typePayeur?: "DEBITEUR_PRINCIPAL" | "AVAL";
        garantiePhysCode?: string;
    }): Promise<any> {
        const response = await apiClient.post(PaiementCreanceService.BASE_URL, data);
        return response.data;
    }

    /**
     * Récupère tous les paiements d'une créance
     */
    static async getByCreance(apiClient: ApiClient, creanceCode: string): Promise<any> {
        const response = await apiClient.get(`${PaiementCreanceService.BASE_URL}/creance/${creanceCode}`);
        return response.data;
    }

    /**
     * Récupère un paiement par son code
     */
    static async getByCode(apiClient: ApiClient, paieCode: number): Promise<any> {
        const response = await apiClient.get(`${PaiementCreanceService.BASE_URL}/${paieCode}`);
        return response.data;
    }

    /**
     * Récupère les modes de paiement disponibles
     */
    static async getModePaiements(apiClient: ApiClient): Promise<any> {
        const response = await apiClient.get(`${PaiementCreanceService.BASE_URL}/referentiels/modes-paiement`);
        return response.data;
    }

    /**
     * Récupère les types d'effet disponibles
     */
    static async getTypeEffets(apiClient: ApiClient): Promise<any> {
        const response = await apiClient.get(`${PaiementCreanceService.BASE_URL}/referentiels/types-effet`);
        return response.data;
    }

    /**
     * Récupère les comptes d'opération
     */
    static async getComptesOperation(apiClient: ApiClient): Promise<any> {
        const response = await apiClient.get(`${PaiementCreanceService.BASE_URL}/referentiels/comptes-operation`);
        return response.data;
    }

    /**
     * Récupère les garanties physiques (avals) d'une créance
     */
    static async getGarantiesPhysiques(apiClient: ApiClient, creanceCode: string): Promise<any> {
        const response = await apiClient.get(`${PaiementCreanceService.BASE_URL}/creance/${creanceCode}/garanties`);
        return response.data;
    }
}
