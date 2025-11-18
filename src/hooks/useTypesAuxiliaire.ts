import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TypeAuxiliaireService } from "@/services/type-auxiliaire.service";
import { TypeAuxiliaireCreateRequest, TypeAuxiliaireUpdateRequest } from "@/types/type-auxiliaire";
import { useApiClient } from "./useApiClient";
import { useSessionWrapper } from "./useSessionWrapper";
import { toast } from "sonner";

export const typeAuxiliaireKeys = {
  all: ["types-auxiliaire"] as const,
  lists: () => [...typeAuxiliaireKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...typeAuxiliaireKeys.lists(), { filters }] as const,
  details: () => [...typeAuxiliaireKeys.all, "detail"] as const,
  detail: (id: string) => [...typeAuxiliaireKeys.details(), id] as const,
  search: (term: string) => [...typeAuxiliaireKeys.all, "search", term] as const,
};

export function useTypesAuxiliaire() {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: typeAuxiliaireKeys.lists(),
    queryFn: () => TypeAuxiliaireService.getAll(apiClient).then((res) => res.data),
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

export function useTypeAuxiliaire(code: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: typeAuxiliaireKeys.detail(code),
    queryFn: () => TypeAuxiliaireService.getByCode(apiClient, code),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!code,
  });
}

export function useSearchTypesAuxiliaire(searchTerm: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: typeAuxiliaireKeys.search(searchTerm),
    queryFn: () => TypeAuxiliaireService.search(apiClient, searchTerm).then((res) => res.data),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!searchTerm,
    staleTime: 1000 * 60 * 2, // 2 minutes pour les recherches
  });
}

export function useCreateTypeAuxiliaire() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (type: TypeAuxiliaireCreateRequest) => TypeAuxiliaireService.create(apiClient, type),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: typeAuxiliaireKeys.lists() });
      toast.success("Type d'auxiliaire créé avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la création du type d'auxiliaire";
      toast.error(message);
    },
  });
}

export function useUpdateTypeAuxiliaire() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: ({ code, type }: { code: string; type: TypeAuxiliaireUpdateRequest }) =>
      TypeAuxiliaireService.update(apiClient, code, type),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: typeAuxiliaireKeys.lists() });
      queryClient.invalidateQueries({ queryKey: typeAuxiliaireKeys.detail(variables.code) });
      toast.success("Type d'auxiliaire mis à jour avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la mise à jour du type d'auxiliaire";
      toast.error(message);
    },
  });
}

export function useDeleteTypeAuxiliaire() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (code: string) => TypeAuxiliaireService.delete(apiClient, code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: typeAuxiliaireKeys.lists() });
      toast.success("Type d'auxiliaire supprimé avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la suppression du type d'auxiliaire";
      toast.error(message);
    },
  });
}

