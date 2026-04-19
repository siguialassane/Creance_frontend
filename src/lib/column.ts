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
      { key: 'sigle', label: 'Sigle', sortable: true },
      { key: 'responsable', label: 'Responsable', sortable: true },
      { key: 'contact', label: 'Contact', sortable: true },
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
      { key: 'code', label: 'Code Agence', sortable: false },
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
      {
        key: 'libelleLong',
        label: 'Libellé long',
        sortable: true,
      },
      {
        key: 'FONCT_NUM',
        label: 'Numéro',
        sortable: true,
      },
    ],
    nationalite: [
      { key: 'code', label: 'Code', sortable: true },
      { key: 'libelle', label: 'Libellé', sortable: true },
      { key: 'NAT_DEF', label: 'Défaut', sortable: true },
      { key: 'NAT_IND', label: 'Indicateur', sortable: true },
    ],
    profession: [
      { key: 'code', label: 'Code', sortable: true },
      { key: 'libelle', label: 'Libellé', sortable: true },
      { key: 'libelleLong', label: 'Libellé long', sortable: true },
      { key: 'numero', label: 'Numéro', sortable: true },
    ],
    quartier: [
      { key: 'code', label: 'Code', sortable: true },
      { key: 'VILLE_CODE', label: 'Ville', sortable: true },
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
      { key: 'libelleCourt', label: 'Libellé court', sortable: true },
      { key: 'modePaiement', label: 'Mode paiement', sortable: true },
      { key: 'typePaiement', label: 'Type paiement', sortable: true },
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
      { key: 'libelleLong', label: 'Libellé long', sortable: true },
      { key: 'responsable', label: 'Responsable', sortable: true },
      { key: 'assigne', label: 'Assigné', sortable: true },
      { key: 'libelleMinusc', label: 'Libellé minuscule', sortable: true },
    ],
    etape: [
      { key: 'code', label: 'Code', sortable: true },
      { key: 'libelle', label: 'Libellé', sortable: true },
    ],
    exercice: [
      {
        key: 'code',
        label: 'N° Exercice',
        sortable: true,
      },
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
      {
        key: 'EXO_CLOS',
        label: 'Clos',
        sortable: true,
        render: renderExerciceCloture
      },
      {
        key: 'DATE_ADOPTION_BUD',
        label: 'Date adoption budget',
        sortable: true,
        render: renderExerciceDateAdoptionBudget
      },
      {
        key: 'EXO_ENCOURS',
        label: 'En cours',
        sortable: true,
        render: renderExerciceEnCours
      },
    ],
    groupe_creance: [
      { key: 'code', label: 'Code', sortable: true },
      { key: 'entiteCode', label: 'Code Entité', sortable: true },
      { key: 'libelle', label: 'Libellé', sortable: true },
      { key: 'libelleLong', label: 'Libellé Long', sortable: true },
      { key: 'hierachie', label: 'Hiérarchie', sortable: true },
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
    param: [
      { key: 'code', label: 'Code', sortable: true },
      { key: 'libelle', label: 'Libellé', sortable: true },
      { key: 'commentaire', label: 'Commentaire', sortable: true },
      { key: 'valeur', label: 'Valeur', sortable: true },
    ],
    poste_comptable: [
      { key: 'code', label: 'Code', sortable: true },
      { key: 'libelle', label: 'Libellé', sortable: true },
      { key: 'typePcNum', label: 'Type poste', sortable: true },
      { key: 'ville', label: 'Ville', sortable: true },
      { key: 'situationGeographique', label: 'Situation géographique', sortable: true },
      { key: 'remarque', label: 'Remarque', sortable: true },
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
      { key: 'precedent', label: 'Code précédent', sortable: true },
      { key: 'libelle', label: 'Libellé', sortable: true },
      { key: 'delai', label: 'Délai', sortable: true },
      { key: 'service', label: 'Service', sortable: true },
      { key: 'ordreEmission', label: 'Ordre émission', sortable: true },
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
      { key: 'sens', label: 'Sens', sortable: true },
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