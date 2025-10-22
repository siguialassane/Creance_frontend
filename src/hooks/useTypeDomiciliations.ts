import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TypeDomiciliationService } from "@/services/type-domiciliation.service";
import { TypeDomiciliationCreateRequest, TypeDomiciliationUpdateRequest } from "@/types/type-domiciliation";
import { useApiClient } from "./useApiClient";
import { useSessionWrapper } from "./useSessionWrapper";
import { toast } from "sonner";

export const typeDomiciliationKeys = {
  all: ["type-domiciliations"] as const,
  lists: () => [...typeDomiciliationKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...typeDomiciliationKeys.lists(), { filters }] as const,
  details: () => [...typeDomiciliationKeys.all, "detail"] as const,
  detail: (id: string) => [...typeDomiciliationKeys.details(), id] as const,
  search: (term: string) => [...typeDomiciliationKeys.all, "search", term] as const,
};

export function useTypeDomiciliations() {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: typeDomiciliationKeys.lists(),
    queryFn: () => TypeDomiciliationService.getAll(apiClient).then((res) => res.data),
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

export function useTypeDomiciliation(code: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: typeDomiciliationKeys.detail(code),
    queryFn: () => TypeDomiciliationService.getByCode(apiClient, code),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!code,
  });
}

export function useSearchTypeDomiciliations(searchTerm: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: typeDomiciliationKeys.search(searchTerm),
    queryFn: () => TypeDomiciliationService.search(apiClient, searchTerm).then((res) => res.data),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!searchTerm,
    staleTime: 1000 * 60 * 2,
  });
}

export function useCreateTypeDomiciliation() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (type: TypeDomiciliationCreateRequest) => TypeDomiciliationService.create(apiClient, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: typeDomiciliationKeys.lists() });
      toast.success("TypeDomiciliation créé avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la création du TypeDomiciliation";
      toast.error(message);
    },
  });
}

export function useUpdateTypeDomiciliation() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: ({ code, type }: { code: string; type: TypeDomiciliationUpdateRequest }) =>
      TypeDomiciliationService.update(apiClient, code, type),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: typeDomiciliationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: typeDomiciliationKeys.detail(variables.code) });
      toast.success("TypeDomiciliation mis à jour avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la mise à jour du TypeDomiciliation";
      toast.error(message);
    },
  });
}

export function useDeleteTypeDomiciliation() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (code: string) => TypeDomiciliationService.delete(apiClient, code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: typeDomiciliationKeys.lists() });
      toast.success("TypeDomiciliation supprimé avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la suppression du TypeDomiciliation";
      toast.error(message);
    },
  });
}
