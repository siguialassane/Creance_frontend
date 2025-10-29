import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "./useApiClient";
import { useSessionWrapper } from "./useSessionWrapper";

/**
 * Hook optimisé pour charger TOUTES les données nécessaires au formulaire débiteur
 * en UNE SEULE FOIS au montage du composant.
 *
 * Utilise React Query pour le cache automatique et évite les appels multiples.
 */

export type DebiteurFormData = {
  // Step 1 - Données de base
  categoriesDebiteur: any[];
  typesDebiteur: any[];

  // Step 2 - Personne physique
  civilites: any[];
  quartiers: any[];
  nationalites: any[];
  fonctions: any[];
  professions: any[];
  entites: any[]; // employeurs
  statutsSalarie: any[];

  // Step 3 - Domiciliation
  typesDomicil: any[];
  banques: any[];
  agencesBanque: any[];
};

const DEBITEUR_FORM_DATA_KEY = ["debiteur-form-data"];

export function useDebiteurFormData() {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();
  const isSessionReady = status === 'authenticated' && !!(session as any)?.accessToken;

  return useQuery({
    queryKey: DEBITEUR_FORM_DATA_KEY,
    queryFn: async (): Promise<DebiteurFormData> => {
      console.log('🚀 [useDebiteurFormData] Chargement de TOUTES les données...');

      // Charger TOUTES les données en parallèle pour optimiser les performances
      const [
        categoriesRes,
        typesRes,
        civilitesRes,
        quartiersRes,
        nationalitesRes,
        fonctionsRes,
        professionsRes,
        entitesRes,
        statutsRes,
        typesDomicilRes,
        banquesRes,
        agencesRes,
      ] = await Promise.all([
        // Step 1
        apiClient.get('/categories-debiteur').catch(() => ({ data: { data: [] } })),
        apiClient.get('/types/AC_TYPE_DEBITEUR').catch(() => ({ data: { data: [] } })),

        // Step 2
        apiClient.get('/civilites').catch(() => ({ data: { data: [] } })),
        apiClient.get('/quartiers/all').catch(() => ({ data: { data: [] } })),
        apiClient.get('/nationalites/all').catch(() => ({ data: { data: [] } })),
        apiClient.get('/fonctions/all').catch(() => ({ data: { data: [] } })),
        apiClient.get('/professions/all').catch(() => ({ data: { data: [] } })),
        apiClient.get('/entites/all').catch(() => ({ data: { data: [] } })),
        apiClient.get('/statuts-salarie/all').catch(() => ({ data: { data: [] } })),

        // Step 3
        apiClient.get('/types/AC_TYPE_DOMICIL').catch(() => ({ data: { data: [] } })),
        apiClient.get('/banques/all').catch(() => ({ data: { data: [] } })),
        apiClient.get('/agences-banque/all').catch(() => ({ data: { data: [] } })),
      ]);

      // Helper pour extraire les données de différents formats de réponse API
      const extractData = (response: any) => {
        const data = response.data?.content || response.data?.data || response.data || [];
        return Array.isArray(data) ? data : [];
      };

      const formData: DebiteurFormData = {
        categoriesDebiteur: extractData(categoriesRes),
        typesDebiteur: extractData(typesRes),
        civilites: extractData(civilitesRes),
        quartiers: extractData(quartiersRes),
        nationalites: extractData(nationalitesRes),
        fonctions: extractData(fonctionsRes),
        professions: extractData(professionsRes),
        entites: extractData(entitesRes),
        statutsSalarie: extractData(statutsRes),
        typesDomicil: extractData(typesDomicilRes),
        banques: extractData(banquesRes),
        agencesBanque: extractData(agencesRes),
      };

      console.log('✅ [useDebiteurFormData] Toutes les données chargées:', {
        categoriesDebiteur: formData.categoriesDebiteur.length,
        typesDebiteur: formData.typesDebiteur.length,
        civilites: formData.civilites.length,
        quartiers: formData.quartiers.length,
        nationalites: formData.nationalites.length,
        fonctions: formData.fonctions.length,
        professions: formData.professions.length,
        entites: formData.entites.length,
        statutsSalarie: formData.statutsSalarie.length,
        typesDomicil: formData.typesDomicil.length,
        banques: formData.banques.length,
        agencesBanque: formData.agencesBanque.length,
      });

      return formData;
    },
    enabled: isSessionReady,
    staleTime: Infinity, // Les données sont statiques, pas besoin de les recharger
    gcTime: 1000 * 60 * 60, // Garder en cache pendant 1 heure
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
  });
}

/**
 * Hook helper pour obtenir uniquement les agences d'une banque spécifique
 */
export function useAgencesByBanque(formData: DebiteurFormData | undefined, banqueCode: string | null) {
  if (!formData || !banqueCode) return [];

  return formData.agencesBanque.filter((agence: any) => {
    const agenceBanqueCode = agence.BQ_CODE || agence.banqueCode || agence.BANQ_CODE;
    return agenceBanqueCode === banqueCode;
  });
}
