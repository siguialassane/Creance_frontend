"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { useDebiteurFormDataStep1 } from "@/hooks/useDebiteurFormDataStep";
import { useDebiteurFormDataStep2 } from "@/hooks/useDebiteurFormDataStep";
import { useQuartiersSearchable } from "@/hooks/useQuartiersSearchable";
import { useVillesSearchable } from "@/hooks/useVillesSearchable";

interface DebiteurFilters {
  typeDebiteur?: 'P' | 'M';
  categorieDebiteur?: string;
  quartier?: string;
  ville?: string;
  statutSalarie?: string;
}

interface DebiteurFilterPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: DebiteurFilters;
  onFiltersChange: (filters: DebiteurFilters) => void;
  onApply: () => void;
}

export function DebiteurFilterPanel({
  open,
  onOpenChange,
  filters,
  onFiltersChange,
  onApply,
}: DebiteurFilterPanelProps) {
  const { data: step1Data, isLoading: isLoadingStep1 } = useDebiteurFormDataStep1();
  const { data: step2Data, isLoading: isLoadingStep2 } = useDebiteurFormDataStep2(true);
  
  const quartiersSearchable = useQuartiersSearchable();
  const villesSearchable = useVillesSearchable();

  const categoriesDebiteur = step1Data?.categoriesDebiteur || [];
  const quartiers = step2Data?.quartiers || [];
  const statutsSalarie = step2Data?.statutsSalarie || [];

  const handleFilterChange = (key: keyof DebiteurFilters, value: string | undefined) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined,
    });
  };

  const handleReset = () => {
    onFiltersChange({});
  };

  const handleResetField = (key: keyof DebiteurFilters) => {
    handleFilterChange(key, undefined);
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== undefined && value !== '');

  return (
    <Sheet open={open} onOpenChange={onOpenChange} modal={true}>
      <SheetContent 
        side="right" 
        className="w-[400px] sm:w-[500px] overflow-y-auto z-[60]"
      >
        <SheetHeader>
          <SheetTitle className="text-xl font-semibold">Filtres avancés - Débiteurs</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 py-6 px-4">
          {/* Type de débiteur */}
          <div className="space-y-2">
            <Label htmlFor="typeDebiteur" className="text-sm font-medium">
              Type de débiteur
            </Label>
            <div className="relative">
              <Select
                value={filters.typeDebiteur || '__ALL__'}
                onValueChange={(value) => handleFilterChange('typeDebiteur', value === '__ALL__' ? undefined : value as 'P' | 'M')}
              >
                <SelectTrigger id="typeDebiteur">
                  <SelectValue placeholder="Tous les types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__ALL__">Tous les types</SelectItem>
                  <SelectItem value="P">Personne physique</SelectItem>
                  <SelectItem value="M">Personne morale</SelectItem>
                </SelectContent>
              </Select>
              {filters.typeDebiteur && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-8 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-transparent"
                  onClick={() => handleResetField('typeDebiteur')}
                >
                  <X className="h-4 w-4 text-gray-500" />
                </Button>
              )}
            </div>
          </div>

          {/* Catégorie de débiteur */}
          <div className="space-y-2">
            <Label htmlFor="categorieDebiteur" className="text-sm font-medium">
              Catégorie de débiteur
            </Label>
            <div className="relative">
              <Select
                value={filters.categorieDebiteur || '__ALL__'}
                onValueChange={(value) => handleFilterChange('categorieDebiteur', value === '__ALL__' ? undefined : value)}
                disabled={isLoadingStep1}
              >
                <SelectTrigger id="categorieDebiteur">
                  <SelectValue placeholder={isLoadingStep1 ? "Chargement..." : "Toutes les catégories"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__ALL__">Toutes les catégories</SelectItem>
                  {categoriesDebiteur.map((categorie: any) => {
                    const code = categorie.CATEG_DEB_CODE || categorie.code || categorie.id;
                    const libelle = categorie.CATEG_DEB_LIB || categorie.libelle || categorie.label || code;
                    return (
                      <SelectItem key={code} value={code}>
                        {libelle}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {filters.categorieDebiteur && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-8 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-transparent"
                  onClick={() => handleResetField('categorieDebiteur')}
                >
                  <X className="h-4 w-4 text-gray-500" />
                </Button>
              )}
            </div>
          </div>

          {/* Ville */}
          <div className="space-y-2">
            <Label htmlFor="ville" className="text-sm font-medium">
              Ville
            </Label>
            <div className="relative">
              <SearchableSelect
                value={filters.ville}
                onValueChange={(value) => handleFilterChange('ville', value || undefined)}
                items={villesSearchable.items}
                placeholder="Toutes les villes"
                isLoading={villesSearchable.isLoading}
                hasMore={villesSearchable.hasMore}
                onLoadMore={villesSearchable.loadMore}
                isFetchingMore={villesSearchable.isFetchingMore}
                search={villesSearchable.search}
                onSearchChange={villesSearchable.setSearch}
                disabled={villesSearchable.isLoading}
              />
              {filters.ville && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-transparent z-10"
                  onClick={() => handleResetField('ville')}
                >
                  <X className="h-4 w-4 text-gray-500" />
                </Button>
              )}
            </div>
          </div>

          {/* Quartier */}
          <div className="space-y-2">
            <Label htmlFor="quartier" className="text-sm font-medium">
              Quartier
            </Label>
            <div className="relative">
              <SearchableSelect
                value={filters.quartier}
                onValueChange={(value) => handleFilterChange('quartier', value || undefined)}
                items={quartiersSearchable.items}
                placeholder="Tous les quartiers"
                isLoading={quartiersSearchable.isLoading}
                hasMore={quartiersSearchable.hasMore}
                onLoadMore={quartiersSearchable.loadMore}
                isFetchingMore={quartiersSearchable.isFetchingMore}
                search={quartiersSearchable.search}
                onSearchChange={quartiersSearchable.setSearch}
                disabled={quartiersSearchable.isLoading}
              />
              {filters.quartier && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-transparent z-10"
                  onClick={() => handleResetField('quartier')}
                >
                  <X className="h-4 w-4 text-gray-500" />
                </Button>
              )}
            </div>
          </div>

          {/* Statut salarié (uniquement pour personnes physiques) */}
          {filters.typeDebiteur === 'P' && (
            <div className="space-y-2">
              <Label htmlFor="statutSalarie" className="text-sm font-medium">
                Statut salarié
              </Label>
              <div className="relative">
                <Select
                  value={filters.statutSalarie || '__ALL__'}
                  onValueChange={(value) => handleFilterChange('statutSalarie', value === '__ALL__' ? undefined : value)}
                  disabled={isLoadingStep2}
                >
                  <SelectTrigger id="statutSalarie">
                    <SelectValue placeholder={isLoadingStep2 ? "Chargement..." : "Tous les statuts"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__ALL__">Tous les statuts</SelectItem>
                    {statutsSalarie.map((statut: any) => {
                      const code = statut.STATSAL_CODE || statut.code || statut.id;
                      const libelle = statut.STATSAL_LIB || statut.libelle || statut.label || code;
                      return (
                        <SelectItem key={code} value={code}>
                          {libelle}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                {filters.statutSalarie && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-8 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-transparent"
                    onClick={() => handleResetField('statutSalarie')}
                  >
                    <X className="h-4 w-4 text-gray-500" />
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        <SheetFooter className="flex gap-2 border-t pt-4">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={!hasActiveFilters}
            className="flex-1"
          >
            Réinitialiser
          </Button>
          <Button
            onClick={() => {
              onApply();
              onOpenChange(false);
            }}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
          >
            Appliquer les filtres
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

