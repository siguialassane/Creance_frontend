import { z } from "zod";

/**
 * Schémas de validation Zod pour le formulaire multi-step créance
 * Séparés pour une meilleure maintenabilité et réutilisabilité
 */

// Fonction helper pour obtenir la date du jour au format YYYY-MM-DD
const getToday = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Étape 1: Informations générales - Fusion des anciens step1 et step2
export const step1Schema = z.object({
  debiteur: z.string().min(1, "Le débiteur est obligatoire"),
  groupeCreance: z.string().min(1, "Le groupe créance est obligatoire"),
  objetCreance: z.string().min(1, "L'objet créance est obligatoire"),
  objetDetail: z.string().optional(),
  capitalInitial: z.union([z.number(), z.string(), z.undefined()]).refine(
    (val) => {
      // Le champ est obligatoire, donc undefined/null/chaîne vide ne sont pas acceptés
      if (val === undefined || val === null || val === '') {
        return false;
      }
      return true;
    },
    {
      message: "Le capital initial est obligatoire"
    }
  ).refine(
    (val) => {
      // Vérifier que c'est un nombre valide
      if (val === undefined || val === null || val === '') {
        return false;
      }
      const num = typeof val === 'string' ? parseFloat(val) : val;
      return !isNaN(num);
    },
    {
      message: "Le capital initial doit être un nombre"
    }
  ).refine(
    (val) => {
      // Vérifier que le nombre est supérieur à 0
      if (val === undefined || val === null || val === '') {
        return false;
      }
      const num = typeof val === 'string' ? parseFloat(val) : val;
      return !isNaN(num) && num >= 0.01;
    },
    {
      message: "Le capital initial doit être supérieur à 0"
    }
  ).transform((val) => {
    // Transformer en nombre après validation
    if (val === undefined || val === null || val === '') {
      return 0; // Ne devrait jamais arriver grâce au refine
    }
    const num = typeof val === 'string' ? parseFloat(val) : val;
    return isNaN(num) ? 0 : num;
  }),
  montantDecaisse: z.number().optional(),
  numeroPrecedent: z.string().optional(),
  numeroAncien: z.string().optional(),
  // Champs de l'ancien step2 (Dates et conditions)
  dateDeblocage: z.string().min(1, "La date de déblocage est obligatoire"),
  dateEcheance: z.string().min(1, "La date d'échéance est obligatoire"),
  periodicite: z.string().optional(),
  duree: z.number().optional(),
  tauxInteretConventionnel: z.number().optional(),
  tauxInteretRetard: z.number().optional(),
  ordonnateur: z.string().min(1, "L'ordonnateur est obligatoire"),
  statut: z.enum(['A', 'C', 'S'], {
    message: "Le statut est obligatoire. Valeurs acceptées: A (Actif), C (Clôturé), S (Suspendu)"
  }),
}).refine((data) => {
  // Date de déblocage ne peut pas être supérieure à aujourd'hui
  if (data.dateDeblocage) {
    return data.dateDeblocage <= getToday();
  }
  return true;
}, {
  message: "La date de déblocage ne peut pas être supérieure à aujourd'hui",
  path: ["dateDeblocage"],
}).refine((data) => {
  // Date d'échéance doit être supérieure ou égale à la date de déblocage
  if (data.dateDeblocage && data.dateEcheance) {
    return data.dateEcheance >= data.dateDeblocage;
  }
  return true;
}, {
  message: "La date d'échéance doit être supérieure ou égale à la date de déblocage",
  path: ["dateEcheance"],
});

// Étape 2: Détails financiers (ancien step3)
// Défini après step3Schema ci-dessous

