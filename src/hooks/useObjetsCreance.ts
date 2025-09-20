import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ObjetCreanceService } from "@/services/objet-creance.service";
import { ObjetCreanceCreateRequest, ObjetCreanceUpdateRequest } from "@/types/objet-creance";
import { useApiClient } from "./useApiClient";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export const objetCreanceKeys = {
  all: ["objets-creance"] as const,
  lists: () => [...objetCreanceKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...objetCreanceKeys.lists(), { filters }] as const,
  details: () => [...objetCreanceKeys.all, "detail"] as const,
  detail: (id: string) => [...objetCreanceKeys.details(), id] as const,
  search: (term: string) => [...objetCreanceKeys.all, "search", term] as const,
};

export function useObjetsCreance() {
  const apiClient = useApiClient();
  const { data: session, status } = useSession();

  return useQuery({
    queryKey: objetCreanceKeys.lists(),
    queryFn: () => ObjetCreanceService.getAll(apiClient).then((res) => res.data),
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

export function useObjetCreance(code: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSession();

  return useQuery({
    queryKey: objetCreanceKeys.detail(code),
    queryFn: () => ObjetCreanceService.getByCode(apiClient, code),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!code,
  });
}

export function useSearchObjetsCreance(searchTerm: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSession();

  return useQuery({
    queryKey: objetCreanceKeys.search(searchTerm),
    queryFn: () => ObjetCreanceService.search(apiClient, searchTerm).then((res) => res.data),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!searchTerm,
    staleTime: 1000 * 60 * 2, // 2 minutes pour les recherches
  });
}

export function useCreateObjetCreance() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (objet: ObjetCreanceCreateRequest) => ObjetCreanceService.create(apiClient, objet),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: objetCreanceKeys.lists() });
      toast.success("Objet créance créé avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la création de l'objet créance";
      toast.error(message);
    },
  });
}

export function useUpdateObjetCreance() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: ({ code, objet }: { code: string; objet: ObjetCreanceUpdateRequest }) =>
      ObjetCreanceService.update(apiClient, code, objet),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: objetCreanceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: objetCreanceKeys.detail(variables.code) });
      toast.success("Objet créance mis à jour avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la mise à jour de l'objet créance";
      toast.error(message);
    },
  });
}

export function useDeleteObjetCreance() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (code: string) => ObjetCreanceService.delete(apiClient, code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: objetCreanceKeys.lists() });
      toast.success("Objet créance supprimé avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la suppression de l'objet créance";
      toast.error(message);
    },
  });
}

