import { useState } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useApiClient } from "./useApiClient"
import { useSessionWrapper } from "./useSessionWrapper"
import { CreanceService } from "@/services/creance.service"
import { PaginationParams } from "@/types/pagination"
import { SearchableSelectItem } from "@/components/ui/searchable-select"

/**
 * Hook pour charger les créances avec recherche et pagination infinie
 */
export function useCreancesSearchable() {
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
        queryKey: ["creances", "searchable", search],
        queryFn: async ({ pageParam = 0 }) => {
            const params: PaginationParams = {
                page: pageParam,
                size: 20,
                search: search || undefined,
                sort: 'dateCreation,desc' // Trier par date de création par défaut
            }

            const response = await CreanceService.getAll(apiClient, params)

            // Transformer les données
            const items: SearchableSelectItem[] = (response.data?.content || []).map((creance: any) => {
                // Formater l'affichage: Code - Débiteur (Montant)
                const debiteurNom = creance.debiteurNom ? `${creance.debiteurNom} ${creance.debiteurPrenom || ''}` : (creance.raisonSociale || 'Inconnu');
                const montant = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', minimumFractionDigits: 0 }).format(creance.soldeInit || 0);

                return {
                    value: creance.numeroCreance || creance.id,
                    label: `${creance.numeroCreance} - ${debiteurNom} (${montant})`,
                    ...creance,
                }
            })

            return {
                items,
                pagination: response.data,
                nextPage: response.data?.hasNext ? pageParam + 1 : undefined,
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
