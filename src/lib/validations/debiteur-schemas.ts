import { z } from "zod";

/**
 * Schémas de validation Zod pour le formulaire multi-step débiteur
 * Séparés pour une meilleure maintenabilité et réutilisabilité
 */

// Étape 1: Informations générales
export const step1Schema = z.object({
  codeDebiteur: z.string().optional(), // Auto-généré après validation
  categorieDebiteur: z.string().optional(), // NULLABLE = Y dans la base
  adressePostale: z.string().optional(), // NULLABLE = Y dans la base
  email: z
    .string()
    .email("Email invalide (format attendu: exemple@domaine.com)")
    .optional(), // NULLABLE = Y dans la base
  telephone: z.string().optional(),
  numeroCell: z.string().optional(),
  localisation: z.string().optional(),
  typeDebiteur: z.enum(["P", "M", "physique", "moral"], {
    message: "Le type débiteur doit être 'P' (physique) ou 'M' (moral)"
  }),
});

// Étape 2: Personne physique
export const step2PhysiqueSchema = z.object({
  civilite: z.string().optional(), // NULLABLE = Y dans la base
  nom: z.string().optional(), // NULLABLE = Y dans la base
  prenom: z.string().optional(), // NULLABLE = Y dans la base
  dateNaissance: z.string().optional(), // NULLABLE = Y dans la base
  lieuNaissance: z.string().optional(), // NULLABLE = Y dans la base
  quartier: z.string().optional(), // NULLABLE = Y dans la base
  nationalite: z.string().optional(), // NULLABLE = Y dans la base
  fonction: z.string().optional(), // NULLABLE = Y dans la base
  profession: z.string().optional(), // NULLABLE = Y dans la base
  employeur: z.string().optional(), // NULLABLE = Y dans la base
  statutSalarie: z.string().optional(), // NULLABLE = Y dans la base
  matricule: z.string().optional(),
  sexe: z.string().optional(),
  dateDeces: z.string().optional(),
  // Pièce d'identité (optionnel)
  naturePieceIdentite: z.string().optional(),
  numeroPieceIdentite: z.string().optional(),
  dateEtablie: z.string().optional(),
  lieuEtablie: z.string().optional(),
  // Statut matrimonial (optionnel)
  statutMatrimonial: z.string().optional(),
  regimeMariage: z.string().max(1, "Le régime de mariage ne peut pas dépasser 1 caractère").optional(),
  nombreEnfant: z.union([z.number(), z.string().transform((val) => val ? parseInt(val) : undefined)]).optional(),
  // Conjoint (optionnel)
  nomConjoint: z.string().optional(),
  prenomsConjoint: z.string().optional(),
  dateNaissanceConjoint: z.string().optional(),
  adresseConjoint: z.string().max(30, "L'adresse du conjoint ne peut pas dépasser 30 caractères").optional(),
  telConjoint: z.string().optional(),
  numeroPieceConjoint: z.string().optional(),
  // Parents (optionnel)
  nomPere: z.string().optional(),
  prenomsPere: z.string().optional(),
  nomMere: z.string().optional(),
  prenomsMere: z.string().optional(),
  rue: z.string().optional(),
});

// Étape 2: Personne morale
export const step2MoralSchema = z.object({
  registreCommerce: z.string().optional(), // NULLABLE = Y dans la base
  raisonSociale: z.string().optional(), // NULLABLE = Y dans la base
  capitalSocial: z.union([z.number(), z.string().transform((val) => val ? parseFloat(val) : undefined)]).optional(),
  formeJuridique: z.string().optional(), // NULLABLE = Y dans la base
  domaineActivite: z.string().optional(), // NULLABLE = Y dans la base
  siegeSocial: z.string().optional(), // NULLABLE = Y dans la base
  nomGerant: z.string().optional(), // NULLABLE = Y dans la base
});

// Schéma pour une domiciliation individuelle
const domiciliationItemSchema = z.object({
  type: z.string().optional(),
  numBenef: z.string().optional(),
  libelle: z.string().optional(),
  banqueAgence: z.string().optional(),
  banque: z.string().optional(), // Pas utilisé par le backend, seulement pour le filtre UI
  ancAgence: z.string().optional(),
  villeCode: z.string().optional(),
});

// Étape 3: Domiciliations (tableau)
export const step3Schema = z.object({
  domiciliations: z.array(domiciliationItemSchema).optional().default([]),
});

/**
 * Obtient le schéma de validation approprié selon l'étape et le type de débiteur
 */
export function getSchemaForStep(
  step: number,
  typeDebiteur?: string
): z.ZodSchema {
  switch (step) {
    case 1:
      return step1Schema;
    case 2:
      return typeDebiteur === "P" || typeDebiteur === "physique"
        ? step2PhysiqueSchema
        : step2MoralSchema;
    case 3:
      return step3Schema;
    default:
      return z.object({});
  }
}

/**
 * Type inféré pour chaque étape
 */
export type Step1FormData = z.infer<typeof step1Schema>;
export type Step2PhysiqueFormData = z.infer<typeof step2PhysiqueSchema>;
export type Step2MoralFormData = z.infer<typeof step2MoralSchema>;
export type Step3FormData = z.infer<typeof step3Schema>;

