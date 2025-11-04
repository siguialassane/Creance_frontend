"use client"

import { Control, Controller, FieldErrors } from "react-hook-form";
import { useDebiteurFormContext } from "./DebiteurFormContext";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { useFonctionsSearchable } from "@/hooks/useFonctionsSearchable";
import { useProfessionsSearchable } from "@/hooks/useProfessionsSearchable";
import { useEmployeursSearchable } from "@/hooks/useEmployeursSearchable";
import { useQuartiersSearchable } from "@/hooks/useQuartiersSearchable";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const primaryGreen = '#28A325';
const borderGray = '#d1d5db';
const errorRed = '#ef4444';
const errorBg = '#fef2f2';
const labelColor = '#374151';
const titleColor = '#1a202c';

type Props = {
  control: Control<any>;
  errors: FieldErrors<any>;
  readOnly?: boolean;
};

export function DebiteurFormStep2Physical({ control, errors, readOnly = false }: Props) {
  const { formData, isLoadingStep2 } = useDebiteurFormContext();
  
  // Hooks pour les selects avec recherche (listes longues)
  const quartiersSearchable = useQuartiersSearchable();
  const fonctionsSearchable = useFonctionsSearchable();
  const professionsSearchable = useProfessionsSearchable();
  const employeursSearchable = useEmployeursSearchable();

  const getFieldClassName = (hasError?: boolean) => {
    const baseClasses = "w-full px-3 py-2 rounded-md border transition-colors duration-200 focus:outline-none focus:ring-2";
    const errorClasses = hasError ? "border-red-500 bg-red-50 focus:ring-red-500" : "border-[#28A325] bg-[#f3f4f6] focus:ring-[#28A325]/50";
    const readOnlyClasses = readOnly ? "bg-gray-50 cursor-not-allowed" : "";
    return `${baseClasses} ${errorClasses} ${readOnlyClasses}`;
  };

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-lg font-bold mb-4" style={{ color: titleColor }}>
        Personne physique
      </h2>

      {/* Identité */}
      <div className="grid grid-cols-3 gap-2">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <label className="text-sm font-medium whitespace-nowrap flex-shrink-0" style={{ color: labelColor, minWidth: '120px' }}>
              Civilité <span className="text-red-500">*</span>
            </label>
            <Controller
              name="civilite"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className={getFieldClassName(!!errors.civilite) + " flex-1"}
                  disabled={readOnly}
                  style={{ borderColor: errors.civilite ? errorRed : primaryGreen, backgroundColor: '#f3f4f6' }}
                >
                  <option value="">Sélectionner</option>
                  {formData.civilites?.map((civ: any) => (
                    <option key={civ.CIV_CODE || civ.code} value={civ.CIV_CODE || civ.code}>
                      {civ.CIV_LIB || civ.libelle}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.civilite && <p className="text-sm mt-1" style={{ color: errorRed }}>{String(errors.civilite.message)}</p>}
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2">
            <label className="text-sm font-medium whitespace-nowrap flex-shrink-0" style={{ color: labelColor, minWidth: '120px' }}>
              Nom <span className="text-red-500">*</span>
            </label>
            <Controller name="nom" control={control} render={({ field }) => (
              <input {...field} value={field.value || ""} placeholder="Ex: Koné" className={getFieldClassName(!!errors.nom) + " flex-1"} disabled={readOnly} />
            )} />
            {errors.nom && <p className="text-sm mt-1" style={{ color: errorRed }}>{String(errors.nom.message)}</p>}
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2">
            <label className="text-sm font-medium whitespace-nowrap flex-shrink-0" style={{ color: labelColor, minWidth: '120px' }}>
              Prénom <span className="text-red-500">*</span>
            </label>
            <Controller name="prenom" control={control} render={({ field }) => (
              <input {...field} value={field.value || ""} placeholder="Ex: Amadou" className={getFieldClassName(!!errors.prenom) + " flex-1"} disabled={readOnly} />
            )} />
            {errors.prenom && <p className="text-sm mt-1" style={{ color: errorRed }}>{String(errors.prenom.message)}</p>}
          </div>
        </div>
      </div>

      {/* Naissance */}
      <div className="grid grid-cols-3 gap-2">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <label className="text-sm font-medium whitespace-nowrap flex-shrink-0" style={{ color: labelColor, minWidth: '120px' }}>
              Date de naissance <span className="text-red-500">*</span>
            </label>
            <Controller name="dateNaissance" control={control} render={({ field }) => (
              <input 
                {...field} 
                value={field.value || ""} 
                type="date" 
                max="2020-12-31"
                className={getFieldClassName(!!errors.dateNaissance) + " flex-1"} 
                  disabled={readOnly}
                onFocus={(e) => {
                  if (!errors.dateNaissance) {
                    e.target.style.borderColor = primaryGreen;
                    e.target.style.backgroundColor = '#f3f4f6';
                  }
                }}
                  onBlur={(e) => {
                    if (errors.dateNaissance) {
                      e.target.style.borderColor = errorRed;
                      e.target.style.backgroundColor = errorBg;
                    } else {
                      e.target.style.borderColor = primaryGreen;
                      e.target.style.backgroundColor = '#f3f4f6';
                    }
                  }}
              />
            )} />
            {errors.dateNaissance && <p className="text-sm mt-1" style={{ color: errorRed }}>{String(errors.dateNaissance.message)}</p>}
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2">
            <label className="text-sm font-medium whitespace-nowrap flex-shrink-0" style={{ color: labelColor, minWidth: '120px' }}>
              Lieu de naissance <span className="text-red-500">*</span>
            </label>
            <Controller name="lieuNaissance" control={control} render={({ field }) => (
              <input {...field} value={field.value || ""} placeholder="Ex: Abidjan" className={getFieldClassName(!!errors.lieuNaissance) + " flex-1"} disabled={readOnly} />
            )} />
            {errors.lieuNaissance && <p className="text-sm mt-1" style={{ color: errorRed }}>{String(errors.lieuNaissance.message)}</p>}
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2">
            <label className="text-sm font-medium whitespace-nowrap flex-shrink-0" style={{ color: labelColor, minWidth: '120px' }}>
              Quartier <span className="text-red-500">*</span>
            </label>
            <Controller 
              name="quartier" 
              control={control} 
              render={({ field }) => (
                <div className="flex-1">
                  <div className="flex-1">
                  <SearchableSelect
                    value={field.value || ""}
                    onValueChange={field.onChange}
                    items={quartiersSearchable.items}
                    placeholder={isLoadingStep2 || quartiersSearchable.isLoading ? "Chargement..." : "Sélectionner un quartier"}
                    searchPlaceholder="Rechercher un quartier..."
                    emptyMessage="Aucun quartier trouvé"
                    disabled={readOnly || isLoadingStep2 || quartiersSearchable.isLoading}
                    isLoading={quartiersSearchable.isLoading}
                    hasMore={quartiersSearchable.hasMore}
                    onLoadMore={quartiersSearchable.loadMore}
                    isFetchingMore={quartiersSearchable.isFetchingMore}
                    onSearchChange={(search) => quartiersSearchable.setSearch(search)}
                    className={errors.quartier ? 'border-red-500' : field.value ? 'border-[#28A325]' : ''}
                  />
                </div>
                </div>
              )} 
            />
            {errors.quartier && <p className="text-sm mt-1" style={{ color: errorRed }}>{String(errors.quartier.message)}</p>}
          </div>
        </div>
      </div>

      {/* Nationalité et Profession */}
      <div className="grid grid-cols-3 gap-2">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <label className="text-sm font-medium whitespace-nowrap flex-shrink-0" style={{ color: labelColor, minWidth: '120px' }}>
              Nationalité <span className="text-red-500">*</span>
            </label>
            <Controller name="nationalite" control={control} render={({ field }) => {
              // Debug: vérifier les données
              const nationalites = formData.nationalites || [];
              console.log('🔍 [DebiteurFormStep2Physical] Nationalites disponibles:', nationalites);
              console.log('🔍 [DebiteurFormStep2Physical] Nombre de nationalites:', nationalites.length);
              console.log('🔍 [DebiteurFormStep2Physical] Premier element:', nationalites[0]);
              
              return (
                <div className="relative flex-1">
                  <select 
                    {...field} 
                    value={field.value || ""}
                    className={getFieldClassName(!!errors.nationalite) + " pr-8 h-[40px] w-full"} 
                    disabled={readOnly || isLoadingStep2}
                    style={{ 
                      borderColor: errors.nationalite ? errorRed : primaryGreen,
                      backgroundColor: errors.nationalite ? errorBg : '#f3f4f6'
                    }}
                    onFocus={(e) => {
                      if (!errors.nationalite) {
                        e.target.style.borderColor = primaryGreen;
                        e.target.style.backgroundColor = '#f3f4f6';
                      }
                    }}
                    onBlur={(e) => {
                      if (errors.nationalite) {
                        e.target.style.borderColor = errorRed;
                        e.target.style.backgroundColor = errorBg;
                      } else {
                        e.target.style.borderColor = primaryGreen;
                        e.target.style.backgroundColor = '#f3f4f6';
                      }
                    }}
                  >
                    <option value="">
                      {isLoadingStep2 ? "Chargement..." : "Sélectionner"}
                    </option>
                    {nationalites.length > 0 ? (
                      nationalites.map((n: any) => {
                        const code = n.NAT_CODE || n.code || '';
                        const libelle = n.NAT_LIB || n.libelle || '';
                        return (
                          <option key={code} value={code}>
                            {libelle}
                  </option>
                        );
                      })
                    ) : (
                      !isLoadingStep2 && <option value="" disabled>Aucune nationalité disponible</option>
                    )}
              </select>
                  {isLoadingStep2 && (
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-[#28A325]"></div>
                    </div>
                  )}
                </div>
              );
            }} />
            {errors.nationalite && <p className="text-sm mt-1" style={{ color: errorRed }}>{String(errors.nationalite.message)}</p>}
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2">
            <label className="text-sm font-medium whitespace-nowrap flex-shrink-0" style={{ color: labelColor, minWidth: '120px' }}>
              Fonction <span className="text-red-500">*</span>
            </label>
            <Controller 
              name="fonction" 
              control={control} 
              render={({ field }) => (
                <div className="flex-1">
                  <SearchableSelect
                  value={field.value || ""}
                  onValueChange={field.onChange}
                  items={fonctionsSearchable.items}
                  placeholder={isLoadingStep2 || fonctionsSearchable.isLoading ? "Chargement..." : "Sélectionner une fonction"}
                  searchPlaceholder="Rechercher une fonction..."
                  emptyMessage="Aucune fonction trouvée"
                  disabled={readOnly || isLoadingStep2 || fonctionsSearchable.isLoading}
                  isLoading={fonctionsSearchable.isLoading}
                  hasMore={fonctionsSearchable.hasMore}
                  onLoadMore={fonctionsSearchable.loadMore}
                  isFetchingMore={fonctionsSearchable.isFetchingMore}
                  onSearchChange={(search) => fonctionsSearchable.setSearch(search)}
                  className={errors.fonction ? 'border-red-500' : field.value ? 'border-[#28A325]' : ''}
                  />
                </div>
              )} 
            />
            {errors.fonction && <p className="text-sm mt-1" style={{ color: errorRed }}>{String(errors.fonction.message)}</p>}
          </div>
        </div>
      </div>

      {/* Emploi */}
      <div className="grid grid-cols-3 gap-2">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <label className="text-sm font-medium whitespace-nowrap flex-shrink-0" style={{ color: labelColor, minWidth: '120px' }}>
              Profession <span className="text-red-500">*</span>
            </label>
            <Controller 
              name="profession" 
              control={control} 
              render={({ field }) => (
                <div className="flex-1">
                  <SearchableSelect
                  value={field.value || ""}
                  onValueChange={field.onChange}
                  items={professionsSearchable.items}
                  placeholder={isLoadingStep2 || professionsSearchable.isLoading ? "Chargement..." : "Sélectionner une profession"}
                  searchPlaceholder="Rechercher une profession..."
                  emptyMessage="Aucune profession trouvée"
                  disabled={readOnly || isLoadingStep2 || professionsSearchable.isLoading}
                  isLoading={professionsSearchable.isLoading}
                  hasMore={professionsSearchable.hasMore}
                  onLoadMore={professionsSearchable.loadMore}
                  isFetchingMore={professionsSearchable.isFetchingMore}
                  onSearchChange={(search) => professionsSearchable.setSearch(search)}
                  className={errors.profession ? 'border-red-500' : field.value ? 'border-[#28A325]' : ''}
                  />
                </div>
              )} 
            />
            {errors.profession && <p className="text-sm mt-1" style={{ color: errorRed }}>{String(errors.profession.message)}</p>}
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2">
            <label className="text-sm font-medium whitespace-nowrap flex-shrink-0" style={{ color: labelColor, minWidth: '120px' }}>
              Employeur <span className="text-red-500">*</span>
            </label>
            <Controller 
              name="employeur" 
              control={control} 
              render={({ field }) => (
                <div className="flex-1">
                  <SearchableSelect
                  value={field.value || ""}
                  onValueChange={field.onChange}
                  items={employeursSearchable.items}
                  placeholder={isLoadingStep2 || employeursSearchable.isLoading ? "Chargement..." : "Sélectionner un employeur"}
                  searchPlaceholder="Rechercher un employeur..."
                  emptyMessage="Aucun employeur trouvé"
                  disabled={readOnly || isLoadingStep2 || employeursSearchable.isLoading}
                  isLoading={employeursSearchable.isLoading}
                  hasMore={employeursSearchable.hasMore}
                  onLoadMore={employeursSearchable.loadMore}
                  isFetchingMore={employeursSearchable.isFetchingMore}
                  onSearchChange={(search) => employeursSearchable.setSearch(search)}
                  className={errors.employeur ? 'border-red-500' : field.value ? 'border-[#28A325]' : ''}
                  />
                </div>
              )} 
            />
            {errors.employeur && <p className="text-sm mt-1" style={{ color: errorRed }}>{String(errors.employeur.message)}</p>}
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2">
            <label className="text-sm font-medium whitespace-nowrap flex-shrink-0" style={{ color: labelColor, minWidth: '120px' }}>
              Statut Salarié <span className="text-red-500">*</span>
            </label>
            <Controller name="statutSalarie" control={control} render={({ field }) => (
              <select {...field} className={getFieldClassName(!!errors.statutSalarie) + " flex-1"} disabled={readOnly} style={{ borderColor: primaryGreen, backgroundColor: '#f3f4f6' }}>
                <option value="">Sélectionner</option>
                {formData.statutsSalarie?.map((s: any) => (
                  <option key={s.STATSAL_CODE || s.code} value={s.STATSAL_CODE || s.code}>
                    {s.STATSAL_LIB || s.libelle}
                  </option>
                ))}
              </select>
            )} />
            {errors.statutSalarie && <p className="text-sm mt-1" style={{ color: errorRed }}>{String(errors.statutSalarie.message)}</p>}
          </div>
        </div>
      </div>

      {/* Autres infos */}
      <div className="grid grid-cols-3 gap-2">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <label className="text-sm font-medium whitespace-nowrap flex-shrink-0" style={{ color: labelColor, minWidth: '120px' }}>
              Matricule
            </label>
            <Controller name="matricule" control={control} render={({ field }) => (
              <input {...field} value={field.value || ""} placeholder="Ex: MAT123456" className={getFieldClassName() + " flex-1"} disabled={readOnly} />
            )} />
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2">
            <label className="text-sm font-medium whitespace-nowrap flex-shrink-0" style={{ color: labelColor, minWidth: '120px' }}>
              Sexe <span className="text-red-500">*</span>
            </label>
            <Controller name="sexe" control={control} render={({ field }) => (
              <select {...field} className={getFieldClassName(!!errors.sexe) + " flex-1"} disabled={readOnly} style={{ borderColor: primaryGreen, backgroundColor: '#f3f4f6' }}>
                <option value="">Sélectionner</option>
                <option value="M">Masculin</option>
                <option value="F">Féminin</option>
              </select>
            )} />
            {errors.sexe && <p className="text-sm mt-1" style={{ color: errorRed }}>{String(errors.sexe.message)}</p>}
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2">
            <label className="text-sm font-medium whitespace-nowrap flex-shrink-0" style={{ color: labelColor, minWidth: '120px' }}>
              Date de décès
            </label>
            <Controller name="dateDeces" control={control} render={({ field }) => {
              // Obtenir la date d'aujourd'hui au format YYYY-MM-DD pour limiter la sélection aux dates passées
              const today = new Date().toISOString().split('T')[0];
              
              return (
                <input 
                  {...field} 
                  value={field.value || ""} 
                  type="date" 
                  max={today}
                  className={getFieldClassName()} 
                  disabled={readOnly}
                  onFocus={(e) => {
                    if (!errors.dateDeces) {
                      e.target.style.borderColor = primaryGreen;
                      e.target.style.backgroundColor = '#f3f4f6';
                    }
                  }}
                  onBlur={(e) => {
                    if (errors.dateDeces) {
                      e.target.style.borderColor = errorRed;
                      e.target.style.backgroundColor = errorBg;
                    } else {
                      e.target.style.borderColor = primaryGreen;
                      e.target.style.backgroundColor = '#f3f4f6';
                    }
                  }}
                />
              );
            }} />
          </div>
        </div>
      </div>

      <hr className="my-4 border-gray-200" />

      {/* Pièce d'identité */}
      <div className="mb-6">
        <h3 className="text-base font-semibold mb-3" style={{ color: titleColor }}>
          Pièce d'identité
        </h3>
        <div className="grid grid-cols-4 gap-2">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <label className="text-sm font-medium whitespace-nowrap flex-shrink-0" style={{ color: labelColor, minWidth: '100px' }}>
                Nature de la pièce
              </label>
              <Controller name="naturePieceIdentite" control={control} render={({ field }) => (
                <input {...field} value={field.value || ""} placeholder="Ex: CNI, Passeport" className={getFieldClassName() + " flex-1"} disabled={readOnly} />
              )} />
            </div>
          </div>
          <div>
            <div className="mb-2 flex items-center gap-2">
              <label className="text-sm font-medium whitespace-nowrap flex-shrink-0" style={{ color: labelColor, minWidth: '100px' }}>
                Numéro de la pièce
              </label>
              <Controller name="numeroPieceIdentite" control={control} render={({ field }) => (
                <input {...field} value={field.value || ""} placeholder="Ex: 123456789" className={getFieldClassName() + " flex-1"} disabled={readOnly} />
              )} />
            </div>
          </div>
          <div>
            <div className="mb-2 flex items-center gap-2">
              <label className="text-sm font-medium whitespace-nowrap flex-shrink-0" style={{ color: labelColor, minWidth: '100px' }}>
                Date d'établissement
              </label>
              <Controller name="dateEtablie" control={control} render={({ field }) => {
                const today = new Date().toISOString().split('T')[0];
                return (
                  <input 
                    {...field} 
                    value={field.value || ""} 
                    type="date" 
                    max={today}
                    className={getFieldClassName() + " flex-1"} 
                    disabled={readOnly}
                    onFocus={(e) => {
                      if (!errors.dateEtablie) {
                        e.target.style.borderColor = primaryGreen;
                        e.target.style.backgroundColor = '#f3f4f6';
                      }
                    }}
                    onBlur={(e) => {
                      if (errors.dateEtablie) {
                        e.target.style.borderColor = errorRed;
                        e.target.style.backgroundColor = errorBg;
                      } else {
                        e.target.style.borderColor = primaryGreen;
                        e.target.style.backgroundColor = '#f3f4f6';
                      }
                    }}
                  />
                );
              }} />
            </div>
          </div>
          <div>
            <div className="mb-2 flex items-center gap-2">
              <label className="text-sm font-medium whitespace-nowrap flex-shrink-0" style={{ color: labelColor, minWidth: '100px' }}>
                Lieu d'établissement
              </label>
              <Controller name="lieuEtablie" control={control} render={({ field }) => (
                <input {...field} value={field.value || ""} placeholder="Ex: Mairie de Paris" className={getFieldClassName() + " flex-1"} disabled={readOnly} />
              )} />
            </div>
          </div>
        </div>
      </div>

      <hr className="my-4 border-gray-200" />

      {/* Statut matrimonial */}
      <div className="mb-6">
        <h3 className="text-base font-semibold mb-3" style={{ color: titleColor }}>
          Statut matrimonial
        </h3>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <label className="text-sm font-medium whitespace-nowrap flex-shrink-0" style={{ color: labelColor, minWidth: '120px' }}>
                Statut matrimonial
              </label>
              <Controller name="statutMatrimonial" control={control} render={({ field }) => (
                <select {...field} className={getFieldClassName() + " flex-1"} disabled={readOnly} style={{ borderColor: primaryGreen, backgroundColor: '#f3f4f6' }}>
                  <option value="">Sélectionner</option>
                  <option value="CELIBATAIRE">Célibataire</option>
                  <option value="MARIE">Marié(e)</option>
                  <option value="DIVORCE">Divorcé(e)</option>
                  <option value="VEUF">Veuf/Veuve</option>
                </select>
              )} />
            </div>
          </div>
          <div>
            <div className="mb-2 flex items-center gap-2">
              <label className="text-sm font-medium whitespace-nowrap flex-shrink-0" style={{ color: labelColor, minWidth: '120px' }}>
                Régime de mariage
              </label>
              <Controller name="regimeMariage" control={control} render={({ field }) => (
                <select {...field} className={getFieldClassName() + " flex-1"} disabled={readOnly} style={{ borderColor: primaryGreen, backgroundColor: '#f3f4f6' }}>
                  <option value="">Sélectionner</option>
                  <option value="C">Communauté</option>
                  <option value="S">Séparation de biens</option>
                  <option value="P">Participation aux acquêts</option>
                </select>
              )} />
            </div>
          </div>
          <div>
            <div className="mb-2 flex items-center gap-2">
              <label className="text-sm font-medium whitespace-nowrap flex-shrink-0" style={{ color: labelColor, minWidth: '120px' }}>
                Nombre d'enfants
              </label>
              <Controller name="nombreEnfant" control={control} render={({ field }) => (
                <input 
                  {...field} 
                  value={field.value || ""} 
                  type="number" 
                  min="0"
                  placeholder="0"
                  className={getFieldClassName() + " flex-1"} 
                  disabled={readOnly}
                />
              )} />
            </div>
          </div>
        </div>
      </div>

      <hr className="my-4 border-gray-200" />

      {/* Informations du conjoint */}
      <div className="mb-6">
        <h3 className="text-base font-semibold mb-3" style={{ color: titleColor }}>
          Informations du conjoint
        </h3>
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <label className="text-sm font-medium whitespace-nowrap flex-shrink-0" style={{ color: labelColor, minWidth: '120px' }}>
                Nom du conjoint
              </label>
              <Controller name="nomConjoint" control={control} render={({ field }) => (
                <input {...field} value={field.value || ""} placeholder="Ex: Koné" className={getFieldClassName() + " flex-1"} disabled={readOnly} />
              )} />
            </div>
          </div>
          <div>
            <div className="mb-2 flex items-center gap-2">
              <label className="text-sm font-medium whitespace-nowrap flex-shrink-0" style={{ color: labelColor, minWidth: '120px' }}>
                Prénoms du conjoint
              </label>
              <Controller name="prenomsConjoint" control={control} render={({ field }) => (
                <input {...field} value={field.value || ""} placeholder="Ex: Marie" className={getFieldClassName() + " flex-1"} disabled={readOnly} />
              )} />
            </div>
          </div>
          <div>
            <div className="mb-2 flex items-center gap-2">
              <label className="text-sm font-medium whitespace-nowrap flex-shrink-0" style={{ color: labelColor, minWidth: '120px' }}>
                Date de naissance du conjoint
              </label>
              <Controller name="dateNaissanceConjoint" control={control} render={({ field }) => {
                const today = new Date().toISOString().split('T')[0];
                return (
                  <input 
                    {...field} 
                    value={field.value || ""} 
                    type="date" 
                    max="2020-12-31"
                    className={getFieldClassName() + " flex-1"} 
                    disabled={readOnly}
                    onFocus={(e) => {
                      if (!errors.dateNaissanceConjoint) {
                        e.target.style.borderColor = primaryGreen;
                        e.target.style.backgroundColor = '#f3f4f6';
                      }
                    }}
                    onBlur={(e) => {
                      if (errors.dateNaissanceConjoint) {
                        e.target.style.borderColor = errorRed;
                        e.target.style.backgroundColor = errorBg;
                      } else {
                        e.target.style.borderColor = primaryGreen;
                        e.target.style.backgroundColor = '#f3f4f6';
                      }
                    }}
                  />
                );
              }} />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <label className="text-sm font-medium whitespace-nowrap flex-shrink-0" style={{ color: labelColor, minWidth: '120px' }}>
                Téléphone du conjoint
              </label>
              <Controller name="telConjoint" control={control} render={({ field }) => {
                const hasValue = !!field.value;
                const phoneInputClassName = `PhoneInput ${hasValue ? 'PhoneInput--hasValue' : ''}`;
                
                return (
                  <div className="relative flex-1">
                    <PhoneInput
                      {...field}
                      defaultCountry="CI"
                      international
                      placeholder="Ex: +225 07 12 34 56 78"
                      className={phoneInputClassName}
                      disabled={readOnly}
                      style={{
                        width: '100%',
                      }}
                    />
                  </div>
                );
              }} />
            </div>
          </div>
          <div>
            <div className="mb-2 flex items-center gap-2">
              <label className="text-sm font-medium whitespace-nowrap flex-shrink-0" style={{ color: labelColor, minWidth: '120px' }}>
                Numéro de pièce du conjoint
              </label>
              <Controller name="numeroPieceConjoint" control={control} render={({ field }) => (
                <input {...field} value={field.value || ""} placeholder="Ex: 987654321" className={getFieldClassName() + " flex-1"} disabled={readOnly} />
              )} />
            </div>
          </div>
          <div>
            <div className="mb-2 flex items-center gap-2">
              <label className="text-sm font-medium whitespace-nowrap flex-shrink-0" style={{ color: labelColor, minWidth: '120px' }}>
                Adresse du conjoint
              </label>
              <Controller name="adresseConjoint" control={control} render={({ field }) => (
                <div className="flex-1">
                  <input 
                    {...field} 
                    value={field.value || ""} 
                    maxLength={30}
                    placeholder="Ex: 123 Rue Example, Ville" 
                    className={getFieldClassName() + " flex-1"} 
                    disabled={readOnly}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {field.value?.length || 0}/30 caractères
                  </p>
                </div>
              )} />
            </div>
          </div>
        </div>
      </div>

      <hr className="my-4 border-gray-200" />

      {/* Informations des parents */}
      <div className="mb-6">
        <h3 className="text-base font-semibold mb-3" style={{ color: titleColor }}>
          Informations des parents
        </h3>
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <h4 className="text-sm font-medium mb-2" style={{ color: labelColor }}>
              Père
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="mb-2">
                  <label className="text-sm font-medium whitespace-nowrap flex-shrink-0" style={{ color: labelColor, minWidth: '120px' }}>
                    Nom du père
                  </label>
                  <Controller name="nomPere" control={control} render={({ field }) => (
                    <input {...field} value={field.value || ""} placeholder="Ex: Koné" className={getFieldClassName()} disabled={readOnly} />
                  )} />
                </div>
              </div>
              <div>
                <div className="mb-2">
                  <label className="text-sm font-medium whitespace-nowrap flex-shrink-0" style={{ color: labelColor, minWidth: '120px' }}>
                    Prénoms du père
                  </label>
                  <Controller name="prenomsPere" control={control} render={({ field }) => (
                    <input {...field} value={field.value || ""} placeholder="Ex: Pierre" className={getFieldClassName()} disabled={readOnly} />
                  )} />
                </div>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2" style={{ color: labelColor }}>
              Mère
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="mb-2">
                  <label className="text-sm font-medium whitespace-nowrap flex-shrink-0" style={{ color: labelColor, minWidth: '120px' }}>
                    Nom de la mère
                  </label>
                  <Controller name="nomMere" control={control} render={({ field }) => (
                    <input {...field} value={field.value || ""} placeholder="Ex: Martin" className={getFieldClassName()} disabled={readOnly} />
                  )} />
                </div>
              </div>
              <div>
                <div className="mb-2">
                  <label className="text-sm font-medium whitespace-nowrap flex-shrink-0" style={{ color: labelColor, minWidth: '120px' }}>
                    Prénoms de la mère
                  </label>
                  <Controller name="prenomsMere" control={control} render={({ field }) => (
                    <input {...field} value={field.value || ""} placeholder="Ex: Sophie" className={getFieldClassName()} disabled={readOnly} />
                  )} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr className="my-4 border-gray-200" />

      {/* Rue */}
      <div className="mb-6">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <label className="text-sm font-medium whitespace-nowrap flex-shrink-0" style={{ color: labelColor, minWidth: '120px' }}>
              Rue
            </label>
            <Controller name="rue" control={control} render={({ field }) => (
              <input {...field} value={field.value || ""} placeholder="Ex: 123 Rue Example" className={getFieldClassName() + " flex-1"} disabled={readOnly} />
            )} />
          </div>
        </div>
      </div>
    </div>
  );
}
