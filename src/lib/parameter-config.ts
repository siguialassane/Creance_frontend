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
        id: item.CD_CODE,
        code: item.CD_CODE,
        libelle: item.CD_LIB,
      })
    },
    civilite: {
      hook: useCivilites,
      dataKey: null, // Les données sont déjà extraites dans le hook
      mapper: (item: Civilite) => ({
        id: item.CV_CODE,
        code: item.CV_CODE,
        libelle: item.CV_LIB,
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
      mapper: (item: Zone) => ({ id: item.Z_CODE, code: item.Z_CODE, libelle: item.Z_LIB })
    },
    type_operation: {
      hook: useTypesOperation,
      dataKey: null,
      mapper: (item: TypeOperation) => ({ id: item.TOP_CODE, code: item.TOP_CODE, libelle: item.TOP_LIB })
    }
    }
    return configs[type] || null
  },
}
  