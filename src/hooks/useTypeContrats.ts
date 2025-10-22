import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TypeContratService } from "@/services/type-contrat.service";
import { TypeContratCreateRequest, TypeContratUpdateRequest } from "@/types/type-contrat";
import { useApiClient } from "./useApiClient";
import { useSessionWrapper } from "./useSessionWrapper";
import { toast } from "sonner";

export const typeContratKeys = {
  all: ["type-contrats"] as const,
  lists: () => [...typeContratKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...typeContratKeys.lists(), { filters }] as const,
  details: () => [...typeContratKeys.all, "detail"] as const,
  detail: (id: string) => [...typeContratKeys.details(), id] as const,
  search: (term: string) => [...typeContratKeys.all, "search", term] as const,
};

export function useTypeContrats() {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: typeContratKeys.lists(),
    queryFn: () => TypeContratService.getAll(apiClient).then((res) => res.data),
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

export function useTypeContrat(code: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: typeContratKeys.detail(code),
    queryFn: () => TypeContratService.getByCode(apiClient, code),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!code,
  });
}

export function useSearchTypeContrats(searchTerm: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: typeContratKeys.search(searchTerm),
    queryFn: () => TypeContratService.search(apiClient, searchTerm).then((res) => res.data),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!searchTerm,
    staleTime: 1000 * 60 * 2,
  });
}

export function useCreateTypeContrat() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (type: TypeContratCreateRequest) => TypeContratService.create(apiClient, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: typeContratKeys.lists() });
      toast.success("TypeContrat créé avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la création du TypeContrat";
      toast.error(message);
    },
  });
}

export function useUpdateTypeContrat() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: ({ code, type }: { code: string; type: TypeContratUpdateRequest }) =>
      TypeContratService.update(apiClient, code, type),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: typeContratKeys.lists() });
      queryClient.invalidateQueries({ queryKey: typeContratKeys.detail(variables.code) });
      toast.success("TypeContrat mis à jour avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la mise à jour du TypeContrat";
      toast.error(message);
    },
  });
}

export function useDeleteTypeContrat() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (code: string) => TypeContratService.delete(apiClient, code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: typeContratKeys.lists() });
      toast.success("TypeContrat supprimé avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la suppression du TypeContrat";
      toast.error(message);
    },
  });
}
