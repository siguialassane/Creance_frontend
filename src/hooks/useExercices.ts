import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ExerciceService } from "@/services/exercice.service";
import { ExerciceCreateRequest, ExerciceUpdateRequest } from "@/types/exercice";
import { useApiClient } from "./useApiClient";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export const exerciceKeys = {
  all: ["exercices"] as const,
  lists: () => [...exerciceKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...exerciceKeys.lists(), { filters }] as const,
  details: () => [...exerciceKeys.all, "detail"] as const,
  detail: (id: string) => [...exerciceKeys.details(), id] as const,
  search: (term: string) => [...exerciceKeys.all, "search", term] as const,
};

export function useExercices() {
  const apiClient = useApiClient();
  const { data: session, status } = useSession();

  return useQuery({
    queryKey: exerciceKeys.lists(),
    queryFn: () => ExerciceService.getAll(apiClient).then((res) => res.data),
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

export function useExercice(code: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSession();

  return useQuery({
    queryKey: exerciceKeys.detail(code),
    queryFn: () => ExerciceService.getByCode(apiClient, code),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!code,
  });
}

export function useSearchExercices(searchTerm: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSession();

  return useQuery({
    queryKey: exerciceKeys.search(searchTerm),
    queryFn: () => ExerciceService.search(apiClient, searchTerm).then((res) => res.data),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!searchTerm,
    staleTime: 1000 * 60 * 2, // 2 minutes pour les recherches
  });
}

export function useCreateExercice() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (exercice: ExerciceCreateRequest) => ExerciceService.create(apiClient, exercice),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: exerciceKeys.lists() });
      toast.success("Exercice créé avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la création de l'exercice";
      toast.error(message);
    },
  });
}

export function useUpdateExercice() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: ({ code, exercice }: { code: string; exercice: ExerciceUpdateRequest }) =>
      ExerciceService.update(apiClient, code, exercice),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: exerciceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: exerciceKeys.detail(variables.code) });
      toast.success("Exercice mis à jour avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la mise à jour de l'exercice";
      toast.error(message);
    },
  });
}

export function useDeleteExercice() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (code: string) => ExerciceService.delete(apiClient, code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: exerciceKeys.lists() });
      toast.success("Exercice supprimé avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la suppression de l'exercice";
      toast.error(message);
    },
  });
}

