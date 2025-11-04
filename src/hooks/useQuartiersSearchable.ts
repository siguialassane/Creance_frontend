import { useState } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useApiClient } from "./useApiClient"
import { useSessionWrapper } from "./useSessionWrapper"
import { PaginationParams } from "@/types/pagination"
import { SearchableSelectItem } from "@/components/ui/searchable-select"

/**
 * Hook pour charger les quartiers avec recherche et pagination infinie
 */
export function useQuartiersSearchable() {
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
    queryKey: ["quartiers", "searchable", search],
    queryFn: async ({ pageParam = 0 }) => {
      const params: PaginationParams = {
        page: pageParam,
        size: 50,
        search: search || undefined,
      }
      
      const response = await apiClient.get('/quartiers', {
        params: {
          page: params.page,
          size: params.size,
          ...(params.search && { search: params.search }),
        },
        timeout: 30000,
      })
      
      // Transformer les données
      const items: SearchableSelectItem[] = ((response.data?.data?.content || response.data?.content || []) as any[]).map((quartier: any) => ({
        value: (quartier.QUART_CODE || quartier.Q_CODE || quartier.code || "").toString(),
        label: quartier.QUART_LIB || quartier.Q_LIB || quartier.libelle || "",
        ...quartier,
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

