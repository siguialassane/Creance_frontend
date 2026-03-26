"use client"

import { useState, useMemo } from 'react'
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, Eye, ChevronUp, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import colors from '@/lib/theme/colors'

interface Column {
  key: string
  label: string
  sortable?: boolean
}

interface ModernParameterPageProps {
  title: string
  data: any[]
  columns: Column[]
  onAdd: () => void
  onEdit: (item: any) => void
  onDelete: (item: any) => void
  onView?: (item: any) => void
  searchFields: string[]
  primaryField: string
  description?: string
}

export default function ModernParameterPage({
  title,
  data,
  columns,
  onAdd,
  onEdit,
  onDelete,
  onView,
  searchFields,
  primaryField,
  description
}: ModernParameterPageProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState(primaryField)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Filtrage et tri
  const filteredData = useMemo(() => {
    let filtered = data

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(item =>
        searchFields.some(field =>
          item[field]?.toString().toLowerCase().includes(searchLower)
        )
      )
    }

    // Tri
    filtered.sort((a, b) => {
      const aValue = a[sortField]?.toString() || ''
      const bValue = b[sortField]?.toString() || ''
      
      if (sortDirection === 'asc') {
        return aValue.localeCompare(bValue)
      } else {
        return bValue.localeCompare(aValue)
      }
    })

    return filtered
  }, [data, searchTerm, sortField, sortDirection, searchFields])

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage)

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header épuré avec plus d'espace */}
      <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{title}</h1>
            {description && (
              <p className="text-base text-gray-600">{description}</p>
            )}
          </div>
          <Button 
            onClick={onAdd}
            size="lg"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="h-5 w-5 mr-2" />
            Ajouter
          </Button>
        </div>

        {/* Barre d'actions avec plus d'espace */}
        <div className="flex items-center gap-6">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder={`Rechercher dans ${title.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 text-base border-gray-300 focus:border-emerald-500 focus:ring-emerald-200"
            />
          </div>
          <Badge variant="outline" className="text-gray-600 px-4 py-2 text-sm font-medium">
            {filteredData.length} élément{filteredData.length > 1 ? 's' : ''}
          </Badge>
        </div>
      </div>

      {/* Table moderne avec shadcn/ui */}
      <div className="flex-1 overflow-hidden px-8 py-6">
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                {columns.map((column) => (
                  <TableHead
                    key={column.key}
                    className={`px-6 py-4 text-left font-semibold text-gray-700 ${
                      column.sortable ? 'cursor-pointer hover:bg-gray-100 transition-colors' : ''
                    }`}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{column.label}</span>
                      {column.sortable && sortField === column.key && (
                        sortDirection === 'asc' ? (
                          <ChevronUp className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-emerald-600" />
                        )
                      )}
                    </div>
                  </TableHead>
                ))}
                <TableHead className="px-6 py-4 text-right font-semibold text-gray-700">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((item, index) => (
                <TableRow key={item.id || index} className="hover:bg-gray-50 transition-colors">
                  {columns.map((column) => (
                    <TableCell key={column.key} className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {item[column.key]}
                    </TableCell>
                  ))}
                  <TableCell className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
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
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(item)}
                        className="h-8 w-8 p-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(item)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* État vide */}
          {filteredData.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {searchTerm ? 'Aucun résultat trouvé' : `Aucun ${title.toLowerCase()}`}
              </h3>
              <p className="text-gray-500 mb-6 text-base">
                {searchTerm 
                  ? 'Essayez de modifier votre recherche'
                  : `Commencez par ajouter votre premier ${title.toLowerCase().slice(0, -1)}`
                }
              </p>
              {!searchTerm && (
                <Button 
                  onClick={onAdd} 
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-700 px-6 py-3 text-base font-medium"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Ajouter
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Pagination améliorée */}
      {totalPages > 1 && (
        <div className="px-8 py-4 border-t border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="text-base text-gray-700 font-medium">
              Affichage de {startIndex + 1} à {Math.min(startIndex + itemsPerPage, filteredData.length)} sur {filteredData.length} résultats
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="default"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-4 py-2"
              >
                Précédent
              </Button>
              <div className="flex items-center gap-2">
                <span className="text-base text-gray-600 font-medium">
                  Page {currentPage} sur {totalPages}
                </span>
              </div>
              <Button
                variant="outline"
                size="default"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-4 py-2"
              >
                Suivant
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
