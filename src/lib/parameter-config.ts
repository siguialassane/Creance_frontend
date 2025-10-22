import { useAgencesBanque, useAgencesBanquePaginated } from "@/hooks/useAgencesBanque";
import { useCategoriesDebiteur } from "@/hooks/useCategoriesDebiteur";
import { useBanques } from "@/hooks/useBanques";
import { useClasses } from "@/hooks/useClasses";
import { useCivilites } from "@/hooks/useCivilites";
import { useNationalites } from "@/hooks/useNationalites";
import { useProfessions } from "@/hooks/useProfessions";
import { useQuartiers } from "@/hooks/useQuartiers";
import { useVilles } from "@/hooks/useVilles";
import { useZones } from "@/hooks/useZones";
import { useTypesOperation } from "@/hooks/useTypesOperation";
import { useTypesActe } from "@/hooks/useTypesActe";
import { useTypesAuxiliaire } from "@/hooks/useTypesAuxiliaire";
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
      default:
        return 'any'
    }
  },

  // Configuration des paramètres supportés
  getConfig: (type: string) => {
    const configs: Record<string, any> = {
    banque: {
      hook: useBanques,
      dataKey: "content", // Les données sont déjà extraites dans le hook
      mapper: (item: Banque) => ({
        id: item.BQ_CODE,
        code: item.BQ_CODE,
        libelle: item.BQ_LIB,
      })
    },
    agence_de_banque: {
      hook: useAgencesBanquePaginated,
      dataKey: "content", // Les données sont déjà extraites dans le hook
      mapper: (item: AgenceBanque) => ({
        id: item.BQAG_NUM,
        code: item.BQAG_NUM,
        banqueCode: item.BQ_CODE,
        libelle: item.BQAG_LIB,
      })
    },
    classe: {
      hook: useClasses,
      dataKey: null, // Les données sont déjà extraites dans le hook
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
      mapper: (item: Nationalite) => ({ id: item.NAT_CODE, code: item.NAT_CODE, libelle: item.NAT_LIB })
    },
    profession: {
      hook: useProfessions,
      dataKey: null,
      mapper: (item: Profession) => ({ id: item.PROF_CODE, code: item.PROF_CODE, libelle: item.PROF_LIB })
    },
    quartier: {
      hook: useQuartiers,
      dataKey: null,
      mapper: (item: Quartier) => ({ id: item.Q_CODE, code: item.Q_CODE, libelle: item.Q_LIB })
    },
    ville: {
      hook: useVilles,
      dataKey: null,
      mapper: (item: Ville) => ({ id: item.V_CODE, code: item.V_CODE, libelle: item.V_LIB })
    },
    zone: {
      hook: useZones,
      dataKey: null,
      mapper: (item: Zone) => ({ id: item.ZONE_CODE, code: item.ZONE_CODE, libelle: item.ZONE_LIB })
    },
    type_operation: {
      hook: useTypesOperation,
      dataKey: null,
      mapper: (item: any) => ({ id: item.TYPOPER_CODE, code: item.TYPOPER_CODE, libelle: item.TYPOPER_LIB })
    },
    type_acte: {
      hook: useTypesActe,
      dataKey: null,
      mapper: (item: any) => ({ id: item.TYPACTE_CODE, code: item.TYPACTE_CODE, libelle: item.TYPACTE_LIB })
    },
    type_auxiliaire: {
      hook: useTypesAuxiliaire,
      dataKey: null,
      mapper: (item: any) => ({ id: item.TYPAUXI_CODE, code: item.TYPAUXI_CODE, libelle: item.TYPAUXI_LIB })
    },
    mode_paiement: {
      hook: useModesPaiement,
      dataKey: null,
      mapper: (item: any) => ({ id: item.TYP_PAIE_CODE, code: item.TYP_PAIE_CODE, libelle: item.TYP_PAIE_LIB })
    },
    type_charge: {
      hook: useTypeCharges,
      dataKey: null,
      mapper: (item: any) => ({ id: item.TYPCHARG_CODE, code: item.TYPCHARG_CODE, libelle: item.TYPCHARG_LIB })
    },
    type_contrat: {
      hook: useTypeContrats,
      dataKey: null,
      mapper: (item: any) => ({ id: item.TYPCONT_CODE, code: item.TYPCONT_CODE, libelle: item.TYPCONT_LIB })
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
      mapper: (item: any) => ({ id: item.TYPECH_CODE, code: item.TYPECH_CODE, libelle: item.TYPECH_LIB })
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
      mapper: (item: any) => ({ id: item.CO_CODE, code: item.CO_CODE, libelle: item.CO_LIB })
    },
    entite: {
      hook: useEntites,
      dataKey: null,
      mapper: (item: any) => ({ id: item.ENTITE_CODE, code: item.ENTITE_CODE, libelle: item.ENTITE_LIB })
    },
    etape: {
      hook: useEtapes,
      dataKey: null,
      mapper: (item: any) => ({ id: item.ETAP_CODE, code: item.ETAP_CODE, libelle: item.ETAP_LIB })
    },
    exercice: {
      hook: useExercices,
      dataKey: null,
      mapper: (item: any) => ({ id: item.EXO_CODE, code: item.EXO_CODE, libelle: item.EXO_LIB })
    },
    fonction: {
      hook: useFonctions,
      dataKey: null,
      mapper: (item: any) => ({ id: item.FON_CODE, code: item.FON_CODE, libelle: item.FON_LIB })
    },
    groupe_creance: {
      hook: useGroupeCreances,
      dataKey: null,
      mapper: (item: any) => ({ id: item.GC_CODE, code: item.GC_CODE, libelle: item.GC_LIB })
    }
    }
    return configs[type] || null
  },

  getServiceUpdate: (type: string) => {
    switch (type) {
      case 'banque':
        return import('@/services/banque.service').then(m => m.BanqueService.update)
      case 'agence_de_banque':
        return import('@/services/agence-banque.service').then(m => m.AgenceBanqueService.update)
      case 'classe':
        return import('@/services/classe.service').then(m => m.ClasseService.update)
      case 'categorie_debiteur':
        return import('@/services/categorie-debiteur.service').then(m => m.CategorieDebiteurService.update)
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
      default:
        return Promise.resolve(null)
    }
  },

  getServiceCreate: (type: string) => {
    switch (type) {
      case 'banque':
        return import('@/services/banque.service').then(m => m.BanqueService.create)
      case 'agence_de_banque':
        return import('@/services/agence-banque.service').then(m => m.AgenceBanqueService.create)
      case 'classe':
        return import('@/services/classe.service').then(m => m.ClasseService.create)
      case 'categorie_debiteur':
        return import('@/services/categorie-debiteur.service').then(m => m.CategorieDebiteurService.create)
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
        return import('@/services/categorie-debiteur.service').then(m => m.CategorieDebiteurService.delete)
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
      default:
        return Promise.resolve(null)
    }
  },
}
  