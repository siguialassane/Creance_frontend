import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ModeAcquisitionService } from "@/services/mode-acquisition.service";
import { ModeAcquisitionCreateRequest, ModeAcquisitionUpdateRequest } from "@/types/mode-acquisition";
import { useApiClient } from "./useApiClient";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export const modeAcquisitionKeys = {
  all: ["modes-acquisition"] as const,
  lists: () => [...modeAcquisitionKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...modeAcquisitionKeys.lists(), { filters }] as const,
  details: () => [...modeAcquisitionKeys.all, "detail"] as const,
  detail: (id: string) => [...modeAcquisitionKeys.details(), id] as const,
  search: (term: string) => [...modeAcquisitionKeys.all, "search", term] as const,
};

export function useModesAcquisition() {
  const apiClient = useApiClient();
  const { data: session, status } = useSession();

  return useQuery({
    queryKey: modeAcquisitionKeys.lists(),
    queryFn: () => ModeAcquisitionService.getAll(apiClient).then((res) => res.data),
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

export function useModeAcquisition(code: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSession();

  return useQuery({
    queryKey: modeAcquisitionKeys.detail(code),
    queryFn: () => ModeAcquisitionService.getByCode(apiClient, code),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!code,
  });
}

export function useSearchModesAcquisition(searchTerm: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSession();

  return useQuery({
    queryKey: modeAcquisitionKeys.search(searchTerm),
    queryFn: () => ModeAcquisitionService.search(apiClient, searchTerm).then((res) => res.data),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!searchTerm,
    staleTime: 1000 * 60 * 2, // 2 minutes pour les recherches
  });
}

export function useCreateModeAcquisition() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (mode: ModeAcquisitionCreateRequest) => ModeAcquisitionService.create(apiClient, mode),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: modeAcquisitionKeys.lists() });
      toast.success("Mode d'acquisition créé avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la création du mode d'acquisition";
      toast.error(message);
    },
  });
}

export function useUpdateModeAcquisition() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: ({ code, mode }: { code: string; mode: ModeAcquisitionUpdateRequest }) =>
      ModeAcquisitionService.update(apiClient, code, mode),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: modeAcquisitionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: modeAcquisitionKeys.detail(variables.code) });
      toast.success("Mode d'acquisition mis à jour avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la mise à jour du mode d'acquisition";
      toast.error(message);
    },
  });
}

export function useDeleteModeAcquisition() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (code: string) => ModeAcquisitionService.delete(apiClient, code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: modeAcquisitionKeys.lists() });
      toast.success("Mode d'acquisition supprimé avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la suppression du mode d'acquisition";
      toast.error(message);
    },
  });
}

