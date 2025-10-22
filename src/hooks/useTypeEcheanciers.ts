import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TypeEcheancierService } from "@/services/type-echeancier.service";
import { TypeEcheancierCreateRequest, TypeEcheancierUpdateRequest } from "@/types/type-echeancier";
import { useApiClient } from "./useApiClient";
import { useSessionWrapper } from "./useSessionWrapper";
import { toast } from "sonner";

export const typeEcheancierKeys = {
  all: ["type-echeanciers"] as const,
  lists: () => [...typeEcheancierKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...typeEcheancierKeys.lists(), { filters }] as const,
  details: () => [...typeEcheancierKeys.all, "detail"] as const,
  detail: (id: string) => [...typeEcheancierKeys.details(), id] as const,
  search: (term: string) => [...typeEcheancierKeys.all, "search", term] as const,
};

export function useTypeEcheanciers() {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: typeEcheancierKeys.lists(),
    queryFn: () => TypeEcheancierService.getAll(apiClient).then((res) => res.data),
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

export function useTypeEcheancier(code: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: typeEcheancierKeys.detail(code),
    queryFn: () => TypeEcheancierService.getByCode(apiClient, code),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!code,
  });
}

export function useSearchTypeEcheanciers(searchTerm: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: typeEcheancierKeys.search(searchTerm),
    queryFn: () => TypeEcheancierService.search(apiClient, searchTerm).then((res) => res.data),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!searchTerm,
    staleTime: 1000 * 60 * 2,
  });
}

export function useCreateTypeEcheancier() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (type: TypeEcheancierCreateRequest) => TypeEcheancierService.create(apiClient, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: typeEcheancierKeys.lists() });
      toast.success("TypeEcheancier créé avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la création du TypeEcheancier";
      toast.error(message);
    },
  });
}

export function useUpdateTypeEcheancier() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: ({ code, type }: { code: string; type: TypeEcheancierUpdateRequest }) =>
      TypeEcheancierService.update(apiClient, code, type),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: typeEcheancierKeys.lists() });
      queryClient.invalidateQueries({ queryKey: typeEcheancierKeys.detail(variables.code) });
      toast.success("TypeEcheancier mis à jour avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la mise à jour du TypeEcheancier";
      toast.error(message);
    },
  });
}

export function useDeleteTypeEcheancier() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (code: string) => TypeEcheancierService.delete(apiClient, code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: typeEcheancierKeys.lists() });
      toast.success("TypeEcheancier supprimé avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la suppression du TypeEcheancier";
      toast.error(message);
    },
  });
}
