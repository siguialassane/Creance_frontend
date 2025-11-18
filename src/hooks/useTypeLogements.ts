import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TypeLogementService } from "@/services/type-logement.service";
import { TypeLogementCreateRequest, TypeLogementUpdateRequest } from "@/types/type-logement";
import { useApiClient } from "./useApiClient";
import { useSessionWrapper } from "./useSessionWrapper";
import { toast } from "sonner";

export const typeLogementKeys = {
  all: ["type-logements"] as const,
  lists: () => [...typeLogementKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...typeLogementKeys.lists(), { filters }] as const,
  details: () => [...typeLogementKeys.all, "detail"] as const,
  detail: (id: string) => [...typeLogementKeys.details(), id] as const,
  search: (term: string) => [...typeLogementKeys.all, "search", term] as const,
};

export function useTypeLogements() {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: typeLogementKeys.lists(),
    queryFn: () => TypeLogementService.getAll(apiClient).then((res) => res.data),
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

export function useTypeLogement(code: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: typeLogementKeys.detail(code),
    queryFn: () => TypeLogementService.getByCode(apiClient, code),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!code,
  });
}

export function useSearchTypeLogements(searchTerm: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: typeLogementKeys.search(searchTerm),
    queryFn: () => TypeLogementService.search(apiClient, searchTerm).then((res) => res.data),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!searchTerm,
    staleTime: 1000 * 60 * 2,
  });
}

export function useCreateTypeLogement() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (type: TypeLogementCreateRequest) => TypeLogementService.create(apiClient, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: typeLogementKeys.lists() });
      toast.success("TypeLogement créé avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la création du TypeLogement";
      toast.error(message);
    },
  });
}

export function useUpdateTypeLogement() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: ({ code, type }: { code: string; type: TypeLogementUpdateRequest }) =>
      TypeLogementService.update(apiClient, code, type),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: typeLogementKeys.lists() });
      queryClient.invalidateQueries({ queryKey: typeLogementKeys.detail(variables.code) });
      toast.success("TypeLogement mis à jour avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la mise à jour du TypeLogement";
      toast.error(message);
    },
  });
}

export function useDeleteTypeLogement() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (code: string) => TypeLogementService.delete(apiClient, code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: typeLogementKeys.lists() });
      toast.success("TypeLogement supprimé avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la suppression du TypeLogement";
      toast.error(message);
    },
  });
}
