import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BanqueService } from "@/services/banque.service";
import { Banque, BanqueCreateRequest, BanqueUpdateRequest } from "@/types/banque";
import { PaginationParams, PaginatedData, ApiError, extractPaginatedData } from "@/types/pagination";
import { useApiClient } from "./useApiClient";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useState } from "react";

// Clés de requête
export const banqueKeys = {
  all: ["banques"] as const,
  lists: () => [...banqueKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...banqueKeys.lists(), { filters }] as const,
  paginated: (params: PaginationParams) => [...banqueKeys.lists(), "paginated", params] as const,
  details: () => [...banqueKeys.all, "detail"] as const,
  detail: (id: string) => [...banqueKeys.details(), id] as const,
  search: (term: string) => [...banqueKeys.all, "search", term] as const,
};

/**
 * Hook pour récupérer toutes les banques avec pagination
 */
export function useBanquesPaginated(params: PaginationParams = {}) {
  const apiClient = useApiClient();
  const { data: session, status } = useSession();
  
  return useQuery({
    queryKey: banqueKeys.paginated(params),
    queryFn: () => BanqueService.getAll(apiClient, params),
    enabled: status === 'authenticated' && !!(session as { accessToken?: string })?.accessToken,
    retry: (failureCount, error: unknown) => {
      if ((error as ApiError)?.response?.status === 401) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook pour récupérer toutes les banques (méthode legacy)
 */
export function useBanques() {
  const apiClient = useApiClient();
  const { data: session, status } = useSession();
  
  return useQuery({
    queryKey: banqueKeys.lists(),
    queryFn: async () => {
      try {
        // On force explicitement le tri "récent -> ancien" côté back.
        // La vue "Banque" passe ensuite par des mécanismes UI sans pagination serveur,
        // donc l'ordre initial doit déjà être correct.
        const res = await BanqueService.getAll(apiClient, {
          page: 0,
          size: 50,
          sortBy: 'BQ_CODE',
          sortDirection: 'DESC',
        });

        const paginated = extractPaginatedData(res);
        return paginated.content;
      } catch (error) {
        console.error('❌ Erreur chargement banques:', error);
        return [];
      }
    },
    enabled: status === 'authenticated' && !!(session as { accessToken?: string })?.accessToken,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

/**
 * Hook pour récupérer une banque par son code
 */
export function useBanque(code: string) {
  const apiClient = useApiClient();
  
  return useQuery({
    queryKey: banqueKeys.detail(code),
    queryFn: () => BanqueService.getByCode(apiClient, code),
    enabled: !!code,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook pour rechercher des banques
 */
export function useSearchBanques(searchTerm: string) {
  const apiClient = useApiClient();
  
  return useQuery({
    queryKey: banqueKeys.search(searchTerm),
    queryFn: () => BanqueService.search(apiClient, searchTerm),
    enabled: !!searchTerm && searchTerm.length >= 2,
    staleTime: 2 * 60 * 1000, // 2 minutes pour les recherches
  });
}

/**
 * Hook pour créer une banque
 */
export function useCreateBanque() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (banque: BanqueCreateRequest) => BanqueService.create(apiClient, banque),
    onSuccess: (data) => {
      // Invalider et refetch les listes de banques
      queryClient.invalidateQueries({ queryKey: banqueKeys.lists() });
      toast.success("Banque créée avec succès");
    },
    onError: (error: unknown) => {
      const message = (error as ApiError)?.response?.data?.message || "Erreur lors de la création de la banque";
      toast.error(message);
    },
  });
}

/**
 * Hook pour mettre à jour une banque
 */
export function useUpdateBanque() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: ({ code, banque }: { code: string; banque: BanqueUpdateRequest }) =>
      BanqueService.update(apiClient, code, banque),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: banqueKeys.lists() });
      queryClient.invalidateQueries({ queryKey: banqueKeys.detail(variables.code) });
      toast.success("Banque mise à jour avec succès");
    },
    onError: (error: unknown) => {
      const message = (error as ApiError)?.response?.data?.message || "Erreur lors de la mise à jour de la banque";
      toast.error(message);
    },
  });
}


/**
 * Hook pour supprimer une banque
 */
export function useDeleteBanque() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (code: string) => BanqueService.delete(apiClient, code),
    onSuccess: (data, code) => {
      // Invalider les listes et supprimer le détail de la banque du cache
      queryClient.invalidateQueries({ queryKey: banqueKeys.lists() });
      queryClient.removeQueries({ queryKey: banqueKeys.detail(code) });
      toast.success("Banque supprimée avec succès");
    },
    onError: (error: unknown) => {
      const message = (error as ApiError)?.response?.data?.message || "Erreur lors de la suppression de la banque";
      toast.error(message);
    },
  });
}

/**
 * Hook personnalisé pour gérer la pagination des banques avec état local
 */
export function useBanquesWithPagination(initialParams: PaginationParams = {}) {
  const [params, setParams] = useState<PaginationParams>({
    page: 0,
    size: 50,
    search: '',
    sortDirection: 'DESC',
    ...initialParams
  });

  const query = useBanquesPaginated(params);

  const data: PaginatedData<Banque> = {
    ...extractPaginatedData(query.data),
    loading: query.isLoading,
    error: (query.error as ApiError)?.message || null,
  };

  const updateParams = (newParams: Partial<PaginationParams>) => {
    setParams(prev => ({ ...prev, ...newParams }));
  };

  const goToPage = (page: number) => {
    updateParams({ page });
  };

  const changePageSize = (size: number) => {
    updateParams({ size, page: 0 }); // Reset to first page when changing size
  };

  const setSearch = (search: string) => {
    updateParams({ search, page: 0 }); // Reset to first page when searching
  };

  const setSorting = (sortBy: string, sortDirection: 'ASC' | 'DESC') => {
    updateParams({ sortBy, sortDirection, page: 0 }); // Reset to first page when sorting
  };

  return {
    data,
    params,
    updateParams,
    goToPage,
    changePageSize,
    setSearch,
    setSorting,
    refetch: query.refetch,
  };
}

/**
 * Hook pour précharger une banque
 */
export function usePrefetchBanque() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return (code: string) => {
    queryClient.prefetchQuery({
      queryKey: banqueKeys.detail(code),
      queryFn: () => BanqueService.getByCode(apiClient, code),
      staleTime: 5 * 60 * 1000,
    });
  };
}


