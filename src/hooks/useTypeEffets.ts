import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TypeEffetService } from "@/services/type-effet.service";
import { TypeEffetCreateRequest, TypeEffetUpdateRequest } from "@/types/type-effet";
import { useApiClient } from "./useApiClient";
import { useSessionWrapper } from "./useSessionWrapper";
import { toast } from "sonner";

export const typeEffetKeys = {
  all: ["type-effets"] as const,
  lists: () => [...typeEffetKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...typeEffetKeys.lists(), { filters }] as const,
  details: () => [...typeEffetKeys.all, "detail"] as const,
  detail: (id: string) => [...typeEffetKeys.details(), id] as const,
  search: (term: string) => [...typeEffetKeys.all, "search", term] as const,
};

export function useTypeEffets() {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: typeEffetKeys.lists(),
    queryFn: () => TypeEffetService.getAll(apiClient).then((res) => res.data),
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

export function useTypeEffet(code: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: typeEffetKeys.detail(code),
    queryFn: () => TypeEffetService.getByCode(apiClient, code),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!code,
  });
}

export function useSearchTypeEffets(searchTerm: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: typeEffetKeys.search(searchTerm),
    queryFn: () => TypeEffetService.search(apiClient, searchTerm).then((res) => res.data),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!searchTerm,
    staleTime: 1000 * 60 * 2,
  });
}

export function useCreateTypeEffet() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (type: TypeEffetCreateRequest) => TypeEffetService.create(apiClient, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: typeEffetKeys.lists() });
      toast.success("TypeEffet créé avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la création du TypeEffet";
      toast.error(message);
    },
  });
}

export function useUpdateTypeEffet() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: ({ code, type }: { code: string; type: TypeEffetUpdateRequest }) =>
      TypeEffetService.update(apiClient, code, type),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: typeEffetKeys.lists() });
      queryClient.invalidateQueries({ queryKey: typeEffetKeys.detail(variables.code) });
      toast.success("TypeEffet mis à jour avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la mise à jour du TypeEffet";
      toast.error(message);
    },
  });
}

export function useDeleteTypeEffet() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (code: string) => TypeEffetService.delete(apiClient, code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: typeEffetKeys.lists() });
      toast.success("TypeEffet supprimé avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la suppression du TypeEffet";
      toast.error(message);
    },
  });
}
