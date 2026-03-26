import { useState, useEffect, useRef, useCallback } from 'react';
import { useApiClient } from './useApiClient';
import { useSessionWrapper } from './useSessionWrapper';

type UseStaticDataOptions = {
  autoLoad?: boolean;
};

type LoadedFlags = {
  quartiers: boolean;
  nationalites: boolean;
  banques: boolean;
  civilites: boolean;
  typesDebiteur: boolean;
  categoriesDebiteur: boolean;
};

const createInitialLoadedFlags = (): LoadedFlags => ({
  quartiers: false,
  nationalites: false,
  banques: false,
  civilites: false,
  typesDebiteur: false,
  categoriesDebiteur: false,
});

// Hook pour charger les données statiques avec possibilité de chargement paresseux
export function useStaticData(options: UseStaticDataOptions = {}) {
  const { autoLoad = true } = options;
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();
  const isAuthenticated = status === 'authenticated' && !!session;

  // États pour les données
  const [quartiers, setQuartiers] = useState<any[]>([]);
  const [nationalites, setNationalites] = useState<any[]>([]);
  const [banques, setBanques] = useState<any[]>([]);
  const [civilites, setCivilites] = useState<any[]>([]);
  const [typesDebiteur, setTypesDebiteur] = useState<any[]>([]);
  const [categoriesDebiteur, setCategoriesDebiteur] = useState<any[]>([]);

  // États de chargement
  const [loadingQuartiers, setLoadingQuartiers] = useState(false);
  const [loadingNationalites, setLoadingNationalites] = useState(false);
  const [loadingBanques, setLoadingBanques] = useState(false);
  const [loadingCivilites, setLoadingCivilites] = useState(false);
  const [loadingTypesDebiteur, setLoadingTypesDebiteur] = useState(false);
  const [loadingCategoriesDebiteur, setLoadingCategoriesDebiteur] = useState(false);

  // États d'erreur
  const [errorQuartiers, setErrorQuartiers] = useState<string | null>(null);
  const [errorNationalites, setErrorNationalites] = useState<string | null>(null);
  const [errorBanques, setErrorBanques] = useState<string | null>(null);
  const [errorCivilites, setErrorCivilites] = useState<string | null>(null);
  const [errorTypesDebiteur, setErrorTypesDebiteur] = useState<string | null>(null);
  const [errorCategoriesDebiteur, setErrorCategoriesDebiteur] = useState<string | null>(null);

  // Flags pour éviter les chargements multiples
  const loadedRef = useRef<LoadedFlags>(createInitialLoadedFlags());

  const loadQuartiers = useCallback(async () => {
    if (!isAuthenticated || loadedRef.current.quartiers || loadingQuartiers) return;

    setLoadingQuartiers(true);
    setErrorQuartiers(null);

    try {
      console.log('🔄 Chargement des quartiers...');
      const response = await apiClient.get('/quartiers/all');
      const data = response.data?.data || [];
      setQuartiers(data);
      loadedRef.current.quartiers = true;
      console.log('✅ Quartiers chargés:', data.length, 'éléments');
    } catch (error: any) {
      console.error('❌ Erreur chargement quartiers:', error);
      setErrorQuartiers(error.message || 'Erreur lors du chargement des quartiers');
    } finally {
      setLoadingQuartiers(false);
    }
  }, [apiClient, isAuthenticated, loadingQuartiers]);

  const loadNationalites = useCallback(async () => {
    if (!isAuthenticated || loadedRef.current.nationalites || loadingNationalites) return;

    setLoadingNationalites(true);
    setErrorNationalites(null);

    try {
      console.log('🔄 Chargement des nationalités...');
      const response = await apiClient.get('/nationalites/all');
      const data = response.data?.data || [];
      setNationalites(data);
      loadedRef.current.nationalites = true;
      console.log('✅ Nationalités chargées:', data.length, 'éléments');
    } catch (error: any) {
      console.error('❌ Erreur chargement nationalités:', error);
      setErrorNationalites(error.message || 'Erreur lors du chargement des nationalités');
    } finally {
      setLoadingNationalites(false);
    }
  }, [apiClient, isAuthenticated, loadingNationalites]);

  const loadBanques = useCallback(async () => {
    if (!isAuthenticated || loadedRef.current.banques || loadingBanques) return;

    setLoadingBanques(true);
    setErrorBanques(null);

    try {
      console.log('🔄 Chargement des banques...');
      const response = await apiClient.get('/banques/all');
      const data = response.data?.data || [];
      setBanques(data);
      loadedRef.current.banques = true;
      console.log('✅ Banques chargées:', data.length, 'éléments');
    } catch (error: any) {
      console.error('❌ Erreur chargement banques:', error);
      setErrorBanques(error.message || 'Erreur lors du chargement des banques');
    } finally {
      setLoadingBanques(false);
    }
  }, [apiClient, isAuthenticated, loadingBanques]);

  const loadCivilites = useCallback(async () => {
    if (!isAuthenticated || loadedRef.current.civilites || loadingCivilites) return;

    setLoadingCivilites(true);
    setErrorCivilites(null);

    try {
      console.log('🔄 Chargement des civilités...');
      const response = await apiClient.get('/civilites');
      const data = response.data?.data || [];
      setCivilites(data);
      loadedRef.current.civilites = true;
      console.log('✅ Civilités chargées:', data.length, 'éléments');
    } catch (error: any) {
      console.error('❌ Erreur chargement civilités:', error);
      setErrorCivilites(error.message || 'Erreur lors du chargement des civilités');
    } finally {
      setLoadingCivilites(false);
    }
  }, [apiClient, isAuthenticated, loadingCivilites]);

  const loadTypesDebiteur = useCallback(async () => {
    if (!isAuthenticated || loadedRef.current.typesDebiteur || loadingTypesDebiteur) return;

    setLoadingTypesDebiteur(true);
    setErrorTypesDebiteur(null);

    try {
      console.log('🔄 Chargement des types débiteur...');
      const response = await apiClient.get('/types/AC_TYPE_DEBITEUR');
      const data = response.data?.data || [];
      setTypesDebiteur(data);
      loadedRef.current.typesDebiteur = true;
      console.log('✅ Types débiteur chargés:', data.length, 'éléments');
    } catch (error: any) {
      console.error('❌ Erreur chargement types débiteur:', error);
      setErrorTypesDebiteur(error.message || 'Erreur lors du chargement des types débiteur');
    } finally {
      setLoadingTypesDebiteur(false);
    }
  }, [apiClient, isAuthenticated, loadingTypesDebiteur]);

  const loadCategoriesDebiteur = useCallback(async () => {
    if (!isAuthenticated || loadedRef.current.categoriesDebiteur || loadingCategoriesDebiteur) return;

    setLoadingCategoriesDebiteur(true);
    setErrorCategoriesDebiteur(null);

    try {
      console.log('🔄 Chargement des catégories débiteur...');
      const response = await apiClient.get('/categories-debiteur');
      const data = response.data?.data || [];
      setCategoriesDebiteur(data);
      loadedRef.current.categoriesDebiteur = true;
      console.log('✅ Catégories débiteur chargées:', data.length, 'éléments');
    } catch (error: any) {
      console.error('❌ Erreur chargement catégories débiteur:', error);
      setErrorCategoriesDebiteur(error.message || 'Erreur lors du chargement des catégories débiteur');
    } finally {
      setLoadingCategoriesDebiteur(false);
    }
  }, [apiClient, isAuthenticated, loadingCategoriesDebiteur]);

  useEffect(() => {
    if (!autoLoad || !isAuthenticated) {
      return;
    }

    console.log('🚀 Début du chargement des données statiques...');
    Promise.all([
      loadQuartiers(),
      loadNationalites(),
      loadBanques(),
      loadCivilites(),
      loadTypesDebiteur(),
      loadCategoriesDebiteur(),
    ])
      .then(() => {
        console.log('🎉 Toutes les données statiques ont été chargées !');
      })
      .catch((error) => {
        console.error('❌ Erreur lors du chargement des données:', error);
      });
  }, [
    autoLoad,
    isAuthenticated,
    loadBanques,
    loadCategoriesDebiteur,
    loadCivilites,
    loadNationalites,
    loadQuartiers,
    loadTypesDebiteur,
  ]);

  useEffect(() => {
    if (!isAuthenticated) {
      loadedRef.current = createInitialLoadedFlags();
    }
  }, [isAuthenticated]);

  return {
    // Données
    quartiers,
    nationalites,
    banques,
    civilites,
    typesDebiteur,
    categoriesDebiteur,

    // États de chargement
    loadingQuartiers,
    loadingNationalites,
    loadingBanques,
    loadingCivilites,
    loadingTypesDebiteur,
    loadingCategoriesDebiteur,

    // États d'erreur
    errorQuartiers,
    errorNationalites,
    errorBanques,
    errorCivilites,
    errorTypesDebiteur,
    errorCategoriesDebiteur,

    // Fonctions de rechargement manuel
    reloadQuartiers: loadQuartiers,
    reloadNationalites: loadNationalites,
    reloadBanques: loadBanques,
    reloadCivilites: loadCivilites,
    reloadTypesDebiteur: loadTypesDebiteur,
    reloadCategoriesDebiteur: loadCategoriesDebiteur,
  };
}





