import React from 'react';

// Fonctions de rendu réutilisables
const renderFonctionCode = (value: any, item: any) => (
  <div className="font-semibold text-gray-900">
    {item.FONCT_CODE || item.FON_CODE || value || '-'}
  </div>
);

const renderFonctionLibelle = (value: any, item: any) => (
  <div className="text-gray-700">
    {item.FONCT_LIB || item.FON_LIB || value || '-'}
  </div>
);

const renderCompteOperationNumero = (value: any, item: any) => (
  <div className="font-semibold text-gray-900">
    {item.CPT_OPER_NUM !== undefined ? String(item.CPT_OPER_NUM) : (item.CO_CODE || value || '-')}
  </div>
);

const renderCompteOperationJournal = (value: any, item: any) => (
  <div className="text-sm text-gray-600">
    {item.CODE_JOURNAL || '-'}
  </div>
);

const renderCompteOperationType = (value: any, item: any) => (
  <div className="text-sm text-gray-600">
    {item.TYPOPER_CODE || '-'}
  </div>
);

const renderCompteOperationSens = (value: any, item: any) => (
  <div className="text-sm text-gray-600">
    {item.CPT_OPER_SENS || '-'}
  </div>
);

const renderCompteOperationLibelle = (value: any, item: any) => (
  <div className="text-gray-700">
    {item.CO_LIB || value || '-'}
  </div>
);

const renderExerciceNumero = (value: any, item: any) => (
  <div className="font-semibold text-gray-900">
    {item.NUM_EXE !== undefined ? String(item.NUM_EXE) : (item.EXO_CODE || value || '-')}
  </div>
);

const renderExerciceLibelle = (value: any, item: any) => (
  <div className="text-gray-700">
    {item.EXO_LIB || value || '-'}
  </div>
);

