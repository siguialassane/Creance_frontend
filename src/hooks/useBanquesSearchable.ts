import { useState, useCallback, useEffect } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useApiClient } from "./useApiClient"
import { useSessionWrapper } from "./useSessionWrapper"
import { BanqueService } from "@/services/banque.service"
import { PaginationParams } from "@/types/pagination"
import { SearchableSelectItem } from "@/components/ui/searchable-select"

/**
 * Hook pour charger les banques avec recherche et pagination infinie
 */
export function useBanquesSearchable() {
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
    queryKey: ["banques", "searchable", search],
    queryFn: async ({ pageParam = 0 }) => {
      const params: PaginationParams = {
        page: pageParam,
        size: 50,
        search: search || undefined,
      }
      const response = await BanqueService.getAll(apiClient, params)
      
      // Transformer les données
      const items: SearchableSelectItem[] = (response.data?.content || []).map((banque: any) => ({
        value: banque.BQ_CODE || banque.code || "",
        label: `${banque.BQ_CODE || banque.code} - ${banque.BQ_LIB || banque.libelle || ""}`,
        ...banque,
      }))

      return {
        items,
        pagination: response.data,
        nextPage: response.data?.hasNext ? pageParam + 1 : undefined,
      }
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: isSessionReady,
    staleTime: 2 * 60 * 1000, // 2 minutes
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

