import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ClasseService } from "@/services/classe.service";
import { ClasseCreateRequest, ClasseUpdateRequest } from "@/types/classe";
import { useApiClient } from "./useApiClient";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export const classeKeys = {
  all: ["classes"] as const,
  lists: () => [...classeKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...classeKeys.lists(), { filters }] as const,
  details: () => [...classeKeys.all, "detail"] as const,
  detail: (id: string) => [...classeKeys.details(), id] as const,
  search: (term: string) => [...classeKeys.all, "search", term] as const,
};

export function useClasses() {
  const apiClient = useApiClient();
  const { data: session, status } = useSession();

  return useQuery({
    queryKey: classeKeys.lists(),
    queryFn: () => ClasseService.getAll(apiClient).then((res) => res.data),
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

export function useClasse(code: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSession();

  return useQuery({
    queryKey: classeKeys.detail(code),
    queryFn: () => ClasseService.getByCode(apiClient, code),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!code,
  });
}

export function useSearchClasses(searchTerm: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSession();

  return useQuery({
    queryKey: classeKeys.search(searchTerm),
    queryFn: () => ClasseService.search(apiClient, searchTerm).then((res) => res.data),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!searchTerm,
    staleTime: 1000 * 60 * 2, // 2 minutes pour les recherches
  });
}

export function useCreateClasse() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (classe: ClasseCreateRequest) => ClasseService.create(apiClient, classe),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: classeKeys.lists() });
      toast.success("Classe créée avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la création de la classe";
      toast.error(message);
    },
  });
}

export function useUpdateClasse() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: ({ code, classe }: { code: string; classe: ClasseUpdateRequest }) =>
      ClasseService.update(apiClient, code, classe),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: classeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: classeKeys.detail(variables.code) });
      toast.success("Classe mise à jour avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la mise à jour de la classe";
      toast.error(message);
    },
  });
}

export function useDeleteClasse() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (code: string) => ClasseService.delete(apiClient, code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: classeKeys.lists() });
      toast.success("Classe supprimée avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la suppression de la classe";
      toast.error(message);
    },
  });
}