// Étape 3: Détails financiers
export const step3Schema = z.object({
  // Champs saisissables
  montantInteretConventionnel: z.number().optional(),
  commissionBanque: z.union([z.number(), z.string()]).optional().transform((val) => {
    // Accepter string ou number, toujours convertir en number
    if (val === undefined || val === null || val === '') return undefined;
    const num = typeof val === 'string' ? parseFloat(val) : val;
    return isNaN(num) ? undefined : num;
  }),
  montantDu: z.number().optional(),
  montantRembourse: z.union([z.number(), z.string()]).optional().transform((val) => {
    // Accepter string ou number, toujours convertir en number
    if (val === undefined || val === null || val === '') return undefined;
    const num = typeof val === 'string' ? parseFloat(val) : val;
    return isNaN(num) ? undefined : num;
  }), // Montant déjà remboursé (saisi manuellement)
  montantInteretRetard: z.number().optional(),
  frais: z.union([z.number(), z.string()]).optional().transform((val) => {
    // Accepter string ou number, toujours convertir en number
    if (val === undefined || val === null || val === '') return undefined;
    const num = typeof val === 'string' ? parseFloat(val) : val;
    return isNaN(num) ? undefined : num;
  }),
  encours: z.number().optional(),
  // Champs calculés automatiquement (lecture seule, optionnels pour la validation)
  montantARembourser: z.union([z.number(), z.string()]).optional().transform((val) => {
    // Accepter string ou number, toujours convertir en number
    if (val === undefined || val === null || val === '') return undefined;
    const num = typeof val === 'string' ? parseFloat(val) : val;
    return isNaN(num) ? undefined : num;
  }),
  montantImpaye: z.union([z.number(), z.string()]).optional().transform((val) => {
    if (val === undefined || val === null || val === '') return undefined;
    const num = typeof val === 'string' ? parseFloat(val) : val;
    return isNaN(num) ? undefined : num;
  }),
  totalDu: z.union([z.number(), z.string()]).optional().transform((val) => {
    if (val === undefined || val === null || val === '') return undefined;
    const num = typeof val === 'string' ? parseFloat(val) : val;
    return isNaN(num) ? undefined : num;
  }),
  penalite: z.union([z.number(), z.string()]).optional().transform((val) => {
    if (val === undefined || val === null || val === '') return undefined;
    const num = typeof val === 'string' ? parseFloat(val) : val;
    return isNaN(num) ? undefined : num;
  }),
  totalSolde: z.union([z.number(), z.string()]).optional().transform((val) => {
    if (val === undefined || val === null || val === '') return undefined;
    const num = typeof val === 'string' ? parseFloat(val) : val;
    return isNaN(num) ? undefined : num;
  }),
});

// Étape 2: Détails financiers (ancien step3)
export const step2Schema = step3Schema;

// Étape 4: Pièces jointes (optionnel)
export const step4Schema = z.object({
  // Pas de validation stricte pour les pièces car elles sont gérées dynamiquement
  // Le schéma est vide mais existe pour la compatibilité
});

// Étape 5: Garanties
export const step5Schema = z.object({
  typeGarantie: z.string().optional(),
  // Garanties personnelles
  employeur: z.string().optional(),
  statutSal: z.string().optional(),
  quartier: z.string().optional(),
  priorite: z.string().optional(),
  nom: z.string().optional(),
  prenoms: z.string().optional(),
  dateInscription: z.string().optional(),
  fonction: z.string().optional(),
  profession: z.string().optional(),
  adressePostale: z.string().optional(),
  // Garanties réelles
  numeroGarantie: z.string().optional(),
  objetMontant: z.string().optional(),
  libelle: z.string().optional(),
  terrain: z.string().optional(),
  logement: z.string().optional(),
  code: z.string().optional(),
});

/**
 * Obtient le schéma de validation approprié selon l'étape
 */
export function getSchemaForStep(step: number): z.ZodSchema {
  switch (step) {
    case 1:
      return step1Schema; // Informations générales (fusion step1 + step2)
    case 2:
      return step2Schema; // Détails financiers (ancien step3)
    case 3:
      return step3Schema; // Détails financiers (ancien step3)
    case 4:
      return step4Schema; // Pièces jointes
    case 5:
      return step5Schema; // Garanties
    default:
      return z.object({});
  }
}

/**
 * Type inféré pour chaque étape
 */
export type Step1FormData = z.infer<typeof step1Schema>;
export type Step2FormData = z.infer<typeof step2Schema>;
export type Step3FormData = z.infer<typeof step3Schema>;
export type Step4FormData = z.infer<typeof step4Schema>;
export type Step5FormData = z.infer<typeof step5Schema>;

