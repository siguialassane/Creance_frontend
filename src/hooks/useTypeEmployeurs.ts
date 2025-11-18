import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TypeEmployeurService } from "@/services/type-employeur.service";
import { TypeEmployeurCreateRequest, TypeEmployeurUpdateRequest } from "@/types/type-employeur";
import { useApiClient } from "./useApiClient";
import { useSessionWrapper } from "./useSessionWrapper";
import { toast } from "sonner";

export const typeEmployeurKeys = {
  all: ["type-employeurs"] as const,
  lists: () => [...typeEmployeurKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...typeEmployeurKeys.lists(), { filters }] as const,
  details: () => [...typeEmployeurKeys.all, "detail"] as const,
  detail: (id: string) => [...typeEmployeurKeys.details(), id] as const,
  search: (term: string) => [...typeEmployeurKeys.all, "search", term] as const,
};

export function useTypeEmployeurs() {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: typeEmployeurKeys.lists(),
    queryFn: () => TypeEmployeurService.getAll(apiClient).then((res) => res.data),
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

export function useTypeEmployeur(code: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: typeEmployeurKeys.detail(code),
    queryFn: () => TypeEmployeurService.getByCode(apiClient, code),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!code,
  });
}

export function useSearchTypeEmployeurs(searchTerm: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: typeEmployeurKeys.search(searchTerm),
    queryFn: () => TypeEmployeurService.search(apiClient, searchTerm).then((res) => res.data),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!searchTerm,
    staleTime: 1000 * 60 * 2,
  });
}

export function useCreateTypeEmployeur() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (type: TypeEmployeurCreateRequest) => TypeEmployeurService.create(apiClient, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: typeEmployeurKeys.lists() });
      toast.success("TypeEmployeur créé avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la création du TypeEmployeur";
      toast.error(message);
    },
  });
}

export function useUpdateTypeEmployeur() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: ({ code, type }: { code: string; type: TypeEmployeurUpdateRequest }) =>
      TypeEmployeurService.update(apiClient, code, type),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: typeEmployeurKeys.lists() });
      queryClient.invalidateQueries({ queryKey: typeEmployeurKeys.detail(variables.code) });
      toast.success("TypeEmployeur mis à jour avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la mise à jour du TypeEmployeur";
      toast.error(message);
    },
  });
}

export function useDeleteTypeEmployeur() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (code: string) => TypeEmployeurService.delete(apiClient, code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: typeEmployeurKeys.lists() });
      toast.success("TypeEmployeur supprimé avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la suppression du TypeEmployeur";
      toast.error(message);
    },
  });
}
