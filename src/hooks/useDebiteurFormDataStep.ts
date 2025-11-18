import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "./useApiClient";
import { useSessionWrapper } from "./useSessionWrapper";
import { useEffect, useState } from "react";

/**
 * Hook pour charger les données du formulaire débiteur de manière non bloquante
 * Les données sont chargées par étape pour améliorer les performances
 */

export type DebiteurFormDataStep1 = {
  categoriesDebiteur: any[];
  typesDebiteur: any[];
};

export type DebiteurFormDataStep2 = {
  civilites: any[];
  quartiers: any[];
  nationalites: any[];
  fonctions: any[];
  professions: any[];
  employeurs: any[];
  statutsSalarie: any[];
};

export type DebiteurFormDataStep3 = {
  typesDomicil: any[];
  banques: any[];
  agencesBanque: any[];
};

export type DebiteurFormData = DebiteurFormDataStep1 & DebiteurFormDataStep2 & DebiteurFormDataStep3;

// Helper pour extraire les données de différents formats de réponse API
const extractData = (response: any) => {
  // Format paginé avec data.data: { data: { content: [...] } }
  // Format paginé direct: { data: { content: [...] } }
  // Format direct: { data: [...] } ou { data: { data: [...] } }
  // Format direct dans response: { content: [...] }
  const data = response?.data?.data?.content || 
               response?.data?.content || 
               response?.data?.data || 
               response?.data || 
               response?.content ||
               [];
  return Array.isArray(data) ? data : [];
};

// Query keys
const STEP1_KEY = ["debiteur-form-data", "step1"];
const STEP2_KEY = ["debiteur-form-data", "step2"];
const STEP3_KEY = ["debiteur-form-data", "step3"];

/**
 * Charger les données du Step 1 (toujours chargé)
 */
export function useDebiteurFormDataStep1() {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();
  const isSessionReady = status === 'authenticated' && !!(session as any)?.accessToken;

  return useQuery({
    queryKey: STEP1_KEY,
    queryFn: async (): Promise<DebiteurFormDataStep1> => {
      console.log('🚀 [useDebiteurFormDataStep1] Chargement des données Step 1...');
      
      const [categoriesRes, typesRes] = await Promise.all([
        apiClient.get('/categories-debiteur').catch(() => ({ data: { data: [] } })),
        apiClient.get('/types/AC_TYPE_DEBITEUR').catch(() => ({ data: { data: [] } })),
      ]);

      return {
        categoriesDebiteur: extractData(categoriesRes),
        typesDebiteur: extractData(typesRes),
      };
    },
    enabled: isSessionReady,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 1, // Réduire à 1 retry pour éviter les délais trop longs
    retryDelay: 1000, // Délai de 1 seconde entre les retries
  });
}

/**
 * Charger les données du Step 2 (chargé quand on arrive sur Step 1 ou après)
 */
