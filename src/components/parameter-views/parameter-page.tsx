"use client"

import * as React from "react"

// Composant pour la confirmation de suppression
function DeleteConfirmationDialog({
  isOpen,
  onClose,
  onConfirm
}: {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void | Promise<void>
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
        <h2 className="text-lg font-semibold mb-2">Confirmer la suppression</h2>
        <p className="text-gray-600 mb-6">
          Cette action est irréversible. Voulez-vous vraiment supprimer cet élément ?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border-2 border-black rounded-md hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 border-2 border-red-600 text-red-600 rounded-md hover:bg-red-50"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  )
}
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { DataTable } from "@/components/ui/data-table"
import { PaginationInfo } from "@/types/pagination"
import { toast } from "sonner"

interface BaseParameterItem {
  id: string | number
  [key: string]: unknown
}

interface ParameterPageProps<T extends BaseParameterItem> {
  title: string
  description?: string
  data: T[]
  columns: Array<{
    key: keyof T
    label: string
    sortable?: boolean
    render?: (value: unknown, item: T) => React.ReactNode
  }>
  searchKey?: keyof T
  searchPlaceholder?: string
  onAdd?: () => void
  onEdit?: (item: T) => void
  onDelete?: (item: T) => void | Promise<void>
  onView?: (item: T) => void
  addButtonText?: string
  showActions?: boolean
  status?: boolean
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
  onRefresh?: () => void
  extraActionsSlot?: React.ReactNode
}

export function ParameterPage<T extends BaseParameterItem>({
  title,
  description,
  data,
  columns,
  searchKey,
  searchPlaceholder,
  onAdd,
  onEdit,
  onDelete,
  onView,
  addButtonText = "Ajouter",
  showActions = true,
  status,
  useServerPagination = false,
  pagination,
  onPaginationChange,
  isPaginationLoading,
  isTableLoading,
  searchQuery,
  searchValue,
  onSearchChange,
  onSearchValueChange,
  onSearchSubmit,
  onSearchReset,
  onRefresh,
  extraActionsSlot,
}: ParameterPageProps<T>) {
  const [pendingDelete, setPendingDelete] = React.useState<T | null>(null)
  
  // Créer les colonnes pour TanStack Table
  const tableColumns: ColumnDef<T>[] = React.useMemo(() => {
    const cols: ColumnDef<T>[] = columns.map((column) => ({
      accessorKey: column.key as string,
      header: column.label,
      cell: ({ row, getValue }) => {
        const value = getValue()
        const item = row.original
        
        if (column.render) {
          return column.render(value, item)
        }
        
        return <div className="font-medium">{value as React.ReactNode}</div>
      },
      enableSorting: column.sortable !== false,
    }))

    // Ajouter la colonne Actions si nécessaire
    if (showActions && (onEdit || onDelete || onView)) {
      cols.push({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const item = row.original

          return (
            <TooltipProvider>
              <div className="flex items-center gap-2">
                {/* Actions rapides pour les actions principales */}
                {onView && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView(item)}
                        className="h-8 w-8 p-0 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Voir les détails</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                {onEdit && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        aria-label="Modifier"
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(item)}
                        className="h-8 w-8 p-0 text-secondary hover:bg-emerald-50"
                      >
                        <Edit className="h-4 w-4 text-orange-600" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Modifier</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                {onDelete && (
                  <>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          aria-label="Supprimer"
                          variant="ghost"
                          size="sm"
                          onClick={() => setPendingDelete(item)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Supprimer</p>
                      </TooltipContent>
                    </Tooltip>
                    <DeleteConfirmationDialog
                      isOpen={pendingDelete?.id === item.id}
                      onClose={() => setPendingDelete(null)}
                      onConfirm={async () => {
                        if (!pendingDelete) return
                        try {
                          await onDelete(pendingDelete)
                          toast.success("Élément supprimé avec succès")
                          setPendingDelete(null)
                        } catch (error) {
                          const message =
                            (error as any)?.response?.data?.message ||
                            (error as Error)?.message ||
                            "Erreur lors de la suppression de l'élément"
                          toast.error(message)
                          // On garde l'élément affiché pour éviter de "casser" l'UI
                        }
                      }}
                    />
                  </>
                )}

              {/* Menu déroulant pour plus d'actions si nécessaire */}
              {(onEdit && onDelete && onView) && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          aria-label="Ouvrir le menu"
                          variant="ghost" 
                          className="h-8 w-8 p-0"
                        >
                          <span className="sr-only">Ouvrir le menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {onView && (
                          <DropdownMenuItem aria-label="Voir" onClick={() => onView(item)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Voir
                          </DropdownMenuItem>
                        )}
                        {onEdit && (
                          <DropdownMenuItem aria-label="Modifier" onClick={() => onEdit(item)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Modifier
                          </DropdownMenuItem>
                        )}
                        {onDelete && (
                          <DropdownMenuItem 
                            aria-label="Supprimer"
                            onClick={() => setPendingDelete(item)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Supprimer
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Plus d'actions</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            </TooltipProvider>
          )
        },
        enableSorting: false,
      })
    }

    return cols
  }, [columns, onEdit, onDelete, onView, showActions, pendingDelete])

  return (
    <DataTable
      title={title}
      description={description}
      columns={tableColumns}
      data={data}
      searchKey={searchKey as string}
      searchPlaceholder={searchPlaceholder}
      onAdd={onAdd}
      addButtonText={addButtonText}
      status={status ? 'pending' : 'error'}
      useServerPagination={useServerPagination}
      pagination={pagination}
      onPaginationChange={onPaginationChange}
      isPaginationLoading={isPaginationLoading}
      isTableLoading={isTableLoading}
      searchQuery={searchQuery}
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      onSearchValueChange={onSearchValueChange}
      onSearchSubmit={onSearchSubmit}
      onSearchReset={onSearchReset}
      onRefresh={onRefresh}
      extraActionsSlot={extraActionsSlot}
    />
  )
}
