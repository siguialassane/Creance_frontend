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
  debiteur: z.string().min(1, "Le débiteur est obligatoire"), // DEB_CODE est obligatoire
  groupeCreance: z.string().min(1, "Le groupe créance est obligatoire"), // GRP_CREAN_CODE est obligatoire
  objetCreance: z.string().min(1, "L'objet créance est obligatoire"), // OBJ_CREAN_CODE est obligatoire
  objetDetail: z.string().optional(),
  capitalInitial: z.union([z.number(), z.string(), z.undefined()]).optional(), // CREAN_CAPIT_INIT est NULLABLE = Y
  montantDecaisse: z.number().optional(),
  numeroPrecedent: z.string().optional(),
  numeroAncien: z.string().optional(),
  // Champs de l'ancien step2 (Dates et conditions)
  dateDeblocage: z.string().optional(), // CREAN_DATOCTROI est NULLABLE = Y
  dateEcheance: z.string().optional(), // CREAN_DATECH est NULLABLE = Y
  periodicite: z.string().min(1, "La périodicité est obligatoire"), // PERIOD_CODE est obligatoire
  duree: z.number().optional(),
  tauxInteretConventionnel: z.number().optional(),
  tauxInteretRetard: z.number().optional(),
  ordonnateur: z.string().optional(), // ORDO_CODE est NULLABLE = Y
  statut: z.enum(['A', 'C', 'S']).optional(), // CREAN_STATRECOUV est NULLABLE = Y
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

