import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { ParamService } from "@/services/param.service"
import { ParamCreateRequest, ParamUpdateRequest } from "@/types/param"
import { useApiClient } from "./useApiClient"
import { useSessionWrapper } from "./useSessionWrapper"
import { toast } from "sonner"

export const paramKeys = {
  all: ["params"] as const,
  lists: () => [...paramKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...paramKeys.lists(), { filters }] as const,
  details: () => [...paramKeys.all, "detail"] as const,
  detail: (id: number) => [...paramKeys.details(), id] as const,
  search: (term: string) => [...paramKeys.all, "search", term] as const,
}

export function useParams() {
  const apiClient = useApiClient()
  const { data: session, status } = useSessionWrapper()

  return useQuery({
    queryKey: paramKeys.lists(),
    queryFn: async () => {
      try {
        const res = await ParamService.getAll(apiClient)
        console.log('📦 Réponse brute params:', res)
        
        const data = (res as any)?.data?.content || (res as any)?.content || (res as any)?.data || []
        
        console.log('✅ Données params transformées:', data)
        return Array.isArray(data) ? data : []
      } catch (error) {
        console.error('❌ Erreur chargement params:', error)
        return []
      }
    },
    enabled: status === 'authenticated' && !!(session as any)?.accessToken,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  })
}

export function useParamsPaginated(params: {
  page?: number
  size?: number
  search?: string
  sortBy?: string
  sortDirection?: string
}) {
  const apiClient = useApiClient()
  const { data: session, status } = useSessionWrapper()

  return useQuery({
    queryKey: paramKeys.list(params as Record<string, unknown>),
    queryFn: async () => {
      try {
        const res = await ParamService.getAllPaginated(apiClient, params)
        console.log('📦 Réponse brute params paginated:', res)
        
        const responseData = (res as any)?.data || res
        const content = responseData?.content || []
        const totalElements = responseData?.totalElements || 0
        const totalPages = responseData?.totalPages || 0
        
        console.log('✅ Données params paginated transformées:', { content, totalElements, totalPages })
        return {
          content: Array.isArray(content) ? content : [],
          totalElements,
          totalPages,
          page: params.page || 0,
          size: params.size || 50,
        }
      } catch (error) {
        console.error('❌ Erreur chargement params paginated:', error)
        return {
          content: [],
          totalElements: 0,
          totalPages: 0,
          page: params.page || 0,
          size: params.size || 50,
        }
      }
    },
    enabled: status === 'authenticated' && !!(session as any)?.accessToken,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}

export function useParam(code: number) {
  const apiClient = useApiClient()
  const { data: session, status } = useSessionWrapper()

  return useQuery({
    queryKey: paramKeys.detail(code),
    queryFn: () => ParamService.getByCode(apiClient, code),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!code,
  })
}

export function useSearchParams(searchTerm: string) {
  const apiClient = useApiClient()
  const { data: session, status } = useSessionWrapper()

  return useQuery({
    queryKey: paramKeys.search(searchTerm),
    queryFn: () => ParamService.search(apiClient, searchTerm).then((res) => res.data),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!searchTerm,
    staleTime: 1000 * 60 * 2, // 2 minutes pour les recherches
  })
}

export function useCreateParam() {
  const queryClient = useQueryClient()
  const apiClient = useApiClient()

  return useMutation({
    mutationFn: (param: ParamCreateRequest) => ParamService.create(apiClient, param),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: paramKeys.lists() })
      toast.success("Paramètre créé avec succès")
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la création du paramètre"
      toast.error(message)
    },
  })
}

export function useUpdateParam() {
  const queryClient = useQueryClient()
  const apiClient = useApiClient()

  return useMutation({
    mutationFn: ({ code, param }: { code: number; param: ParamUpdateRequest }) =>
      ParamService.update(apiClient, code, param),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: paramKeys.lists() })
      queryClient.invalidateQueries({ queryKey: paramKeys.detail(variables.code) })
      toast.success("Paramètre mis à jour avec succès")
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la mise à jour du paramètre"
      toast.error(message)
    },
  })
}

export function useDeleteParam() {
  const queryClient = useQueryClient()
  const apiClient = useApiClient()

  return useMutation({
    mutationFn: (code: number) => ParamService.delete(apiClient, code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paramKeys.lists() })
      toast.success("Paramètre supprimé avec succès")
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la suppression du paramètre"
      toast.error(message)
    },
  })
}