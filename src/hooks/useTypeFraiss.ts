import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TypeFraisService } from "@/services/type-frais.service";
import { TypeFraisCreateRequest, TypeFraisUpdateRequest } from "@/types/type-frais";
import { useApiClient } from "./useApiClient";
import { useSessionWrapper } from "./useSessionWrapper";
import { toast } from "sonner";

export const typeFraisKeys = {
  all: ["type-frais"] as const,
  lists: () => [...typeFraisKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...typeFraisKeys.lists(), { filters }] as const,
  details: () => [...typeFraisKeys.all, "detail"] as const,
  detail: (id: string) => [...typeFraisKeys.details(), id] as const,
  search: (term: string) => [...typeFraisKeys.all, "search", term] as const,
};

export function useTypeFraiss() {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: typeFraisKeys.lists(),
    queryFn: () => TypeFraisService.getAll(apiClient).then((res) => res.data),
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

export function useTypeFrais(code: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: typeFraisKeys.detail(code),
    queryFn: () => TypeFraisService.getByCode(apiClient, code),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!code,
  });
}

export function useSearchTypeFraiss(searchTerm: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: typeFraisKeys.search(searchTerm),
    queryFn: () => TypeFraisService.search(apiClient, searchTerm).then((res) => res.data),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!searchTerm,
    staleTime: 1000 * 60 * 2,
  });
}

export function useCreateTypeFrais() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (type: TypeFraisCreateRequest) => TypeFraisService.create(apiClient, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: typeFraisKeys.lists() });
      toast.success("TypeFrais créé avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la création du TypeFrais";
      toast.error(message);
    },
  });
}

export function useUpdateTypeFrais() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: ({ code, type }: { code: string; type: TypeFraisUpdateRequest }) =>
      TypeFraisService.update(apiClient, code, type),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: typeFraisKeys.lists() });
      queryClient.invalidateQueries({ queryKey: typeFraisKeys.detail(variables.code) });
      toast.success("TypeFrais mis à jour avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la mise à jour du TypeFrais";
      toast.error(message);
    },
  });
}

export function useDeleteTypeFrais() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (code: string) => TypeFraisService.delete(apiClient, code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: typeFraisKeys.lists() });
      toast.success("TypeFrais supprimé avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la suppression du TypeFrais";
      toast.error(message);
    },
  });
}
