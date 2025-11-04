import { useState } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useApiClient } from "./useApiClient"
import { useSessionWrapper } from "./useSessionWrapper"
import { PaginationParams } from "@/types/pagination"
import { SearchableSelectItem } from "@/components/ui/searchable-select"

/**
 * Hook pour charger les professions avec recherche et pagination infinie
 */
export function useProfessionsSearchable() {
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
    queryKey: ["professions", "searchable", search],
    queryFn: async ({ pageParam = 0 }) => {
      const params: PaginationParams = {
        page: pageParam,
        size: 50,
        search: search || undefined,
      }
      
      const response = await apiClient.get('/professions', {
        params: {
          page: params.page,
          size: params.size,
          ...(params.search && { search: params.search }),
        }
      })
      
      // Transformer les données
      const items: SearchableSelectItem[] = ((response.data?.data?.content || response.data?.content || []) as any[]).map((profession: any) => ({
        value: profession.PROFES_CODE || profession.code || "",
        label: profession.PROFES_LIB || profession.libelle || "",
        ...profession,
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

