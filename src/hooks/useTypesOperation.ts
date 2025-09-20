import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TypeOperationService } from "@/services/type-operation.service";
import { TypeOperationCreateRequest, TypeOperationUpdateRequest } from "@/types/type-operation";
import { useApiClient } from "./useApiClient";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export const typeOperationKeys = {
  all: ["types-operation"] as const,
  lists: () => [...typeOperationKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...typeOperationKeys.lists(), { filters }] as const,
  details: () => [...typeOperationKeys.all, "detail"] as const,
  detail: (id: string) => [...typeOperationKeys.details(), id] as const,
  search: (term: string) => [...typeOperationKeys.all, "search", term] as const,
};

export function useTypesOperation() {
  const apiClient = useApiClient();
  const { data: session, status } = useSession();

  return useQuery({
    queryKey: typeOperationKeys.lists(),
    queryFn: () => TypeOperationService.getAll(apiClient).then((res) => res.data),
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

export function useTypeOperation(code: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSession();

  return useQuery({
    queryKey: typeOperationKeys.detail(code),
    queryFn: () => TypeOperationService.getByCode(apiClient, code),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!code,
  });
}

export function useSearchTypesOperation(searchTerm: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSession();

  return useQuery({
    queryKey: typeOperationKeys.search(searchTerm),
    queryFn: () => TypeOperationService.search(apiClient, searchTerm).then((res) => res.data),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!searchTerm,
    staleTime: 1000 * 60 * 2,
  });
}

export function useCreateTypeOperation() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (type: TypeOperationCreateRequest) => TypeOperationService.create(apiClient, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: typeOperationKeys.lists() });
      toast.success("Type d'opération créé avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la création du type d'opération";
      toast.error(message);
    },
  });
}

export function useUpdateTypeOperation() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: ({ code, type }: { code: string; type: TypeOperationUpdateRequest }) =>
      TypeOperationService.update(apiClient, code, type),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: typeOperationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: typeOperationKeys.detail(variables.code) });
      toast.success("Type d'opération mis à jour avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la mise à jour du type d'opération";
      toast.error(message);
    },
  });
}

export function useDeleteTypeOperation() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (code: string) => TypeOperationService.delete(apiClient, code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: typeOperationKeys.lists() });
      toast.success("Type d'opération supprimé avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la suppression du type d'opération";
      toast.error(message);
    },
  });
}