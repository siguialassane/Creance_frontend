import { useState, useCallback } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useApiClient } from "./useApiClient"
import { useSessionWrapper } from "./useSessionWrapper"
import { AgenceBanqueService } from "@/services/agence-banque.service"
import { PaginationParams } from "@/types/pagination"
import { SearchableSelectItem } from "@/components/ui/searchable-select"

/**
 * Hook pour charger les agences bancaires avec recherche et pagination infinie
 */
export function useAgencesBanqueSearchable(banqueCode?: string | null) {
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
    queryKey: ["agences-banque", "searchable", banqueCode, search],
    queryFn: async ({ pageParam = 0 }) => {
      const params: PaginationParams = {
        page: pageParam,
        size: 50,
        search: search || undefined,
      }
      
      // Si une banque est sélectionnée, utiliser l'endpoint spécifique avec pagination serveur
      let response
      if (banqueCode) {
        // Utiliser getByBanque avec pagination côté serveur
        // La recherche est passée dans les paramètres et gérée par le serveur
        response = await AgenceBanqueService.getByBanque(apiClient, banqueCode, params)
      } else {
        // Sinon, récupérer toutes les agences (sans filtre banque)
        response = await AgenceBanqueService.getAll(apiClient, params)
      }
      
      // Transformer les données
      const items: SearchableSelectItem[] = (response.data?.content || []).map((agence: any) => ({
        value: (agence.BQAG_NUM || agence.code || "").toString(),
        label: `${agence.BQAG_NUM || agence.code || ""} - ${agence.BQAG_LIB || agence.libelle || ""}`,
        ...agence,
      }))

      return {
        items,
        pagination: response.data,
        nextPage: response.data?.hasNext ? pageParam + 1 : undefined,
      }
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: isSessionReady, // Charger même sans banque pour lister toutes les agences
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

