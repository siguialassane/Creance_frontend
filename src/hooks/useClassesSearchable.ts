import { useState, useCallback, useEffect } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useApiClient } from "./useApiClient"
import { useSessionWrapper } from "./useSessionWrapper"
import { ClasseService } from "@/services/classe.service"
import { PaginationParams } from "@/types/pagination"
import { SearchableSelectItem } from "@/components/ui/searchable-select"
import { fetchPaginatedData } from "@/lib/api"

/**
 * Hook pour charger les classes avec recherche et pagination infinie
 */
export function useClassesSearchable() {
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
    queryKey: ["classes", "searchable", search],
    queryFn: async ({ pageParam = 0 }) => {
      try {
        // Essayer d'abord avec pagination
        const params: PaginationParams = {
          page: pageParam,
          size: 50,
          search: search || undefined,
        }
        
        try {
          const response = await fetchPaginatedData<any>("/classes", params)
          
          // Transformer les données
          const items: SearchableSelectItem[] = (response.data?.content || []).map((classe: any) => ({
            value: classe.CLAS_CODE || classe.code || "",
            label: `${classe.CLAS_CODE || classe.code} - ${classe.CLAS_LIB || classe.libelle || ""}`,
            ...classe,
          }))

          return {
            items,
            pagination: response.data,
            nextPage: response.data?.hasNext ? pageParam + 1 : undefined,
          }
        } catch (e) {
          // Si la pagination ne fonctionne pas, utiliser getAll sans pagination
          const response = await ClasseService.getAll(apiClient as any)
          const allData = response.data?.content || response.data?.data || response.data || []
          const allItems: SearchableSelectItem[] = Array.isArray(allData)
            ? allData.map((classe: any) => ({
                value: classe.CLAS_CODE || classe.code || "",
                label: `${classe.CLAS_CODE || classe.code} - ${classe.CLAS_LIB || classe.libelle || ""}`,
                ...classe,
              }))
            : []

          // Filtrer par recherche si nécessaire
          const filtered = search
            ? allItems.filter((item) =>
                item.label.toLowerCase().includes(search.toLowerCase())
              )
            : allItems

          // Simuler une pagination côté client
          const pageSize = 50
          const startIndex = pageParam * pageSize
          const endIndex = startIndex + pageSize
          const paginatedItems = filtered.slice(startIndex, endIndex)

          return {
            items: paginatedItems,
            pagination: {
              hasNext: endIndex < filtered.length,
              totalElements: filtered.length,
            },
            nextPage: endIndex < filtered.length ? pageParam + 1 : undefined,
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement des classes:", error)
        return {
          items: [],
          pagination: { hasNext: false },
          nextPage: undefined,
        }
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


