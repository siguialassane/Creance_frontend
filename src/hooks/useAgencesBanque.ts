import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AgenceBanqueService } from "@/services/agence-banque.service";
import { AgenceBanque, AgenceBanqueCreateRequest, AgenceBanqueUpdateRequest } from "@/types/agence-banque";
import { PaginationParams, PaginatedData, ApiError, extractPaginatedData } from "@/types/pagination";
import { useApiClient } from "./useApiClient";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useState } from "react";

// Clés de requête
export const agenceBanqueKeys = {
  all: ["banque-agences"] as const,
  lists: () => [...agenceBanqueKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...agenceBanqueKeys.lists(), { filters }] as const,
  paginated: (params: PaginationParams) => [...agenceBanqueKeys.lists(), "paginated", params] as const,
  details: () => [...agenceBanqueKeys.all, "detail"] as const,
  detail: (id: string) => [...agenceBanqueKeys.details(), id] as const,
  search: (term: string) => [...agenceBanqueKeys.all, "search", term] as const,
  byBanque: (banqueCode: string) => [...agenceBanqueKeys.all, "by-banque", banqueCode] as const,
};

/**
 * Hook pour récupérer toutes les agences bancaires avec pagination
 */
export function useAgencesBanquePaginated(params: PaginationParams = {}) {
  const apiClient = useApiClient();
  const { data: session, status } = useSession();
  
  return useQuery({
    queryKey: agenceBanqueKeys.paginated(params),
    queryFn: () => AgenceBanqueService.getAll(apiClient, params).then((res) => res.data),
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
 * Hook pour récupérer toutes les agences bancaires (méthode legacy)
 */
type UseAgencesBanqueOptions = {
  enabled?: boolean;
};

export function useAgencesBanque(options: UseAgencesBanqueOptions = {}) {
  const apiClient = useApiClient();
  const { data: session, status } = useSession();
  const { enabled = true } = options;
  const isSessionReady = status === 'authenticated' && !!(session as { accessToken?: string })?.accessToken;
  
  return useQuery({
    queryKey: agenceBanqueKeys.lists(),
    queryFn: async () => {
      const res = await AgenceBanqueService.getAllLegacy(apiClient);
      const data = res.data?.content || res.data?.data || res.data || res;
      console.log('✅ Données agences banque chargées depuis l\'API:', data);
      return Array.isArray(data) ? data : [];
    },
    enabled: enabled && isSessionReady,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook pour récupérer une agence bancaire par son code
 */
export function useAgenceBanque(code: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSession();
  
  return useQuery({
    queryKey: agenceBanqueKeys.detail(code),
    queryFn: () => AgenceBanqueService.getByCode(apiClient, code),
    enabled: status === 'authenticated' && !!(session as { accessToken?: string })?.accessToken && !!code,
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
 * Hook pour rechercher des agences bancaires
 */
export function useSearchAgencesBanque(searchTerm: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSession();
  
  return useQuery({
    queryKey: agenceBanqueKeys.search(searchTerm),
    queryFn: () => AgenceBanqueService.search(apiClient, searchTerm).then((res) => res.data),
    enabled: status === 'authenticated' && !!(session as { accessToken?: string })?.accessToken && searchTerm.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes pour les recherches
  });
}

/**
 * Hook pour récupérer les agences d'une banque
 */
export function useAgencesByBanque(banqueCode: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSession();
  
  return useQuery({
    queryKey: agenceBanqueKeys.byBanque(banqueCode),
    queryFn: () => AgenceBanqueService.getByBanque(apiClient, banqueCode).then((res) => res.data),
    enabled: status === 'authenticated' && !!(session as { accessToken?: string })?.accessToken && !!banqueCode,
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
 * Hook pour créer une agence bancaire
 */
export function useCreateAgenceBanque() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (agence: AgenceBanqueCreateRequest) => AgenceBanqueService.create(apiClient, agence),
    onSuccess: () => {
      // Invalider et refetch les listes d'agences bancaires
      queryClient.invalidateQueries({ queryKey: agenceBanqueKeys.lists() });
      toast.success("Agence bancaire créée avec succès");
    },
    onError: (error: unknown) => {
      const message = (error as ApiError)?.response?.data?.message || "Erreur lors de la création de l'agence bancaire";
      toast.error(message);
    },
  });
}

/**
 * Hook pour mettre à jour une agence bancaire
 */
export function useUpdateAgenceBanque() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: ({ code, agence }: { code: string; agence: AgenceBanqueUpdateRequest }) =>
      AgenceBanqueService.update(apiClient, code, agence),
    onSuccess: (data, variables) => {
      // Invalider les listes et le détail de l'agence bancaire
      queryClient.invalidateQueries({ queryKey: agenceBanqueKeys.lists() });
      queryClient.invalidateQueries({ queryKey: agenceBanqueKeys.detail(variables.code) });
      toast.success("Agence bancaire mise à jour avec succès");
    },
    onError: (error: unknown) => {
      const message = (error as ApiError)?.response?.data?.message || "Erreur lors de la mise à jour de l'agence bancaire";
      toast.error(message);
    },
  });
}

/**
 * Hook pour supprimer une agence bancaire
 */
export function useDeleteAgenceBanque() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (code: string) => AgenceBanqueService.delete(apiClient, code),
    onSuccess: (data, code) => {
      // Invalider les listes et le détail de l'agence bancaire
      queryClient.invalidateQueries({ queryKey: agenceBanqueKeys.lists() });
      queryClient.invalidateQueries({ queryKey: agenceBanqueKeys.detail(code) });
      toast.success("Agence bancaire supprimée avec succès");
    },
    onError: (error: unknown) => {
      const message = (error as ApiError)?.response?.data?.message || "Erreur lors de la suppression de l'agence bancaire";
      toast.error(message);
    },
  });
}

/**
 * Hook personnalisé pour gérer la pagination des agences bancaires avec état local
 */
export function useAgencesBanqueWithPagination(initialParams: PaginationParams = {}) {
  const [params, setParams] = useState<PaginationParams>({
    page: 0,
    size: 50,
    search: '',
    sortDirection: 'DESC',
    ...initialParams
  });

  const query = useAgencesBanquePaginated(params);

  const data: PaginatedData<AgenceBanque> = {
    ...extractPaginatedData(query.data as any),
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
