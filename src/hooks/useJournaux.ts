import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { JournalService } from "@/services/journal.service";
import { JournalCreateRequest, JournalUpdateRequest } from "@/types/journal";
import { useApiClient } from "./useApiClient";
import { useSessionWrapper } from "./useSessionWrapper";
import { toast } from "sonner";

export const journalKeys = {
  all: ["journaux"] as const,
  lists: () => [...journalKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...journalKeys.lists(), { filters }] as const,
  details: () => [...journalKeys.all, "detail"] as const,
  detail: (id: string) => [...journalKeys.details(), id] as const,
  search: (term: string) => [...journalKeys.all, "search", term] as const,
};

export function useJournaux() {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: journalKeys.lists(),
    queryFn: () => JournalService.getAll(apiClient).then((res) => res.data),
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

export function useJournal(code: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: journalKeys.detail(code),
    queryFn: () => JournalService.getByCode(apiClient, code),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!code,
  });
}

export function useSearchJournaux(searchTerm: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: journalKeys.search(searchTerm),
    queryFn: () => JournalService.search(apiClient, searchTerm).then((res) => res.data),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!searchTerm,
    staleTime: 1000 * 60 * 2, // 2 minutes pour les recherches
  });
}

export function useCreateJournal() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (journal: JournalCreateRequest) => JournalService.create(apiClient, journal),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: journalKeys.lists() });
      toast.success("Journal créé avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la création du journal";
      toast.error(message);
    },
  });
}

export function useUpdateJournal() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: ({ code, journal }: { code: string; journal: JournalUpdateRequest }) =>
      JournalService.update(apiClient, code, journal),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: journalKeys.lists() });
      queryClient.invalidateQueries({ queryKey: journalKeys.detail(variables.code) });
      toast.success("Journal mis à jour avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la mise à jour du journal";
      toast.error(message);
    },
  });
}

export function useDeleteJournal() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (code: string) => JournalService.delete(apiClient, code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: journalKeys.lists() });
      toast.success("Journal supprimé avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la suppression du journal";
      toast.error(message);
    },
  });
}

