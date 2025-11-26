import { useState, useMemo } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useApiClient } from "./useApiClient"
import { useSessionWrapper } from "./useSessionWrapper"
import { SearchableSelectItem } from "@/components/ui/searchable-select"
import { PaginationParams } from "@/types/pagination"

export function useFraissSearchable(codeCreance?: string) {
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
    queryKey: ["fraiss", "searchable", codeCreance, search],
    queryFn: async ({ pageParam = 0 }) => {
      const params: PaginationParams = {
        page: pageParam,
        size: 50,
        search: search || undefined,
      }
      
      // TODO: Remplacer par le bon endpoint API pour les frais
      // Exemple: /creances/{codeCreance}/fraiss ou /fraiss
      const endpoint = codeCreance 
        ? `/creances/${codeCreance}/fraiss`
        : '/fraiss'
      
      const response = await apiClient.get(endpoint, {
        params: {
          page: params.page,
          size: params.size,
          ...(params.search && { search: params.search }),
        }
      })
      
      // Transformer les données - adapter selon la structure de l'API
      const fraissList = response.data?.content || response.data?.data?.content || response.data || []
      const items: SearchableSelectItem[] = (Array.isArray(fraissList) ? fraissList : []).map((frais: any) => ({
        value: (frais.FRAIS_NUM || frais.numero || frais.code || "").toString(),
        label: `${frais.FRAIS_NUM || frais.numero || frais.code || ""} - ${frais.FRAIS_LIB || frais.libelle || ""}`,
        ...frais,
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

