import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MessageService } from "@/services/message.service";
import { MessageCreateRequest, MessageUpdateRequest } from "@/types/message";
import { useApiClient } from "./useApiClient";
import { useSessionWrapper } from "./useSessionWrapper";
import { toast } from "sonner";

export const messageKeys = {
  all: ["messages"] as const,
  lists: () => [...messageKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...messageKeys.lists(), { filters }] as const,
  details: () => [...messageKeys.all, "detail"] as const,
  detail: (id: string) => [...messageKeys.details(), id] as const,
  search: (term: string) => [...messageKeys.all, "search", term] as const,
};

export function useMessages() {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: messageKeys.lists(),
    queryFn: () => MessageService.getAll(apiClient).then((res) => res.data),
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

export function useMessage(code: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: messageKeys.detail(code),
    queryFn: () => MessageService.getByCode(apiClient, code),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!code,
  });
}

export function useSearchMessages(searchTerm: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: messageKeys.search(searchTerm),
    queryFn: () => MessageService.search(apiClient, searchTerm).then((res) => res.data),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!searchTerm,
    staleTime: 1000 * 60 * 2, // 2 minutes pour les recherches
  });
}

export function useCreateMessage() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (message: MessageCreateRequest) => MessageService.create(apiClient, message),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: messageKeys.lists() });
      toast.success("Message créé avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la création du message";
      toast.error(message);
    },
  });
}

export function useUpdateMessage() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: ({ code, message }: { code: string; message: MessageUpdateRequest }) =>
      MessageService.update(apiClient, code, message),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: messageKeys.lists() });
      queryClient.invalidateQueries({ queryKey: messageKeys.detail(variables.code) });
      toast.success("Message mis à jour avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la mise à jour du message";
      toast.error(message);
    },
  });
}

export function useDeleteMessage() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (code: string) => MessageService.delete(apiClient, code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messageKeys.lists() });
      toast.success("Message supprimé avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la suppression du message";
      toast.error(message);
    },
  });
}

