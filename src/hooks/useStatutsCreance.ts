import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { StatutCreanceService } from "@/services/statut-creance.service";
import { StatutCreanceCreateRequest, StatutCreanceUpdateRequest } from "@/types/statut-creance";
import { useApiClient } from "./useApiClient";
import { useSessionWrapper } from "./useSessionWrapper";
import { toast } from "sonner";

export const statutCreanceKeys = {
  all: ["statuts-creance"] as const,
  lists: () => [...statutCreanceKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...statutCreanceKeys.lists(), { filters }] as const,
  details: () => [...statutCreanceKeys.all, "detail"] as const,
  detail: (id: string) => [...statutCreanceKeys.details(), id] as const,
  search: (term: string) => [...statutCreanceKeys.all, "search", term] as const,
};

export function useStatutsCreance() {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: statutCreanceKeys.lists(),
    queryFn: () => StatutCreanceService.getAll(apiClient).then((res) => res.data),
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

export function useStatutCreance(code: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: statutCreanceKeys.detail(code),
    queryFn: () => StatutCreanceService.getByCode(apiClient, code),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!code,
  });
}

export function useSearchStatutsCreance(searchTerm: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: statutCreanceKeys.search(searchTerm),
    queryFn: () => StatutCreanceService.search(apiClient, searchTerm).then((res) => res.data),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!searchTerm,
    staleTime: 1000 * 60 * 2, // 2 minutes pour les recherches
  });
}

export function useCreateStatutCreance() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (statut: StatutCreanceCreateRequest) => StatutCreanceService.create(apiClient, statut),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: statutCreanceKeys.lists() });
      toast.success("Statut créance créé avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la création du statut créance";
      toast.error(message);
    },
  });
}

export function useUpdateStatutCreance() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: ({ code, statut }: { code: string; statut: StatutCreanceUpdateRequest }) =>
      StatutCreanceService.update(apiClient, code, statut),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: statutCreanceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: statutCreanceKeys.detail(variables.code) });
      toast.success("Statut créance mis à jour avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la mise à jour du statut créance";
      toast.error(message);
    },
  });
}

export function useDeleteStatutCreance() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (code: string) => StatutCreanceService.delete(apiClient, code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: statutCreanceKeys.lists() });
      toast.success("Statut créance supprimé avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la suppression du statut créance";
      toast.error(message);
    },
  });
}

