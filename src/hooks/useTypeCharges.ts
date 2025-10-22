import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TypeChargeService } from "@/services/type-charge.service";
import { TypeChargeCreateRequest, TypeChargeUpdateRequest } from "@/types/type-charge";
import { useApiClient } from "./useApiClient";
import { useSessionWrapper } from "./useSessionWrapper";
import { toast } from "sonner";

export const typeChargeKeys = {
  all: ["type-charges"] as const,
  lists: () => [...typeChargeKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...typeChargeKeys.lists(), { filters }] as const,
  details: () => [...typeChargeKeys.all, "detail"] as const,
  detail: (id: string) => [...typeChargeKeys.details(), id] as const,
  search: (term: string) => [...typeChargeKeys.all, "search", term] as const,
};

export function useTypeCharges() {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: typeChargeKeys.lists(),
    queryFn: () => TypeChargeService.getAll(apiClient).then((res) => res.data),
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

export function useTypeCharge(code: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: typeChargeKeys.detail(code),
    queryFn: () => TypeChargeService.getByCode(apiClient, code),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!code,
  });
}

export function useSearchTypeCharges(searchTerm: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: typeChargeKeys.search(searchTerm),
    queryFn: () => TypeChargeService.search(apiClient, searchTerm).then((res) => res.data),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!searchTerm,
    staleTime: 1000 * 60 * 2,
  });
}

export function useCreateTypeCharge() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (type: TypeChargeCreateRequest) => TypeChargeService.create(apiClient, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: typeChargeKeys.lists() });
      toast.success("TypeCharge créé avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la création du TypeCharge";
      toast.error(message);
    },
  });
}

export function useUpdateTypeCharge() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: ({ code, type }: { code: string; type: TypeChargeUpdateRequest }) =>
      TypeChargeService.update(apiClient, code, type),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: typeChargeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: typeChargeKeys.detail(variables.code) });
      toast.success("TypeCharge mis à jour avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la mise à jour du TypeCharge";
      toast.error(message);
    },
  });
}

export function useDeleteTypeCharge() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (code: string) => TypeChargeService.delete(apiClient, code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: typeChargeKeys.lists() });
      toast.success("TypeCharge supprimé avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la suppression du TypeCharge";
      toast.error(message);
    },
  });
}
