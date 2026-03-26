import { useState } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useApiClient } from "./useApiClient"
import { useSessionWrapper } from "./useSessionWrapper"
import { TypeEffetService } from "@/services/type-effet.service"
import { PaginationParams } from "@/types/pagination"
import { SearchableSelectItem } from "@/components/ui/searchable-select"

/**
 * Hook pour charger les types d'effets avec recherche et pagination infinie
 */
export function useTypeEffetsSearchable() {
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
    queryKey: ["type-effets", "searchable", search],
    queryFn: async ({ pageParam = 0 }) => {
      const params: PaginationParams = {
        page: pageParam,
        size: 50,
        search: search || undefined,
      }
      
      // Utiliser le service TypeEffet avec pagination
      const response = await apiClient.get('/types/AC_TYPE_EFFET', {
        params: {
          page: params.page,
          size: params.size,
          ...(params.search && { search: params.search }),
        }
      })
      
      // Transformer les données
      // L'API retourne {data: {data: [...], message, status}} donc response.data.data est le tableau
      const rawData = response.data?.data || response.data?.content || response.data || []
      const items: SearchableSelectItem[] = (Array.isArray(rawData) ? rawData : []).map((typeEffet: any) => ({
        value: typeEffet.TYPEFT_CODE || typeEffet.TE_CODE || typeEffet.code || "",
        label: `${typeEffet.TYPEFT_CODE || typeEffet.TE_CODE || typeEffet.code || ""} - ${typeEffet.TYPEFT_LIB || typeEffet.TE_LIB || typeEffet.libelle || ""}`,
        ...typeEffet,
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

