import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { TypeDebiteurService } from "@/services/type-debiteur.service";
import { TypeDebiteurCreateRequest, TypeDebiteurUpdateRequest } from "@/types/type-debiteur";
import { useApiClient } from "./useApiClient";
import { useSessionWrapper } from "./useSessionWrapper";
import { toast } from "sonner";

export const typeDebiteurKeys = {
  all: ["typesDebiteur"] as const,
  lists: () => [...typeDebiteurKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...typeDebiteurKeys.lists(), { filters }] as const,
  details: () => [...typeDebiteurKeys.all, "detail"] as const,
  detail: (id: string) => [...typeDebiteurKeys.details(), id] as const,
  search: (term: string) => [...typeDebiteurKeys.all, "search", term] as const,
};

export const useTypesDebiteur = () => {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: typeDebiteurKeys.lists(),
    queryFn: async () => {
      const res = await TypeDebiteurService.getAll(apiClient);
      const data = res.data?.content || res.data?.data || res.data || res;
      console.log('✅ Données types débiteur chargées depuis l\'API:', data);
      return Array.isArray(data) ? data : [];
    },
    enabled: status === 'authenticated' && !!(session as any)?.accessToken,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

export function useTypeDebiteur(code: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: typeDebiteurKeys.detail(code),
    queryFn: () => TypeDebiteurService.getByCode(apiClient, code),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!code,
  });
}

export function useSearchTypesDebiteur(searchTerm: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: typeDebiteurKeys.search(searchTerm),
    queryFn: () => TypeDebiteurService.search(apiClient, searchTerm).then((res) => res.data),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!searchTerm,
    staleTime: 1000 * 60 * 2, // 2 minutes pour les recherches
  });
}

export function useCreateTypeDebiteur() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (type: TypeDebiteurCreateRequest) => TypeDebiteurService.create(apiClient, type),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: typeDebiteurKeys.lists() });
      toast.success("Type débiteur créé avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la création du type débiteur";
      toast.error(message);
    },
  });
}

export function useUpdateTypeDebiteur() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: ({ code, type }: { code: string; type: TypeDebiteurUpdateRequest }) =>
      TypeDebiteurService.update(apiClient, code, type),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: typeDebiteurKeys.lists() });
      queryClient.invalidateQueries({ queryKey: typeDebiteurKeys.detail(variables.code) });
      toast.success("Type débiteur mis à jour avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la mise à jour du type débiteur";
      toast.error(message);
    },
  });
}

export function useDeleteTypeDebiteur() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (code: string) => TypeDebiteurService.delete(apiClient, code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: typeDebiteurKeys.lists() });
      toast.success("Type débiteur supprimé avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la suppression du type débiteur";
      toast.error(message);
    },
  });
}

