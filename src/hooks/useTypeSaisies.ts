import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TypeSaisieService } from "@/services/type-saisie.service";
import { TypeSaisieCreateRequest, TypeSaisieUpdateRequest } from "@/types/type-saisie";
import { useApiClient } from "./useApiClient";
import { useSessionWrapper } from "./useSessionWrapper";
import { toast } from "sonner";

export const typeSaisieKeys = {
  all: ["type-saisies"] as const,
  lists: () => [...typeSaisieKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...typeSaisieKeys.lists(), { filters }] as const,
  details: () => [...typeSaisieKeys.all, "detail"] as const,
  detail: (id: string) => [...typeSaisieKeys.details(), id] as const,
  search: (term: string) => [...typeSaisieKeys.all, "search", term] as const,
};

export function useTypeSaisies() {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: typeSaisieKeys.lists(),
    queryFn: () => TypeSaisieService.getAll(apiClient).then((res) => res.data),
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

export function useTypeSaisie(code: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: typeSaisieKeys.detail(code),
    queryFn: () => TypeSaisieService.getByCode(apiClient, code),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!code,
  });
}

export function useSearchTypeSaisies(searchTerm: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: typeSaisieKeys.search(searchTerm),
    queryFn: () => TypeSaisieService.search(apiClient, searchTerm).then((res) => res.data),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!searchTerm,
    staleTime: 1000 * 60 * 2,
  });
}

export function useCreateTypeSaisie() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (type: TypeSaisieCreateRequest) => TypeSaisieService.create(apiClient, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: typeSaisieKeys.lists() });
      toast.success("TypeSaisie créé avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la création du TypeSaisie";
      toast.error(message);
    },
  });
}

export function useUpdateTypeSaisie() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: ({ code, type }: { code: string; type: TypeSaisieUpdateRequest }) =>
      TypeSaisieService.update(apiClient, code, type),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: typeSaisieKeys.lists() });
      queryClient.invalidateQueries({ queryKey: typeSaisieKeys.detail(variables.code) });
      toast.success("TypeSaisie mis à jour avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la mise à jour du TypeSaisie";
      toast.error(message);
    },
  });
}

export function useDeleteTypeSaisie() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (code: string) => TypeSaisieService.delete(apiClient, code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: typeSaisieKeys.lists() });
      toast.success("TypeSaisie supprimé avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la suppression du TypeSaisie";
      toast.error(message);
    },
  });
}
