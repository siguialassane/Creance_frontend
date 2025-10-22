import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TypeRegularisationService } from "@/services/type-regularisation.service";
import { TypeRegularisationCreateRequest, TypeRegularisationUpdateRequest } from "@/types/type-regularisation";
import { useApiClient } from "./useApiClient";
import { useSessionWrapper } from "./useSessionWrapper";
import { toast } from "sonner";

export const typeRegularisationKeys = {
  all: ["type-regularisations"] as const,
  lists: () => [...typeRegularisationKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...typeRegularisationKeys.lists(), { filters }] as const,
  details: () => [...typeRegularisationKeys.all, "detail"] as const,
  detail: (id: string) => [...typeRegularisationKeys.details(), id] as const,
  search: (term: string) => [...typeRegularisationKeys.all, "search", term] as const,
};

export function useTypeRegularisations() {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: typeRegularisationKeys.lists(),
    queryFn: () => TypeRegularisationService.getAll(apiClient).then((res) => res.data),
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

export function useTypeRegularisation(code: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: typeRegularisationKeys.detail(code),
    queryFn: () => TypeRegularisationService.getByCode(apiClient, code),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!code,
  });
}

export function useSearchTypeRegularisations(searchTerm: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: typeRegularisationKeys.search(searchTerm),
    queryFn: () => TypeRegularisationService.search(apiClient, searchTerm).then((res) => res.data),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!searchTerm,
    staleTime: 1000 * 60 * 2,
  });
}

export function useCreateTypeRegularisation() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (type: TypeRegularisationCreateRequest) => TypeRegularisationService.create(apiClient, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: typeRegularisationKeys.lists() });
      toast.success("TypeRegularisation créé avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la création du TypeRegularisation";
      toast.error(message);
    },
  });
}

export function useUpdateTypeRegularisation() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: ({ code, type }: { code: string; type: TypeRegularisationUpdateRequest }) =>
      TypeRegularisationService.update(apiClient, code, type),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: typeRegularisationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: typeRegularisationKeys.detail(variables.code) });
      toast.success("TypeRegularisation mis à jour avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la mise à jour du TypeRegularisation";
      toast.error(message);
    },
  });
}

export function useDeleteTypeRegularisation() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (code: string) => TypeRegularisationService.delete(apiClient, code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: typeRegularisationKeys.lists() });
      toast.success("TypeRegularisation supprimé avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la suppression du TypeRegularisation";
      toast.error(message);
    },
  });
}