export const COLUMN_CONFIGS = {
    banque: [
      { key: 'code', label: 'Code', sortable: true },
      { key: 'libelle', label: 'Nom de la banque', sortable: true },
    ],
    civilite: [
      { key: 'code', label: 'Code', sortable: true },
      { key: 'libelle', label: 'Libellé', sortable: true },
    ],
    categorie_debiteur: [
      { key: 'code', label: 'Code', sortable: true },
      { key: 'libelle', label: 'Libellé', sortable: true },
    ],
    agence_de_banque: [
      { key: 'banqueCode', label: 'Code Banque', sortable: true },
      { key: 'code', label: 'Code', sortable: true },
      { key: 'libelle', label: 'Libellé', sortable: true },
    ],
    classe: [
      { key: 'code', label: 'Code', sortable: true },
      { key: 'libelle', label: 'Libellé', sortable: true },
    ],
    fonction: [
      { 
        key: 'code', 
        label: 'Code', 
        sortable: true,
        render: renderFonctionCode
      },
      { 
        key: 'libelle', 
        label: 'Libellé', 
        sortable: true,
        render: renderFonctionLibelle
      },
    ],
    nationalite: [
      { key: 'code', label: 'Code', sortable: true },
      { key: 'libelle', label: 'Libellé', sortable: true },
    ],
    profession: [
      { key: 'code', label: 'Code', sortable: true },
      { key: 'libelle', label: 'Libellé', sortable: true },
    ],
    quartier: [
      { key: 'code', label: 'Code', sortable: true },
      { key: 'libelle', label: 'Libellé', sortable: true },
    ],
    ville: [
      { key: 'code', label: 'Code', sortable: true },
      { key: 'libelle', label: 'Libellé', sortable: true },
    ],
    zone: [
      { key: 'code', label: 'Code', sortable: true },
      { key: 'libelle', label: 'Libellé', sortable: true },
    ],
    type_operation: [
      { key: 'code', label: 'Code', sortable: true },
      { key: 'libelle', label: 'Libellé', sortable: true },
    ],
    compte_operation: [
      { 
        key: 'code', 
        label: 'Numéro', 
        sortable: true,
        render: renderCompteOperationNumero
      },
      { 
        key: 'journal', 
        label: 'Journal', 
        sortable: true,
        render: renderCompteOperationJournal
      },
      { 
        key: 'typeOperation', 
        label: 'Type Opération', 
        sortable: true,
        render: renderCompteOperationType
      },
      { 
        key: 'sens', 
        label: 'Sens', 
        sortable: true,
        render: renderCompteOperationSens
      },
      { 
        key: 'libelle', 
        label: 'Libellé', 
        sortable: true,
        render: renderCompteOperationLibelle
      },
    ],
    entite: [
      { key: 'code', label: 'Code', sortable: true },
      { key: 'libelle', label: 'Libellé', sortable: true },
    ],
    etape: [
      { key: 'code', label: 'Code', sortable: true },
      { key: 'libelle', label: 'Libellé', sortable: true },
    ],
    exercice: [
      { 
        key: 'code', 
        label: 'Numéro', 
        sortable: true,
        render: renderExerciceNumero
      },
      { 
        key: 'libelle', 
        label: 'Libellé', 
        sortable: true,
        render: renderExerciceLibelle
      },
    ],
    groupe_creance: [
      { key: 'code', label: 'Code', sortable: true },
      { key: 'libelle', label: 'Libellé', sortable: true },
    ],
    journal: [
      { key: 'code', label: 'Code', sortable: true },
      { key: 'libelle', label: 'Libellé', sortable: true },
    ],
    message: [
      { key: 'code', label: 'Code', sortable: true },
      { key: 'libelle', label: 'Libellé', sortable: true },
    ],
    mode_acquisition: [
      { key: 'code', label: 'Code', sortable: true },
      { key: 'libelle', label: 'Libellé', sortable: true },
    ],
    mode_paiement: [
      { key: 'code', label: 'Code', sortable: true },
      { key: 'libelle', label: 'Libellé', sortable: true },
    ],
    objet_creance: [
      { key: 'code', label: 'Code', sortable: true },
      { key: 'libelle', label: 'Libellé', sortable: true },
    ],
    operation: [
      { key: 'code', label: 'Code', sortable: true },
      { key: 'libelle', label: 'Libellé', sortable: true },
    ],
    periodicite: [
      { key: 'code', label: 'Code', sortable: true },
      { key: 'libelle', label: 'Libellé', sortable: true },
    ],
    poste_comptable: [
      { key: 'code', label: 'Code', sortable: true },
      { key: 'libelle', label: 'Libellé', sortable: true },
    ],
    statut_creance: [
      { key: 'code', label: 'Code', sortable: true },
      { key: 'libelle', label: 'Libellé', sortable: true },
    ],
    statut_salarie: [
      { key: 'code', label: 'Code', sortable: true },
      { key: 'libelle', label: 'Libellé', sortable: true },
    ],
    type_acte: [
      { key: 'code', label: 'Code', sortable: true },
      { key: 'libelle', label: 'Libellé', sortable: true },
    ],
    type_auxiliaire: [
      { key: 'code', label: 'Code', sortable: true },
      { key: 'libelle', label: 'Libellé', sortable: true },
    ],
    type_debiteur: [
      { key: 'code', label: 'Code', sortable: true },
      { key: 'libelle', label: 'Libellé', sortable: true },
    ],
    type_charge: [
      { key: 'code', label: 'Code', sortable: true },
      { key: 'libelle', label: 'Libellé', sortable: true },
    ],
    type_contrat: [
      { key: 'code', label: 'Code', sortable: true },
      { key: 'libelle', label: 'Libellé', sortable: true },
    ],
    type_compte: [
      { key: 'code', label: 'Code', sortable: true },
      { key: 'libelle', label: 'Libellé', sortable: true },
    ],
    type_domiciliation: [
      { key: 'code', label: 'Code', sortable: true },
      { key: 'libelle', label: 'Libellé', sortable: true },
    ],
    type_echeancier: [
      { key: 'code', label: 'Code', sortable: true },
      { key: 'libelle', label: 'Libellé', sortable: true },
    ],
    type_effet: [
      { key: 'code', label: 'Code', sortable: true },
      { key: 'libelle', label: 'Libellé', sortable: true },
    ],
    type_employeur: [
      { key: 'code', label: 'Code', sortable: true },
      { key: 'libelle', label: 'Libellé', sortable: true },
    ],
    type_frais: [
      { key: 'code', label: 'Code', sortable: true },
      { key: 'libelle', label: 'Libellé', sortable: true },
    ],
    type_logement: [
      { key: 'code', label: 'Code', sortable: true },
      { key: 'libelle', label: 'Libellé', sortable: true },
    ],
    type_ovp: [
      { key: 'code', label: 'Code', sortable: true },
      { key: 'libelle', label: 'Libellé', sortable: true },
    ],
    type_piece: [
      { key: 'code', label: 'Code', sortable: true },
      { key: 'libelle', label: 'Libellé', sortable: true },
    ],
    type_regularisation: [
      { key: 'code', label: 'Code', sortable: true },
      { key: 'libelle', label: 'Libellé', sortable: true },
    ],
    type_saisie: [
      { key: 'code', label: 'Code', sortable: true },
      { key: 'libelle', label: 'Libellé', sortable: true },
    ],
    type_garantie_personnelle: [
      { key: 'code', label: 'Code', sortable: true },
      { key: 'libelle', label: 'Libellé', sortable: true },
    ],
    type_garantie_reelle: [
      { key: 'code', label: 'Code', sortable: true },
      { key: 'libelle', label: 'Libellé', sortable: true },
    ],
  }