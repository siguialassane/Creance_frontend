// Configuration des champs de formulaire pour chaque type de paramètre
// Basée sur les colonnes affichées dans les tableaux

export interface FormFieldConfig {
  key: string
  label: string
  type: 'text' | 'number' | 'date' | 'select' | 'textarea' | 'searchable-select'
  required?: boolean
  placeholder?: string
  maxLength?: number
  min?: number
  max?: number
  options?: { value: string; label: string }[]
  validation?: {
    pattern?: RegExp
    message?: string
  }
  apiKey?: string // Nom de la clé dans l'API si différente de key
  searchableHook?: string // Nom du hook à utiliser pour les searchable-select (ex: 'useBanquesSearchable')
}

export const FORM_FIELD_CONFIGS: Record<string, FormFieldConfig[]> = {
  // Paramètres avec code et libelle uniquement
  banque: [
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'BQ_CODE', maxLength: 20 },
    { key: 'libelle', label: 'Nom de la banque', type: 'text', required: true, apiKey: 'BQ_LIB', maxLength: 100 }
  ],
  civilite: [
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'CIV_CODE', maxLength: 10 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'CIV_LIB', maxLength: 50 }
  ],
  classe: [
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'CLAS_CODE', maxLength: 10 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'CLAS_LIB', maxLength: 100 }
  ],
  categorie_debiteur: [
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'CATEG_DEB_CODE', maxLength: 10 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'CATEG_DEB_LIB', maxLength: 100 }
  ],
  fonction: [
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'FONCT_CODE', maxLength: 10 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'FONCT_LIB', maxLength: 100 }
  ],
  nationalite: [
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'NAT_CODE', maxLength: 10 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'NAT_LIB', maxLength: 100 }
  ],
  profession: [
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'PROFES_CODE', maxLength: 10 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'PROFES_LIB', maxLength: 100 }
  ],
  quartier: [
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'QUART_CODE', maxLength: 10 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'QUART_LIB', maxLength: 100 }
  ],
  ville: [
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'VILLE_CODE', maxLength: 10 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'VILLE_LIB', maxLength: 100 }
  ],
  zone: [
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'ZONE_CODE', maxLength: 10 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'ZONE_LIB', maxLength: 100 }
  ],
  type_operation: [
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'TYPOPER_CODE', maxLength: 10 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'TYPOPER_LIB', maxLength: 100 }
  ],
  entite: [
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'ENTITE_CODE', maxLength: 10 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'ENTITE_LIB', maxLength: 100 }
  ],
  etape: [
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'ETAP_CODE', maxLength: 10 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'ETAP_LIB', maxLength: 100 }
  ],
  groupe_creance: [
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'GC_CODE', maxLength: 10 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'GC_LIB', maxLength: 100 }
  ],
  journal: [
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'J_CODE', maxLength: 10 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'J_LIB', maxLength: 100 }
  ],
  message: [
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'MSG_CODE', maxLength: 10 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'MSG_LIB', maxLength: 100 }
  ],
  mode_acquisition: [
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'MA_CODE', maxLength: 10 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'MA_LIB', maxLength: 100 }
  ],
  objet_creance: [
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'OC_CODE', maxLength: 10 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'OC_LIB', maxLength: 100 }
  ],
  operation: [
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'OP_CODE', maxLength: 10 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'OP_LIB', maxLength: 100 }
  ],
  periodicite: [
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'PER_CODE', maxLength: 10 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'PER_LIB', maxLength: 100 }
  ],
  poste_comptable: [
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'PC_CODE', maxLength: 10 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'PC_LIB', maxLength: 100 }
  ],
  statut_creance: [
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'SC_CODE', maxLength: 10 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'SC_LIB', maxLength: 100 }
  ],
  statut_salarie: [
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'SS_CODE', maxLength: 10 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'SS_LIB', maxLength: 100 }
  ],
  type_acte: [
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'TYPACTE_CODE', maxLength: 10 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'TYPACTE_LIB', maxLength: 100 }
  ],
  type_auxiliaire: [
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'TYPAUXI_CODE', maxLength: 10 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'TYPAUXI_LIB', maxLength: 100 }
  ],
  mode_paiement: [
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'TYP_PAIE_CODE', maxLength: 10 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'TYP_PAIE_LIB', maxLength: 100 }
  ],
  type_charge: [
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'TYPCHARG_CODE', maxLength: 10 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'TYPCHARG_LIB', maxLength: 100 }
  ],
  type_contrat: [
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'TYPCONT_CODE', maxLength: 10 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'TYPCONT_LIB', maxLength: 100 }
  ],
  type_compte: [
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'TYPCPT_CODE', maxLength: 10 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'TYPCPT_LIB', maxLength: 100 }
  ],
  type_domiciliation: [
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'TYPDOM_CODE', maxLength: 10 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'TYPDOM_LIB', maxLength: 100 }
  ],
  type_echeancier: [
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'TYPECH_CODE', maxLength: 10 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'TYPECH_LIB', maxLength: 100 }
  ],
  type_effet: [
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'TYPEFT_CODE', maxLength: 10 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'TYPEFT_LIB', maxLength: 100 }
  ],
  type_employeur: [
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'TYPEMP_CODE', maxLength: 10 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'TYPEMP_LIB', maxLength: 100 }
  ],
  type_frais: [
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'TYPFRAIS_CODE', maxLength: 10 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'TYPFRAIS_LIB', maxLength: 100 }
  ],
  type_logement: [
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'TYPE_LOGE_CODE', maxLength: 10 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'TYPE_LOGE_LIB', maxLength: 100 }
  ],
  type_ovp: [
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'TYPOVP_CODE', maxLength: 10 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'TYPOVP_LIB', maxLength: 100 }
  ],
  type_piece: [
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'TYPE_PIECE_CODE', maxLength: 10 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'TYPE_PIECE_LIB', maxLength: 100 }
  ],
  type_regularisation: [
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'REGUL_TYPE_CODE', maxLength: 10 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'REGUL_TYPE_LIB', maxLength: 100 }
  ],
  type_saisie: [
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'TYPSAIS_CODE', maxLength: 10 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'TYPSAIS_LIB', maxLength: 100 }
  ],
  type_garantie_personnelle: [
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'TYPGAR_PHYS_CODE', maxLength: 10 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'TYPGAR_PHYS_LIB', maxLength: 100 }
  ],
  type_garantie_reelle: [
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'TYPGAR_REEL_CODE', maxLength: 10 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'TYPGAR_REEL_LIB', maxLength: 100 }
  ],

  // Paramètres avec champs supplémentaires
  agence_de_banque: [
    { 
      key: 'banqueCode', 
      label: 'Code Banque', 
      type: 'searchable-select', 
      required: true, 
      apiKey: 'BQ_CODE', 
      placeholder: 'Sélectionner une banque',
      searchableHook: 'useBanquesSearchable'
    },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'BQAG_LIB', maxLength: 100, placeholder: 'Ex: AGENCE PLATEAU' },
    { key: 'libelleLong', label: 'Libellé Long', type: 'text', required: false, apiKey: 'BQAG_LIBLONG', maxLength: 200, placeholder: 'Ex: AGENCE SOCIETE GENERALE PLATEAU' },
    { key: 'adresse', label: 'Adresse', type: 'text', required: false, apiKey: 'BQAG_ADR', maxLength: 255, placeholder: 'Ex: BOULEVARD CARDE, PLATEAU' },
    { key: 'telephone', label: 'Téléphone', type: 'text', required: false, apiKey: 'BQAG_TEL', maxLength: 20, placeholder: 'Ex: 2722204001' },
    { key: 'ville', label: 'Ville', type: 'text', required: false, apiKey: 'BQAG_VILLE', maxLength: 100, placeholder: 'Ex: ABIDJAN' }
  ],
  
  compte_operation: [
    { 
      key: 'numero', 
      label: 'Numéro', 
      type: 'number', 
      required: true, 
      apiKey: 'CPT_OPER_NUM',
      min: 1
    },
    { 
      key: 'journal', 
      label: 'Journal', 
      type: 'text', 
      required: true, 
      apiKey: 'CODE_JOURNAL',
      maxLength: 20
    },
    { 
      key: 'typeOperation', 
      label: 'Type Opération', 
      type: 'text', 
      required: true, 
      apiKey: 'TYPOPER_CODE',
      maxLength: 10
    },
    { 
      key: 'sens', 
      label: 'Sens', 
      type: 'select', 
      required: true, 
      apiKey: 'CPT_OPER_SENS',
      options: [
        { value: 'D', label: 'Débit' },
        { value: 'C', label: 'Crédit' }
      ]
    },
    { 
      key: 'libelle', 
      label: 'Libellé', 
      type: 'text', 
      required: false, 
      apiKey: 'CO_LIB',
      maxLength: 200
    }
  ],
  
  exercice: [
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'EXO_LIB', maxLength: 50 },
    { 
      key: 'dateDebut', 
      label: 'Date de début', 
      type: 'date', 
      required: true, 
      apiKey: 'EXO_DATEDEB'
    },
    { 
      key: 'dateFin', 
      label: 'Date de fin', 
      type: 'date', 
      required: true, 
      apiKey: 'EXO_DATEFIN'
    }
  ]
}

export function getFormFieldsForType(type: string): FormFieldConfig[] {
  return FORM_FIELD_CONFIGS[type] || [
    { key: 'code', label: 'Code', type: 'text', required: true, maxLength: 50 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, maxLength: 100 }
  ]
}

export function validateFormField(value: any, field: FormFieldConfig): string | null {
  if (field.required && (!value || (typeof value === 'string' && !value.trim()))) {
    return `${field.label} est requis`
  }

  if (value && typeof value === 'string') {
    if (field.maxLength && value.length > field.maxLength) {
      return `${field.label} ne peut pas dépasser ${field.maxLength} caractères`
    }
  }

  if (value && field.type === 'number') {
    const numValue = Number(value)
    if (isNaN(numValue)) {
      return `${field.label} doit être un nombre`
    }
    if (field.min !== undefined && numValue < field.min) {
      return `${field.label} doit être supérieur ou égal à ${field.min}`
    }
    if (field.max !== undefined && numValue > field.max) {
      return `${field.label} doit être inférieur ou égal à ${field.max}`
    }
  }

  if (value && field.validation?.pattern && typeof value === 'string') {
    if (!field.validation.pattern.test(value)) {
      return field.validation.message || `${field.label} n'est pas au bon format`
    }
  }

  return null
}

