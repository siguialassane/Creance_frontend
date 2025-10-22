import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { EtapeService } from "@/services/etape.service";
import { EtapeCreateRequest, EtapeUpdateRequest } from "@/types/etape";
import { useApiClient } from "./useApiClient";
import { useSessionWrapper } from "./useSessionWrapper";
import { toast } from "sonner";

export const etapeKeys = {
  all: ["etapes"] as const,
  lists: () => [...etapeKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...etapeKeys.lists(), { filters }] as const,
  details: () => [...etapeKeys.all, "detail"] as const,
  detail: (id: string) => [...etapeKeys.details(), id] as const,
  search: (term: string) => [...etapeKeys.all, "search", term] as const,
};

export function useEtapes() {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: etapeKeys.lists(),
    queryFn: () => EtapeService.getAll(apiClient).then((res) => res.data),
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

export function useEtape(code: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: etapeKeys.detail(code),
    queryFn: () => EtapeService.getByCode(apiClient, code),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!code,
  });
}

export function useSearchEtapes(searchTerm: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: etapeKeys.search(searchTerm),
    queryFn: () => EtapeService.search(apiClient, searchTerm).then((res) => res.data),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!searchTerm,
    staleTime: 1000 * 60 * 2, // 2 minutes pour les recherches
  });
}

export function useCreateEtape() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (etape: EtapeCreateRequest) => EtapeService.create(apiClient, etape),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: etapeKeys.lists() });
      toast.success("Étape créée avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la création de l'étape";
      toast.error(message);
    },
  });
}

export function useUpdateEtape() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: ({ code, etape }: { code: string; etape: EtapeUpdateRequest }) =>
      EtapeService.update(apiClient, code, etape),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: etapeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: etapeKeys.detail(variables.code) });
      toast.success("Étape mise à jour avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la mise à jour de l'étape";
      toast.error(message);
    },
  });
}

export function useDeleteEtape() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (code: string) => EtapeService.delete(apiClient, code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: etapeKeys.lists() });
      toast.success("Étape supprimée avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la suppression de l'étape";
      toast.error(message);
    },
  });
}

