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
import { ChevronDown, ChevronUp, Search, Plus, Loader2 } from "lucide-react"

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
import { Badge } from "@/components/ui/badge"
import { Icon } from "@iconify/react/dist/iconify.js"

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
}

export function DataTable<TData, TValue>({
  title,
  description,
  columns,
  data,
  searchKey,
  searchPlaceholder = "Rechercher...",
  onAdd,
  addButtonText = "Ajouter",
  statsSlot,
  extraActionsSlot,
  status,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [query, setQuery] = React.useState("")

  // Global search across all fields of each row
  const filteredData = React.useMemo(() => {
    if (!query) return data
    const q = query.toString().toLowerCase()
    return (data as any[]).filter((row) =>
      Object.values(row ?? {}).some((val) =>
        (val ?? "").toString().toLowerCase().includes(q)
      )
    )
  }, [data, query])

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
    },
  })

  // Revenir à la première page à chaque saisie pour voir immédiatement les résultats
  React.useEffect(() => {
    table.setPageIndex(0)
  }, [query, table])

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
          <div className="relative flex-1 max-w-lg">
            {/* <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" /> */}
            <Input
              placeholder={searchPlaceholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                border: '1px solid #000',
                padding: '0px 8px',
                borderRadius: '6px',
              }}
              className="pl-12 h-12 text-base border-gray-300 focus:border-emerald-500 focus:ring-emerald-200"
            />
          </div>
          <div className="flex items-center gap-3">
            {extraActionsSlot}
            {onAdd && (
              <div 
                onClick={onAdd}
                style={{
                  border: '2px solid secondary',
                  cursor: 'pointer',
                  padding: '5px 25px',
                  borderRadius: '6px',
                }}
                className="bg-secondary hover:bg-white text-white hover:text-black"
              >
                {addButtonText}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table avec scroll contrôlé (hauteur réduite) */}
      <div className="flex-1 px-8 py-4">
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-auto max-h-[60vh]">
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
                          <Icon icon="mdi:loading" className="h-10 w-10 text-gray-400" />
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
            Affichage de {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} à {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              filteredData.length
            )} sur {filteredData.length} résultats
          </div>
          <div className="flex items-center gap-4">
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
          </div>
        </div>
      </div>
    </div>
  )
}
