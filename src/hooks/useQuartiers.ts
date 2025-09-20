import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QuartierService } from "@/services/quartier.service";
import { QuartierCreateRequest, QuartierUpdateRequest } from "@/types/quartier";
import { useApiClient } from "./useApiClient";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export const quartierKeys = {
  all: ["quartiers"] as const,
  lists: () => [...quartierKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...quartierKeys.lists(), { filters }] as const,
  details: () => [...quartierKeys.all, "detail"] as const,
  detail: (id: string) => [...quartierKeys.details(), id] as const,
  search: (term: string) => [...quartierKeys.all, "search", term] as const,
};

export function useQuartiers() {
  const apiClient = useApiClient();
  const { data: session, status } = useSession();

  return useQuery({
    queryKey: quartierKeys.lists(),
    queryFn: () => QuartierService.getAll(apiClient).then((res) => res.data),
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

export function useQuartier(code: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSession();

  return useQuery({
    queryKey: quartierKeys.detail(code),
    queryFn: () => QuartierService.getByCode(apiClient, code),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!code,
  });
}

export function useSearchQuartiers(searchTerm: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSession();

  return useQuery({
    queryKey: quartierKeys.search(searchTerm),
    queryFn: () => QuartierService.search(apiClient, searchTerm).then((res) => res.data),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!searchTerm,
    staleTime: 1000 * 60 * 2, // 2 minutes pour les recherches
  });
}

export function useCreateQuartier() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (quartier: QuartierCreateRequest) => QuartierService.create(apiClient, quartier),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: quartierKeys.lists() });
      toast.success("Quartier créé avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la création du quartier";
      toast.error(message);
    },
  });
}

export function useUpdateQuartier() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: ({ code, quartier }: { code: string; quartier: QuartierUpdateRequest }) =>
      QuartierService.update(apiClient, code, quartier),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: quartierKeys.lists() });
      queryClient.invalidateQueries({ queryKey: quartierKeys.detail(variables.code) });
      toast.success("Quartier mis à jour avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la mise à jour du quartier";
      toast.error(message);
    },
  });
}

export function useDeleteQuartier() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (code: string) => QuartierService.delete(apiClient, code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quartierKeys.lists() });
      toast.success("Quartier supprimé avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la suppression du quartier";
      toast.error(message);
    },
  });
}

