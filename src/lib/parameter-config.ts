import { useAgencesBanque, useAgencesBanquePaginated } from "@/hooks/useAgencesBanque";
import { useCategoriesDebiteur } from "@/hooks/useCategoriesDebiteur";
import { useBanques } from "@/hooks/useBanques";
import { useClasses } from "@/hooks/useClasses";
import { useCivilites } from "@/hooks/useCivilites";
import { useNationalites } from "@/hooks/useNationalites";
import { useProfessions, useProfessionsPaginated } from "@/hooks/useProfessions";
import { useQuartiers } from "@/hooks/useQuartiers";
import { useQuartiersSearchable } from "@/hooks/useQuartiersSearchable";
import { useVilles, useVillesPaginated } from "@/hooks/useVilles";
import { useZones } from "@/hooks/useZones";
import { useTypesOperation } from "@/hooks/useTypesOperation";
import { useTypesActe } from "@/hooks/useTypesActe";
import { useTypesAuxiliaire } from "@/hooks/useTypesAuxiliaire";
import { useTypesDebiteur } from "@/hooks/useTypesDebiteur";
import { useModesPaiement } from "@/hooks/useModesPaiement";
import { useTypeCharges } from "@/hooks/useTypeCharges";
import { useTypeContrats } from "@/hooks/useTypeContrats";
import { useTypeComptes } from "@/hooks/useTypeComptes";
import { useTypeDomiciliations } from "@/hooks/useTypeDomiciliations";
import { useTypeEcheanciers } from "@/hooks/useTypeEcheanciers";
import { useTypeEffets } from "@/hooks/useTypeEffets";
import { useTypeEmployeurs } from "@/hooks/useTypeEmployeurs";
import { useTypeFraiss } from "@/hooks/useTypeFraiss";
import { useTypeLogements } from "@/hooks/useTypeLogements";
import { useTypeOvps } from "@/hooks/useTypeOvps";
import { useTypePieces } from "@/hooks/useTypePieces";
import { useTypeRegularisations } from "@/hooks/useTypeRegularisations";
import { useTypeSaisies } from "@/hooks/useTypeSaisies";
import { useTypeGarantiePersonnelles } from "@/hooks/useTypeGarantiePersonnelles";
import { useTypeGarantieReelles } from "@/hooks/useTypeGarantieReelles";
import { useCompteOperations } from "@/hooks/useCompteOperations";
import { useEntites } from "@/hooks/useEntites";
import { useEtapes } from "@/hooks/useEtapes";
import { useExercices } from "@/hooks/useExercices";
import { useFonctions } from "@/hooks/useFonctions";
import { useGroupeCreances } from "@/hooks/useGroupeCreances";
import { useJournaux } from "@/hooks/useJournaux";
import { useMessages } from "@/hooks/useMessages";
import { useModesAcquisition } from "@/hooks/useModesAcquisition";
import { useObjetsCreance } from "@/hooks/useObjetsCreance";
import { useOperations } from "@/hooks/useOperations";
import { usePeriodicites } from "@/hooks/usePeriodicites";
import { useParams, useParamsPaginated } from "@/hooks/useParams";
import { usePostesComptables } from "@/hooks/usePostesComptables";
import { useStatutsCreance } from "@/hooks/useStatutsCreance";
import { useStatutsSalarie } from "@/hooks/useStatutsSalarie";
import { AgenceBanque } from "@/types/agence-banque";
import { Banque } from "@/types/banque";
import { Classe } from "@/types/classe";
import { CategorieDebiteur } from "@/types/categorie-debiteur";
import { Civilite } from "@/types/civilite";
import { Nationalite } from "@/types/nationalite";
import { Profession } from "@/types/profession";
import { Quartier } from "@/types/quartier";
import { Ville } from "@/types/ville";
import { Zone } from "@/types/zone";
import { TypeOperation } from "@/types/type-operation";
import { TypeActe } from "@/types/type-acte";
import { TypeAuxiliaire } from "@/types/type-auxiliaire";
import { ModePaiement } from "@/types/mode-paiement";
import { TypeCharge } from "@/types/type-charge";
import { TypeContrat } from "@/types/type-contrat";
import { TypeCompte } from "@/types/type-compte";
import { TypeDomiciliation } from "@/types/type-domiciliation";
import { TypeEcheancier } from "@/types/type-echeancier";
import { TypeEffet } from "@/types/type-effet";
import { TypeEmployeur } from "@/types/type-employeur";
import { TypeFrais } from "@/types/type-frais";
import { TypeLogement } from "@/types/type-logement";
import { TypeOvp } from "@/types/type-ovp";
import { TypePiece } from "@/types/type-piece";
import { TypeRegularisation } from "@/types/type-regularisation";
import { TypeSaisie } from "@/types/type-saisie";
import { TypeGarantiePersonnelle } from "@/types/type-garantie-personnelle";
import { TypeGarantieReelle } from "@/types/type-garantie-reelle";
import { CompteOperation } from "@/types/compte-operation";
import { Entite } from "@/types/entite";
import { Etape } from "@/types/etape";
import { Exercice } from "@/types/exercice";
import { Fonction } from "@/types/fonction";
import { GroupeCreance } from "@/types/groupe-creance";
import { Param } from "@/types/param";

