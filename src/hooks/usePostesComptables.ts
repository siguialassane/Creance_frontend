import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PosteComptableService } from "@/services/poste-comptable.service";
import { PosteComptableCreateRequest, PosteComptableUpdateRequest } from "@/types/poste-comptable";
import { useApiClient } from "./useApiClient";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export const posteComptableKeys = {
  all: ["postes-comptables"] as const,
  lists: () => [...posteComptableKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...posteComptableKeys.lists(), { filters }] as const,
  details: () => [...posteComptableKeys.all, "detail"] as const,
  detail: (id: string) => [...posteComptableKeys.details(), id] as const,
  search: (term: string) => [...posteComptableKeys.all, "search", term] as const,
};

export function usePostesComptables() {
  const apiClient = useApiClient();
  const { data: session, status } = useSession();

  return useQuery({
    queryKey: posteComptableKeys.lists(),
    queryFn: () => PosteComptableService.getAll(apiClient).then((res) => res.data),
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

export function usePosteComptable(code: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSession();

  return useQuery({
    queryKey: posteComptableKeys.detail(code),
    queryFn: () => PosteComptableService.getByCode(apiClient, code),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!code,
  });
}

export function useSearchPostesComptables(searchTerm: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSession();

  return useQuery({
    queryKey: posteComptableKeys.search(searchTerm),
    queryFn: () => PosteComptableService.search(apiClient, searchTerm).then((res) => res.data),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!searchTerm,
    staleTime: 1000 * 60 * 2, // 2 minutes pour les recherches
  });
}

export function useCreatePosteComptable() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (poste: PosteComptableCreateRequest) => PosteComptableService.create(apiClient, poste),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: posteComptableKeys.lists() });
      toast.success("Poste comptable créé avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la création du poste comptable";
      toast.error(message);
    },
  });
}

export function useUpdatePosteComptable() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: ({ code, poste }: { code: string; poste: PosteComptableUpdateRequest }) =>
      PosteComptableService.update(apiClient, code, poste),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: posteComptableKeys.lists() });
      queryClient.invalidateQueries({ queryKey: posteComptableKeys.detail(variables.code) });
      toast.success("Poste comptable mis à jour avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la mise à jour du poste comptable";
      toast.error(message);
    },
  });
}

export function useDeletePosteComptable() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (code: string) => PosteComptableService.delete(apiClient, code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: posteComptableKeys.lists() });
      toast.success("Poste comptable supprimé avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la suppression du poste comptable";
      toast.error(message);
    },
  });
}

