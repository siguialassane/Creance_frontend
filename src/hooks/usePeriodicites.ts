import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PeriodiciteService } from "@/services/periodicite.service";
import { PeriodiciteCreateRequest, PeriodiciteUpdateRequest } from "@/types/periodicite";
import { useApiClient } from "./useApiClient";
import { useSessionWrapper } from "./useSessionWrapper";
import { toast } from "sonner";

export const periodiciteKeys = {
  all: ["periodicites"] as const,
  lists: () => [...periodiciteKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...periodiciteKeys.lists(), { filters }] as const,
  details: () => [...periodiciteKeys.all, "detail"] as const,
  detail: (id: string) => [...periodiciteKeys.details(), id] as const,
  search: (term: string) => [...periodiciteKeys.all, "search", term] as const,
};

export function usePeriodicites() {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: periodiciteKeys.lists(),
    queryFn: async () => {
      try {
        const res = await PeriodiciteService.getAll(apiClient);
        console.log('📦 Réponse brute periodicites:', res);
        
        // Structure réelle de l'API: { data: { content: [...], totalElements, ... } }
        // Le service retourne response.data, donc res = { data: { content: [...] }, ... }
        const data = (res as any)?.data?.content || (res as any)?.content || (res as any)?.data || [];
        
        console.log('✅ Données periodicites transformées:', data);
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error('❌ Erreur chargement periodicites:', error);
        return [];
      }
    },
    enabled: status === 'authenticated' && !!(session as any)?.accessToken,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function usePeriodicite(code: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: periodiciteKeys.detail(code),
    queryFn: () => PeriodiciteService.getByCode(apiClient, code),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!code,
  });
}

export function useSearchPeriodicites(searchTerm: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: periodiciteKeys.search(searchTerm),
    queryFn: () => PeriodiciteService.search(apiClient, searchTerm).then((res) => res.data),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!searchTerm,
    staleTime: 1000 * 60 * 2, // 2 minutes pour les recherches
  });
}

export function useCreatePeriodicite() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (periodicite: PeriodiciteCreateRequest) => PeriodiciteService.create(apiClient, periodicite),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: periodiciteKeys.lists() });
      toast.success("Périodicité créée avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la création de la périodicité";
      toast.error(message);
    },
  });
}

export function useUpdatePeriodicite() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: ({ code, periodicite }: { code: string; periodicite: PeriodiciteUpdateRequest }) =>
      PeriodiciteService.update(apiClient, code, periodicite),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: periodiciteKeys.lists() });
      queryClient.invalidateQueries({ queryKey: periodiciteKeys.detail(variables.code) });
      toast.success("Périodicité mise à jour avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la mise à jour de la périodicité";
      toast.error(message);
    },
  });
}

export function useDeletePeriodicite() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (code: string) => PeriodiciteService.delete(apiClient, code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: periodiciteKeys.lists() });
      toast.success("Périodicité supprimée avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la suppression de la périodicité";
      toast.error(message);
    },
  });
}

