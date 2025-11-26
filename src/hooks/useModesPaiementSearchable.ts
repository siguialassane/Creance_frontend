import { useState, useMemo } from "react"
import { useModesPaiement } from "./useModesPaiement"
import { SearchableSelectItem } from "@/components/ui/searchable-select"

/**
 * Hook pour charger les modes de paiement avec recherche
 */
export function useModesPaiementSearchable() {
  const { data, isLoading, isError, error } = useModesPaiement()
  const [search, setSearch] = useState("")

  // Transformer les données en SearchableSelectItem et filtrer selon la recherche
  const items: SearchableSelectItem[] = useMemo(() => {
    if (!data) return []

    // useModesPaiement retourne ModePaiementApiResponse qui a une propriété data
    const modes = (data as any)?.data || []
    const searchLower = search.toLowerCase().trim()

    // Filtrer selon la recherche
    const filtered = searchLower
      ? modes.filter((mode: any) => {
          const code = (mode.TYP_PAIE_CODE || mode.code || "").toLowerCase()
          const libelle = (mode.TYP_PAIE_LIB || mode.libelle || "").toLowerCase()
          return code.includes(searchLower) || libelle.includes(searchLower)
        })
      : modes

    // Transformer en SearchableSelectItem
    return filtered.map((mode: any) => ({
      value: mode.TYP_PAIE_CODE || mode.code || "",
      label: `${mode.TYP_PAIE_CODE || mode.code} - ${mode.TYP_PAIE_LIB || mode.libelle || ""}`,
      ...mode,
    }))
  }, [data, search])

  return {
    items,
    isLoading,
    isError,
    error,
    hasMore: false, // Pas de pagination pour les modes de paiement
    loadMore: () => {},
    isFetchingMore: false,
    search,
    setSearch,
  }
}