export function useDebiteurFormDataStep2(enabled: boolean = true) {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();
  const isSessionReady = status === 'authenticated' && !!(session as any)?.accessToken;

  return useQuery({
    queryKey: STEP2_KEY,
    queryFn: async (): Promise<DebiteurFormDataStep2> => {
      console.log('🚀 [useDebiteurFormDataStep2] Chargement des données Step 2...');
      
      const [
        civilitesRes,
        quartiersRes,
        nationalitesRes,
        fonctionsRes,
        professionsRes,
        employeursRes,
        statutsRes,
      ] = await Promise.all([
        apiClient.get('/civilites').catch((err) => {
          console.error('❌ [useDebiteurFormDataStep2] Erreur civilites:', err);
          return { data: { data: [] } };
        }),
        apiClient.get('/quartiers', {
          params: { page: 0, size: 200 },
          timeout: 30000, // Timeout spécifique pour cette requête
        }).catch((err) => {
          console.error('❌ [useDebiteurFormDataStep2] Erreur quartiers:', err);
          return { data: { data: { content: [] } } };
        }),
        apiClient.get('/nationalites', {
          params: { page: 0, size: 100 },
          timeout: 30000,
        }).catch((err) => {
          console.error('❌ [useDebiteurFormDataStep2] Erreur nationalites:', err);
          return { data: { data: { content: [] } } };
        }),
        apiClient.get('/fonctions', {
          params: { page: 0, size: 50 }, // Réduire à 50 pour accélérer (recherche disponible)
          timeout: 30000,
        }).catch((err) => {
          console.error('❌ [useDebiteurFormDataStep2] Erreur fonctions:', err);
          return { data: { data: { content: [] } } };
        }),
        apiClient.get('/professions', {
          params: { page: 0, size: 50 }, // Réduire à 50 pour accélérer (recherche disponible)
          timeout: 30000,
        }).catch((err) => {
          console.error('❌ [useDebiteurFormDataStep2] Erreur professions:', err);
          return { data: { data: { content: [] } } };
        }),
        apiClient.get('/employeurs', {
          params: { page: 0, size: 50 }, // Réduire à 50 pour accélérer (recherche disponible)
          timeout: 30000,
        }).catch((err) => {
          console.error('❌ [useDebiteurFormDataStep2] Erreur employeurs:', err);
          return { data: { data: { content: [] } } };
        }),
        apiClient.get('/statut-salaries', {
          params: { page: 0, size: 100 },
          timeout: 30000,
        }).catch((err) => {
          console.error('❌ [useDebiteurFormDataStep2] Erreur statut-salaries:', err);
          return { data: { data: { content: [] } } };
        }),
      ]);

      // Logs pour déboguer
      console.log('📦 [useDebiteurFormDataStep2] Réponse quartiers brute:', quartiersRes);
      console.log('📦 [useDebiteurFormDataStep2] quartiersRes.data:', quartiersRes?.data);
      console.log('📦 [useDebiteurFormDataStep2] quartiersRes.data?.data:', quartiersRes?.data?.data);
      console.log('📦 [useDebiteurFormDataStep2] quartiersRes.data?.data?.content:', quartiersRes?.data?.data?.content);

      const quartiers = extractData(quartiersRes);
      console.log('✅ [useDebiteurFormDataStep2] Quartiers extraits:', quartiers);
      console.log('✅ [useDebiteurFormDataStep2] Nombre de quartiers:', quartiers.length);

      // Logs pour déboguer les nationalités
      console.log('📦 [useDebiteurFormDataStep2] Réponse nationalites brute:', nationalitesRes);
      console.log('📦 [useDebiteurFormDataStep2] nationalitesRes.data:', nationalitesRes?.data);
      console.log('📦 [useDebiteurFormDataStep2] nationalitesRes.data?.content:', nationalitesRes?.data?.content);
      console.log('📦 [useDebiteurFormDataStep2] nationalitesRes.data?.data:', nationalitesRes?.data?.data);
      console.log('📦 [useDebiteurFormDataStep2] nationalitesRes.data?.data?.content:', nationalitesRes?.data?.data?.content);
      
      const nationalites = extractData(nationalitesRes);
      console.log('✅ [useDebiteurFormDataStep2] Nationalites extraites:', nationalites);
      console.log('✅ [useDebiteurFormDataStep2] Nombre de nationalites:', nationalites.length);
      console.log('✅ [useDebiteurFormDataStep2] Premier element nationalite:', nationalites[0]);

      return {
        civilites: extractData(civilitesRes),
        quartiers,
        nationalites,
        fonctions: extractData(fonctionsRes),
        professions: extractData(professionsRes),
        employeurs: extractData(employeursRes),
        statutsSalarie: extractData(statutsRes),
      };
    },
    enabled: isSessionReady && enabled,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 1, // Réduire à 1 retry pour éviter les délais trop longs
    retryDelay: 1000, // Délai de 1 seconde entre les retries
  });
}

/**
 * Charger les données du Step 3 (chargé quand on arrive sur Step 2 ou après)
 */
export function useDebiteurFormDataStep3(enabled: boolean = true) {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();
  const isSessionReady = status === 'authenticated' && !!(session as any)?.accessToken;

  return useQuery({
    queryKey: STEP3_KEY,
    queryFn: async (): Promise<DebiteurFormDataStep3> => {
      console.log('🚀 [useDebiteurFormDataStep3] Chargement des données Step 3...');
      
      const [typesDomicilRes, banquesRes, agencesRes] = await Promise.all([
        apiClient.get('/types/AC_TYPE_DOMICIL').catch(() => ({ data: { data: [] } })),
        apiClient.get('/banques').catch(() => ({ data: { data: [] } })),
        apiClient.get('/banque-agences').catch(() => ({ data: { data: [] } })),
      ]);

      return {
        typesDomicil: extractData(typesDomicilRes),
        banques: extractData(banquesRes),
        agencesBanque: extractData(agencesRes),
      };
    },
    enabled: isSessionReady && enabled,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 1, // Réduire à 1 retry pour éviter les délais trop longs
    retryDelay: 1000, // Délai de 1 seconde entre les retries
  });
}

/**
 * Hook principal qui combine toutes les données par étape
 * Permet un chargement progressif non bloquant
 */
export function useDebiteurFormDataProgressive(currentStep: number = 1) {
  // Step 1 toujours chargé
  const step1Query = useDebiteurFormDataStep1();
  
  // Step 2 chargé dès qu'on est sur Step 1 (préchargement)
  const step2Query = useDebiteurFormDataStep2(currentStep >= 1);
  
  // Step 3 chargé dès qu'on est sur Step 2 (préchargement)
  const step3Query = useDebiteurFormDataStep3(currentStep >= 2);

  const isLoading = step1Query.isLoading || 
    (currentStep >= 1 && step2Query.isLoading) || 
    (currentStep >= 2 && step3Query.isLoading);

  const error = step1Query.error || step2Query.error || step3Query.error;

  // Combiner les données - toujours créer l'objet même si step1Query.data est undefined
  const data: DebiteurFormData | undefined = {
    ...(step1Query.data || {}),
    ...(step2Query.data || {}),
    ...(step3Query.data || {}),
  } as DebiteurFormData;

  return {
    data,
    isLoading,
    error,
    // Données par étape pour savoir ce qui est chargé
    step1: step1Query,
    step2: step2Query,
    step3: step3Query,
  };
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

