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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PaginationParams } from "@/types/pagination";
import { STATUT_RECOUVREMENT } from "@/lib/constants/statut-recouvrement";
import { useGroupesCreanceSearchable } from "@/hooks/useGroupesCreanceSearchable";

interface CreanceFilters {
  statutRecouvrement?: string;
  groupeCreance?: string;
  dateCreationFrom?: string;
  dateCreationTo?: string;
  dateEcheanceFrom?: string;
  dateEcheanceTo?: string;
  typeDebiteur?: 'P' | 'M';
}

interface CreanceFilterPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: CreanceFilters;
  onFiltersChange: (filters: CreanceFilters) => void;
  onApply: () => void;
}

export function CreanceFilterPanel({
  open,
  onOpenChange,
  filters,
  onFiltersChange,
  onApply,
}: CreanceFilterPanelProps) {
  // Utiliser useGroupesCreanceSearchable qui utilise le bon endpoint avec pagination
  const groupesCreanceSearchable = useGroupesCreanceSearchable();
  const groupesCreance = groupesCreanceSearchable.items;
  const isLoadingGroupes = groupesCreanceSearchable.isLoading;

  // Liste des statuts de recouvrement disponibles depuis les constantes
  const statutsRecouvrement = Object.entries(STATUT_RECOUVREMENT).map(([code, libelle]) => ({
    code,
    libelle,
  }));

  const handleFilterChange = (key: keyof CreanceFilters, value: string | undefined) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined,
    });
  };

  const handleReset = () => {
    onFiltersChange({});
  };

  const handleResetField = (key: keyof CreanceFilters) => {
    handleFilterChange(key, undefined);
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== undefined && value !== '');

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[400px] sm:w-[500px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-xl font-semibold">Filtres avancés - Créances</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 py-6 px-4">
          {/* Statut de recouvrement */}
          <div className="space-y-2">
            <Label htmlFor="statutRecouvrement" className="text-sm font-medium">
              Statut de recouvrement
            </Label>
            <div className="relative">
              <Select
                value={filters.statutRecouvrement || '__ALL__'}
                onValueChange={(value) => handleFilterChange('statutRecouvrement', value === '__ALL__' ? undefined : value)}
              >
                <SelectTrigger id="statutRecouvrement">
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__ALL__">Tous les statuts</SelectItem>
                  {statutsRecouvrement.map((statut) => (
                    <SelectItem key={statut.code} value={statut.code}>
                      {statut.libelle}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {filters.statutRecouvrement && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-8 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-transparent"
                  onClick={() => handleResetField('statutRecouvrement')}
                >
                  <X className="h-4 w-4 text-gray-500" />
                </Button>
              )}
            </div>
          </div>

          {/* Groupe de créance */}
          <div className="space-y-2">
            <Label htmlFor="groupeCreance" className="text-sm font-medium">
              Groupe de créance
            </Label>
            <div className="relative">
              <Select
                value={filters.groupeCreance || '__ALL__'}
                onValueChange={(value) => handleFilterChange('groupeCreance', value === '__ALL__' ? undefined : value)}
                disabled={isLoadingGroupes}
              >
                <SelectTrigger id="groupeCreance">
                  <SelectValue placeholder={isLoadingGroupes ? "Chargement..." : "Tous les groupes"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__ALL__">Tous les groupes</SelectItem>
                  {groupesCreance.map((groupe: any) => {
                    // useGroupesCreanceSearchable retourne déjà des items avec value et label
                    const code = groupe.value || groupe.GRP_CREAN_CODE || groupe.GC_CODE || groupe.code || groupe.id;
                    const libelle = groupe.label || groupe.GRP_CREAN_LIB || groupe.GC_LIB || groupe.libelle || groupe.label || code;
                    return (
                      <SelectItem key={code} value={code}>
                        {libelle}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {filters.groupeCreance && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-8 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-transparent"
                  onClick={() => handleResetField('groupeCreance')}
                >
                  <X className="h-4 w-4 text-gray-500" />
                </Button>
              )}
            </div>
          </div>

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

          {/* Date de création */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Date de création</Label>
            <div className="flex gap-2">
              <div className="flex-1 space-y-2">
                <Label htmlFor="dateCreationFrom" className="text-xs text-gray-500">
                  Du
                </Label>
                <Input
                  id="dateCreationFrom"
                  type="date"
                  value={filters.dateCreationFrom || ''}
                  onChange={(e) => handleFilterChange('dateCreationFrom', e.target.value || undefined)}
                />
              </div>
              <div className="flex-1 space-y-2">
                <Label htmlFor="dateCreationTo" className="text-xs text-gray-500">
                  Au
                </Label>
                <Input
                  id="dateCreationTo"
                  type="date"
                  value={filters.dateCreationTo || ''}
                  onChange={(e) => handleFilterChange('dateCreationTo', e.target.value || undefined)}
                />
              </div>
            </div>
          </div>

          {/* Date d'échéance */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Date d'échéance</Label>
            <div className="flex gap-2">
              <div className="flex-1 space-y-2">
                <Label htmlFor="dateEcheanceFrom" className="text-xs text-gray-500">
                  Du
                </Label>
                <Input
                  id="dateEcheanceFrom"
                  type="date"
                  value={filters.dateEcheanceFrom || ''}
                  onChange={(e) => handleFilterChange('dateEcheanceFrom', e.target.value || undefined)}
                />
              </div>
              <div className="flex-1 space-y-2">
                <Label htmlFor="dateEcheanceTo" className="text-xs text-gray-500">
                  Au
                </Label>
                <Input
                  id="dateEcheanceTo"
                  type="date"
                  value={filters.dateEcheanceTo || ''}
                  onChange={(e) => handleFilterChange('dateEcheanceTo', e.target.value || undefined)}
                />
              </div>
            </div>
          </div>
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

