"use client"

import * as React from "react"
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
import { DataTable } from "@/components/ui/data-table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"

interface BaseParameterItem {
  id: string | number
  [key: string]: any
}

interface ParameterPageProps<T extends BaseParameterItem> {
  title: string
  description?: string
  data: T[]
  columns: Array<{
    key: keyof T
    label: string
    sortable?: boolean
    render?: (value: any, item: T) => React.ReactNode
  }>
  searchKey?: keyof T
  searchPlaceholder?: string
  onAdd?: () => void
  onEdit?: (item: T) => void
  onDelete?: (item: T) => void
  onView?: (item: T) => void
  addButtonText?: string
  showActions?: boolean
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
            <div className="flex items-center gap-2">
              {/* Actions rapides pour les actions principales */}
              {onView && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onView(item)}
                  className="h-8 w-8 p-0 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              )}
              {onEdit && (
                <Button
                aria-label="Modifier"
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(item)}
                  className="h-8 w-8 p-0 text-secondary hover:bg-emerald-50"
                >
                  <Edit className="h-4 w-4" color="#f97316" />
                </Button>
              )}
              {onDelete && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      aria-label="Supprimer"
                      variant="ghost"
                      size="sm"
                      onClick={() => setPendingDelete(item)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" color="#E53E3E" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action est irréversible. Voulez-vous vraiment supprimer cet élément ?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel 
                        style={{
                          border: '2px solid #000',
                          padding: '5px 15px',
                          borderRadius: '6px',
                        }}
                      >Annuler</AlertDialogCancel>
                      <AlertDialogAction
                        style={{
                          border: '2px solid #E53E3E',
                          padding: '5px 15px',
                          borderRadius: '6px',
                        }}
                        onClick={() => {
                          if (pendingDelete) {
                            // onDelete(pendingDelete)
                            toast.success("Élément supprimé avec succès")
                            setPendingDelete(null)
                          }
                        }}
                      >
                        Supprimer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}

              {/* Menu déroulant pour plus d'actions si nécessaire */}
              {(onEdit && onDelete && onView) && (
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
                        onClick={() => onDelete(item)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          )
        },
        enableSorting: false,
      })
    }

    return cols
  }, [columns, onEdit, onDelete, onView, showActions])

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
    />
  )
}
