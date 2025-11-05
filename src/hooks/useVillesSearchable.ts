import { useState } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useApiClient } from "./useApiClient"
import { useSessionWrapper } from "./useSessionWrapper"
import { PaginationParams } from "@/types/pagination"
import { SearchableSelectItem } from "@/components/ui/searchable-select"

/**
 * Hook pour charger les villes avec recherche et pagination infinie
 * Utilise la route dédiée /villes
 */
export function useVillesSearchable() {
  const apiClient = useApiClient()
  const { data: session, status } = useSessionWrapper()
  const isSessionReady = status === 'authenticated' && !!(session as any)?.accessToken
  
  const [search, setSearch] = useState("")

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["villes", "searchable", search],
    queryFn: async ({ pageParam = 0 }) => {
      const params: PaginationParams = {
        page: pageParam,
        size: 50,
        search: search || undefined,
      }
      
      // Utiliser la route dédiée /villes
      const response = await apiClient.get('/villes', {
        params: {
          page: params.page,
          size: params.size,
          ...(params.search && { search: params.search }),
        },
        timeout: 30000,
      })
      
      // Transformer les données de l'API
      const villes = (response.data?.data?.content || response.data?.content || []) as any[]
      
      // Transformer en SearchableSelectItem
      const items: SearchableSelectItem[] = villes.map((ville: any) => ({
        value: (ville.V_CODE || ville.VILLE_CODE || ville.code || "").toString(),
        label: ville.V_LIB || ville.VILLE_LIB || ville.libelle || "",
        V_CODE: ville.V_CODE || ville.VILLE_CODE || ville.code,
        V_LIB: ville.V_LIB || ville.VILLE_LIB || ville.libelle,
        ...ville,
      }))

      const paginationData = response.data?.data || response.data || {}
      const hasNext = paginationData.hasNext !== undefined 
        ? paginationData.hasNext 
        : (pageParam + 1) * 50 < (paginationData.totalElements || 0)

      return {
        items,
        pagination: paginationData,
        nextPage: hasNext ? pageParam + 1 : undefined,
      }
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: isSessionReady,
    staleTime: 2 * 60 * 1000,
    initialPageParam: 0,
  })

  // Flatten all items from all pages
  const allItems = data?.pages.flatMap((page) => page.items) || []

  return {
    items: allItems,
    isLoading,
    isError,
    error,
    hasMore: hasNextPage,
    loadMore: fetchNextPage,
    isFetchingMore: isFetchingNextPage,
    search,
    setSearch,
  }
}

