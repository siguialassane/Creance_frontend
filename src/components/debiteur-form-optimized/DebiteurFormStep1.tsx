"use client"

import { Control, Controller, FieldErrors } from "react-hook-form";
import { useDebiteurFormContext } from "./DebiteurFormContext";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

type Step1FormData = {
  codeDebiteur?: string;
  categorieDebiteur: string;
  adressePostale: string;
  email: string;
  telephone?: string;
  numeroCell?: string;
  localisation?: string;
  typeDebiteur: string;
};

type Props = {
  control: Control<any>;
  errors: FieldErrors<Step1FormData>;
  isEditMode?: boolean;
  readOnly?: boolean;
};

const primaryGreen = '#28A325';
const borderGray = '#d1d5db';
const errorRed = '#ef4444';
const errorBg = '#fef2f2';
const labelColor = '#374151';
const titleColor = '#1a202c';

export function DebiteurFormStep1({ control, errors, isEditMode = false, readOnly = false }: Props) {
  const { formData, isLoadingStep1 } = useDebiteurFormContext();

  const getFieldClassName = (hasError?: boolean, isFocused: boolean = false) => {
    const baseClasses = "w-full px-3 py-2 rounded-md border transition-colors duration-200 focus:outline-none";
    const errorClasses = hasError 
      ? "border-red-500 bg-red-50 focus:border-red-500" 
      : `border-[#28A325] bg-[#f3f4f6] focus:border-[#28A325]`;
    const readOnlyClasses = readOnly ? "bg-gray-50 cursor-not-allowed" : "";
    return `${baseClasses} ${errorClasses} ${readOnlyClasses}`;
  };

  return (
    <div className="flex flex-col gap-2">
      {/* <h2 className="text-lg font-bold mb-4" style={{ color: titleColor }}>
        Informations générales
      </h2> */}

      <div className="grid grid-cols-3 gap-2 mt-9">
        {/* Code Débiteur 
        <div>
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1" style={{ color: labelColor }}>
              Code débiteur
            </label>
            <Controller
              name="codeDebiteur"
              control={control}
              render={({ field }) => (
                isEditMode || readOnly ? (
                  <input
                    {...field}
                    value={field.value || "Code non disponible"}
                    readOnly
                    className={`${getFieldClassName(!!errors.codeDebiteur)} bg-gray-100 text-gray-700`}
                  />
                ) : (
                  <input
                    value="Sera généré automatiquement"
                    readOnly
                    className={`${getFieldClassName(!!errors.codeDebiteur)} bg-gray-100 text-gray-500`}
                  />
                )
              )}
            />
            {!isEditMode && !readOnly && (
              <p className="text-xs text-gray-500 mt-1">
                Le code sera généré automatiquement après validation
              </p>
            )}
          </div>
        </div>
*/}
        {/* Catégorie Débiteur */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium whitespace-nowrap flex-shrink-0" style={{ color: labelColor, minWidth: '140px' }}>
              Catégorie débiteur <span className="text-red-500">*</span>
            </label>
            <Controller
              name="categorieDebiteur"
              control={control}
              render={({ field }) => (
                <div className="relative flex-1">
                  <select
                    {...field}
                    className={getFieldClassName(!!errors.categorieDebiteur) + " focus:border-[#28A325] focus:bg-[#f3f4f6] h-[40px] pr-8 w-full"}
                    disabled={readOnly || isLoadingStep1}
                    onFocus={(e) => {
                      if (!errors.categorieDebiteur) {
                        e.target.style.borderColor = primaryGreen;
                        e.target.style.backgroundColor = '#f3f4f6';
                      }
                    }}
                    onBlur={(e) => {
                      if (errors.categorieDebiteur) {
                        e.target.style.borderColor = errorRed;
                        e.target.style.backgroundColor = errorBg;
                      } else {
                        e.target.style.borderColor = primaryGreen;
                        e.target.style.backgroundColor = '#f3f4f6';
                      }
                    }}
                    style={{ 
                      borderColor: errors.categorieDebiteur ? errorRed : primaryGreen,
                      backgroundColor: errors.categorieDebiteur ? errorBg : '#f3f4f6'
                    }}
                  >
                    <option value="">
                      {isLoadingStep1 ? "Chargement..." : "Sélectionner une catégorie"}
                    </option>
                    {formData.categoriesDebiteur?.map((categorie: any) => {
                      const code = categorie.CATEG_DEB_CODE || categorie.id || categorie.code;
                      const libelle = categorie.CATEG_DEB_LIB || categorie.libelle;
                      return (
                        <option key={code} value={code}>
                          {libelle}
                        </option>
                      );
                    })}
                  </select>
                  {isLoadingStep1 && (
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-[#28A325]"></div>
                    </div>
                  )}
                </div>
              )}
            />
          </div>
          {errors.categorieDebiteur && (
            <p className="text-sm" style={{ color: errorRed }}>{String(errors.categorieDebiteur.message)}</p>
          )}
        </div>

        {/* Type Débiteur */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium whitespace-nowrap flex-shrink-0" style={{ color: labelColor, minWidth: '140px' }}>
              Type débiteur <span className="text-red-500">*</span>
            </label>
            <Controller
              name="typeDebiteur"
              control={control}
              render={({ field }) => (
                <div className="relative flex-1">
                  <select
                    {...field}
                    className={getFieldClassName(!!errors.typeDebiteur) + " focus:border-[#28A325] focus:bg-[#f3f4f6] h-[40px] pr-8 w-full"}
                    disabled={readOnly || isLoadingStep1}
                    onFocus={(e) => {
                      if (!errors.typeDebiteur) {
                        e.target.style.borderColor = primaryGreen;
                        e.target.style.backgroundColor = '#f3f4f6';
                      }
                    }}
                    onBlur={(e) => {
                      if (errors.typeDebiteur) {
                        e.target.style.borderColor = errorRed;
                        e.target.style.backgroundColor = errorBg;
                      } else {
                        e.target.style.borderColor = primaryGreen;
                        e.target.style.backgroundColor = '#f3f4f6';
                      }
                    }}
                    style={{ 
                      borderColor: errors.typeDebiteur ? errorRed : primaryGreen,
                      backgroundColor: errors.typeDebiteur ? errorBg : '#f3f4f6'
                    }}
                  >
                    <option value="">
                      {isLoadingStep1 ? "Chargement..." : "Sélectionner un type"}
                    </option>
                    {formData.typesDebiteur?.map((type: any) => {
                      const code = type.TYPDEB_CODE || type.code || type.id;
                      const libelle = type.TYPDEB_LIB || type.libelle;
                      return (
                        <option key={code} value={code}>
                          {libelle}
                        </option>
                      );
                    })}
                  </select>
                  {isLoadingStep1 && (
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-[#28A325]"></div>
                    </div>
                  )}
                </div>
              )}
            />
          </div>
          {errors.typeDebiteur && (
            <p className="text-sm" style={{ color: errorRed }}>{String(errors.typeDebiteur.message)}</p>
          )}
        </div>

        {/* Adresse Postale */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium whitespace-nowrap flex-shrink-0" style={{ color: labelColor, minWidth: '140px' }}>
              Adresse postale <span className="text-red-500">*</span>
            </label>
            <Controller
              name="adressePostale"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  value={field.value || ""}
                  placeholder="Ex: Cocody"
                  type="text"
                  className={`${getFieldClassName(!!errors.adressePostale)} focus:border-[#28A325] focus:bg-[#f3f4f6] flex-1`}
                  disabled={readOnly}
                  style={{
                    borderColor: errors.adressePostale ? errorRed : primaryGreen,
                    backgroundColor: errors.adressePostale ? errorBg : '#f3f4f6'
                  }}
                  onFocus={(e) => {
                    if (!errors.adressePostale) {
                      e.target.style.borderColor = primaryGreen;
                      e.target.style.backgroundColor = '#f3f4f6';
                    }
                  }}
                  onBlur={(e) => {
                    if (errors.adressePostale) {
                      e.target.style.borderColor = errorRed;
                      e.target.style.backgroundColor = errorBg;
                    } else {
                      e.target.style.borderColor = primaryGreen;
                      e.target.style.backgroundColor = '#f3f4f6';
                    }
                  }}
                />
              )}
            />
          </div>
          {errors.adressePostale && (
            <p className="text-sm" style={{ color: errorRed }}>{String(errors.adressePostale.message)}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {/* Email */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium whitespace-nowrap flex-shrink-0" style={{ color: labelColor, minWidth: '140px' }}>
              Email <span className="text-red-500">*</span>
            </label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  value={field.value || ""}
                  placeholder="Ex: debiteur@example.com"
                  type="email"
                  className={`${getFieldClassName(!!errors.email)} focus:border-[#28A325] focus:bg-[#f3f4f6] flex-1`}
                  disabled={readOnly}
                  style={{
                    borderColor: errors.email ? errorRed : primaryGreen,
                    backgroundColor: errors.email ? errorBg : '#f3f4f6'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = primaryGreen;
                    e.target.style.backgroundColor = '#f3f4f6';
                  }}
                  onBlur={(e) => {
                    if (errors.email) {
                      e.target.style.borderColor = errorRed;
                      e.target.style.backgroundColor = errorBg;
                    } else {
                      e.target.style.borderColor = primaryGreen;
                      e.target.style.backgroundColor = '#f3f4f6';
                    }
                  }}
                />
              )}
            />
          </div>
          {errors.email && (
            <p className="text-sm" style={{ color: errorRed }}>{String(errors.email.message)}</p>
          )}
        </div>

        {/* Téléphone */}
        <div>
          <div className="mb-2 flex items-center gap-2">
            <label className="text-sm font-medium whitespace-nowrap flex-shrink-0" style={{ color: labelColor, minWidth: '140px' }}>
              Téléphone
            </label>
            <Controller
              name="telephone"
              control={control}
              render={({ field }) => {
                const hasValue = !!field.value;
                const hasError = !!errors.telephone;
                const phoneInputClassName = `PhoneInput ${hasValue ? 'PhoneInput--hasValue' : ''} ${hasError ? 'PhoneInput--hasError' : ''}`;
                
                return (
                  <div className="relative flex-1">
                    <PhoneInput
                      {...field}
                      defaultCountry="CI"
                      international
                      placeholder="Ex: +225 27 12 34 56 78"
                      className={phoneInputClassName}
                      disabled={readOnly}
                      style={{
                        width: '100%',
                      }}
                    />
                  </div>
                );
              }}
            />
          </div>
        </div>

        {/* N° Cellulaire */}
        <div>
          <div className="mb-2 flex items-center gap-2">
            <label className="text-sm font-medium whitespace-nowrap flex-shrink-0" style={{ color: labelColor, minWidth: '140px' }}>
              N° Cellulaire
            </label>
            <Controller
              name="numeroCell"
              control={control}
              render={({ field }) => {
                const hasValue = !!field.value;
                const hasError = !!errors.numeroCell;
                const phoneInputClassName = `PhoneInput ${hasValue ? 'PhoneInput--hasValue' : ''} ${hasError ? 'PhoneInput--hasError' : ''}`;
                
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
              }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {/* Localisation */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium whitespace-nowrap flex-shrink-0" style={{ color: labelColor, minWidth: '140px' }}>
              Localisation
            </label>
            <Controller
              name="localisation"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  value={field.value || ""}
                  placeholder="Ex: Abidjan, Cocody"
                  type="text"
                  className={`${getFieldClassName(!!errors.localisation)} focus:border-[#28A325] focus:bg-[#f3f4f6] flex-1`}
                  disabled={readOnly}
                  style={{
                    borderColor: errors.localisation ? errorRed : primaryGreen,
                    backgroundColor: errors.localisation ? errorBg : '#f3f4f6'
                  }}
                  onFocus={(e) => {
                    if (!errors.localisation) {
                      e.target.style.borderColor = primaryGreen;
                      e.target.style.backgroundColor = '#f3f4f6';
                    }
                  }}
                  onBlur={(e) => {
                    if (errors.localisation) {
                      e.target.style.borderColor = errorRed;
                      e.target.style.backgroundColor = errorBg;
                    } else {
                      e.target.style.borderColor = primaryGreen;
                      e.target.style.backgroundColor = '#f3f4f6';
                    }
                  }}
                />
              )}
            />
          </div>
          {errors.localisation && (
            <p className="text-sm" style={{ color: errorRed }}>{String(errors.localisation.message)}</p>
          )}
        </div>
      </div>

    
    </div>
  );
}
