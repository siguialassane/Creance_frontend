import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { VilleService } from "@/services/ville.service";
import { VilleCreateRequest, VilleUpdateRequest } from "@/types/ville";
import { useApiClient } from "./useApiClient";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export const villeKeys = {
  all: ["villes"] as const,
  lists: () => [...villeKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...villeKeys.lists(), { filters }] as const,
  details: () => [...villeKeys.all, "detail"] as const,
  detail: (id: string) => [...villeKeys.details(), id] as const,
  search: (term: string) => [...villeKeys.all, "search", term] as const,
};

export function useVilles() {
  const apiClient = useApiClient();
  const { data: session, status } = useSession();

  return useQuery({
    queryKey: villeKeys.lists(),
    queryFn: () => VilleService.getAll(apiClient).then((res) => res.data),
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

export function useVille(code: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSession();

  return useQuery({
    queryKey: villeKeys.detail(code),
    queryFn: () => VilleService.getByCode(apiClient, code),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!code,
  });
}

export function useSearchVilles(searchTerm: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSession();

  return useQuery({
    queryKey: villeKeys.search(searchTerm),
    queryFn: () => VilleService.search(apiClient, searchTerm).then((res) => res.data),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!searchTerm,
    staleTime: 1000 * 60 * 2, // 2 minutes pour les recherches
  });
}

export function useCreateVille() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (ville: VilleCreateRequest) => VilleService.create(apiClient, ville),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: villeKeys.lists() });
      toast.success("Ville créée avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la création de la ville";
      toast.error(message);
    },
  });
}

export function useUpdateVille() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: ({ code, ville }: { code: string; ville: VilleUpdateRequest }) =>
      VilleService.update(apiClient, code, ville),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: villeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: villeKeys.detail(variables.code) });
      toast.success("Ville mise à jour avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la mise à jour de la ville";
      toast.error(message);
    },
  });
}

export function useDeleteVille() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (code: string) => VilleService.delete(apiClient, code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: villeKeys.lists() });
      toast.success("Ville supprimée avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la suppression de la ville";
      toast.error(message);
    },
  });
}

