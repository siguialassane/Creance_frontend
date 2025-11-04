"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Loader2, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { PaginationInfo } from "@/types/pagination"

export interface SearchableSelectItem {
  value: string
  label: string
  [key: string]: any
}

interface SearchableSelectProps {
  value?: string
  onValueChange: (value: string) => void
  items: SearchableSelectItem[]
  placeholder?: string
  emptyMessage?: string
  searchPlaceholder?: string
  disabled?: boolean
  className?: string
  isLoading?: boolean
  hasMore?: boolean
  onLoadMore?: () => void
  isFetchingMore?: boolean
  onSearchChange?: (search: string) => void
  displayValue?: (item: SearchableSelectItem) => string
}

export function SearchableSelect({
  value,
  onValueChange,
  items,
  placeholder = "Sélectionner...",
  emptyMessage = "Aucun résultat trouvé.",
  searchPlaceholder = "Rechercher...",
  disabled = false,
  className,
  isLoading = false,
  hasMore = false,
  onLoadMore,
  isFetchingMore = false,
  onSearchChange,
  displayValue,
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const listRef = React.useRef<HTMLDivElement>(null)
  const commandInputRef = React.useRef<HTMLInputElement>(null)

  // Trouver l'item sélectionné pour afficher son label
  const selectedItem = items.find((item) => item.value === value)

  // Réinitialiser la recherche quand on ferme/ouvre le popover
  React.useEffect(() => {
    if (!open) {
      setSearch("")
      onSearchChange?.("")
    } else {
      // Quand on ouvre, réinitialiser aussi la recherche dans le parent
      setSearch("")
      onSearchChange?.("")
      // Mettre le focus sur le champ de recherche quand le popover s'ouvre
      // Utiliser un petit délai pour s'assurer que le DOM est prêt
      setTimeout(() => {
        if (commandInputRef.current) {
          commandInputRef.current.focus()
        }
      }, 100)
    }
  }, [open, onSearchChange])

  // Empêcher la fermeture du popover quand on clique à l'intérieur
  const handlePopoverInteractOutside = React.useCallback((e: Event) => {
    // Empêcher la fermeture si on clique dans le popover ou sur un autre champ du formulaire
    const target = e.target as HTMLElement
    if (target.closest('[role="dialog"]') || target.closest('[cmdk-root]')) {
      e.preventDefault()
    }
  }, [])

  // Gérer le changement de recherche
  const handleSearchChange = React.useCallback((newSearch: string) => {
    setSearch(newSearch)
    onSearchChange?.(newSearch)
  }, [onSearchChange])

  // Observer pour détecter le scroll et charger plus d'items
  React.useEffect(() => {
    if (!open || !onLoadMore || !hasMore || isFetchingMore) return

    let scrollElement: HTMLElement | null = null
    let cleanup: (() => void) | null = null

    // Attendre un peu pour que le DOM soit prêt
    const timeoutId = setTimeout(() => {
      // CommandList crée un élément avec overflow-y-auto directement
      // On peut utiliser listRef qui pointe vers CommandList
      scrollElement = listRef.current as HTMLElement
      
      if (!scrollElement) {
        // Essayer de trouver l'élément avec cmdk-list
        scrollElement = listRef.current?.querySelector('[cmdk-list]') as HTMLElement
      }

      if (!scrollElement) {
        // Dernière tentative : chercher le conteneur de scroll
        scrollElement = listRef.current?.querySelector('.overflow-y-auto') as HTMLElement
      }

      if (!scrollElement) return

      const handleScroll = () => {
        if (!scrollElement || isFetchingMore) return
        const { scrollTop, scrollHeight, clientHeight } = scrollElement
        // Charger plus quand on est à 90% du scroll
        if (scrollTop + clientHeight >= scrollHeight * 0.9) {
          onLoadMore()
        }
      }

      scrollElement.addEventListener("scroll", handleScroll, { passive: true })
      
      cleanup = () => {
        if (scrollElement) {
          scrollElement.removeEventListener("scroll", handleScroll)
        }
      }
    }, 150)

    return () => {
      clearTimeout(timeoutId)
      if (cleanup) {
        cleanup()
      }
    }
  }, [open, onLoadMore, hasMore, isFetchingMore, items.length])

  return (
    <Popover 
      open={disabled ? false : open} 
      onOpenChange={disabled ? undefined : setOpen}
      modal={false}
    >
      <PopoverTrigger asChild>
        <div className="relative w-full">
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              "w-full justify-between h-9",
              !value && "text-muted-foreground",
              value && "pr-8",
              disabled && "bg-gray-50 cursor-not-allowed",
              className
            )}
            style={{
              borderColor: '#28A325',
              backgroundColor: disabled ? '#f3f4f6' : '#f3f4f6',
            }}
          >
            {value
              ? (displayValue ? displayValue(selectedItem!) : selectedItem?.label) || placeholder
              : placeholder}
            {isLoading && !open ? (
              <Loader2 className="ml-2 h-4 w-4 shrink-0 animate-spin opacity-50" />
            ) : (
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            )}
          </Button>
          {value && !disabled && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onValueChange("")
              }}
              className="absolute right-8 top-1/2 -translate-y-1/2 h-4 w-4 rounded-sm hover:bg-gray-200 flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity"
              aria-label="Effacer la sélection"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[var(--radix-popover-trigger-width)] p-0 z-[100]" 
        align="start"
        onInteractOutside={(e) => {
          const target = e.target as HTMLElement
          
          // Ne jamais fermer si on clique dans le formulaire (Dialog ou form parent)
          const isFormElement = target.closest('form') || 
                                target.closest('[role="dialog"]') ||
                                target.tagName === 'INPUT' ||
                                target.tagName === 'TEXTAREA' ||
                                target.tagName === 'SELECT' ||
                                target.closest('button[type="submit"]') ||
                                target.closest('button[type="button"]')
          
          // Ne fermer que si on clique vraiment en dehors du formulaire
          // Mais ne pas empêcher si c'est dans le popover lui-même
          if (isFormElement && 
              !target.closest('[cmdk-root]') && 
              !target.closest('[data-slot="popover-content"]') &&
              !target.closest('[data-slot="popover"]')) {
            e.preventDefault()
          }
        }}
        onEscapeKeyDown={() => {
          // Permettre la fermeture avec Escape
          setOpen(false)
        }}
      >
        <Command shouldFilter={false}>
          <CommandInput
            ref={commandInputRef}
            placeholder={searchPlaceholder}
            value={search}
            onValueChange={handleSearchChange}
            autoFocus={open}
          />
          <CommandList ref={listRef} className="max-h-[300px] overflow-y-auto scroll-smooth">
            {isLoading && items.length === 0 ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="ml-2 text-sm text-muted-foreground">Chargement...</span>
              </div>
            ) : items.length === 0 ? (
              <CommandEmpty>{emptyMessage}</CommandEmpty>
            ) : (
              <CommandGroup>
                {items.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onSelect={() => {
                      onValueChange(item.value === value ? "" : item.value)
                      setOpen(false)
                      setSearch("")
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === item.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {displayValue ? displayValue(item) : item.label}
                  </CommandItem>
                ))}
                {hasMore && (
                  <CommandItem
                    disabled
                    className="flex items-center justify-center py-2"
                  >
                    {isFetchingMore ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        <span className="text-sm text-muted-foreground">Chargement...</span>
                      </>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        Faites défiler pour charger plus
                      </span>
                    )}
                  </CommandItem>
                )}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

