import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CiviliteService } from "@/services/civilite.service";
import { CiviliteCreateRequest, CiviliteUpdateRequest } from "@/types/civilite";
import { useApiClient } from "./useApiClient";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export const civiliteKeys = {
  all: ["civilites"] as const,
  lists: () => [...civiliteKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...civiliteKeys.lists(), { filters }] as const,
  details: () => [...civiliteKeys.all, "detail"] as const,
  detail: (id: string) => [...civiliteKeys.details(), id] as const,
  search: (term: string) => [...civiliteKeys.all, "search", term] as const,
};

export function useCivilites() {
  const apiClient = useApiClient();
  const { data: session, status } = useSession();

  return useQuery({
    queryKey: civiliteKeys.lists(),
    queryFn: async () => {
      try {
        const res = await CiviliteService.getAll(apiClient);
        // res.data est déjà un tableau Civilite[]
        const data = res.data;
        console.log('✅ Données civilités chargées depuis l\'API:', data);
        return Array.isArray(data) ? data : [];
      } catch (error) {
        // En cas d'erreur, retourner les données mock
        console.log('API non disponible, utilisation des données mock pour civilités');
        // Les civilités sont statiques
        return [
          { id: "civ001", libelle: "Monsieur", code: "M" },
          { id: "civ002", libelle: "Madame", code: "MME" },
          { id: "civ003", libelle: "Mademoiselle", code: "MLLE" }
        ];
      }
    },
    enabled: status === 'authenticated' && !!(session as any)?.accessToken,
    retry: false,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function useCivilite(code: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSession();

  return useQuery({
    queryKey: civiliteKeys.detail(code),
    queryFn: () => CiviliteService.getByCode(apiClient, code),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!code,
  });
}

export function useSearchCivilites(searchTerm: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSession();

  return useQuery({
    queryKey: civiliteKeys.search(searchTerm),
    queryFn: () => CiviliteService.search(apiClient, searchTerm).then((res) => res.data),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!searchTerm,
    staleTime: 1000 * 60 * 2, // 2 minutes pour les recherches
  });
}

export function useCreateCivilite() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (civilite: CiviliteCreateRequest) => CiviliteService.create(apiClient, civilite),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: civiliteKeys.lists() });
      toast.success("Civilité créée avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la création de la civilité";
      toast.error(message);
    },
  });
}

export function useUpdateCivilite() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: ({ code, civilite }: { code: string; civilite: CiviliteUpdateRequest }) =>
      CiviliteService.update(apiClient, code, civilite),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: civiliteKeys.lists() });
      queryClient.invalidateQueries({ queryKey: civiliteKeys.detail(variables.code) });
      toast.success("Civilité mise à jour avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la mise à jour de la civilité";
      toast.error(message);
    },
  });
}

export function useDeleteCivilite() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (code: string) => CiviliteService.delete(apiClient, code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: civiliteKeys.lists() });
      toast.success("Civilité supprimée avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la suppression de la civilité";
      toast.error(message);
    },
  });
}