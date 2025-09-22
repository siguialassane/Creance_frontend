"use client"

import * as React from "react"
import {
  ColumnDef,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ChevronDown, ChevronUp, Search, Plus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Icon } from "@iconify/react/dist/iconify.js"
import { PaginationInfo } from "@/types/pagination"

interface DataTableProps<TData, TValue> {
  title: string
  description?: string
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchKey?: string
  searchPlaceholder?: string
  onAdd?: () => void
  addButtonText?: string
  // Optional stats slot rendered between title and search bar
  statsSlot?: React.ReactNode
  // Optional extra actions on the right (e.g., Filters button)
  extraActionsSlot?: React.ReactNode
  status?: string
  useServerPagination?: boolean
  pagination?: PaginationInfo
  onPaginationChange?: (params: { page?: number; size?: number; search?: string }) => void
  isPaginationLoading?: boolean
  isTableLoading?: boolean
  searchQuery?: string
  searchValue?: string
  onSearchChange?: (query: string) => void
  onSearchValueChange?: (value: string) => void
  onSearchSubmit?: () => void
  onSearchReset?: () => void
}

export function DataTable<TData, TValue>({
  title,
  description,
  columns,
  data,
  searchPlaceholder = "Rechercher...",
  onAdd,
  addButtonText = "Ajouter",
  statsSlot,
  extraActionsSlot,
  status,
  useServerPagination = false,
  pagination,
  onPaginationChange,
  isPaginationLoading = false,
  isTableLoading = false,
  searchQuery,
  searchValue,
  onSearchChange,
  onSearchValueChange,
  onSearchSubmit,
  onSearchReset,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [query, setQuery] = React.useState("")
  const [localQuery, setLocalQuery] = React.useState("")

  // Synchroniser avec searchQuery et searchValue si fournis
  React.useEffect(() => {
    if (searchValue !== undefined) {
      setLocalQuery(searchValue)
      setQuery(searchValue)
    } else if (searchQuery !== undefined) {
      setLocalQuery(searchQuery)
      setQuery(searchQuery)
    }
  }, [searchQuery, searchValue])

  // Notifier le parent quand localQuery change
  React.useEffect(() => {
    if (onSearchValueChange && localQuery !== undefined) {
      onSearchValueChange(localQuery)
    }
  }, [localQuery, onSearchValueChange])

  // Global search across all fields of each row (only for client-side pagination)
  const filteredData = React.useMemo(() => {
    if (useServerPagination) {
      // Pour la pagination côté serveur, on utilise les données telles quelles
      return data
    }
    
    if (!query) return data
    const q = query.toString().toLowerCase()
    return (data as TData[]).filter((row) =>
      Object.values(row ?? {}).some((val) =>
        (val ?? "").toString().toLowerCase().includes(q)
      )
    )
  }, [data, query, useServerPagination])

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: useServerPagination ? undefined : getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
    },
    // Désactiver la pagination côté client quand on utilise la pagination côté serveur
    manualPagination: useServerPagination,
  })

  // Gestion de la recherche côté serveur
  React.useEffect(() => {
    // Si onSearchChange est fourni, ne pas déclencher automatiquement la recherche
    // La recherche sera gérée par le bouton de recherche
    if (useServerPagination && onPaginationChange && !onSearchChange) {
      // Délai pour éviter trop de requêtes
      const timeoutId = setTimeout(() => {
        // Ne déclencher la recherche que si la query a vraiment changé
        // et n'est pas vide (pour éviter les appels inutiles)
        if (query.trim() !== '') {
          onPaginationChange({ search: query, page: 0 })
        } else {
          onPaginationChange({ search: '', page: 0 })
        }
      }, 500)

      return () => clearTimeout(timeoutId)
    } else if (!useServerPagination) {
      // Revenir à la première page à chaque saisie pour voir immédiatement les résultats (côté client)
      table.setPageIndex(0)
    }
  }, [query, table, useServerPagination, onPaginationChange, onSearchChange])

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header avec titre et actions */}
      <div className=" py-6 border-b border-gray-200 to-white">
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-2 mb-5 bg-primary w-full py-4 px-8">
            <h1 className="text-2xl!  tracking-tight"
            style={{
              fontWeight: 'bold',
              color: '#fff',
            }}
            >
              {title}
            </h1>
            {description && (
              <p className="text-base text-white">{description}</p>
            )}
          </div>
          
        </div>

        {/* Stats section */}
        {statsSlot && (
          <div className="mb-4">
            {statsSlot}
          </div>
        )}

        {/* Barre de recherche */}
        <div className="flex items-center justify-between gap-6 px-8">
          <div className="relative flex-1 max-w-lg flex items-center gap-2">
            <div className="relative">
              <Input
                placeholder={searchPlaceholder}
                value={onSearchValueChange ? localQuery : query}
                onChange={(e) => {
                  const newValue = e.target.value
                  if (onSearchValueChange) {
                    setLocalQuery(newValue)
                  } else {
                    setQuery(newValue)
                  }
                }}
                style={{
                  border: '1px solid #000',
                  padding: '0px 8px',
                  borderRadius: '6px',
                  paddingRight: '40px', // Laisser de l'espace pour la croix
                }}
                className="h-12 text-base border-gray-300 focus:border-emerald-500 focus:ring-emerald-200"
              />
              {/* Petite croix pour effacer */}
              {(onSearchValueChange && localQuery) && (
                <button
                  type="button"
                  onClick={() => {
                    setLocalQuery('')
                    if (onSearchValueChange) {
                      onSearchValueChange('')
                    }
                    // Si on a un callback de reset, l'utiliser
                    if (onSearchReset) {
                      onSearchReset()
                    }
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  title="Effacer la recherche"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            {onSearchValueChange && onSearchSubmit && (
              <Button
                onClick={onSearchSubmit}
                style={{
                  border: '2px solid #f97316',
                  padding: '5px 15px',
                  borderRadius: '6px',
                }}
                className="bg-emerald-600 hover:bg-emerald-700 h-12 px-4 text-white font-medium"
                disabled={isTableLoading}
              >
                <Search className="h-5 w-5 mr-2" />
                Rechercher
              </Button>
            )}
          </div>
          <div className="flex items-center gap-3">
            {extraActionsSlot}
            {onAdd && (
              <Button
                onClick={onAdd}
                style={{
                  border: '2px solid #f97316',
                  padding: '5px 20px',
                  borderRadius: '6px',
                }}
                className="bg-secondary hover:bg-white text-white hover:text-black h-12 px-6 font-medium"
              >
                <Plus className="h-5 w-5 mr-2" />
                {addButtonText}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Table avec scroll contrôlé (hauteur réduite) */}
      <div className="flex-1 px-8 py-4">
        {/* Loader global du tableau */}
        {isTableLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-3">
              <Icon icon="line-md:loading-twotone-loop" className="h-6 w-6 text-emerald-600" />
              <span className="text-gray-600 font-medium">Chargement des données...</span>
            </div>
          </div>
        )}

        <div className={`rounded-lg border border-gray-200 bg-white shadow-sm overflow-auto max-h-[60vh] ${isTableLoading ? 'opacity-50' : ''}`}>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="bg-gray-50">
                  {headerGroup.headers.map((header) => (
                    <TableHead 
                      key={header.id}
                      className="px-6 py-4 text-left font-semibold text-gray-700"
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={
                            header.column.getCanSort()
                              ? "cursor-pointer select-none flex items-center gap-2 hover:bg-gray-100 transition-colors rounded px-2 py-1 -mx-2"
                              : "flex items-center gap-2"
                          }
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <span className="text-base font-bold">
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </span>
                          {header.column.getCanSort() && (
                            <div className="flex flex-col">
                              {header.column.getIsSorted() === "desc" ? (
                                <ChevronDown className="h-4 w-4 text-emerald-600" />
                              ) : header.column.getIsSorted() === "asc" ? (
                                <ChevronUp className="h-4 w-4 text-emerald-600" />
                              ) : (
                                <div className="h-4 w-4" />
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell 
                        key={cell.id}
                        className="px-6 py-4 text-sm text-gray-900 font-medium"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : 
              (
               
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-64 text-center"
                  >
                    {status === 'pending' ? (
                      <div className="flex flex-col items-center justify-center py-16">
                        <Icon icon="line-md:loading-twotone-loop" className="h-12 w-12 text-secondary mb-4" />
                        <p className="text-gray-600">Chargement des données en cours...</p>
                      </div>
                    ) : (
                    <div className="flex flex-col items-center justify-center py-16">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                        <Search className="h-10 w-10 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        Aucun résultat trouvé
                      </h3>
                      <p className="text-gray-500 mb-6 text-base">
                        Aucune donnée disponible pour le moment
                      </p>
                      {onAdd && (
                        <Button 
                          onClick={onAdd}
                          size="lg"
                          style={{
                            border: '2px solid #f97316',
                            padding: '5px 8px',
                            borderRadius: '6px',
                          }}
                          className="bg-emerald-600 hover:bg-emerald-700 px-6 py-3 text-base font-medium"
                        >
                          <Plus className="h-5 w-5 mr-2" />
                          {addButtonText}
                        </Button>
                      )}
                    </div>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <div className="px-8 py-4 border-t border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="text-base text-gray-700 font-medium">
            {useServerPagination && pagination ? (
              `Affichage de ${pagination.number * pagination.size + 1} à ${Math.min(
                (pagination.number + 1) * pagination.size,
                pagination.totalElements
              )} sur ${pagination.totalElements} résultats`
            ) : (
              `Affichage de ${table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} à ${Math.min(
                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                filteredData.length
              )} sur ${filteredData.length} résultats`
            )}
          </div>
          <div className="flex items-center gap-4">
            {useServerPagination && pagination  ? (
              <>
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => onPaginationChange?.({ page: pagination.number - 1 })}
                  disabled={!pagination.hasPrevious || isPaginationLoading}
                  className="px-4 py-2"
                >
                  Précédent
                </Button>
                <div className="flex items-center gap-2">
                  <span className="text-base text-gray-600 font-medium">
                    Page {pagination.number + 1} sur {pagination.totalPages}
                  </span>
                  {isPaginationLoading && (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-600"></div>
                      <span className="text-sm text-gray-500">Chargement...</span>
                    </div>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => onPaginationChange?.({ page: pagination.number + 1 })}
                  disabled={!pagination.hasNext || isPaginationLoading}
                  className="px-4 py-2"
                >
                  Suivant
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="px-4 py-2"
                >
                  Précédent
                </Button>
                <div className="flex items-center gap-2">
                  <span className="text-base text-gray-600 font-medium">
                    Page {table.getState().pagination.pageIndex + 1} sur{" "}
                    {table.getPageCount()}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="px-4 py-2"
                >
                  Suivant
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
