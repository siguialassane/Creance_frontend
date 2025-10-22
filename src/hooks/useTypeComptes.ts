import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TypeCompteService } from "@/services/type-compte.service";
import { TypeCompteCreateRequest, TypeCompteUpdateRequest } from "@/types/type-compte";
import { useApiClient } from "./useApiClient";
import { useSessionWrapper } from "./useSessionWrapper";
import { toast } from "sonner";

export const typeCompteKeys = {
  all: ["type-comptes"] as const,
  lists: () => [...typeCompteKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...typeCompteKeys.lists(), { filters }] as const,
  details: () => [...typeCompteKeys.all, "detail"] as const,
  detail: (id: string) => [...typeCompteKeys.details(), id] as const,
  search: (term: string) => [...typeCompteKeys.all, "search", term] as const,
};

export function useTypeComptes() {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: typeCompteKeys.lists(),
    queryFn: () => TypeCompteService.getAll(apiClient).then((res) => res.data),
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

export function useTypeCompte(code: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: typeCompteKeys.detail(code),
    queryFn: () => TypeCompteService.getByCode(apiClient, code),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!code,
  });
}

export function useSearchTypeComptes(searchTerm: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: typeCompteKeys.search(searchTerm),
    queryFn: () => TypeCompteService.search(apiClient, searchTerm).then((res) => res.data),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!searchTerm,
    staleTime: 1000 * 60 * 2,
  });
}

export function useCreateTypeCompte() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (type: TypeCompteCreateRequest) => TypeCompteService.create(apiClient, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: typeCompteKeys.lists() });
      toast.success("TypeCompte créé avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la création du TypeCompte";
      toast.error(message);
    },
  });
}

export function useUpdateTypeCompte() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: ({ code, type }: { code: string; type: TypeCompteUpdateRequest }) =>
      TypeCompteService.update(apiClient, code, type),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: typeCompteKeys.lists() });
      queryClient.invalidateQueries({ queryKey: typeCompteKeys.detail(variables.code) });
      toast.success("TypeCompte mis à jour avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la mise à jour du TypeCompte";
      toast.error(message);
    },
  });
}

export function useDeleteTypeCompte() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (code: string) => TypeCompteService.delete(apiClient, code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: typeCompteKeys.lists() });
      toast.success("TypeCompte supprimé avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la suppression du TypeCompte";
      toast.error(message);
    },
  });
}
