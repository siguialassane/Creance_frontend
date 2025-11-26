import { useState, useMemo } from "react"
import { useTypeFraiss } from "./useTypeFraiss"
import { SearchableSelectItem } from "@/components/ui/searchable-select"

export function useTypeFraissSearchable() {
  const { data, isLoading, isError, error } = useTypeFraiss()
  const [search, setSearch] = useState("")

  const items: SearchableSelectItem[] = useMemo(() => {
    if (!data) return []

    const typesFrais = Array.isArray(data) ? data : (data as any)?.data || []
    const searchLower = search.toLowerCase().trim()

    const filtered = searchLower
      ? typesFrais.filter((type: any) => {
          const code = (type.TYP_FRAIS_CODE || type.code || "").toLowerCase()
          const libelle = (type.TYP_FRAIS_LIB || type.libelle || "").toLowerCase()
          return code.includes(searchLower) || libelle.includes(searchLower)
        })
      : typesFrais

    return filtered.map((type: any) => ({
      value: type.TYP_FRAIS_CODE || type.code || "",
      label: `${type.TYP_FRAIS_CODE || type.code} - ${type.TYP_FRAIS_LIB || type.libelle || ""}`,
      ...type,
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

