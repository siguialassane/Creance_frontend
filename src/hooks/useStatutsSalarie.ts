import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { StatutSalarieService } from "@/services/statut-salarie.service";
import { StatutSalarieCreateRequest, StatutSalarieUpdateRequest } from "@/types/statut-salarie";
import { useApiClient } from "./useApiClient";
import { useSessionWrapper } from "./useSessionWrapper";
import { toast } from "sonner";

export const statutSalarieKeys = {
  all: ["statuts-salarie"] as const,
  lists: () => [...statutSalarieKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...statutSalarieKeys.lists(), { filters }] as const,
  details: () => [...statutSalarieKeys.all, "detail"] as const,
  detail: (id: string) => [...statutSalarieKeys.details(), id] as const,
  search: (term: string) => [...statutSalarieKeys.all, "search", term] as const,
};

type UseStatutsSalarieOptions = {
  enabled?: boolean;
};

export function useStatutsSalarie(options: UseStatutsSalarieOptions = {}) {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();
  const { enabled = true } = options;
  const isSessionReady = status === 'authenticated' && !!(session as any)?.accessToken;

  return useQuery({
    queryKey: statutSalarieKeys.lists(),
    queryFn: async () => {
      const res = await StatutSalarieService.getAll(apiClient);
      const data = res.data?.content || res.data?.data || res.data || res;
      console.log('✅ Données statuts salarié chargées depuis l\'API:', data);
      return Array.isArray(data) ? data : [];
    },
    enabled: enabled && isSessionReady,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function useStatutSalarie(code: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: statutSalarieKeys.detail(code),
    queryFn: () => StatutSalarieService.getByCode(apiClient, code),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!code,
  });
}

export function useSearchStatutsSalarie(searchTerm: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: statutSalarieKeys.search(searchTerm),
    queryFn: () => StatutSalarieService.search(apiClient, searchTerm).then((res) => res.data),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!searchTerm,
    staleTime: 1000 * 60 * 2, // 2 minutes pour les recherches
  });
}

export function useCreateStatutSalarie() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (statut: StatutSalarieCreateRequest) => StatutSalarieService.create(apiClient, statut),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: statutSalarieKeys.lists() });
      toast.success("Statut salarié créé avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la création du statut salarié";
      toast.error(message);
    },
  });
}

export function useUpdateStatutSalarie() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: ({ code, statut }: { code: string; statut: StatutSalarieUpdateRequest }) =>
      StatutSalarieService.update(apiClient, code, statut),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: statutSalarieKeys.lists() });
      queryClient.invalidateQueries({ queryKey: statutSalarieKeys.detail(variables.code) });
      toast.success("Statut salarié mis à jour avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la mise à jour du statut salarié";
      toast.error(message);
    },
  });
}

export function useDeleteStatutSalarie() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (code: string) => StatutSalarieService.delete(apiClient, code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: statutSalarieKeys.lists() });
      toast.success("Statut salarié supprimé avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la suppression du statut salarié";
      toast.error(message);
    },
  });
}
