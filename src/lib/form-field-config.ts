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
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'BQ_CODE', maxLength: 5 },
    { key: 'libelle', label: 'Nom de la banque', type: 'text', required: true, apiKey: 'BQ_LIB', maxLength: 100 },
    { key: 'cptoperCode', label: 'Compte opération', type: 'text', required: false, apiKey: 'CPTOPER_CODE', maxLength: 25 },
    { key: 'bqag', label: 'Agence', type: 'text', required: false, apiKey: 'BQAG', maxLength: 5 },
    { key: 'responsable', label: 'Responsable', type: 'text', required: false, apiKey: 'BQ_RESPONS', maxLength: 200 },
    { key: 'adresse', label: 'Adresse', type: 'textarea', required: false, apiKey: 'BQ_ADRESS', maxLength: 200 },
    { key: 'contact', label: 'Contact', type: 'text', required: false, apiKey: 'BQ_CONTACT', maxLength: 200 },
    { key: 'libelleLong', label: 'Libellé long', type: 'textarea', required: false, apiKey: 'BQ_LIBLONG', maxLength: 400 },
    { key: 'sigle', label: 'Sigle', type: 'text', required: false, apiKey: 'BQ_SIGLE', maxLength: 50 },
    { key: 'autreLibelle', label: 'Autre libellé', type: 'text', required: false, apiKey: 'BQ_AUTLIB', maxLength: 200 },
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
    // AC_CATEGORIE_DEBITEUR.CATEG_DEB_CODE est en VARCHAR2(3 BYTE)
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'CATEG_DEB_CODE', maxLength: 3 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'CATEG_DEB_LIB', maxLength: 100 }
  ],
  fonction: [
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'FONCT_CODE', maxLength: 20 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'FONCT_LIB', maxLength: 150 },
    { key: 'libelleLong', label: 'Libellé long', type: 'text', required: false, apiKey: 'FONCT_LIB_LONG', maxLength: 150 },
    { key: 'numero', label: 'Numéro', type: 'text', required: false, apiKey: 'FONCT_NUM', maxLength: 50 }
  ],
  nationalite: [
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'NAT_CODE', maxLength: 10 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'NAT_LIB', maxLength: 100 },
    { key: 'natDef', label: 'Défaut', type: 'text', required: false, apiKey: 'NAT_DEF', maxLength: 10 },
    { key: 'natInd', label: 'Indicateur', type: 'text', required: false, apiKey: 'NAT_IND', maxLength: 3 }
  ],
  profession: [
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'PROFES_CODE', maxLength: 20 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: false, apiKey: 'PROFES_LIB', maxLength: 250 },
    { key: 'libelleLong', label: 'Libellé long', type: 'text', required: false, apiKey: 'PROFES_LIB_LONG', maxLength: 250 },
    { key: 'numero', label: 'Numéro', type: 'text', required: false, apiKey: 'PROFES_NUM', maxLength: 20 }
  ],
  quartier: [
    { key: 'code', label: 'Code Quartier', type: 'text', required: true, apiKey: 'QUART_CODE', maxLength: 20 },
    {
      key: 'villeCode',
      label: 'Ville',
      type: 'searchable-select',
      required: true,
      apiKey: 'VILLE_CODE',
      placeholder: 'Sélectionner une ville',
      searchableHook: 'useVillesSearchable'
    },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'QUART_LIB', maxLength: 300 },
    {
      key: 'zoneCode',
      label: 'Zone',
      type: 'searchable-select',
      required: false,
      apiKey: 'ZONE_CODE',
      placeholder: 'Sélectionner une zone',
      searchableHook: 'useZonesSearchable'
    },
    { key: 'libelleLong', label: 'Libellé long', type: 'text', required: false, apiKey: 'QUART_LIB_LONG', maxLength: 300 },
    { key: 'numero', label: 'Numéro', type: 'text', required: false, apiKey: 'QUART_NUM', maxLength: 100 }
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
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'code', maxLength: 10 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'libelle', maxLength: 100 },
    { key: 'libelleCourt', label: 'Libellé court', type: 'text', required: false, apiKey: 'LIB_COURT', maxLength: 100 },
    { key: 'modePaiement', label: 'Mode de paiement', type: 'text', required: false, apiKey: 'MODE_PAIE_CODE', maxLength: 10 },
    { key: 'typePaiement', label: 'Type de paiement', type: 'text', required: false, apiKey: 'TYPAIE_CODE', maxLength: 10 }
  ],
  entite: [
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'ENTITE_LIB', maxLength: 100 },
    { key: 'libelleLong', label: 'Libellé long', type: 'text', required: false, apiKey: 'ENTITE_LIB_LONG', maxLength: 100 },
    { key: 'responsable', label: 'Responsable', type: 'text', required: false, apiKey: 'ENTITE_RESP', maxLength: 50 },
    { key: 'assigne', label: 'Assigné', type: 'text', required: false, apiKey: 'ENTITE_ASSIGN', maxLength: 200 },
    { key: 'libelleMinusc', label: 'Libellé minuscule', type: 'text', required: false, apiKey: 'ENTITE_LIB_MINUSC', maxLength: 50 },
  ],
  etape: [
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'ETAP_CODE', maxLength: 10 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'ETAP_LIB', maxLength: 100 }
  ],
  groupe_creance: [
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'GRP_CREAN_CODE', maxLength: 4 },
    {
      key: 'entiteCode',
      label: 'Entité',
      type: 'searchable-select',
      required: true,
      apiKey: 'ENTITE_CODE',
      placeholder: 'Sélectionner une entité',
      searchableHook: 'useEntitesSearchable'
    },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'GRP_CREAN_LIB', maxLength: 50 },
    { key: 'libelleLong', label: 'Libellé Long', type: 'text', required: false, apiKey: 'GRP_CREAN_LIB_LONG', maxLength: 110 },
    { key: 'hierachie', label: 'Hiérarchie', type: 'number', required: false, apiKey: 'HIERACHIE' }
  ],
  journal: [
    { key: 'code', label: 'Code', type: 'number', required: true, apiKey: 'CODE_JOURNAL', min: 1 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'LIB_JOURNAL', maxLength: 255 }
  ],
  message: [
    { key: 'code', label: 'Code', type: 'number', required: true, apiKey: 'CODE_MESSAGE', min: 1 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'LIBELLE_MESSAGE', maxLength: 200 }
  ],
  mode_acquisition: [
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'MODAC_CODE', maxLength: 3 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'MODAC_LIB', maxLength: 50 }
  ],
  objet_creance: [
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'OBJ_CREAN_CODE', maxLength: 10 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'OBJ_CREAN_LIB', maxLength: 500 }
  ],
  operation: [
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'OPERAT_CODE', maxLength: 25 },
    {
      key: 'quartCode',
      label: 'Quartier',
      type: 'searchable-select',
      required: false,
      apiKey: 'QUART_CODE',
      placeholder: 'Sélectionner un quartier',
      searchableHook: 'useQuartiersSearchable'
    },
    { key: 'libelle', label: 'Libellé', type: 'text', required: false, apiKey: 'OPERAT_LIB', maxLength: 350 }
  ],
  periodicite: [
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'PERIOD_CODE', maxLength: 10 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'PERIOD_LIB', maxLength: 100 }
  ],
  param: [
    { key: 'code', label: 'Code', type: 'number', required: true, apiKey: 'PARAM_CODE', min: 0 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: false, apiKey: 'PARAM_LIB', maxLength: 255 },
    { key: 'commentaire', label: 'Commentaire', type: 'textarea', required: false, apiKey: 'PARAM_COMMENT', maxLength: 1000 },
    { key: 'valeur', label: 'Valeur', type: 'number', required: false, apiKey: 'PARAM_VALEUR' }
  ],
  poste_comptable: [
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'PC_CODE', maxLength: 20 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: false, apiKey: 'PC_LIB', maxLength: 50 },
    { key: 'typePcNum', label: 'Type poste', type: 'number', required: false, apiKey: 'TYPE_PC_NUM' },
    { key: 'situationGeographique', label: 'Situation géographique', type: 'text', required: false, apiKey: 'PC_SITGEO', maxLength: 100 },
    { key: 'ville', label: 'Ville', type: 'text', required: false, apiKey: 'PC_VILLE', maxLength: 50 },
    { key: 'remarque', label: 'Remarque', type: 'textarea', required: false, apiKey: 'PC_REM', maxLength: 100 }
  ],
  statut_creance: [
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'STAT_CODE', maxLength: 2 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: false, apiKey: 'STAT_LIB', maxLength: 30 }
  ],
  statut_salarie: [
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'STATSAL_CODE', maxLength: 10 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'STATSAL_LIB', maxLength: 100 }
  ],
  type_acte: [
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'code', maxLength: 10 },
    { key: 'precedent', label: 'Code précédent', type: 'text', required: false, apiKey: 'TYPACTE_CODE_PREC', maxLength: 10 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'libelle', maxLength: 100 },
    { key: 'delai', label: 'Délai', type: 'number', required: false, apiKey: 'TYPACTE_DELAI' },
    { key: 'service', label: 'Service', type: 'number', required: false, apiKey: 'TYPACTE_SERV' },
    { key: 'ordreEmission', label: 'Ordre émission', type: 'number', required: false, apiKey: 'TYPACTE_ORD_EMIS' }
  ],
  type_auxiliaire: [
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'code', maxLength: 10 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'libelle', maxLength: 100 }
  ],
  type_debiteur: [
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'code', maxLength: 10 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'libelle', maxLength: 100 }
  ],
  mode_paiement: [
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'MODE_PAIE_CODE', maxLength: 10 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'MODE_PAIE_LIB', maxLength: 30 }
  ],
  type_charge: [
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'code', maxLength: 10 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'libelle', maxLength: 100 },
    { key: 'sens', label: 'Sens', type: 'text', required: false, apiKey: 'TYPCHARG_SENS', maxLength: 10 }
  ],
  type_contrat: [
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'code', maxLength: 10 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'libelle', maxLength: 100 }
  ],
  type_compte: [
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'code', maxLength: 1 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'libelle', maxLength: 100 }
  ],
  type_domiciliation: [
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'code', maxLength: 10 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'libelle', maxLength: 100 }
  ],
  type_echeancier: [
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'code', maxLength: 10 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'libelle', maxLength: 100 }
  ],
  type_effet: [
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'code', maxLength: 10 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'libelle', maxLength: 100 }
  ],
  type_employeur: [
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'code', maxLength: 10 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'libelle', maxLength: 100 }
  ],
  type_frais: [
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'code', maxLength: 10 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'libelle', maxLength: 100 }
  ],
  type_logement: [
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'code', maxLength: 4 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'libelle', maxLength: 250 },
    { key: 'libelleLong', label: 'Libellé long', type: 'text', required: false, apiKey: 'TYPE_LOGE_LIB_LONG', maxLength: 250 },
    { key: 'numero', label: 'Numéro', type: 'text', required: false, apiKey: 'TYPE_LOGE_NUM', maxLength: 20 }
  ],
  type_ovp: [
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'code', maxLength: 10 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'libelle', maxLength: 100 }
  ],
  type_piece: [
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'code', maxLength: 10 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'libelle', maxLength: 100 }
  ],
  type_regularisation: [
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'code', maxLength: 10 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'libelle', maxLength: 100 }
  ],
  type_saisie: [
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'code', maxLength: 10 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'libelle', maxLength: 100 }
  ],
  type_garantie_personnelle: [
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'code', maxLength: 10 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'libelle', maxLength: 100 }
  ],
  type_garantie_reelle: [
    { key: 'code', label: 'Code', type: 'text', required: true, apiKey: 'code', maxLength: 10 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'libelle', maxLength: 100 }
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
    {
      key: 'bqagCode',
      label: 'Code Agence',
      type: 'text',
      required: true,
      apiKey: 'BQAG_CODE',
      maxLength: 20,
      placeholder: 'Ex: A0082'
    },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'BQAG_LIB', maxLength: 100, placeholder: 'Ex: AGENCE PLATEAU' },
    { key: 'bqagNum', label: 'N° Agence', type: 'text', required: false, apiKey: 'BQAG_NUM', maxLength: 20, placeholder: 'Ex: 12345' },
    { key: 'ancAg', label: 'Ancien code agence', type: 'text', required: false, apiKey: 'ANC_AG', maxLength: 50, placeholder: 'Ex: ANC-AG-01' },
    { key: 'ancBqagCode', label: 'Ancien code banque-agence', type: 'text', required: false, apiKey: 'ANC_BQAG_CODE', maxLength: 50, placeholder: 'Ex: ANC-BQAG-001' },
  ],
  
  compte_operation: [
    { 
      key: 'numero', 
      label: 'Numéro', 
      type: 'number', 
      required: true, 
      apiKey: 'CPT_OPER_NUM',
      min: 1,
      validation: {
        // Eviter les entrées type "1e3", "+1", "-2" : on accepte uniquement des chiffres.
        pattern: /^\d+$/,
        message: 'Le numéro doit contenir uniquement des chiffres'
      }
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
    { key: 'code', label: 'Numéro exercice', type: 'number', required: true, apiKey: 'NUM_EXE', min: 1 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, apiKey: 'EXO_LIB', maxLength: 30 },
    {
      key: 'dateDebut',
      label: 'Date de début',
      type: 'date',
      required: false,
      apiKey: 'EXO_DATEDEB'
    },
    {
      key: 'dateFin',
      label: 'Date de fin',
      type: 'date',
      required: false,
      apiKey: 'EXO_DATEFIN'
    },
    {
      key: 'clos',
      label: 'Clos',
      type: 'select',
      required: false,
      apiKey: 'EXO_CLOS',
      options: [
        { value: 'O', label: 'Oui' },
        { value: 'N', label: 'Non' }
      ]
    },
    {
      key: 'dateAdoptionBudget',
      label: 'Date adoption budget',
      type: 'date',
      required: false,
      apiKey: 'DATE_ADOPTION_BUD'
    },
    {
      key: 'enCours',
      label: 'En cours',
      type: 'select',
      required: false,
      apiKey: 'EXO_ENCOURS',
      options: [
        { value: 'O', label: 'Oui' },
        { value: 'N', label: 'Non' }
      ]
    }
  ]
}

export function getFormFieldsForType(type: string): FormFieldConfig[] {
  return FORM_FIELD_CONFIGS[type] || [
    { key: 'code', label: 'Code', type: 'text', required: true, maxLength: 50 },
    { key: 'libelle', label: 'Libellé', type: 'text', required: true, maxLength: 100 }
  ]
}

export function validateFormField(value: unknown, field: FormFieldConfig): string | null {
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

