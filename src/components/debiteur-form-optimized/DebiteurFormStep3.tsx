"use client"

import { Control, Controller, FieldErrors, useFieldArray } from "react-hook-form";
import { useDebiteurFormContext } from "./DebiteurFormContext";
import { useState, useEffect, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { useBanquesSearchable } from "@/hooks/useBanquesSearchable";
import { useAgencesBanqueSearchable } from "@/hooks/useAgencesBanqueSearchable";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

const primaryGreen = '#28A325';
const errorRed = '#ef4444';
const labelColor = '#374151';
const titleColor = '#1a202c';

type Props = {
  control: Control<any>;
  errors: FieldErrors<any>;
  readOnly?: boolean;
  watch: any; // react-hook-form watch function
  setValue?: (name: string, value: any) => void; // react-hook-form setValue function
};

export function DebiteurFormStep3({ control, errors, readOnly = false, watch, setValue }: Props) {
  const { formData, isLoadingStep3 } = useDebiteurFormContext();
  
  // Utiliser useFieldArray pour gérer le tableau de domiciliations
  const { fields, append, remove } = useFieldArray({
    control,
    name: "domiciliations",
    keyName: "id", // Utiliser 'id' comme clé
  });

  // Référence pour éviter les doubles initialisations
  const hasInitialized = useRef(false);
  
  // Observer les valeurs du formulaire pour détecter les domiciliations chargées
  const watchedDomiciliations = watch("domiciliations");

  // Initialiser avec une seule domiciliation vide si le tableau est vide (une seule fois)
  // NE PAS initialiser si on est en mode lecture seule ou si des données existent déjà
  useEffect(() => {
    // Vérifier si des domiciliations existent déjà dans le formulaire (chargées depuis l'API)
    const hasExistingDomiciliations = watchedDomiciliations && 
      Array.isArray(watchedDomiciliations) && 
      watchedDomiciliations.length > 0;
    
    // Si on a déjà des domiciliations (chargées depuis l'API), ne rien faire
    if (hasExistingDomiciliations || fields.length > 0) {
      hasInitialized.current = true;
      return;
    }
    
    // Réinitialiser le flag si on passe en mode readOnly
    if (readOnly) {
      hasInitialized.current = false;
      return;
    }
    
    // Ajouter une seule domiciliation si le tableau est vide et qu'on n'a pas déjà initialisé
    // Et seulement si on n'est pas en train d'attendre des données
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      append({
        type: "",
        numeroCompte: "",
        libelle: "",
        banque: "",
        banqueAgence: "",
      }, { shouldFocus: false });
    }
  }, [fields.length, watchedDomiciliations, append, readOnly]);

  // États pour les banques sélectionnées par domiciliation
  const [selectedBanques, setSelectedBanques] = useState<Record<number, string | null>>({});

  // Hooks pour les banques et agences avec recherche et pagination infinie
  const {
    items: banquesItems,
    isLoading: isLoadingBanques,
    hasMore: hasMoreBanques,
    loadMore: loadMoreBanques,
    isFetchingMore: isFetchingMoreBanques,
    search: banquesSearch,
    setSearch: setBanquesSearch,
  } = useBanquesSearchable();

  // Hook global pour toutes les agences (on filtrera côté client)
  const {
    items: allAgencesItems,
    isLoading: isLoadingAgences,
    hasMore: hasMoreAgences,
    loadMore: loadMoreAgences,
    isFetchingMore: isFetchingMoreAgences,
    search: agencesSearch,
    setSearch: setAgencesSearch,
  } = useAgencesBanqueSearchable(null); // On charge toutes les agences, puis on filtre

  const handleAddDomiciliation = () => {
    append({
      type: "",
      numeroCompte: "",
      libelle: "",
      banque: "",
      banqueAgence: "",
    });
  };

  const handleRemoveDomiciliation = (index: number) => {
    if (fields.length > 1) {
      remove(index);
      // Supprimer aussi l'état de la banque sélectionnée
      const newSelectedBanques = { ...selectedBanques };
      delete newSelectedBanques[index];
      // Réindexer les banques
      const reindexed: Record<number, string | null> = {};
      Object.keys(newSelectedBanques).forEach((key) => {
        const oldIndex = parseInt(key);
        if (oldIndex > index) {
          reindexed[oldIndex - 1] = newSelectedBanques[oldIndex];
        } else if (oldIndex < index) {
          reindexed[oldIndex] = newSelectedBanques[oldIndex];
        }
      });
      setSelectedBanques(reindexed);
    }
  };

  const handleBanqueChange = (index: number, banqueCode: string | null) => {
    setSelectedBanques((prev) => ({ ...prev, [index]: banqueCode }));
    // Réinitialiser l'agence si la banque change
    if (setValue) {
      setValue(`domiciliations.${index}.banqueAgence`, "");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold" style={{ color: titleColor }}>
          Domiciliations
        </h3>
        {!readOnly && (
          <Button
            type="button"
            onClick={handleAddDomiciliation}
            size="sm"
            className="bg-[#28A325] hover:bg-[#1e7a1c] text-white"
          >
            <Plus className="h-4 w-4 mr-1" />
            Ajouter
          </Button>
        )}
      </div>

      {fields.length === 0 ? (
        <p className="text-sm text-gray-500">Aucune domiciliation ajoutée</p>
      ) : (
        <div className="space-y-4">
          {fields.map((field, index) => {
            const domiciliationsErrors = errors.domiciliations as any;
            const domiciliationErrors = domiciliationsErrors?.[index] as FieldErrors<any> | undefined;
            const canRemove = fields.length > 1;
            
            // Filtrer les agences selon la banque sélectionnée pour cette domiciliation
            const filteredAgences = selectedBanques[index] 
              ? allAgencesItems.filter((a: any) => a.BQ_CODE === selectedBanques[index])
              : allAgencesItems;

            return (
              <div key={field.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">
                    Domiciliation {index + 1}
                  </span>
                  {!readOnly && (
                    <Button
                      type="button"
                      onClick={() => handleRemoveDomiciliation(index)}
                      disabled={!canRemove}
                      size="sm"
                      variant="ghost"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {/* Tous les champs sur une ligne */}
                <div className="grid grid-cols-12 gap-3">
                  {/* Numéro de compte */}
                  <div className="col-span-2">
                    <Label className="text-xs font-medium mb-1 block" style={{ color: labelColor }}>
                      N° Compte
                    </Label>
                    <Controller
                      name={`domiciliations.${index}.numeroCompte`}
                      control={control}
                      render={({ field: fieldCtrl }) => (
                        <Input
                          {...fieldCtrl}
                          value={fieldCtrl.value || ""}
                          placeholder="Ex: CI106..."
                          disabled={readOnly}
                          className={`h-9 text-sm ${
                            domiciliationErrors?.numeroCompte 
                              ? 'border-red-500 bg-red-50' 
                              : fieldCtrl.value 
                              ? 'border-[#28A325] bg-[#f3f4f6]' 
                              : 'border-gray-300 bg-white'
                          }`}
                        />
                      )}
                    />
                    {domiciliationErrors?.numeroCompte && (
                      <p className="text-xs text-red-500 mt-0.5">
                        {String(domiciliationErrors.numeroCompte.message)}
                      </p>
                    )}
                  </div>

                  {/* Type */}
                  <div className="col-span-2">
                    <Label className="text-xs font-medium mb-1 block" style={{ color: labelColor }}>
                      Type <span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      name={`domiciliations.${index}.type`}
                      control={control}
                      render={({ field: fieldCtrl }) => (
                        <Select 
                          onValueChange={fieldCtrl.onChange} 
                          value={fieldCtrl.value || ""} 
                          disabled={readOnly}
                        >
                          <SelectTrigger className={`h-9 text-sm ${
                            domiciliationErrors?.type 
                              ? 'border-red-500 bg-red-50' 
                              : fieldCtrl.value 
                              ? 'border-[#28A325] bg-[#f3f4f6]' 
                              : 'border-gray-300 bg-white'
                          }`}>
                            <SelectValue placeholder="Type" />
                          </SelectTrigger>
                          <SelectContent>
                            {formData.typesDomicil?.map((type: any) => (
                              <SelectItem key={type.TYPDOM_CODE || type.code} value={type.TYPDOM_CODE || type.code}>
                                {type.TYPDOM_LIB || type.libelle}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {domiciliationErrors?.type && (
                      <p className="text-xs text-red-500 mt-0.5">
                        {String(domiciliationErrors.type.message)}
                      </p>
                    )}
                  </div>

                  {/* Libellé */}
                  <div className="col-span-2">
                    <Label className="text-xs font-medium mb-1 block" style={{ color: labelColor }}>
                      Libellé
                    </Label>
                    <Controller
                      name={`domiciliations.${index}.libelle`}
                      control={control}
                      render={({ field: fieldCtrl }) => (
                        <Input
                          {...fieldCtrl}
                          value={fieldCtrl.value || ""}
                          placeholder="Ex: Principal"
                          disabled={readOnly}
                          className={`h-9 text-sm ${
                            domiciliationErrors?.libelle 
                              ? 'border-red-500 bg-red-50' 
                              : fieldCtrl.value 
                              ? 'border-[#28A325] bg-[#f3f4f6]' 
                              : 'border-gray-300 bg-white'
                          }`}
                        />
                      )}
                    />
                  </div>

                  {/* Banque (plus petit) */}
                  <div className="col-span-2">
                    <Label className="text-xs font-medium mb-1 block" style={{ color: labelColor }}>
                      Banque
                    </Label>
                    <Controller
                      name={`domiciliations.${index}.banque`}
                      control={control}
                      render={({ field: fieldCtrl }) => (
                        <SearchableSelect
                          value={fieldCtrl.value || ""}
                          onValueChange={(value) => {
                            fieldCtrl.onChange(value);
                            handleBanqueChange(index, value || null);
                          }}
                          items={banquesItems}
                          placeholder={isLoadingBanques ? "..." : "Banque"}
                          searchPlaceholder="Rechercher..."
                          emptyMessage="Aucune banque"
                          disabled={readOnly}
                          isLoading={isLoadingBanques}
                          hasMore={hasMoreBanques}
                          onLoadMore={loadMoreBanques}
                          isFetchingMore={isFetchingMoreBanques}
                          onSearchChange={setBanquesSearch}
                          className={`h-9 text-sm ${
                            fieldCtrl.value 
                              ? 'border-[#28A325] bg-[#f3f4f6]' 
                              : 'border-gray-300 bg-white'
                          }`}
                        />
                      )}
                    />
                  </div>

                  {/* Agence de banque */}
                  <div className="col-span-3">
                    <Label className="text-xs font-medium mb-1 block" style={{ color: labelColor }}>
                      Agence <span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      name={`domiciliations.${index}.banqueAgence`}
                      control={control}
                      render={({ field: fieldCtrl }) => (
                        <SearchableSelect
                          value={fieldCtrl.value || ""}
                          onValueChange={(agenceCode) => {
                            fieldCtrl.onChange(agenceCode);
                            
                            if (agenceCode) {
                              const selectedAgence = filteredAgences.find((a: any) => a.value === agenceCode);
                              if (selectedAgence?.BQ_CODE && setValue && !selectedBanques[index]) {
                                setValue(`domiciliations.${index}.banque`, selectedAgence.BQ_CODE);
                                handleBanqueChange(index, selectedAgence.BQ_CODE);
                              }
                            }
                          }}
                          items={filteredAgences}
                            placeholder={isLoadingAgences ? "..." : "Agence"}
                            searchPlaceholder="Rechercher..."
                            emptyMessage="Aucune agence"
                            disabled={readOnly}
                            isLoading={isLoadingAgences}
                            hasMore={hasMoreAgences}
                            onLoadMore={loadMoreAgences}
                            isFetchingMore={isFetchingMoreAgences}
                            onSearchChange={setAgencesSearch}
                            className={`h-9 text-sm ${
                              domiciliationErrors?.banqueAgence 
                                ? 'border-red-500 bg-red-50' 
                                : fieldCtrl.value 
                                ? 'border-[#28A325] bg-[#f3f4f6]' 
                                : 'border-gray-300 bg-white'
                            }`}
                        />
                      )}
                    />
                    {domiciliationErrors?.banqueAgence && (
                      <p className="text-xs text-red-500 mt-0.5">
                        {String(domiciliationErrors.banqueAgence.message)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {fields.length === 0 && !readOnly && (
        <p className="text-xs text-gray-500 mt-2">
          Ajoutez au moins une domiciliation si nécessaire
        </p>
      )}
    </div>
  );
}
