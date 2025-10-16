import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { NationaliteService } from "@/services/nationalite.service";
import { NationaliteCreateRequest, NationaliteUpdateRequest } from "@/types/nationalite";
import { useApiClient } from "./useApiClient";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export const nationaliteKeys = {
  all: ["nationalites"] as const,
  lists: () => [...nationaliteKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...nationaliteKeys.lists(), { filters }] as const,
  details: () => [...nationaliteKeys.all, "detail"] as const,
  detail: (id: string) => [...nationaliteKeys.details(), id] as const,
  search: (term: string) => [...nationaliteKeys.all, "search", term] as const,
};

export function useNationalites() {
  const apiClient = useApiClient();
  const { data: session, status } = useSession();

  return useQuery({
    queryKey: nationaliteKeys.lists(),
    queryFn: async () => {
      try {
        const res = await NationaliteService.getAll(apiClient);
        return res.data;
      } catch (error) {
        // En cas d'erreur, retourner les données mock
        console.log('API non disponible, utilisation des données mock pour nationalités');
        const { mockNationalites } = await import("@/lib/mock-data");
        return mockNationalites;
      }
    },
    enabled: status === 'authenticated' && !!(session as any)?.accessToken,
    retry: false,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function useNationalite(code: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSession();

  return useQuery({
    queryKey: nationaliteKeys.detail(code),
    queryFn: () => NationaliteService.getByCode(apiClient, code),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!code,
  });
}

export function useSearchNationalites(searchTerm: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSession();

  return useQuery({
    queryKey: nationaliteKeys.search(searchTerm),
    queryFn: () => NationaliteService.search(apiClient, searchTerm).then((res) => res.data),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!searchTerm,
    staleTime: 1000 * 60 * 2, // 2 minutes pour les recherches
  });
}

export function useCreateNationalite() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (nationalite: NationaliteCreateRequest) => NationaliteService.create(apiClient, nationalite),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: nationaliteKeys.lists() });
      toast.success("Nationalité créée avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la création de la nationalité";
      toast.error(message);
    },
  });
}

export function useUpdateNationalite() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: ({ code, nationalite }: { code: string; nationalite: NationaliteUpdateRequest }) =>
      NationaliteService.update(apiClient, code, nationalite),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: nationaliteKeys.lists() });
      queryClient.invalidateQueries({ queryKey: nationaliteKeys.detail(variables.code) });
      toast.success("Nationalité mise à jour avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la mise à jour de la nationalité";
      toast.error(message);
    },
  });
}

export function useDeleteNationalite() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (code: string) => NationaliteService.delete(apiClient, code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: nationaliteKeys.lists() });
      toast.success("Nationalité supprimée avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la suppression de la nationalité";
      toast.error(message);
    },
  });
}

