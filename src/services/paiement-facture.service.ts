import { ApiClient } from "@/lib/api";

/**
 * Service pour la gestion des paiements de factures/loyers (Module M5)
 */
export class PaiementFactureService {
    private static readonly BASE_URL = "/paiements/facture";

    /**
     * Crée un nouveau paiement de facture/loyer
     */
    static async create(apiClient: ApiClient, data: {
        contratCode: number;
        libellePaiement: string;
        montantPaiement: number;
        datePaiement: string;
        modePaiement: "EFFET" | "ESPECE";

        // Si modePaiement = "EFFET"
        typeEffet?: string;
        numeroEffet?: string;
        banqueAgence?: string;
        montantEffet?: number;
    }): Promise<any> {
        const response = await apiClient.post(PaiementFactureService.BASE_URL, data);
        return response.data;
    }

    /**
     * Récupère tous les paiements d'un contrat
     */
    static async getByContrat(apiClient: ApiClient, contratCode: number): Promise<any> {
        const response = await apiClient.get(`${PaiementFactureService.BASE_URL}/contrat/${contratCode}`);
        return response.data;
    }

    /**
     * Récupère un paiement par son code
     */
    static async getByCode(apiClient: ApiClient, paieCode: number): Promise<any> {
        const response = await apiClient.get(`${PaiementFactureService.BASE_URL}/${paieCode}`);
        return response.data;
    }

    /**
     * Récupère les contrats actifs
     */
    static async getContratsActifs(apiClient: ApiClient): Promise<any> {
        const response = await apiClient.get(`${PaiementFactureService.BASE_URL}/referentiels/contrats-actifs`);
        return response.data;
    }

    /**
     * Récupère l'historique des soldes d'un contrat
     */
    static async getHistoriqueSoldes(apiClient: ApiClient, contratCode: number): Promise<any> {
        const response = await apiClient.get(`${PaiementFactureService.BASE_URL}/contrat/${contratCode}/historique-soldes`);
        return response.data;
    }

    /**
     * Récupère les informations détaillées d'un contrat
     */
    static async getContratInfo(apiClient: ApiClient, contratCode: number): Promise<any> {
        const response = await apiClient.get(`${PaiementFactureService.BASE_URL}/contrat/${contratCode}/info`);
        return response.data;
    }
}
