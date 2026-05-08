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
import { useApiClient } from "@/hooks/useApiClient";
import { AgenceBanqueService } from "@/services/agence-banque.service";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

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
  // TOUJOURS afficher au moins un champ vide en mode édition
  useEffect(() => {
    // En mode lecture seule, ne jamais ajouter de champ
    if (readOnly) {
      return;
    }
    
    // Si on a déjà des domiciliations (chargées depuis l'API), ne rien faire
    const hasExistingDomiciliations = watchedDomiciliations && 
      Array.isArray(watchedDomiciliations) && 
      watchedDomiciliations.length > 0;
    
    if (hasExistingDomiciliations) {
      hasInitialized.current = true;
      return;
    }
    
    // Ajouter une seule domiciliation si le tableau est vide et qu'on n'a pas déjà initialisé
    // En mode édition, TOUJOURS afficher au moins un champ vide
    if (!hasInitialized.current && fields.length === 0) {
      hasInitialized.current = true;
      append({
        type: "",
        numBenef: "",
        libelle: "",
        banque: "",
        banqueAgence: "",
      }, { shouldFocus: false });
    }
  }, [fields.length, watchedDomiciliations, append, readOnly]);

  // Debug useEffect pour suivre l'état des domiciliations
  useEffect(() => {
    console.log('🔍 [DebiteurFormStep3] État actuel:', {
      fieldsLength: fields.length,
      fields: fields,
      watchedDomiciliations: watchedDomiciliations,
      readOnly: readOnly,
      hasInitialized: hasInitialized.current
    });
  }, [fields.length, fields, watchedDomiciliations, readOnly]);

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

  // Hook global pour toutes les agences (on affichera toutes, pas de filtre)
  const {
    items: allAgencesItems,
    isLoading: isLoadingAgences,
    hasMore: hasMoreAgences,
    loadMore: loadMoreAgences,
    isFetchingMore: isFetchingMoreAgences,
    search: agencesSearch,
    setSearch: setAgencesSearch,
  } = useAgencesBanqueSearchable(null); // On charge toutes les agences

  const handleAddDomiciliation = () => {
    append({
      type: "",
      numBenef: "",
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

  // Stocker les libellés des banques pour affichage
  const [banqueLabels, setBanqueLabels] = useState<Record<number, string>>({});
  // Stocker les libellés des agences pour affichage en mode consultation
  const [agenceLabels, setAgenceLabels] = useState<Record<number, string>>({});

  const apiClient = useApiClient();

  // Initialiser les libellés des banques et agences à partir des données du formulaire (mode consultation)
  useEffect(() => {
    if (!watchedDomiciliations || !Array.isArray(watchedDomiciliations)) return;
    
    watchedDomiciliations.forEach(async (dom: any, idx: number) => {
      // Initialiser libellé banque
      if (dom.banque && !banqueLabels[idx]) {
        const banqueItem = banquesItems.find((b: any) => b.value === dom.banque?.toString());
        if (banqueItem) {
          setBanqueLabels((prev) => ({ ...prev, [idx]: banqueItem.label }));
        } else if (dom.banque) {
          setBanqueLabels((prev) => ({ ...prev, [idx]: dom.banque }));
        }
      }
      // Initialiser libellé agence - chercher dans les items chargés, sinon faire un appel API
      if (dom.banqueAgence && !agenceLabels[idx]) {
        const agenceItem = allAgencesItems.find((a: any) => a.value === dom.banqueAgence?.toString());
        if (agenceItem) {
          setAgenceLabels((prev) => ({ ...prev, [idx]: agenceItem.label }));
          // Aussi initialiser la banque si vide
          if (!dom.banque) {
            const agenceData = (agenceItem as any)?.data || agenceItem;
            const banqueCode = agenceData?.BQ_CODE || agenceData?.BQAG_CODE || '';
            const banqueLib = agenceData?.BQ_LIB || '';
            if (banqueCode) {
              setValue?.(`domiciliations.${idx}.banque`, banqueCode);
              setBanqueLabels((prev) => ({ ...prev, [idx]: banqueLib || banqueCode }));
            }
          }
        } else {
          // Agence pas dans les items chargés -> appel API pour récupérer le libellé
          try {
            const agenceResponse = await AgenceBanqueService.getByCode(apiClient, dom.banqueAgence);
            const agenceData = Array.isArray(agenceResponse) ? agenceResponse[0] : agenceResponse;
            if (agenceData) {
              const label = `${agenceData.BQAG_NUM || agenceData.code || ''} - ${agenceData.BQAG_LIB || agenceData.libelle || ''}`;
              setAgenceLabels((prev) => ({ ...prev, [idx]: label }));
              // Aussi initialiser la banque depuis les données de l'agence
              if (!dom.banque) {
                const banqueCode = agenceData.BQ_CODE || agenceData.BQAG_BQ_CODE || '';
                const banqueLib = agenceData.BQ_LIB || '';
                if (banqueCode) {
                  setValue?.(`domiciliations.${idx}.banque`, banqueCode);
                  setBanqueLabels((prev) => ({ ...prev, [idx]: banqueLib || banqueCode }));
                }
              }
            }
          } catch (e) {
            console.warn('Impossible de récupérer l\'agence:', dom.banqueAgence, e);
            setAgenceLabels((prev) => ({ ...prev, [idx]: dom.banqueAgence }));
          }
        }
      }
    });
  }, [watchedDomiciliations, banquesItems, allAgencesItems]);

  const handleBanqueChange = (index: number, banqueCode: string | null, resetAgence = true, banqueLabel?: string) => {
    setSelectedBanques((prev) => ({ ...prev, [index]: banqueCode }));
    if (banqueLabel) {
      setBanqueLabels((prev) => ({ ...prev, [index]: banqueLabel }));
    }
    // Réinitialiser l'agence si la banque change manuellement (pas quand auto-remplie depuis agence)
    if (resetAgence && setValue) {
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
            const domiciliationErrors = errors.domiciliations as FieldErrors<any>;
            const canRemove = fields.length > 1;
            
            // Afficher toutes les agences (non filtrées)
            const filteredAgences = allAgencesItems;

            return (
              <div key={field.id || `domiciliation-${index}`} className="border border-gray-200 rounded-lg p-4 bg-white">
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
                  {/* N° Bénéficiaire */}
                  <div className="col-span-2">
                    <Label className="text-xs font-medium mb-1 block" style={{ color: labelColor }}>
                      N° Bénéficiaire
                    </Label>
                    <Controller
                      name={`domiciliations.${index}.numBenef`}
                      control={control}
                      render={({ field: fieldCtrl }) => (
                        <Input
                          {...fieldCtrl}
                          value={fieldCtrl.value || ""}
                          placeholder="Ex: 123456"
                          disabled={readOnly}
                          className={`h-9 text-sm ${
                            domiciliationErrors?.numBenef 
                              ? 'border-red-500 bg-red-50' 
                              : fieldCtrl.value 
                              ? 'border-[#28A325] bg-[#f3f4f6]' 
                              : 'border-gray-300 bg-white'
                          }`}
                        />
                      )}
                    />
                  </div>

                  {/* Type */}
                  <div className="col-span-2">
                    <Label className="text-xs font-medium mb-1 block" style={{ color: labelColor }}>
                      Type
                    </Label>
                    <Controller
                      name={`domiciliations.${index}.type`}
                      control={control}
                      render={({ field: fieldCtrl }) => (
                        <Select 
                          onValueChange={fieldCtrl.onChange} 
                          value={fieldCtrl.value || ""} 
                          disabled={readOnly}>
                          <SelectTrigger className={`w-full ${
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

                  {/* Agence de banque */}
                  <div className="col-span-2">
                    <Label className="text-xs font-medium mb-1 block" style={{ color: labelColor }}>
                      Agence
                    </Label>
                    <Controller
                      name={`domiciliations.${index}.banqueAgence`}
                      control={control}
                      render={({ field: fieldCtrl }) => (
                        readOnly ? (
                          <Input
                            value={agenceLabels[index] || fieldCtrl.value || ""}
                            readOnly
                            className={`h-9 text-sm bg-[#eef2f5] ${
                              fieldCtrl.value ? 'border-[#28A325] bg-[#f3f4f6]' : 'border-gray-300 bg-white'
                            }`}
                            placeholder="Agence"
                          />
                        ) : (
                          <SearchableSelect
                            key={`banqueAgence-${index}`}
                            value={fieldCtrl.value || ""}
                            onValueChange={(agenceCode) => {
                              fieldCtrl.onChange(agenceCode);
                              
                              if (agenceCode) {
                                const selectedAgence = filteredAgences.find((a: any) => a.value === agenceCode);
                                
                                // Chercher le code de banque dans plusieurs propriétés possibles
                                const agenceData = (selectedAgence as any)?.data || selectedAgence;
                                const banqueCode = agenceData?.BQ_CODE || agenceData?.BQAG_CODE || agenceData?.BANQUE_CODE || agenceData?.banque_code;
                                
                                if (banqueCode && setValue) {
                                  setValue(`domiciliations.${index}.banque`, banqueCode);
                                  const banqueLib = agenceData?.BQ_LIB || agenceData?.BANQUE_LIB || '';
                                  handleBanqueChange(index, banqueCode?.toString() || null, false, banqueLib || banqueCode?.toString());
                                }
                                // Stocker le libellé de l'agence
                                if (selectedAgence?.label) {
                                  setAgenceLabels((prev) => ({ ...prev, [index]: selectedAgence.label }));
                                }
                              }
                            }}
                            items={filteredAgences}
                            displayValue={(item) => item.label || `${item.value} - `}
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
                        )
                      )}
                    />
                  </div>

                  {/* Banque */}
                  <div className="col-span-2">
                    <Label className="text-xs font-medium mb-1 block" style={{ color: labelColor }}>
                      Banque
                    </Label>
                    <Controller
                      name={`domiciliations.${index}.banque`}
                      control={control}
                      render={({ field: fieldCtrl }) => (
                        <Input
                          value={banqueLabels[index] || fieldCtrl.value || ""}
                          readOnly
                          className={`h-9 text-sm bg-[#eef2f5] border-[#28A325] ${
                            fieldCtrl.value ? 'border-[#28A325] bg-[#f3f4f6]' : 'border-gray-300 bg-white'
                          }`}
                          placeholder="Banque"
                        />
                      )}
                    />
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
