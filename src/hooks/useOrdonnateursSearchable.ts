import { useState } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useApiClient } from "./useApiClient"
import { useSessionWrapper } from "./useSessionWrapper"
import { OrdonnateurService } from "@/services/ordonnateur.service"
import { PaginationParams } from "@/types/pagination"
import { SearchableSelectItem } from "@/components/ui/searchable-select"
import { fetchPaginatedData } from "@/lib/api"

/**
 * Hook pour charger les ordonnateurs avec recherche et pagination infinie
 */
export function useOrdonnateursSearchable() {
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
    queryKey: ["ordonnateurs", "searchable", search],
    queryFn: async ({ pageParam = 0 }) => {
      try {
        // Essayer d'abord avec pagination
        const params: PaginationParams = {
          page: pageParam,
          size: 50,
          search: search || undefined,
        }
        
        try {
          const response = await fetchPaginatedData<any>("/ordonnateurs", params)
          
          // L'API retourne directement un tableau dans data selon l'exemple fourni
          // Structure: { data: [{ORDO_CODE: 1, ORDO_NOM: "KOUAME JEAN", ...}] }
          // Ou format paginé: { data: { content: [...], totalElements, ... } }
          let dataArray: any[] = [];
          
          if (Array.isArray(response.data)) {
            // Format direct: data est un tableau
            dataArray = response.data;
          } else if (Array.isArray(response.data?.content)) {
            // Format paginé: data.content est un tableau
            dataArray = response.data.content;
          } else if (Array.isArray(response.data?.data)) {
            // Format alternatif: data.data est un tableau
            dataArray = response.data.data;
          } else if (response.data) {
            // Cas où response.data n'est ni un tableau ni un objet avec content/data
            // Essayer de trouver un tableau ailleurs
            dataArray = [];
          }
          
          // Transformer les données - L'API retourne ORDO_CODE, ORDO_NOM, ORDO_ADR, ORDO_TEL
          const items: SearchableSelectItem[] = dataArray.map((ordo: any) => ({
            value: (ordo.ORDO_CODE || ordo.code || "").toString(),
            label: `${ordo.ORDO_CODE || ordo.code || ""} - ${ordo.ORDO_NOM || ordo.ORDO_LIB || ordo.nom || ordo.libelle || ""}`,
            ...ordo,
          }))
          
          console.log("📋 Ordonnateurs transformés:", { 
            originalData: response.data, 
            dataArrayLength: dataArray.length,
            itemsLength: items.length,
            firstItem: items[0] 
          });

          return {
            items,
            pagination: response.data,
            nextPage: response.data?.hasNext ? pageParam + 1 : undefined,
          }
        } catch (e) {
          // Si la pagination ne fonctionne pas, utiliser getAll sans pagination
          const response = await OrdonnateurService.getAll(apiClient as any)
          const allData = response.data?.content || response.data?.data || response.data || []
          const allItems: SearchableSelectItem[] = Array.isArray(allData)
            ? allData.map((ordo: any) => ({
                value: (ordo.ORDO_CODE || ordo.code || "").toString(),
                label: `${ordo.ORDO_CODE || ordo.code || ""} - ${ordo.ORDO_NOM || ordo.ORDO_LIB || ordo.nom || ordo.libelle || ""}`,
                ...ordo,
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
        console.error("Erreur lors du chargement des ordonnateurs:", error)
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

