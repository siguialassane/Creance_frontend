import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TypeOvpService } from "@/services/type-ovp.service";
import { TypeOvpCreateRequest, TypeOvpUpdateRequest } from "@/types/type-ovp";
import { useApiClient } from "./useApiClient";
import { useSessionWrapper } from "./useSessionWrapper";
import { toast } from "sonner";

export const typeOvpKeys = {
  all: ["type-ovps"] as const,
  lists: () => [...typeOvpKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...typeOvpKeys.lists(), { filters }] as const,
  details: () => [...typeOvpKeys.all, "detail"] as const,
  detail: (id: string) => [...typeOvpKeys.details(), id] as const,
  search: (term: string) => [...typeOvpKeys.all, "search", term] as const,
};

export function useTypeOvps() {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: typeOvpKeys.lists(),
    queryFn: () => TypeOvpService.getAll(apiClient).then((res) => res.data),
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

export function useTypeOvp(code: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: typeOvpKeys.detail(code),
    queryFn: () => TypeOvpService.getByCode(apiClient, code),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!code,
  });
}

export function useSearchTypeOvps(searchTerm: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: typeOvpKeys.search(searchTerm),
    queryFn: () => TypeOvpService.search(apiClient, searchTerm).then((res) => res.data),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!searchTerm,
    staleTime: 1000 * 60 * 2,
  });
}

export function useCreateTypeOvp() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (type: TypeOvpCreateRequest) => TypeOvpService.create(apiClient, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: typeOvpKeys.lists() });
      toast.success("TypeOvp créé avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la création du TypeOvp";
      toast.error(message);
    },
  });
}

export function useUpdateTypeOvp() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: ({ code, type }: { code: string; type: TypeOvpUpdateRequest }) =>
      TypeOvpService.update(apiClient, code, type),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: typeOvpKeys.lists() });
      queryClient.invalidateQueries({ queryKey: typeOvpKeys.detail(variables.code) });
      toast.success("TypeOvp mis à jour avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la mise à jour du TypeOvp";
      toast.error(message);
    },
  });
}

export function useDeleteTypeOvp() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (code: string) => TypeOvpService.delete(apiClient, code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: typeOvpKeys.lists() });
      toast.success("TypeOvp supprimé avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la suppression du TypeOvp";
      toast.error(message);
    },
  });
}
