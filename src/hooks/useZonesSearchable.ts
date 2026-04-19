import { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { useApiClient } from "./useApiClient"
import { useSessionWrapper } from "./useSessionWrapper"
import { SearchableSelectItem } from "@/components/ui/searchable-select"

/**
 * Hook pour charger les zones avec recherche (filtrage client-side)
 * La liste des zones est courte — pas besoin de pagination infinie.
 */
export function useZonesSearchable() {
  const apiClient = useApiClient()
  const { data: session, status } = useSessionWrapper()
  const isSessionReady = status === 'authenticated' && !!(session as any)?.accessToken

  const [search, setSearch] = useState("")

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["zones", "searchable"],
    queryFn: async () => {
      // /zones/all retourne { data: Zone[], message, status } — liste directe sans pagination
      const response = await apiClient.get('/zones/all')
      const rawData = response.data?.data || []
      return Array.isArray(rawData) ? rawData : []
    },
    enabled: isSessionReady,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })

  // Filtrage client-side par libellé ou code
  const items: SearchableSelectItem[] = useMemo(() => {
    const allZones = data || []
    const filtered = search
      ? allZones.filter((zone: any) => {
          const code = (zone.ZONE_CODE || zone.code || "").toLowerCase()
          const lib = (zone.ZONE_LIB || zone.libelle || "").toLowerCase()
          const q = search.toLowerCase()
          return code.includes(q) || lib.includes(q)
        })
      : allZones

    return filtered.map((zone: any) => ({
      value: (zone.ZONE_CODE || zone.code || "").toString(),
      label: zone.ZONE_LIB
        ? `${zone.ZONE_CODE} - ${zone.ZONE_LIB}`
        : (zone.ZONE_CODE || zone.code || ""),
      ZONE_CODE: zone.ZONE_CODE || zone.code,
      ZONE_LIB: zone.ZONE_LIB || zone.libelle,
      ...zone,
    }))
  }, [data, search])

  return {
    items,
    isLoading,
    isError,
    error,
    hasMore: false,
    loadMore: () => {},
    isFetchingMore: false,
    search,
    setSearch,
  }
}
