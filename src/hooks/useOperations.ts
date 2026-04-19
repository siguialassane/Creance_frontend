import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { OperationService } from "@/services/operation.service";
import { OperationCreateRequest, OperationUpdateRequest } from "@/types/operation";
import { useApiClient } from "./useApiClient";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export const operationKeys = {
  all: ["operations"] as const,
  lists: () => [...operationKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...operationKeys.lists(), { filters }] as const,
  details: () => [...operationKeys.all, "detail"] as const,
  detail: (id: string) => [...operationKeys.details(), id] as const,
  search: (term: string) => [...operationKeys.all, "search", term] as const,
};

export function useOperations() {
  const apiClient = useApiClient();
  const { data: session, status } = useSession();

  return useQuery({
    queryKey: operationKeys.lists(),
    queryFn: async () => {
      try {
        const res = await OperationService.getAll(apiClient);
        console.log('📦 Réponse brute operations:', res);
        
        // Structure réelle de l'API: { data: { content: [...], totalElements, ... } }
        // Le service retourne response.data, donc res = { data: { content: [...] }, ... }
        const data = (res as any)?.data?.content || (res as any)?.content || (res as any)?.data || [];
        
        console.log('✅ Données operations transformées:', data);
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error('❌ Erreur chargement operations:', error);
        return [];
      }
    },
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

export function useOperationsPaginated(params: {
  page?: number;
  size?: number;
  search?: string;
  sortBy?: string;
  sortDirection?: string;
}) {
  const apiClient = useApiClient();
  const { data: session, status } = useSession();

  return useQuery({
    queryKey: operationKeys.list(params as Record<string, unknown>),
    queryFn: async () => {
      try {
        const res = await OperationService.getAllPaginated(apiClient, params);
        console.log('📦 Réponse brute operations paginated:', res);
        
        const responseData = (res as any)?.data || res;
        const content = responseData?.content || [];
        const totalElements = responseData?.totalElements || 0;
        const totalPages = responseData?.totalPages || 0;
        
        console.log('✅ Données operations paginated transformées:', { content, totalElements, totalPages });
        return {
          content: Array.isArray(content) ? content : [],
          totalElements,
          totalPages,
          page: params.page || 0,
          size: params.size || 50,
        };
      } catch (error) {
        console.error('❌ Erreur chargement operations paginated:', error);
        return {
          content: [],
          totalElements: 0,
          totalPages: 0,
          page: params.page || 0,
          size: params.size || 50,
        };
      }
    },
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

export function useOperation(code: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSession();

  return useQuery({
    queryKey: operationKeys.detail(code),
    queryFn: () => OperationService.getByCode(apiClient, code),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!code,
  });
}

export function useSearchOperations(searchTerm: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSession();

  return useQuery({
    queryKey: operationKeys.search(searchTerm),
    queryFn: () => OperationService.search(apiClient, searchTerm).then((res) => res.data),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!searchTerm,
    staleTime: 1000 * 60 * 2, // 2 minutes pour les recherches
  });
}

export function useCreateOperation() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (operation: OperationCreateRequest) => OperationService.create(apiClient, operation),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: operationKeys.lists() });
      toast.success("Opération créée avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la création de l'opération";
      toast.error(message);
    },
  });
}

export function useUpdateOperation() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: ({ code, operation }: { code: string; operation: OperationUpdateRequest }) =>
      OperationService.update(apiClient, code, operation),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: operationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: operationKeys.detail(variables.code) });
      toast.success("Opération mise à jour avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la mise à jour de l'opération";
      toast.error(message);
    },
  });
}

export function useDeleteOperation() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (code: string) => OperationService.delete(apiClient, code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: operationKeys.lists() });
      toast.success("Opération supprimée avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la suppression de l'opération";
      toast.error(message);
    },
  });
}

