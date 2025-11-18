import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { EntiteService } from "@/services/entite.service";
import { EntiteCreateRequest, EntiteUpdateRequest } from "@/types/entite";
import { useApiClient } from "./useApiClient";
import { useSessionWrapper } from "./useSessionWrapper";
import { toast } from "sonner";

export const entiteKeys = {
  all: ["entites"] as const,
  lists: () => [...entiteKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...entiteKeys.lists(), { filters }] as const,
  details: () => [...entiteKeys.all, "detail"] as const,
  detail: (id: string) => [...entiteKeys.details(), id] as const,
  search: (term: string) => [...entiteKeys.all, "search", term] as const,
};

type UseEntitesOptions = {
  enabled?: boolean;
};

export function useEntites(options: UseEntitesOptions = {}) {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();
  const { enabled = true } = options;
  const isSessionReady = status === 'authenticated' && !!(session as any)?.accessToken;

  return useQuery({
    queryKey: entiteKeys.lists(),
    queryFn: async () => {
      console.log('🔍 [useEntites] Début du chargement...');
      const res = await EntiteService.getAll(apiClient);
      console.log('📦 [useEntites] Réponse brute:', res);
      console.log('📦 [useEntites] res.data:', res.data);
      console.log('📦 [useEntites] res.data?.content:', res.data?.content);

      const data = res.data?.content || res.data?.data || res.data || res;
      console.log('✅ [useEntites] Données finales:', data);
      console.log('✅ [useEntites] Nombre d\'éléments:', Array.isArray(data) ? data.length : 'N/A');

      if (Array.isArray(data) && data.length > 0) {
        console.log('✅ [useEntites] Premier élément:', data[0]);
        console.log('✅ [useEntites] Clés disponibles:', Object.keys(data[0]));
      }

      return Array.isArray(data) ? data : [];
    },
    enabled: enabled && isSessionReady,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function useEntite(code: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: entiteKeys.detail(code),
    queryFn: () => EntiteService.getByCode(apiClient, code),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!code,
  });
}

export function useSearchEntites(searchTerm: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: entiteKeys.search(searchTerm),
    queryFn: () => EntiteService.search(apiClient, searchTerm).then((res) => res.data),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!searchTerm,
    staleTime: 1000 * 60 * 2, // 2 minutes pour les recherches
  });
}

export function useCreateEntite() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (entite: EntiteCreateRequest) => EntiteService.create(apiClient, entite),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: entiteKeys.lists() });
      toast.success("Entité créée avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la création de l'entité";
      toast.error(message);
    },
  });
}

export function useUpdateEntite() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: ({ code, entite }: { code: string; entite: EntiteUpdateRequest }) =>
      EntiteService.update(apiClient, code, entite),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: entiteKeys.lists() });
      queryClient.invalidateQueries({ queryKey: entiteKeys.detail(variables.code) });
      toast.success("Entité mise à jour avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la mise à jour de l'entité";
      toast.error(message);
    },
  });
}

export function useDeleteEntite() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (code: string) => EntiteService.delete(apiClient, code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: entiteKeys.lists() });
      toast.success("Entité supprimée avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la suppression de l'entité";
      toast.error(message);
    },
  });
}
