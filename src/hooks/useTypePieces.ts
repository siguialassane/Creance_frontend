import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TypePieceService } from "@/services/type-piece.service";
import { TypePieceCreateRequest, TypePieceUpdateRequest } from "@/types/type-piece";
import { useApiClient } from "./useApiClient";
import { useSessionWrapper } from "./useSessionWrapper";
import { toast } from "sonner";

export const typePieceKeys = {
  all: ["type-pieces"] as const,
  lists: () => [...typePieceKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...typePieceKeys.lists(), { filters }] as const,
  details: () => [...typePieceKeys.all, "detail"] as const,
  detail: (id: string) => [...typePieceKeys.details(), id] as const,
  search: (term: string) => [...typePieceKeys.all, "search", term] as const,
};

export function useTypePieces() {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: typePieceKeys.lists(),
    queryFn: () => TypePieceService.getAll(apiClient).then((res) => res.data),
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

export function useTypePiece(code: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: typePieceKeys.detail(code),
    queryFn: () => TypePieceService.getByCode(apiClient, code),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!code,
  });
}

export function useSearchTypePieces(searchTerm: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: typePieceKeys.search(searchTerm),
    queryFn: () => TypePieceService.search(apiClient, searchTerm).then((res) => res.data),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!searchTerm,
    staleTime: 1000 * 60 * 2,
  });
}

export function useCreateTypePiece() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (type: TypePieceCreateRequest) => TypePieceService.create(apiClient, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: typePieceKeys.lists() });
      toast.success("TypePiece créé avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la création du TypePiece";
      toast.error(message);
    },
  });
}

export function useUpdateTypePiece() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: ({ code, type }: { code: string; type: TypePieceUpdateRequest }) =>
      TypePieceService.update(apiClient, code, type),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: typePieceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: typePieceKeys.detail(variables.code) });
      toast.success("TypePiece mis à jour avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la mise à jour du TypePiece";
      toast.error(message);
    },
  });
}

export function useDeleteTypePiece() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (code: string) => TypePieceService.delete(apiClient, code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: typePieceKeys.lists() });
      toast.success("TypePiece supprimé avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la suppression du TypePiece";
      toast.error(message);
    },
  });
}
