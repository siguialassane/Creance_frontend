import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ZoneService } from "@/services/zone.service";
import { ZoneCreateRequest, ZoneUpdateRequest } from "@/types/zone";
import { useApiClient } from "./useApiClient";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export const zoneKeys = {
  all: ["zones"] as const,
  lists: () => [...zoneKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...zoneKeys.lists(), { filters }] as const,
  details: () => [...zoneKeys.all, "detail"] as const,
  detail: (id: string) => [...zoneKeys.details(), id] as const,
  search: (term: string) => [...zoneKeys.all, "search", term] as const,
};

export function useZones() {
  const apiClient = useApiClient();
  const { data: session, status } = useSession();

  return useQuery({
    queryKey: zoneKeys.lists(),
    queryFn: () => ZoneService.getAll(apiClient).then((res) => res.data),
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

export function useZone(code: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSession();

  return useQuery({
    queryKey: zoneKeys.detail(code),
    queryFn: () => ZoneService.getByCode(apiClient, code),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!code,
  });
}

export function useSearchZones(searchTerm: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSession();

  return useQuery({
    queryKey: zoneKeys.search(searchTerm),
    queryFn: () => ZoneService.search(apiClient, searchTerm).then((res) => res.data),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!searchTerm,
    staleTime: 1000 * 60 * 2, // 2 minutes pour les recherches
  });
}

export function useCreateZone() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (zone: ZoneCreateRequest) => ZoneService.create(apiClient, zone),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: zoneKeys.lists() });
      toast.success("Zone créée avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la création de la zone";
      toast.error(message);
    },
  });
}

export function useUpdateZone() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: ({ code, zone }: { code: string; zone: ZoneUpdateRequest }) =>
      ZoneService.update(apiClient, code, zone),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: zoneKeys.lists() });
      queryClient.invalidateQueries({ queryKey: zoneKeys.detail(variables.code) });
      toast.success("Zone mise à jour avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la mise à jour de la zone";
      toast.error(message);
    },
  });
}

export function useDeleteZone() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (code: string) => ZoneService.delete(apiClient, code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: zoneKeys.lists() });
      toast.success("Zone supprimée avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la suppression de la zone";
      toast.error(message);
    },
  });
}

