import { ApiClient } from "@/lib/api";

export type ModePaiementFrais = "ESPECE" | "CHEQUE" | "TRAITE" | "VIREMENT" | "EFFET" | "BANQUE" | "OVP";

/**
 * Service pour la gestion des paiements de frais (Module M4)
 */
export class PaiementFraisService {
    private static readonly BASE_URL = "/paiements/frais";

    /**
     * Crée un nouveau frais (lié à une créance OU à un contrat bail)
     */
    static async createFrais(apiClient: ApiClient, data: {
        creanceCode?: string;
        contCode?: number;
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
        fraisCode: number;
        creanceCode?: string;
        contCode?: number;
        montantPaye: number;
        datePaiement: string;
        modePaiement: ModePaiementFrais;
        recuManuel?: string;

        // Si modePaiement = "EFFET"
        typeEffet?: string;
        numeroEffet?: string;
        banqueAgence?: string;
        montantEffet?: number;
        typePayeur?: "DEBITEUR_PRINCIPAL" | "AVAL";
        garantiePhysCode?: string | number;
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

    /**
     * Récupère les détails d'un contrat bail
     */
    static async getBailDetails(apiClient: ApiClient, contCode: number): Promise<any> {
        const response = await apiClient.get(`${PaiementFraisService.BASE_URL}/bail/${contCode}/details`);
        return response.data;
    }

    /**
     * Récupère tous les frais d'un contrat bail
     */
    static async getByBail(apiClient: ApiClient, contCode: number): Promise<any> {
        const response = await apiClient.get(`${PaiementFraisService.BASE_URL}/bail/${contCode}`);
        return response.data;
    }

    /**
     * Récupère les frais non payés d'un contrat bail
     */
    static async getFraisNonPayesBail(apiClient: ApiClient, contCode: number): Promise<any> {
        const response = await apiClient.get(`${PaiementFraisService.BASE_URL}/bail/${contCode}/non-payes`);
        return response.data;
    }

    /**
     * Génère un reçu PDF pour un frais payé
     * type: 'comptabilite' | 'debiteur' | 'archive'
     */
    static async getRecu(apiClient: ApiClient, fraisCode: number, type: 'comptabilite' | 'debiteur' | 'archive' = 'debiteur'): Promise<Blob> {
        const response = await apiClient.get(`${PaiementFraisService.BASE_URL}/${fraisCode}/recu/${type}`, {
            responseType: 'blob',
        });
        return response.data;
    }

    /**
     * Génère un reçu combiné 3 pages (Client, Comptabilité, Archives) pour un frais payé
     * Utilise fraisCode (pas paieCode — les frais n'ont pas de PAIE_CODE)
     */
    static async getRecuCombine(apiClient: ApiClient, fraisCode: number): Promise<Blob> {
        const response = await apiClient.get(`${PaiementFraisService.BASE_URL}/${fraisCode}/recu-combine`, {
            responseType: 'blob',
        });
        return response.data;
    }

    /**
     * Annule un paiement de frais
     */
    static async annuler(apiClient: ApiClient, fraisCode: number | string, motif?: string): Promise<any> {
        const response = await apiClient.post(`${PaiementFraisService.BASE_URL}/${fraisCode}/annuler`, { motif: motif || "" });
        return response.data;
    }
}
