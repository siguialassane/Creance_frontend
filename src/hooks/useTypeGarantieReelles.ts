import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TypeGarantieReelleService } from "@/services/type-garantie-reelle.service";
import { TypeGarantieReelleCreateRequest, TypeGarantieReelleUpdateRequest } from "@/types/type-garantie-reelle";
import { useApiClient } from "./useApiClient";
import { useSessionWrapper } from "./useSessionWrapper";
import { toast } from "sonner";

export const typeGarantieReelleKeys = {
  all: ["type-garantie-reelles"] as const,
  lists: () => [...typeGarantieReelleKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...typeGarantieReelleKeys.lists(), { filters }] as const,
  details: () => [...typeGarantieReelleKeys.all, "detail"] as const,
  detail: (id: string) => [...typeGarantieReelleKeys.details(), id] as const,
  search: (term: string) => [...typeGarantieReelleKeys.all, "search", term] as const,
};

export function useTypeGarantieReelles() {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: typeGarantieReelleKeys.lists(),
    queryFn: () => TypeGarantieReelleService.getAll(apiClient).then((res) => res.data),
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

export function useTypeGarantieReelle(code: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: typeGarantieReelleKeys.detail(code),
    queryFn: () => TypeGarantieReelleService.getByCode(apiClient, code),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!code,
  });
}

export function useSearchTypeGarantieReelles(searchTerm: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: typeGarantieReelleKeys.search(searchTerm),
    queryFn: () => TypeGarantieReelleService.search(apiClient, searchTerm).then((res) => res.data),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!searchTerm,
    staleTime: 1000 * 60 * 2,
  });
}

export function useCreateTypeGarantieReelle() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (type: TypeGarantieReelleCreateRequest) => TypeGarantieReelleService.create(apiClient, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: typeGarantieReelleKeys.lists() });
      toast.success("TypeGarantieReelle créé avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la création du TypeGarantieReelle";
      toast.error(message);
    },
  });
}

export function useUpdateTypeGarantieReelle() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: ({ code, type }: { code: string; type: TypeGarantieReelleUpdateRequest }) =>
      TypeGarantieReelleService.update(apiClient, code, type),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: typeGarantieReelleKeys.lists() });
      queryClient.invalidateQueries({ queryKey: typeGarantieReelleKeys.detail(variables.code) });
      toast.success("TypeGarantieReelle mis à jour avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la mise à jour du TypeGarantieReelle";
      toast.error(message);
    },
  });
}

export function useDeleteTypeGarantieReelle() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (code: string) => TypeGarantieReelleService.delete(apiClient, code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: typeGarantieReelleKeys.lists() });
      toast.success("TypeGarantieReelle supprimé avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la suppression du TypeGarantieReelle";
      toast.error(message);
    },
  });
}
