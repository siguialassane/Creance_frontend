import { useState } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useApiClient } from "./useApiClient"
import { useSessionWrapper } from "./useSessionWrapper"
import { DebiteurService } from "@/services/debiteur.service"
import { PaginationParams } from "@/types/pagination"
import { SearchableSelectItem } from "@/components/ui/searchable-select"

/**
 * Hook pour charger les débiteurs avec recherche et pagination infinie
 */
export function useDebiteursSearchable() {
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
    queryKey: ["debiteurs", "searchable", search],
    queryFn: async ({ pageParam = 0 }) => {
      try {
        const params: PaginationParams = {
          page: pageParam,
          size: 50,
          search: search || undefined,
        }
        
        const response = await DebiteurService.getAll(apiClient, params)
        
        // Transformer les données - adapter selon la structure de l'API
        const debiteursList = response.data?.content || []
        const items: SearchableSelectItem[] = debiteursList.map((debiteur: any) => {
          // Déterminer le label selon le type de débiteur
          let label = ""
          const code = debiteur.DEB_CODE?.toString() || debiteur.code || ""
          
          // Personne physique
          if (debiteur.TYPDEB_CODE === 'P' || debiteur.typeDebiteur === 'P' || debiteur.typeDebiteur === 'physique') {
            const nom = debiteur.DEB_NOM || debiteur.nom || ""
            const prenom = debiteur.DEB_PREN || debiteur.prenom || ""
            label = `${code} - ${prenom} ${nom}`.trim() || code
          } 
          // Personne morale
          else if (debiteur.TYPDEB_CODE === 'M' || debiteur.typeDebiteur === 'M' || debiteur.typeDebiteur === 'moral') {
            const raisonSociale = debiteur.DEB_RAIS_SOCIALE || debiteur.raisonSociale || ""
            label = `${code} - ${raisonSociale}`.trim() || code
          }
          // Fallback
          else {
            label = code || "Débiteur"
          }

          return {
            value: code,
            label,
            ...debiteur,
          }
        })

        return {
          items,
          pagination: response.data,
          nextPage: response.data?.hasNext ? pageParam + 1 : undefined,
        }
      } catch (error) {
        console.error("Erreur lors du chargement des débiteurs:", error)
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


