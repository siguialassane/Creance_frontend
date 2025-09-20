import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CompteOperationService } from "@/services/compte-operation.service";
import { CompteOperationCreateRequest, CompteOperationUpdateRequest } from "@/types/compte-operation";
import { useApiClient } from "./useApiClient";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export const compteOperationKeys = {
  all: ["comptes-operation"] as const,
  lists: () => [...compteOperationKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...compteOperationKeys.lists(), { filters }] as const,
  details: () => [...compteOperationKeys.all, "detail"] as const,
  detail: (id: string) => [...compteOperationKeys.details(), id] as const,
  search: (term: string) => [...compteOperationKeys.all, "search", term] as const,
};

export function useComptesOperation() {
  const apiClient = useApiClient();
  const { data: session, status } = useSession();

  return useQuery({
    queryKey: compteOperationKeys.lists(),
    queryFn: () => CompteOperationService.getAll(apiClient).then((res) => res.data),
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

export function useCompteOperation(code: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSession();

  return useQuery({
    queryKey: compteOperationKeys.detail(code),
    queryFn: () => CompteOperationService.getByCode(apiClient, code),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!code,
  });
}

export function useSearchComptesOperation(searchTerm: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSession();

  return useQuery({
    queryKey: compteOperationKeys.search(searchTerm),
    queryFn: () => CompteOperationService.search(apiClient, searchTerm).then((res) => res.data),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!searchTerm,
    staleTime: 1000 * 60 * 2, // 2 minutes pour les recherches
  });
}

export function useCreateCompteOperation() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (compte: CompteOperationCreateRequest) => CompteOperationService.create(apiClient, compte),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: compteOperationKeys.lists() });
      toast.success("Compte d'opération créé avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la création du compte d'opération";
      toast.error(message);
    },
  });
}

export function useUpdateCompteOperation() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: ({ code, compte }: { code: string; compte: CompteOperationUpdateRequest }) =>
      CompteOperationService.update(apiClient, code, compte),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: compteOperationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: compteOperationKeys.detail(variables.code) });
      toast.success("Compte d'opération mis à jour avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la mise à jour du compte d'opération";
      toast.error(message);
    },
  });
}

export function useDeleteCompteOperation() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (code: string) => CompteOperationService.delete(apiClient, code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: compteOperationKeys.lists() });
      toast.success("Compte d'opération supprimé avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la suppression du compte d'opération";
      toast.error(message);
    },
  });
}

