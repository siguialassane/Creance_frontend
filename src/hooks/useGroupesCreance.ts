import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GroupeCreanceService } from "@/services/groupe-creance.service";
import { GroupeCreanceCreateRequest, GroupeCreanceUpdateRequest } from "@/types/groupe-creance";
import { useApiClient } from "./useApiClient";
import { useSessionWrapper } from "./useSessionWrapper";
import { toast } from "sonner";

export const groupeCreanceKeys = {
  all: ["groupes-creance"] as const,
  lists: () => [...groupeCreanceKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...groupeCreanceKeys.lists(), { filters }] as const,
  details: () => [...groupeCreanceKeys.all, "detail"] as const,
  detail: (id: string) => [...groupeCreanceKeys.details(), id] as const,
  search: (term: string) => [...groupeCreanceKeys.all, "search", term] as const,
};

export function useGroupesCreance() {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: groupeCreanceKeys.lists(),
    queryFn: () => GroupeCreanceService.getAll(apiClient).then((res) => res.data),
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

export function useGroupeCreance(code: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: groupeCreanceKeys.detail(code),
    queryFn: () => GroupeCreanceService.getByCode(apiClient, code),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!code,
  });
}

export function useSearchGroupesCreance(searchTerm: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: groupeCreanceKeys.search(searchTerm),
    queryFn: () => GroupeCreanceService.search(apiClient, searchTerm).then((res) => res.data),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!searchTerm,
    staleTime: 1000 * 60 * 2, // 2 minutes pour les recherches
  });
}

export function useCreateGroupeCreance() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (groupe: GroupeCreanceCreateRequest) => GroupeCreanceService.create(apiClient, groupe),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: groupeCreanceKeys.lists() });
      toast.success("Groupe créance créé avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la création du groupe créance";
      toast.error(message);
    },
  });
}

export function useUpdateGroupeCreance() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: ({ code, groupe }: { code: string; groupe: GroupeCreanceUpdateRequest }) =>
      GroupeCreanceService.update(apiClient, code, groupe),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: groupeCreanceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: groupeCreanceKeys.detail(variables.code) });
      toast.success("Groupe créance mis à jour avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la mise à jour du groupe créance";
      toast.error(message);
    },
  });
}

export function useDeleteGroupeCreance() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (code: string) => GroupeCreanceService.delete(apiClient, code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupeCreanceKeys.lists() });
      toast.success("Groupe créance supprimé avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la suppression du groupe créance";
      toast.error(message);
    },
  });
}

