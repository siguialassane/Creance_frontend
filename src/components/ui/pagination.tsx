"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalElements: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  showPageSizeSelector?: boolean
  showPageInput?: boolean
  className?: string
}

export function Pagination({
  currentPage,
  totalPages,
  totalElements,
  pageSize,
  onPageChange,
  onPageSizeChange,
  showPageSizeSelector = true,
  showPageInput = true,
  className = "",
}: PaginationProps) {
  const [pageInput, setPageInput] = React.useState((currentPage + 1).toString())

  // Mettre à jour l'input quand la page change
  React.useEffect(() => {
    setPageInput((currentPage + 1).toString())
  }, [currentPage])

  const handlePageInputChange = (value: string) => {
    setPageInput(value)
  }

  const handlePageInputSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const page = parseInt(pageInput)
    if (page >= 1 && page <= totalPages) {
      onPageChange(page - 1) // Convertir en index 0-based
    } else {
      setPageInput((currentPage + 1).toString()) // Reset si invalide
    }
  }

  const handlePageInputBlur = () => {
    setPageInput((currentPage + 1).toString()) // Reset si l'utilisateur quitte sans valider
  }

  const startElement = currentPage * pageSize + 1
  const endElement = Math.min((currentPage + 1) * pageSize, totalElements)

  const canGoPrevious = currentPage > 0
  const canGoNext = currentPage < totalPages - 1

  return (
    <div className={`flex items-center justify-between px-2 ${className}`}>
      {/* Informations sur les éléments */}
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">
            Affichage de {startElement} à {endElement} sur {totalElements} éléments
          </p>
        </div>
        
        {/* Sélecteur de taille de page */}
        {showPageSizeSelector && (
          <div className="flex items-center space-x-2">
            <Label htmlFor="page-size" className="text-sm font-medium">
              Éléments par page
            </Label>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => onPageSizeChange(parseInt(value))}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50, 100].map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Contrôles de pagination */}
      <div className="flex items-center space-x-2">
        {/* Bouton première page */}
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => onPageChange(0)}
          disabled={!canGoPrevious}
        >
          <span className="sr-only">Aller à la première page</span>
          <ChevronsLeft className="h-4 w-4" />
        </Button>

        {/* Bouton page précédente */}
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoPrevious}
        >
          <span className="sr-only">Aller à la page précédente</span>
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Input de page */}
        {showPageInput && (
          <div className="flex items-center space-x-2">
            <Label htmlFor="page-input" className="text-sm font-medium">
              Page
            </Label>
            <form onSubmit={handlePageInputSubmit}>
              <Input
                id="page-input"
                type="number"
                min="1"
                max={totalPages}
                value={pageInput}
                onChange={(e) => handlePageInputChange(e.target.value)}
                onBlur={handlePageInputBlur}
                className="h-8 w-12 text-center"
              />
            </form>
            <span className="text-sm text-muted-foreground">
              sur {totalPages}
            </span>
          </div>
        )}

        {/* Bouton page suivante */}
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoNext}
        >
          <span className="sr-only">Aller à la page suivante</span>
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Bouton dernière page */}
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => onPageChange(totalPages - 1)}
          disabled={!canGoNext}
        >
          <span className="sr-only">Aller à la dernière page</span>
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// Composant de pagination simple pour les cas basiques
export function SimplePagination({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}: {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}) {
  const canGoPrevious = currentPage > 0
  const canGoNext = currentPage < totalPages - 1

  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!canGoPrevious}
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Précédent
      </Button>
      
      <span className="text-sm text-muted-foreground">
        Page {currentPage + 1} sur {totalPages}
      </span>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!canGoNext}
      >
        Suivant
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  )
}
