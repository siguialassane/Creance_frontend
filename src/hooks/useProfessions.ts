import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProfessionService } from "@/services/profession.service";
import { ProfessionCreateRequest, ProfessionUpdateRequest } from "@/types/profession";
import { useApiClient } from "./useApiClient";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export const professionKeys = {
  all: ["professions"] as const,
  lists: () => [...professionKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...professionKeys.lists(), { filters }] as const,
  details: () => [...professionKeys.all, "detail"] as const,
  detail: (id: string) => [...professionKeys.details(), id] as const,
  search: (term: string) => [...professionKeys.all, "search", term] as const,
};

export function useProfessions() {
  const apiClient = useApiClient();
  const { data: session, status } = useSession();

  return useQuery({
    queryKey: professionKeys.lists(),
    queryFn: async () => {
      try {
        const res = await ProfessionService.getAll(apiClient);
        return res.data;
      } catch (error) {
        // En cas d'erreur, retourner les données mock
        console.log('API non disponible, utilisation des données mock pour professions');
        const { mockProfessions } = await import("@/lib/mock-data");
        return mockProfessions;
      }
    },
    enabled: status === 'authenticated' && !!(session as any)?.accessToken,
    retry: false,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function useProfession(code: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSession();

  return useQuery({
    queryKey: professionKeys.detail(code),
    queryFn: () => ProfessionService.getByCode(apiClient, code),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!code,
  });
}

export function useSearchProfessions(searchTerm: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSession();

  return useQuery({
    queryKey: professionKeys.search(searchTerm),
    queryFn: () => ProfessionService.search(apiClient, searchTerm).then((res) => res.data),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!searchTerm,
    staleTime: 1000 * 60 * 2, // 2 minutes pour les recherches
  });
}

export function useCreateProfession() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (profession: ProfessionCreateRequest) => ProfessionService.create(apiClient, profession),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: professionKeys.lists() });
      toast.success("Profession créée avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la création de la profession";
      toast.error(message);
    },
  });
}

export function useUpdateProfession() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: ({ code, profession }: { code: string; profession: ProfessionUpdateRequest }) =>
      ProfessionService.update(apiClient, code, profession),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: professionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: professionKeys.detail(variables.code) });
      toast.success("Profession mise à jour avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la mise à jour de la profession";
      toast.error(message);
    },
  });
}

export function useDeleteProfession() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (code: string) => ProfessionService.delete(apiClient, code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: professionKeys.lists() });
      toast.success("Profession supprimée avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la suppression de la profession";
      toast.error(message);
    },
  });
}

