import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TypeGarantiePersonnelleService } from "@/services/type-garantie-personnelle.service";
import { TypeGarantiePersonnelleCreateRequest, TypeGarantiePersonnelleUpdateRequest } from "@/types/type-garantie-personnelle";
import { useApiClient } from "./useApiClient";
import { useSessionWrapper } from "./useSessionWrapper";
import { toast } from "sonner";

export const typeGarantiePersonnelleKeys = {
  all: ["type-garantie-personnelles"] as const,
  lists: () => [...typeGarantiePersonnelleKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...typeGarantiePersonnelleKeys.lists(), { filters }] as const,
  details: () => [...typeGarantiePersonnelleKeys.all, "detail"] as const,
  detail: (id: string) => [...typeGarantiePersonnelleKeys.details(), id] as const,
  search: (term: string) => [...typeGarantiePersonnelleKeys.all, "search", term] as const,
};

export function useTypeGarantiePersonnelles() {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: typeGarantiePersonnelleKeys.lists(),
    queryFn: () => TypeGarantiePersonnelleService.getAll(apiClient).then((res) => res.data),
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

export function useTypeGarantiePersonnelle(code: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: typeGarantiePersonnelleKeys.detail(code),
    queryFn: () => TypeGarantiePersonnelleService.getByCode(apiClient, code),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!code,
  });
}

export function useSearchTypeGarantiePersonnelles(searchTerm: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: typeGarantiePersonnelleKeys.search(searchTerm),
    queryFn: () => TypeGarantiePersonnelleService.search(apiClient, searchTerm).then((res) => res.data),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!searchTerm,
    staleTime: 1000 * 60 * 2,
  });
}

export function useCreateTypeGarantiePersonnelle() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (type: TypeGarantiePersonnelleCreateRequest) => TypeGarantiePersonnelleService.create(apiClient, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: typeGarantiePersonnelleKeys.lists() });
      toast.success("TypeGarantiePersonnelle créé avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la création du TypeGarantiePersonnelle";
      toast.error(message);
    },
  });
}

export function useUpdateTypeGarantiePersonnelle() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: ({ code, type }: { code: string; type: TypeGarantiePersonnelleUpdateRequest }) =>
      TypeGarantiePersonnelleService.update(apiClient, code, type),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: typeGarantiePersonnelleKeys.lists() });
      queryClient.invalidateQueries({ queryKey: typeGarantiePersonnelleKeys.detail(variables.code) });
      toast.success("TypeGarantiePersonnelle mis à jour avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la mise à jour du TypeGarantiePersonnelle";
      toast.error(message);
    },
  });
}

export function useDeleteTypeGarantiePersonnelle() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (code: string) => TypeGarantiePersonnelleService.delete(apiClient, code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: typeGarantiePersonnelleKeys.lists() });
      toast.success("TypeGarantiePersonnelle supprimé avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la suppression du TypeGarantiePersonnelle";
      toast.error(message);
    },
  });
}
