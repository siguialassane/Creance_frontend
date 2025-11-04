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

const renderExerciceDateDebut = (value: any, item: any): React.ReactNode => {
  const date = item.EXO_DATEDEB;
  if (!date) return <div className="text-gray-500">-</div>;
  try {
    const dateObj = new Date(date);
    return (
      <div className="text-gray-700">
        {dateObj.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
      </div>
    );
  } catch {
    return <div className="text-gray-700">{date}</div>;
  }
};

const renderExerciceDateFin = (value: any, item: any): React.ReactNode => {
  const date = item.EXO_DATEFIN;
  if (!date) return <div className="text-gray-500">-</div>;
  try {
    const dateObj = new Date(date);
    return (
      <div className="text-gray-700">
        {dateObj.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
      </div>
    );
  } catch {
    return <div className="text-gray-700">{date}</div>;
  }
};

const renderExerciceCloture = (value: any, item: any): React.ReactNode => {
  const cloture = item.EXO_CLOS;
  if (cloture === 'O' || cloture === true) {
    return (
      <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
        Clôturé
      </div>
    );
  }
  return (
    <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
      Ouvert
    </div>
  );
};

const renderExerciceEnCours = (value: any, item: any): React.ReactNode => {
  const enCours = item.EXO_ENCOURS;
  if (enCours === true || enCours === 'O' || enCours === 'Y') {
    return (
      <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        En cours
      </div>
    );
  }
  return (
    <div className="text-gray-500 text-sm">-</div>
  );
};

const renderExerciceDateAdoptionBudget = (value: any, item: any): React.ReactNode => {
  const date = item.DATE_ADOPTION_BUD;
  if (!date) return <div className="text-gray-500">-</div>;
  try {
    const dateObj = new Date(date);
    return (
      <div className="text-gray-700">
        {dateObj.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
      </div>
    );
  } catch {
    return <div className="text-gray-700">{date}</div>;
  }
};

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
        key: 'libelle', 
        label: 'Libellé', 
        sortable: true,
        render: renderExerciceLibelle
      },
      { 
        key: 'EXO_DATEDEB', 
        label: 'Date de début', 
        sortable: true,
        render: renderExerciceDateDebut
      },
      { 
        key: 'EXO_DATEFIN', 
        label: 'Date de fin', 
        sortable: true,
        render: renderExerciceDateFin
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