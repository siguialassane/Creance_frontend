import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TypeActeService } from "@/services/type-acte.service";
import { TypeActeCreateRequest, TypeActeUpdateRequest } from "@/types/type-acte";
import { useApiClient } from "./useApiClient";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export const typeActeKeys = {
  all: ["types-acte"] as const,
  lists: () => [...typeActeKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...typeActeKeys.lists(), { filters }] as const,
  details: () => [...typeActeKeys.all, "detail"] as const,
  detail: (id: string) => [...typeActeKeys.details(), id] as const,
  search: (term: string) => [...typeActeKeys.all, "search", term] as const,
};

export function useTypesActe() {
  const apiClient = useApiClient();
  const { data: session, status } = useSession();

  return useQuery({
    queryKey: typeActeKeys.lists(),
    queryFn: () => TypeActeService.getAll(apiClient).then((res) => res.data),
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

export function useTypeActe(code: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSession();

  return useQuery({
    queryKey: typeActeKeys.detail(code),
    queryFn: () => TypeActeService.getByCode(apiClient, code),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!code,
  });
}

export function useSearchTypesActe(searchTerm: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSession();

  return useQuery({
    queryKey: typeActeKeys.search(searchTerm),
    queryFn: () => TypeActeService.search(apiClient, searchTerm).then((res) => res.data),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!searchTerm,
    staleTime: 1000 * 60 * 2, // 2 minutes pour les recherches
  });
}

export function useCreateTypeActe() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (type: TypeActeCreateRequest) => TypeActeService.create(apiClient, type),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: typeActeKeys.lists() });
      toast.success("Type d'acte créé avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la création du type d'acte";
      toast.error(message);
    },
  });
}

export function useUpdateTypeActe() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: ({ code, type }: { code: string; type: TypeActeUpdateRequest }) =>
      TypeActeService.update(apiClient, code, type),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: typeActeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: typeActeKeys.detail(variables.code) });
      toast.success("Type d'acte mis à jour avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la mise à jour du type d'acte";
      toast.error(message);
    },
  });
}

export function useDeleteTypeActe() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (code: string) => TypeActeService.delete(apiClient, code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: typeActeKeys.lists() });
      toast.success("Type d'acte supprimé avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la suppression du type d'acte";
      toast.error(message);
    },
  });
}