// Configuration des paramètres supportés
export const PARAMETER_CONFIG = {
  getCreateHook: (type: string) => {
    switch (type) {
      case 'banque':
        return import('@/hooks/useBanques').then(m => m.useCreateBanque)
      case 'agence_de_banque':
        return import('@/hooks/useAgencesBanque').then(m => m.useCreateAgenceBanque)
      case 'classe':
        return import('@/hooks/useClasses').then(m => m.useCreateClasse)
      case 'categorie_debiteur':
        return import('@/hooks/useCategoriesDebiteur').then(m => m.useCreateCategorieDebiteur)
      case 'civilite':
        return import('@/hooks/useCivilites').then(m => m.useCreateCivilite)
      case 'nationalite':
        return import('@/hooks/useNationalites').then(m => m.useCreateNationalite)
      case 'profession':
        return import('@/hooks/useProfessions').then(m => m.useCreateProfession)
      case 'quartier':
        return import('@/hooks/useQuartiers').then(m => m.useCreateQuartier)
      case 'ville':
        return import('@/hooks/useVilles').then(m => m.useCreateVille)
      case 'zone':
        return import('@/hooks/useZones').then(m => m.useCreateZone)
      case 'type_operation':
        return import('@/hooks/useTypesOperation').then(m => m.useCreateTypeOperation)
      case 'type_acte':
        return import('@/hooks/useTypesActe').then(m => m.useCreateTypeActe)
      case 'type_auxiliaire':
        return import('@/hooks/useTypesAuxiliaire').then(m => m.useCreateTypeAuxiliaire)
      case 'type_debiteur':
        return import('@/hooks/useTypesDebiteur').then(m => m.useCreateTypeDebiteur)
      case 'mode_paiement':
        return import('@/hooks/useModesPaiement').then(m => m.useCreateModePaiement)
      case 'type_charge':
        return import('@/hooks/useTypeCharges').then(m => m.useCreateTypeCharge)
      case 'type_contrat':
        return import('@/hooks/useTypeContrats').then(m => m.useCreateTypeContrat)
      case 'type_compte':
        return import('@/hooks/useTypeComptes').then(m => m.useCreateTypeCompte)
      case 'type_domiciliation':
        return import('@/hooks/useTypeDomiciliations').then(m => m.useCreateTypeDomiciliation)
      case 'type_echeancier':
        return import('@/hooks/useTypeEcheanciers').then(m => m.useCreateTypeEcheancier)
      case 'type_effet':
        return import('@/hooks/useTypeEffets').then(m => m.useCreateTypeEffet)
      case 'type_employeur':
        return import('@/hooks/useTypeEmployeurs').then(m => m.useCreateTypeEmployeur)
      case 'type_frais':
        return import('@/hooks/useTypeFraiss').then(m => m.useCreateTypeFrais)
      case 'type_logement':
        return import('@/hooks/useTypeLogements').then(m => m.useCreateTypeLogement)
      case 'type_ovp':
        return import('@/hooks/useTypeOvps').then(m => m.useCreateTypeOvp)
      case 'type_piece':
        return import('@/hooks/useTypePieces').then(m => m.useCreateTypePiece)
      case 'type_regularisation':
        return import('@/hooks/useTypeRegularisations').then(m => m.useCreateTypeRegularisation)
      case 'type_saisie':
        return import('@/hooks/useTypeSaisies').then(m => m.useCreateTypeSaisie)
      case 'type_garantie_personnelle':
        return import('@/hooks/useTypeGarantiePersonnelles').then(m => m.useCreateTypeGarantiePersonnelle)
      case 'type_garantie_reelle':
        return import('@/hooks/useTypeGarantieReelles').then(m => m.useCreateTypeGarantieReelle)
      case 'compte_operation':
        return import('@/hooks/useCompteOperations').then(m => m.useCreateCompteOperation)
      case 'entite':
        return import('@/hooks/useEntites').then(m => m.useCreateEntite)
      case 'etape':
        return import('@/hooks/useEtapes').then(m => m.useCreateEtape)
      case 'exercice':
        return import('@/hooks/useExercices').then(m => m.useCreateExercice)
      case 'fonction':
        return import('@/hooks/useFonctions').then(m => m.useCreateFonction)
      case 'groupe_creance':
        return import('@/hooks/useGroupeCreances').then(m => m.useCreateGroupeCreance)
      case 'journal':
        return import('@/hooks/useJournaux').then(m => m.useCreateJournal)
      case 'mode_acquisition':
        return import('@/hooks/useModesAcquisition').then(m => m.useCreateModeAcquisition)
      case 'operation':
        return import('@/hooks/useOperations').then(m => m.useCreateOperation)
      case 'periodicite':
        return import('@/hooks/usePeriodicites').then(m => m.useCreatePeriodicite)
      case 'param':
        return import('@/hooks/useParams').then(m => m.useCreateParam)
      case 'poste_comptable':
        return import('@/hooks/usePostesComptables').then(m => m.useCreatePosteComptable)
      case 'statut_creance':
        return import('@/hooks/useStatutsCreance').then(m => m.useCreateStatutCreance)
      case 'statut_salarie':
        return import('@/hooks/useStatutsSalarie').then(m => m.useCreateStatutSalarie)
      default:
        return Promise.resolve(null)
    }
  },

  getUpdateHook: (type: string) => {
    switch (type) {
      case 'banque':
        return import('@/hooks/useBanques').then(m => m.useUpdateBanque)
      case 'agence_de_banque':
        return import('@/hooks/useAgencesBanque').then(m => m.useUpdateAgenceBanque)
      case 'classe':
        return import('@/hooks/useClasses').then(m => m.useUpdateClasse)
      case 'categorie_debiteur':
        return import('@/hooks/useCategoriesDebiteur').then(m => m.useUpdateCategorieDebiteur)
      case 'civilite':
        return import('@/hooks/useCivilites').then(m => m.useUpdateCivilite)
      case 'nationalite':
        return import('@/hooks/useNationalites').then(m => m.useUpdateNationalite)
      case 'profession':
        return import('@/hooks/useProfessions').then(m => m.useUpdateProfession)
      case 'quartier':
        return import('@/hooks/useQuartiers').then(m => m.useUpdateQuartier)
      case 'ville':
        return import('@/hooks/useVilles').then(m => m.useUpdateVille)
      case 'zone':
        return import('@/hooks/useZones').then(m => m.useUpdateZone)
      case 'type_operation':
        return import('@/hooks/useTypesOperation').then(m => m.useUpdateTypeOperation)
      case 'type_acte':
        return import('@/hooks/useTypesActe').then(m => m.useUpdateTypeActe)
      case 'type_auxiliaire':
        return import('@/hooks/useTypesAuxiliaire').then(m => m.useUpdateTypeAuxiliaire)
      case 'type_debiteur':
        return import('@/hooks/useTypesDebiteur').then(m => m.useUpdateTypeDebiteur)
      case 'mode_paiement':
        return import('@/hooks/useModesPaiement').then(m => m.useUpdateModePaiement)
      case 'type_charge':
        return import('@/hooks/useTypeCharges').then(m => m.useUpdateTypeCharge)
      case 'type_contrat':
        return import('@/hooks/useTypeContrats').then(m => m.useUpdateTypeContrat)
      case 'type_compte':
        return import('@/hooks/useTypeComptes').then(m => m.useUpdateTypeCompte)
      case 'type_domiciliation':
        return import('@/hooks/useTypeDomiciliations').then(m => m.useUpdateTypeDomiciliation)
      case 'type_echeancier':
        return import('@/hooks/useTypeEcheanciers').then(m => m.useUpdateTypeEcheancier)
      case 'type_effet':
        return import('@/hooks/useTypeEffets').then(m => m.useUpdateTypeEffet)
      case 'type_employeur':
        return import('@/hooks/useTypeEmployeurs').then(m => m.useUpdateTypeEmployeur)
      case 'type_frais':
        return import('@/hooks/useTypeFraiss').then(m => m.useUpdateTypeFrais)
      case 'type_logement':
        return import('@/hooks/useTypeLogements').then(m => m.useUpdateTypeLogement)
      case 'type_ovp':
        return import('@/hooks/useTypeOvps').then(m => m.useUpdateTypeOvp)
      case 'type_piece':
        return import('@/hooks/useTypePieces').then(m => m.useUpdateTypePiece)
      case 'type_regularisation':
        return import('@/hooks/useTypeRegularisations').then(m => m.useUpdateTypeRegularisation)
      case 'type_saisie':
        return import('@/hooks/useTypeSaisies').then(m => m.useUpdateTypeSaisie)
      case 'type_garantie_personnelle':
        return import('@/hooks/useTypeGarantiePersonnelles').then(m => m.useUpdateTypeGarantiePersonnelle)
      case 'type_garantie_reelle':
        return import('@/hooks/useTypeGarantieReelles').then(m => m.useUpdateTypeGarantieReelle)
      case 'compte_operation':
        return import('@/hooks/useCompteOperations').then(m => m.useUpdateCompteOperation)
      case 'entite':
        return import('@/hooks/useEntites').then(m => m.useUpdateEntite)
      case 'etape':
        return import('@/hooks/useEtapes').then(m => m.useUpdateEtape)
      case 'exercice':
        return import('@/hooks/useExercices').then(m => m.useUpdateExercice)
      case 'fonction':
        return import('@/hooks/useFonctions').then(m => m.useUpdateFonction)
      case 'groupe_creance':
        return import('@/hooks/useGroupeCreances').then(m => m.useUpdateGroupeCreance)
      case 'journal':
        return import('@/hooks/useJournaux').then(m => m.useUpdateJournal)
      case 'mode_acquisition':
        return import('@/hooks/useModesAcquisition').then(m => m.useUpdateModeAcquisition)
      case 'operation':
        return import('@/hooks/useOperations').then(m => m.useUpdateOperation)
      case 'periodicite':
        return import('@/hooks/usePeriodicites').then(m => m.useUpdatePeriodicite)
      case 'param':
        return import('@/hooks/useParams').then(m => m.useUpdateParam)
      case 'poste_comptable':
        return import('@/hooks/usePostesComptables').then(m => m.useUpdatePosteComptable)
      case 'statut_creance':
        return import('@/hooks/useStatutsCreance').then(m => m.useUpdateStatutCreance)
      case 'statut_salarie':
        return import('@/hooks/useStatutsSalarie').then(m => m.useUpdateStatutSalarie)
      default:
        return Promise.resolve(null)
    }
  },

  getDeleteHook: (type: string) => {
    switch (type) {
      case 'banque':
        return import('@/hooks/useBanques').then(m => m.useDeleteBanque)
      case 'agence_de_banque':
        return import('@/hooks/useAgencesBanque').then(m => m.useDeleteAgenceBanque)
      case 'classe':
        return import('@/hooks/useClasses').then(m => m.useDeleteClasse)
      case 'categorie_debiteur':
        return import('@/hooks/useCategoriesDebiteur').then(m => m.useDeleteCategorieDebiteur)
      case 'civilite':
        return import('@/hooks/useCivilites').then(m => m.useDeleteCivilite)
      case 'nationalite':
        return import('@/hooks/useNationalites').then(m => m.useDeleteNationalite)
      case 'profession':
        return import('@/hooks/useProfessions').then(m => m.useDeleteProfession)
      case 'quartier':
        return import('@/hooks/useQuartiers').then(m => m.useDeleteQuartier)
      case 'ville':
        return import('@/hooks/useVilles').then(m => m.useDeleteVille)
      case 'zone':
        return import('@/hooks/useZones').then(m => m.useDeleteZone)
      case 'type_operation':
        return import('@/hooks/useTypesOperation').then(m => m.useDeleteTypeOperation)
      case 'type_acte':
        return import('@/hooks/useTypesActe').then(m => m.useDeleteTypeActe)
      case 'type_auxiliaire':
        return import('@/hooks/useTypesAuxiliaire').then(m => m.useDeleteTypeAuxiliaire)
      case 'type_debiteur':
        return import('@/hooks/useTypesDebiteur').then(m => m.useDeleteTypeDebiteur)
      case 'mode_paiement':
        return import('@/hooks/useModesPaiement').then(m => m.useDeleteModePaiement)
      case 'type_charge':
        return import('@/hooks/useTypeCharges').then(m => m.useDeleteTypeCharge)
      case 'type_contrat':
        return import('@/hooks/useTypeContrats').then(m => m.useDeleteTypeContrat)
      case 'type_compte':
        return import('@/hooks/useTypeComptes').then(m => m.useDeleteTypeCompte)
      case 'type_domiciliation':
        return import('@/hooks/useTypeDomiciliations').then(m => m.useDeleteTypeDomiciliation)
      case 'type_echeancier':
        return import('@/hooks/useTypeEcheanciers').then(m => m.useDeleteTypeEcheancier)
      case 'type_effet':
        return import('@/hooks/useTypeEffets').then(m => m.useDeleteTypeEffet)
      case 'type_employeur':
        return import('@/hooks/useTypeEmployeurs').then(m => m.useDeleteTypeEmployeur)
      case 'type_frais':
        return import('@/hooks/useTypeFraiss').then(m => m.useDeleteTypeFrais)
      case 'type_logement':
        return import('@/hooks/useTypeLogements').then(m => m.useDeleteTypeLogement)
      case 'type_ovp':
        return import('@/hooks/useTypeOvps').then(m => m.useDeleteTypeOvp)
      case 'type_piece':
        return import('@/hooks/useTypePieces').then(m => m.useDeleteTypePiece)
      case 'type_regularisation':
        return import('@/hooks/useTypeRegularisations').then(m => m.useDeleteTypeRegularisation)
      case 'type_saisie':
        return import('@/hooks/useTypeSaisies').then(m => m.useDeleteTypeSaisie)
      case 'type_garantie_personnelle':
        return import('@/hooks/useTypeGarantiePersonnelles').then(m => m.useDeleteTypeGarantiePersonnelle)
      case 'type_garantie_reelle':
        return import('@/hooks/useTypeGarantieReelles').then(m => m.useDeleteTypeGarantieReelle)
      case 'compte_operation':
        return import('@/hooks/useCompteOperations').then(m => m.useDeleteCompteOperation)
      case 'entite':
        return import('@/hooks/useEntites').then(m => m.useDeleteEntite)
      case 'etape':
        return import('@/hooks/useEtapes').then(m => m.useDeleteEtape)
      case 'exercice':
        return import('@/hooks/useExercices').then(m => m.useDeleteExercice)
      case 'fonction':
        return import('@/hooks/useFonctions').then(m => m.useDeleteFonction)
      case 'groupe_creance':
        return import('@/hooks/useGroupeCreances').then(m => m.useDeleteGroupeCreance)
      case 'journal':
        return import('@/hooks/useJournaux').then(m => m.useDeleteJournal)
      case 'mode_acquisition':
        return import('@/hooks/useModesAcquisition').then(m => m.useDeleteModeAcquisition)
      case 'operation':
        return import('@/hooks/useOperations').then(m => m.useDeleteOperation)
      case 'periodicite':
        return import('@/hooks/usePeriodicites').then(m => m.useDeletePeriodicite)
      case 'param':
        return import('@/hooks/useParams').then(m => m.useDeleteParam)
      case 'poste_comptable':
        return import('@/hooks/usePostesComptables').then(m => m.useDeletePosteComptable)
      case 'statut_creance':
        return import('@/hooks/useStatutsCreance').then(m => m.useDeleteStatutCreance)
      case 'statut_salarie':
        return import('@/hooks/useStatutsSalarie').then(m => m.useDeleteStatutSalarie)
      default:
        return Promise.resolve(null)
    }
  },

  getCreateRequestType: (type: string) => {
    switch (type) {
      case 'banque':
        return 'BanqueCreateRequest'
      case 'agence_de_banque':
        return 'AgenceBanqueCreateRequest'
      case 'classe':
        return 'ClasseCreateRequest'
      case 'categorie_debiteur':
        return 'CategorieDebiteurCreateRequest'
      case 'civilite':
        return 'CiviliteCreateRequest'
      case 'nationalite':
        return 'NationaliteCreateRequest'
      case 'profession':
        return 'ProfessionCreateRequest'
      case 'quartier':
        return 'QuartierCreateRequest'
      case 'ville':
        return 'VilleCreateRequest'
      case 'zone':
        return 'ZoneCreateRequest'
      case 'type_operation':
        return 'TypeOperationCreateRequest'
      case 'type_acte':
        return 'TypeActeCreateRequest'
      case 'type_auxiliaire':
        return 'TypeAuxiliaireCreateRequest'
      case 'type_debiteur':
        return 'TypeDebiteurCreateRequest'
      case 'mode_paiement':
        return 'ModePaiementCreateRequest'
      case 'type_charge':
        return 'TypeChargeCreateRequest'
      case 'type_contrat':
        return 'TypeContratCreateRequest'
      case 'type_compte':
        return 'TypeCompteCreateRequest'
      case 'type_domiciliation':
        return 'TypeDomiciliationCreateRequest'
      case 'type_echeancier':
        return 'TypeEcheancierCreateRequest'
      case 'type_effet':
        return 'TypeEffetCreateRequest'
      case 'type_employeur':
        return 'TypeEmployeurCreateRequest'
      case 'type_frais':
        return 'TypeFraisCreateRequest'
      case 'type_logement':
        return 'TypeLogementCreateRequest'
      case 'type_ovp':
        return 'TypeOvpCreateRequest'
      case 'type_piece':
        return 'TypePieceCreateRequest'
      case 'type_regularisation':
        return 'TypeRegularisationCreateRequest'
      case 'type_saisie':
        return 'TypeSaisieCreateRequest'
      case 'type_garantie_personnelle':
        return 'TypeGarantiePersonnelleCreateRequest'
      case 'type_garantie_reelle':
        return 'TypeGarantieReelleCreateRequest'
      case 'compte_operation':
        return 'CompteOperationCreateRequest'
      case 'entite':
        return 'EntiteCreateRequest'
      case 'etape':
        return 'EtapeCreateRequest'
      case 'exercice':
        return 'ExerciceCreateRequest'
      case 'fonction':
        return 'FonctionCreateRequest'
      case 'groupe_creance':
        return 'GroupeCreanceCreateRequest'
      case 'journal':
        return 'JournalCreateRequest'
      case 'operation':
        return 'OperationCreateRequest'
      case 'periodicite':
        return 'PeriodiciteCreateRequest'
      case 'param':
        return 'ParamCreateRequest'
      case 'poste_comptable':
        return 'PosteComptableCreateRequest'
      case 'statut_salarie':
        return 'StatutSalarieCreateRequest'
      default:
        return 'any'
    }
  },

  // Configuration des paramètres supportés
  getConfig: (type: string) => {
    const configs: Record<string, any> = {
    banque: {
      hook: useBanques,
      dataKey: null, // Les données sont déjà extraites dans le hook (tableau direct)
      mapper: (item: Banque) => ({
        id: item.BQ_CODE,
        code: item.BQ_CODE,
        libelle: item.BQ_LIB,
        // Tous les champs pour le mode édition
        cptoperCode: item.CPTOPER_CODE,
        bqag: item.BQAG,
        responsable: item.BQ_RESPONS,
        adresse: item.BQ_ADRESS,
        contact: item.BQ_CONTACT,
        libelleLong: item.BQ_LIBLONG,
        sigle: item.BQ_SIGLE,
        autreLibelle: item.BQ_AUTLIB,
      })
    },
    agence_de_banque: {
      hook: useAgencesBanquePaginated,
      dataKey: "content", // Les données sont déjà extraites dans le hook
      mapper: (item: AgenceBanque) => ({
        id: `${item.BQ_CODE}__${item.BQAG_CODE}`,
        // Pour l'affichage "Code" du listing : on veut BQAG_CODE.
        code: item.BQAG_CODE,
        // Pour les opérations qui ont besoin de BQAG_NUM :
        bqagNum: item.BQAG_NUM,
        banqueCode: item.BQ_CODE,
        libelle: item.BQAG_LIB,
        bqagCode: item.BQAG_CODE,
        // Champs optionnels pour l'édition
        bqagLib: item.BQAG_LIB,
        ancAg: item.ANC_AG,
        ancBqagCode: item.ANC_BQAG_CODE,
      })
    },
    classe: {
      hook: useClasses,
      dataKey: null, // Les données sont déjà extraites dans le hook (tableau direct)
      mapper: (item: Classe) => ({
        id: item.CLAS_CODE,
        code: item.CLAS_CODE,
        libelle: item.CLAS_LIB,
      })
    },
    categorie_debiteur: {
      hook: useCategoriesDebiteur,
      dataKey: null, // Les données sont déjà extraites dans le hook
      mapper: (item: CategorieDebiteur) => ({
        id: item.CATEG_DEB_CODE,
        code: item.CATEG_DEB_CODE,
        libelle: item.CATEG_DEB_LIB,
      })
    },
    civilite: {
      hook: useCivilites,
      dataKey: null, // Les données sont déjà extraites dans le hook
      mapper: (item: Civilite) => ({
        id: item.CIV_CODE,
        code: item.CIV_CODE,
        libelle: item.CIV_LIB,
      })
    },
    nationalite: {
      hook: useNationalites,
      dataKey: null,
      mapper: (item: Nationalite) => ({ 
        id: item.NAT_CODE, 
        code: item.NAT_CODE, 
        libelle: item.NAT_LIB,
        // Inclure TOUS les champs pour l'édition
        NAT_DEF: item.NAT_DEF,
        NAT_IND: item.NAT_IND,
        ...item
      })
    },
    profession: {
      hook: useProfessions,
      hookPaginated: (params: any) => useProfessionsPaginated(params),
      dataKey: null,
      queryKeyBase: 'professions',
      mapper: (item: Profession) => ({
        id: item.PROFES_CODE,
        code: item.PROFES_CODE,
        libelle: item.PROFES_LIB,
        libelleLong: item.PROFES_LIB_LONG,
        numero: item.PROFES_NUM,
        ...item,
      })
    },
    quartier: {
      hook: useQuartiers,
      dataKey: null,
      mapper: (item: Quartier) => ({
        id: item.QUART_CODE,
        code: item.QUART_CODE,
        libelle: item.QUART_LIB,
        // Champs complets pour le mode édition
        VILLE_CODE: item.VILLE_CODE,
        ZONE_CODE: item.ZONE_CODE,
        QUART_LIB_LONG: item.QUART_LIB_LONG,
        QUART_NUM: item.QUART_NUM,
      })
    },
    ville: {
      hook: useVilles,
      hookPaginated: (params: any) => useVillesPaginated(params),
      dataKey: null,
      mapper: (item: any) => ({ 
        id: item.VILLE_CODE || item.V_CODE, 
        code: item.VILLE_CODE || item.V_CODE, 
        libelle: item.VILLE_LIB || item.V_LIB,
        // Préserver les données originales pour l'affichage dans les colonnes
        ...item
      })
    },
    zone: {
      hook: useZones,
      dataKey: null,
      mapper: (item: Zone) => ({ id: item.ZONE_CODE, code: item.ZONE_CODE, libelle: item.ZONE_LIB })
    },
    type_operation: {
      hook: useTypesOperation,
      dataKey: null,
      mapper: (item: any) => ({
        id: item.code ?? item.TYPOPER_CODE ?? item.typoper_code,
        code: item.code ?? item.TYPOPER_CODE ?? item.typoper_code,
        libelle: item.libelle ?? item.TYPOPER_LIB ?? item.typoper_lib,
        libelleCourt: item.libelleCourt ?? item.LIB_COURT ?? item.lib_court,
        modePaiement: item.modePaiement ?? item.MODE_PAIE_CODE ?? item.mode_paiement,
        typePaiement: item.typePaiement ?? item.TYPAIE_CODE ?? item.type_paiement,
        ...item,
      })
    },
    type_acte: {
      hook: useTypesActe,
      dataKey: null,
      mapper: (item: any) => ({
        id: item.code || item.TYPACTE_CODE,
        code: item.code || item.TYPACTE_CODE,
        precedent: item.precedent || item.TYPACTE_CODE_PREC,
        libelle: item.libelle || item.TYPACTE_LIB,
        delai: item.delai ?? item.TYPACTE_DELAI,
        service: item.service ?? item.TYPACTE_SERV,
        ordreEmission: item.ordreEmission ?? item.TYPACTE_ORD_EMIS,
        ...item,
      })
    },
    type_auxiliaire: {
      hook: useTypesAuxiliaire,
      dataKey: null,
      mapper: (item: any) => ({ id: item.TYPAUXI_CODE, code: item.TYPAUXI_CODE, libelle: item.TYPAUXI_LIB })
    },
    type_debiteur: {
      hook: useTypesDebiteur,
      dataKey: null,
      queryKeyBase: 'typesDebiteur',
      mapper: (item: any) => ({
        id: item.code ?? item.TYPDEB_CODE ?? item.typdeb_code,
        code: item.code ?? item.TYPDEB_CODE ?? item.typdeb_code,
        libelle: item.libelle ?? item.TYPDEB_LIB ?? item.typdeb_lib,
        ...item,
      })
    },
    mode_paiement: {
      hook: useModesPaiement,
      dataKey: null,
      mapper: (item: any) => ({ id: item.MODE_PAIE_CODE, code: item.MODE_PAIE_CODE, libelle: item.MODE_PAIE_LIB })
    },
    type_charge: {
      hook: useTypeCharges,
      dataKey: null,
      mapper: (item: TypeCharge) => ({
        id: item.code ?? item.TYPCHARG_CODE,
        code: item.code ?? item.TYPCHARG_CODE,
        libelle: item.libelle ?? item.TYPCHARG_LIB,
        sens: item.sens ?? item.TYPCHARG_SENS,
        ...item,
      })
    },
    type_contrat: {
      hook: useTypeContrats,
      dataKey: null,
      mapper: (item: TypeContrat) => ({
        id: item.code ?? item.TYPCONT_CODE,
        code: item.code ?? item.TYPCONT_CODE,
        libelle: item.libelle ?? item.TYPCONT_LIB,
        ...item,
      })
    },
    type_compte: {
      hook: useTypeComptes,
      dataKey: null,
      mapper: (item: any) => ({ id: item.TYPCPT_CODE, code: item.TYPCPT_CODE, libelle: item.TYPCPT_LIB })
    },
    type_domiciliation: {
      hook: useTypeDomiciliations,
      dataKey: null,
      mapper: (item: any) => ({ id: item.TYPDOM_CODE, code: item.TYPDOM_CODE, libelle: item.TYPDOM_LIB })
    },
    type_echeancier: {
      hook: useTypeEcheanciers,
      dataKey: null,
      mapper: (item: any) => ({ id: item.code ?? item.TYPECH_CODE, code: item.code ?? item.TYPECH_CODE, libelle: item.libelle ?? item.TYPECH_LIB, ...item })
    },
    type_effet: {
      hook: useTypeEffets,
      dataKey: null,
      mapper: (item: any) => ({ id: item.TYPEFT_CODE, code: item.TYPEFT_CODE, libelle: item.TYPEFT_LIB })
    },
    type_employeur: {
      hook: useTypeEmployeurs,
      dataKey: null,
      mapper: (item: any) => ({ id: item.TYPEMP_CODE, code: item.TYPEMP_CODE, libelle: item.TYPEMP_LIB })
    },
    type_frais: {
      hook: useTypeFraiss,
      dataKey: null,
      mapper: (item: any) => ({ id: item.TYPFRAIS_CODE, code: item.TYPFRAIS_CODE, libelle: item.TYPFRAIS_LIB })
    },
    type_logement: {
      hook: useTypeLogements,
      dataKey: null,
      mapper: (item: any) => ({ id: item.TYPE_LOGE_CODE, code: item.TYPE_LOGE_CODE, libelle: item.TYPE_LOGE_LIB })
    },
    type_ovp: {
      hook: useTypeOvps,
      dataKey: null,
      mapper: (item: any) => ({ id: item.TYPOVP_CODE, code: item.TYPOVP_CODE, libelle: item.TYPOVP_LIB })
    },
    type_piece: {
      hook: useTypePieces,
      dataKey: null,
      mapper: (item: any) => ({ id: item.TYPE_PIECE_CODE, code: item.TYPE_PIECE_CODE, libelle: item.TYPE_PIECE_LIB })
    },
    type_regularisation: {
      hook: useTypeRegularisations,
      dataKey: null,
      mapper: (item: any) => ({ id: item.REGUL_TYPE_CODE, code: item.REGUL_TYPE_CODE, libelle: item.REGUL_TYPE_LIB })
    },
    type_saisie: {
      hook: useTypeSaisies,
      dataKey: null,
      mapper: (item: any) => ({ id: item.TYPSAIS_CODE, code: item.TYPSAIS_CODE, libelle: item.TYPSAIS_LIB })
    },
    type_garantie_personnelle: {
      hook: useTypeGarantiePersonnelles,
      dataKey: null,
      mapper: (item: any) => ({ id: item.TYPGAR_PHYS_CODE, code: item.TYPGAR_PHYS_CODE, libelle: item.TYPGAR_PHYS_LIB })
    },
    type_garantie_reelle: {
      hook: useTypeGarantieReelles,
      dataKey: null,
      mapper: (item: any) => ({ id: item.TYPGAR_REEL_CODE, code: item.TYPGAR_REEL_CODE, libelle: item.TYPGAR_REEL_LIB })
    },
    compte_operation: {
      hook: useCompteOperations,
      dataKey: null,
      mapper: (item: any) => {
        // Utiliser CPT_OPER_NUM comme code (number)
        const code = item.CPT_OPER_NUM !== undefined ? String(item.CPT_OPER_NUM) : (item.CO_CODE || '');
        // Construire un libellé descriptif à partir des informations disponibles
        // L'API ne retourne pas CO_LIB, donc on construit toujours le libellé
        const parts: string[] = [];
        if (item.CPT_OPER_NUM !== undefined) {
          parts.push(`N°${item.CPT_OPER_NUM}`);
        }
        if (item.CODE_JOURNAL) {
          parts.push(`Journal: ${item.CODE_JOURNAL}`);
        }
        if (item.TYPOPER_CODE) {
          parts.push(`Type: ${item.TYPOPER_CODE}`);
        }
        if (item.CPT_OPER_SENS) {
          parts.push(`Sens: ${item.CPT_OPER_SENS}`);
        }
        const libelle = parts.length > 0 ? parts.join(' - ') : code || 'Compte opération';
        
        return { 
          id: code, 
          code: code, 
          libelle: libelle,
          // Préserver les données originales pour l'affichage dans les colonnes
          ...item
        };
      }
    },
    entite: {
      hook: useEntites,
      dataKey: null,
      mapper: (item: any) => ({
        id: item.ENTITE_CODE,
        code: item.ENTITE_CODE,
        libelle: item.ENTITE_LIB,
        // Tous les champs pour le mode édition
        libelleLong: item.ENTITE_LIB_LONG,
        responsable: item.ENTITE_RESP,
        assigne: item.ENTITE_ASSIGN,
        libelleMinusc: item.ENTITE_LIB_MINUSC,
      })
    },
    etape: {
      hook: useEtapes,
      dataKey: null,
      mapper: (item: any) => ({ id: item.ETAP_CODE, code: item.ETAP_CODE, libelle: item.ETAP_LIB })
    },
    exercice: {
      hook: useExercices,
      dataKey: null,
      mapper: (item: any) => ({
        id: item.NUM_EXE,
        code: item.NUM_EXE,
        libelle: item.EXO_LIB,
        // Tous les champs pour le mode édition
        dateDebut: item.EXO_DATEDEB,
        dateFin: item.EXO_DATEFIN,
        clos: item.EXO_CLOS,
        dateAdoptionBudget: item.DATE_ADOPTION_BUD,
        enCours: item.EXO_ENCOURS,
        // Préserver les données originales pour l'affichage dans les colonnes
        ...item
      })
    },
    fonction: {
      hook: useFonctions,
      dataKey: null,
      mapper: (item: any) => ({
        id: item.FONCT_CODE,
        code: item.FONCT_CODE,
        libelle: item.FONCT_LIB,
        // Tous les champs pour le mode édition
        libelleLong: item.FONCT_LIB_LONG,
        numero: item.FONCT_NUM,
        // Préserver les données originales pour l'affichage dans les colonnes
        ...item
      })
    },
    groupe_creance: {
      hook: useGroupeCreances,
      dataKey: null,
      queryKeyBase: 'groupeCreances',
      mapper: (item: any) => ({
        id: item.GRP_CREAN_CODE,
        code: item.GRP_CREAN_CODE,
        entiteCode: item.ENTITE_CODE,
        libelle: item.GRP_CREAN_LIB,
        libelleLong: item.GRP_CREAN_LIB_LONG,
        hierachie: item.HIERACHIE,
        ...item
      })
    },
    journal: {
      hook: useJournaux,
      dataKey: null,
      mapper: (item: any) => ({ id: item.CODE_JOURNAL, code: item.CODE_JOURNAL, libelle: item.LIB_JOURNAL })
    },
    message: {
      hook: useMessages,
      dataKey: null,
      queryKeyBase: 'messages',
      mapper: (item: any) => ({
        id: item.CODE_MESSAGE,
        code: item.CODE_MESSAGE,
        libelle: item.LIBELLE_MESSAGE,
        ...item
      })
    },
    mode_acquisition: {
      hook: useModesAcquisition,
      dataKey: null,
      queryKeyBase: 'modes-acquisition',
      mapper: (item: any) => ({
        id: item.MODAC_CODE,
        code: item.MODAC_CODE,
        libelle: item.MODAC_LIB,
        ...item
      })
    },
    objet_creance: {
      hook: useObjetsCreance,
      dataKey: null,
      queryKeyBase: 'objets-creance',
      mapper: (item: any) => ({
        id: item.OBJ_CREAN_CODE,
        code: item.OBJ_CREAN_CODE,
        libelle: item.OBJ_CREAN_LIB,
        ...item
      })
    },
    operation: {
      hook: useOperations,
      dataKey: null,
      mapper: (item: any) => ({
        id: item.OPERAT_CODE,
        code: item.OPERAT_CODE,
        libelle: item.OPERAT_LIB,
        // Tous les champs pour le mode édition
        quartCode: item.QUART_CODE,
        operatLib: item.OPERAT_LIB,
        // Préserver les données originales
        ...item
      })
    },
    periodicite: {
      hook: usePeriodicites,
      dataKey: null,
      queryKeyBase: 'periodicites',
      mapper: (item: any) => ({
        id: item.PERIOD_CODE,
        code: item.PERIOD_CODE,
        libelle: item.PERIOD_LIB,
        ...item
      })
    },
    param: {
      hook: useParams,
      hookPaginated: (params: any) => useParamsPaginated(params),
      dataKey: null,
      queryKeyBase: 'params',
      mapper: (item: Param) => ({
        id: item.PARAM_CODE,
        code: item.PARAM_CODE,
        libelle: item.PARAM_LIB,
        commentaire: item.PARAM_COMMENT,
        valeur: item.PARAM_VALEUR,
        ...item,
      })
    },
    poste_comptable: {
      hook: usePostesComptables,
      dataKey: null,
      queryKeyBase: 'postes-comptables',
      mapper: (item: any) => ({
        id: item.PC_CODE,
        code: item.PC_CODE,
        libelle: item.PC_LIB,
        typePcNum: item.TYPE_PC_NUM,
        situationGeographique: item.PC_SITGEO,
        ville: item.PC_VILLE,
        remarque: item.PC_REM,
        ...item,
      })
    },
    statut_creance: {
      hook: useStatutsCreance,
      dataKey: null,
      queryKeyBase: 'statuts-creance',
      mapper: (item: any) => ({ id: item.STAT_CODE, code: item.STAT_CODE, libelle: item.STAT_LIB, ...item })
    },
    statut_salarie: {
      hook: useStatutsSalarie,
      dataKey: null,
      queryKeyBase: 'status-salaries',
      mapper: (item: any) => ({ id: item.STATSAL_CODE, code: item.STATSAL_CODE, libelle: item.STATSAL_LIB, ...item })
    }
    }
    return configs[type] || null
  },

  getServiceUpdate: (type: string) => {
    switch (type) {
      case 'banque':
        return import('@/services/banque.service').then(m => (apiClient: any, code: string, data: any) => m.BanqueService.update(apiClient, code, data))
      case 'agence_de_banque':
        return import('@/services/agence-banque.service').then(m => (apiClient: any, _code: string, data: any) => {
          // Route backend: PUT /banque-agences/{bqCode}/{bqagLib}
          return m.AgenceBanqueService.updateByComposite(apiClient, data?.BQ_CODE, data?.BQAG_LIB, data)
        })
      case 'classe':
        return import('@/services/classe.service').then(m => m.ClasseService.update)
      case 'categorie_debiteur':
        return import('@/services/categorie-debiteur.service').then(m => (apiClient: any, code: string, data: any) =>
          m.CategorieDebiteurService.update(apiClient, code, data)
        )
      case 'civilite':
        return import('@/services/civilite.service').then(m => m.CiviliteService.update)
      case 'nationalite':
        return import('@/services/nationalite.service').then(m => m.NationaliteService.update)
      case 'profession':
        return import('@/services/profession.service').then(m => m.ProfessionService.update)
      case 'quartier':
        return import('@/services/quartier.service').then(m => m.QuartierService.update)
      case 'ville':
        return import('@/services/ville.service').then(m => m.VilleService.update)
      case 'zone':
        return import('@/services/zone.service').then(m => m.ZoneService.update)
      case 'type_operation':
        return import('@/services/type-operation.service').then(m => m.TypeOperationService.update)
      case 'type_acte':
        return import('@/services/type-acte.service').then(m => m.TypeActeService.update)
      case 'type_auxiliaire':
        return import('@/services/type-auxiliaire.service').then(m => m.TypeAuxiliaireService.update)
      case 'type_debiteur':
        return import('@/services/type-debiteur.service').then(m => m.TypeDebiteurService.update)
      case 'mode_paiement':
        return import('@/services/mode-paiement.service').then(m => m.ModePaiementService.update)
      case 'type_charge':
        return import('@/services/type-charge.service').then(m => (apiClient: any, code: string, data: any) => m.TypeChargeService.update(apiClient, code, data))
      case 'type_contrat':
        return import('@/services/type-contrat.service').then(m => (apiClient: any, code: string, data: any) => m.TypeContratService.update(apiClient, code, data))
      case 'type_compte':
        return import('@/services/type-compte.service').then(m => (apiClient: any, code: string, data: any) => m.TypeCompteService.update(apiClient, code, data))
      case 'type_domiciliation':
        return import('@/services/type-domiciliation.service').then(m => (apiClient: any, code: string, data: any) => m.TypeDomiciliationService.update(apiClient, code, data))
      case 'type_echeancier':
        return import('@/services/type-echeancier.service').then(m => (apiClient: any, code: string, data: any) => m.TypeEcheancierService.update(apiClient, code, data))
      case 'type_effet':
        return import('@/services/type-effet.service').then(m => (apiClient: any, code: string, data: any) => m.TypeEffetService.update(apiClient, code, data))
      case 'type_employeur':
        return import('@/services/type-employeur.service').then(m => (apiClient: any, code: string, data: any) => m.TypeEmployeurService.update(apiClient, code, data))
      case 'type_frais':
        return import('@/services/type-frais.service').then(m => (apiClient: any, code: string, data: any) => m.TypeFraisService.update(apiClient, code, data))
      case 'type_logement':
        return import('@/services/type-logement.service').then(m => (apiClient: any, code: string, data: any) => m.TypeLogementService.update(apiClient, code, data))
      case 'type_ovp':
        return import('@/services/type-ovp.service').then(m => (apiClient: any, code: string, data: any) => m.TypeOvpService.update(apiClient, code, data))
      case 'type_piece':
        return import('@/services/type-piece.service').then(m => (apiClient: any, code: string, data: any) => m.TypePieceService.update(apiClient, code, data))
      case 'type_regularisation':
        return import('@/services/type-regularisation.service').then(m => (apiClient: any, code: string, data: any) => m.TypeRegularisationService.update(apiClient, code, data))
      case 'type_saisie':
        return import('@/services/type-saisie.service').then(m => (apiClient: any, code: string, data: any) => m.TypeSaisieService.update(apiClient, code, data))
      case 'type_garantie_personnelle':
        return import('@/services/type-garantie-personnelle.service').then(m => (apiClient: any, code: string, data: any) => m.TypeGarantiePersonnelleService.update(apiClient, code, data))
      case 'type_garantie_reelle':
        return import('@/services/type-garantie-reelle.service').then(m => (apiClient: any, code: string, data: any) => m.TypeGarantieReelleService.update(apiClient, code, data))
      case 'compte_operation':
        return import('@/services/compte-operation.service').then(m => m.CompteOperationService.update)
      case 'entite':
        return import('@/services/entite.service').then(m => m.EntiteService.update)
      case 'etape':
        return import('@/services/etape.service').then(m => m.EtapeService.update)
      case 'exercice':
        return import('@/services/exercice.service').then(m => m.ExerciceService.update)
      case 'fonction':
        return import('@/services/fonction.service').then(m => m.FonctionService.update)
      case 'groupe_creance':
        return import('@/services/groupe-creance.service').then(m => m.GroupeCreanceService.update)
      case 'journal':
        return import('@/services/journal.service').then(m => m.JournalService.update)
      case 'message':
        return import('@/services/message.service').then(m => m.MessageService.update)
      case 'mode_acquisition':
        return import('@/services/mode-acquisition.service').then(m => m.ModeAcquisitionService.update)
      case 'objet_creance':
        return import('@/services/objet-creance.service').then(m => m.ObjetCreanceService.update)
      case 'operation':
        return import('@/services/operation.service').then(m => m.OperationService.update)
      case 'periodicite':
        return import('@/services/periodicite.service').then(m => m.PeriodiciteService.update)
      case 'param':
        return import('@/services/param.service').then(m => m.ParamService.update)
      case 'statut_creance':
        return import('@/services/statut-creance.service').then(m => m.StatutCreanceService.update)
      case 'statut_salarie':
        return import('@/services/statut-salarie.service').then(m => m.StatutSalarieService.update)
      case 'poste_comptable':
        return import('@/services/poste-comptable.service').then(m => m.PosteComptableService.update)
      default:
        return Promise.resolve(null)
    }
  },

  getServiceCreate: (type: string) => {
    switch (type) {
      case 'banque':
        return import('@/services/banque.service').then(m => (apiClient: any, data: any) => m.BanqueService.create(apiClient, data))
      case 'agence_de_banque':
        return import('@/services/agence-banque.service').then(m => (apiClient: any, data: any) => m.AgenceBanqueService.create(apiClient, data))
      case 'classe':
        return import('@/services/classe.service').then(m => m.ClasseService.create)
      case 'categorie_debiteur':
        return import('@/services/categorie-debiteur.service').then(m => (apiClient: any, data: any) =>
          m.CategorieDebiteurService.create(apiClient, data)
        )
      case 'civilite':
        return import('@/services/civilite.service').then(m => m.CiviliteService.create)
      case 'nationalite':
        return import('@/services/nationalite.service').then(m => m.NationaliteService.create)
      case 'profession':
        return import('@/services/profession.service').then(m => m.ProfessionService.create)
      case 'quartier':
        return import('@/services/quartier.service').then(m => m.QuartierService.create)
      case 'ville':
        return import('@/services/ville.service').then(m => m.VilleService.create)
      case 'zone':
        return import('@/services/zone.service').then(m => m.ZoneService.create)
      case 'type_operation':
        return import('@/services/type-operation.service').then(m => m.TypeOperationService.create)
      case 'type_acte':
        return import('@/services/type-acte.service').then(m => m.TypeActeService.create)
      case 'type_auxiliaire':
        return import('@/services/type-auxiliaire.service').then(m => m.TypeAuxiliaireService.create)
      case 'type_debiteur':
        return import('@/services/type-debiteur.service').then(m => m.TypeDebiteurService.create)
      case 'mode_paiement':
        return import('@/services/mode-paiement.service').then(m => m.ModePaiementService.create)
      case 'type_charge':
        return import('@/services/type-charge.service').then(m => (apiClient: any, data: any) => m.TypeChargeService.create(apiClient, data))
      case 'type_contrat':
        return import('@/services/type-contrat.service').then(m => (apiClient: any, data: any) => m.TypeContratService.create(apiClient, data))
      case 'type_compte':
        return import('@/services/type-compte.service').then(m => (apiClient: any, data: any) => m.TypeCompteService.create(apiClient, data))
      case 'type_domiciliation':
        return import('@/services/type-domiciliation.service').then(m => (apiClient: any, data: any) => m.TypeDomiciliationService.create(apiClient, data))
      case 'type_echeancier':
        return import('@/services/type-echeancier.service').then(m => (apiClient: any, data: any) => m.TypeEcheancierService.create(apiClient, data))
      case 'type_effet':
        return import('@/services/type-effet.service').then(m => (apiClient: any, data: any) => m.TypeEffetService.create(apiClient, data))
      case 'type_employeur':
        return import('@/services/type-employeur.service').then(m => (apiClient: any, data: any) => m.TypeEmployeurService.create(apiClient, data))
      case 'type_frais':
        return import('@/services/type-frais.service').then(m => (apiClient: any, data: any) => m.TypeFraisService.create(apiClient, data))
      case 'type_logement':
        return import('@/services/type-logement.service').then(m => (apiClient: any, data: any) => m.TypeLogementService.create(apiClient, data))
      case 'type_ovp':
        return import('@/services/type-ovp.service').then(m => (apiClient: any, data: any) => m.TypeOvpService.create(apiClient, data))
      case 'type_piece':
        return import('@/services/type-piece.service').then(m => (apiClient: any, data: any) => m.TypePieceService.create(apiClient, data))
      case 'type_regularisation':
        return import('@/services/type-regularisation.service').then(m => (apiClient: any, data: any) => m.TypeRegularisationService.create(apiClient, data))
      case 'type_saisie':
        return import('@/services/type-saisie.service').then(m => (apiClient: any, data: any) => m.TypeSaisieService.create(apiClient, data))
      case 'type_garantie_personnelle':
        return import('@/services/type-garantie-personnelle.service').then(m => (apiClient: any, data: any) => m.TypeGarantiePersonnelleService.create(apiClient, data))
      case 'type_garantie_reelle':
        return import('@/services/type-garantie-reelle.service').then(m => (apiClient: any, data: any) => m.TypeGarantieReelleService.create(apiClient, data))
      case 'compte_operation':
        return import('@/services/compte-operation.service').then(m => m.CompteOperationService.create)
      case 'entite':
        return import('@/services/entite.service').then(m => m.EntiteService.create)
      case 'etape':
        return import('@/services/etape.service').then(m => m.EtapeService.create)
      case 'exercice':
        return import('@/services/exercice.service').then(m => m.ExerciceService.create)
      case 'fonction':
        return import('@/services/fonction.service').then(m => m.FonctionService.create)
      case 'groupe_creance':
        return import('@/services/groupe-creance.service').then(m => m.GroupeCreanceService.create)
      case 'journal':
        return import('@/services/journal.service').then(m => m.JournalService.create)
      case 'message':
        return import('@/services/message.service').then(m => m.MessageService.create)
      case 'mode_acquisition':
        return import('@/services/mode-acquisition.service').then(m => m.ModeAcquisitionService.create)
      case 'objet_creance':
        return import('@/services/objet-creance.service').then(m => m.ObjetCreanceService.create)
      case 'operation':
        return import('@/services/operation.service').then(m => m.OperationService.create)
      case 'periodicite':
        return import('@/services/periodicite.service').then(m => m.PeriodiciteService.create)
      case 'param':
        return import('@/services/param.service').then(m => m.ParamService.create)
      case 'statut_creance':
        return import('@/services/statut-creance.service').then(m => m.StatutCreanceService.create)
      case 'statut_salarie':
        return import('@/services/statut-salarie.service').then(m => m.StatutSalarieService.create)
      case 'poste_comptable':
        return import('@/services/poste-comptable.service').then(m => m.PosteComptableService.create)
      default:
        return Promise.resolve(null)
    }
  },

  getServiceDelete: (type: string) => {
    switch (type) {
      case 'banque':
        return import('@/services/banque.service').then(m => m.BanqueService.delete)
      case 'agence_de_banque':
        return import('@/services/agence-banque.service').then(m => m.AgenceBanqueService.delete)
      case 'classe':
        return import('@/services/classe.service').then(m => m.ClasseService.delete)
      case 'categorie_debiteur':
        return import('@/services/categorie-debiteur.service').then(m => (apiClient: any, code: string) =>
          m.CategorieDebiteurService.delete(apiClient, code)
        )
      case 'civilite':
        return import('@/services/civilite.service').then(m => m.CiviliteService.delete)
      case 'nationalite':
        return import('@/services/nationalite.service').then(m => m.NationaliteService.delete)
      case 'profession':
        return import('@/services/profession.service').then(m => m.ProfessionService.delete)
      case 'quartier':
        return import('@/services/quartier.service').then(m => m.QuartierService.delete)
      case 'ville':
        return import('@/services/ville.service').then(m => m.VilleService.delete)
      case 'zone':
        return import('@/services/zone.service').then(m => m.ZoneService.delete)
      case 'type_operation':
        return import('@/services/type-operation.service').then(m => m.TypeOperationService.delete)
      case 'type_acte':
        return import('@/services/type-acte.service').then(m => m.TypeActeService.delete)
      case 'type_auxiliaire':
        return import('@/services/type-auxiliaire.service').then(m => m.TypeAuxiliaireService.delete)
      case 'type_debiteur':
        return import('@/services/type-debiteur.service').then(m => m.TypeDebiteurService.delete)
      case 'mode_paiement':
        return import('@/services/mode-paiement.service').then(m => m.ModePaiementService.delete)
      case 'type_charge':
        return import('@/services/type-charge.service').then(m => (apiClient: any, code: string) => m.TypeChargeService.delete(apiClient, code))
      case 'type_contrat':
        return import('@/services/type-contrat.service').then(m => (apiClient: any, code: string) => m.TypeContratService.delete(apiClient, code))
      case 'type_compte':
        return import('@/services/type-compte.service').then(m => (apiClient: any, code: string) => m.TypeCompteService.delete(apiClient, code))
      case 'type_domiciliation':
        return import('@/services/type-domiciliation.service').then(m => (apiClient: any, code: string) => m.TypeDomiciliationService.delete(apiClient, code))
      case 'type_echeancier':
        return import('@/services/type-echeancier.service').then(m => (apiClient: any, code: string) => m.TypeEcheancierService.delete(apiClient, code))
      case 'type_effet':
        return import('@/services/type-effet.service').then(m => (apiClient: any, code: string) => m.TypeEffetService.delete(apiClient, code))
      case 'type_employeur':
        return import('@/services/type-employeur.service').then(m => (apiClient: any, code: string) => m.TypeEmployeurService.delete(apiClient, code))
      case 'type_frais':
        return import('@/services/type-frais.service').then(m => (apiClient: any, code: string) => m.TypeFraisService.delete(apiClient, code))
      case 'type_logement':
        return import('@/services/type-logement.service').then(m => (apiClient: any, code: string) => m.TypeLogementService.delete(apiClient, code))
      case 'type_ovp':
        return import('@/services/type-ovp.service').then(m => (apiClient: any, code: string) => m.TypeOvpService.delete(apiClient, code))
      case 'type_piece':
        return import('@/services/type-piece.service').then(m => (apiClient: any, code: string) => m.TypePieceService.delete(apiClient, code))
      case 'type_regularisation':
        return import('@/services/type-regularisation.service').then(m => (apiClient: any, code: string) => m.TypeRegularisationService.delete(apiClient, code))
      case 'type_saisie':
        return import('@/services/type-saisie.service').then(m => (apiClient: any, code: string) => m.TypeSaisieService.delete(apiClient, code))
      case 'type_garantie_personnelle':
        return import('@/services/type-garantie-personnelle.service').then(m => (apiClient: any, code: string) => m.TypeGarantiePersonnelleService.delete(apiClient, code))
      case 'type_garantie_reelle':
        return import('@/services/type-garantie-reelle.service').then(m => (apiClient: any, code: string) => m.TypeGarantieReelleService.delete(apiClient, code))
      case 'compte_operation':
        return import('@/services/compte-operation.service').then(m => m.CompteOperationService.delete)
      case 'entite':
        return import('@/services/entite.service').then(m => m.EntiteService.delete)
      case 'etape':
        return import('@/services/etape.service').then(m => m.EtapeService.delete)
      case 'exercice':
        return import('@/services/exercice.service').then(m => m.ExerciceService.delete)
      case 'fonction':
        return import('@/services/fonction.service').then(m => m.FonctionService.delete)
      case 'groupe_creance':
        return import('@/services/groupe-creance.service').then(m => m.GroupeCreanceService.delete)
      case 'journal':
        return import('@/services/journal.service').then(m => m.JournalService.delete)
      case 'message':
        return import('@/services/message.service').then(m => m.MessageService.delete)
      case 'mode_acquisition':
        return import('@/services/mode-acquisition.service').then(m => m.ModeAcquisitionService.delete)
      case 'objet_creance':
        return import('@/services/objet-creance.service').then(m => m.ObjetCreanceService.delete)
      case 'operation':
        return import('@/services/operation.service').then(m => m.OperationService.delete)
      case 'periodicite':
        return import('@/services/periodicite.service').then(m => m.PeriodiciteService.delete)
      case 'param':
        return import('@/services/param.service').then(m => m.ParamService.delete)
      case 'statut_creance':
        return import('@/services/statut-creance.service').then(m => m.StatutCreanceService.delete)
      case 'statut_salarie':
        return import('@/services/statut-salarie.service').then(m => m.StatutSalarieService.delete)
      case 'poste_comptable':
        return import('@/services/poste-comptable.service').then(m => m.PosteComptableService.delete)
      default:
        return Promise.resolve(null)
    }
  },
}
  