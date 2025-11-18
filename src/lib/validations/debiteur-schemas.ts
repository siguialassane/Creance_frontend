import { z } from "zod";

/**
 * Schémas de validation Zod pour le formulaire multi-step débiteur
 * Séparés pour une meilleure maintenabilité et réutilisabilité
 */

// Étape 1: Informations générales
export const step1Schema = z.object({
  codeDebiteur: z.string().optional(), // Auto-généré après validation
  categorieDebiteur: z.string()
    .min(1, "La catégorie débiteur est requise")
    .max(3, "La catégorie débiteur ne peut pas dépasser 3 caractères"),
  adressePostale: z.string().min(1, "L'adresse postale est requise"),
  email: z
    .string()
    .min(1, "L'email est requis")
    .email("Email invalide (format attendu: exemple@domaine.com)"),
  telephone: z.string().optional(),
  numeroCell: z.string().optional(),
  typeDebiteur: z.enum(["P", "M", "physique", "moral"], {
    errorMap: () => ({ message: "Le type débiteur doit être 'P' (physique) ou 'M' (moral)" })
  }),
});

// Étape 2: Personne physique
export const step2PhysiqueSchema = z.object({
  civilite: z.string().min(1, "La civilité est requise"),
  nom: z.string().min(1, "Le nom est requis"),
  prenom: z.string().min(1, "Le prénom est requis"),
  dateNaissance: z.string().min(1, "La date de naissance est requise"),
  lieuNaissance: z.string().min(1, "Le lieu de naissance est requis"),
  quartier: z.string().min(1, "Le quartier est requis"),
  nationalite: z.string().min(1, "La nationalité est requise"),
  fonction: z.string().min(1, "La fonction est requise"),
  profession: z.string().min(1, "La profession est requise"),
  employeur: z.string().min(1, "L'employeur est requis"),
  statutSalarie: z.string().min(1, "Le statut salarié est requis"),
  matricule: z.string().optional(),
  sexe: z.string().min(1, "Le sexe est requis"),
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
  registreCommerce: z.string()
    .min(1, "Le registre de commerce est requis")
    .max(15, "Le registre de commerce ne peut pas dépasser 15 caractères"),
  raisonSociale: z.string().min(1, "La raison sociale est requise"),
  capitalSocial: z.union([z.number(), z.string().transform((val) => val ? parseFloat(val) : undefined)]).optional(),
  formeJuridique: z.string().min(1, "La forme juridique est requise"),
  domaineActivite: z.string().min(1, "Le domaine d'activité est requis"),
  siegeSocial: z.string().min(1, "Le siège social est requis"),
  nomGerant: z.string().min(1, "Le nom du gérant est requis"),
});

// Schéma pour une domiciliation individuelle
const domiciliationItemSchema = z.object({
  type: z.string().optional(),
  numeroCompte: z.string().optional(), // Optionnel selon l'exemple
  libelle: z.string().optional(),
  banqueAgence: z.string().optional(),
  banque: z.string().optional(), // Pas utilisé par le backend, seulement pour le filtre UI
}).refine(
  (data) => {
    // Si la domiciliation est partiellement remplie, au moins type et banqueAgence doivent être présents
    // Sinon, on considère la domiciliation comme vide et on l'ignore
    const hasAnyValue = data.type || data.numeroCompte || data.libelle || data.banqueAgence;
    if (hasAnyValue) {
      // Si on commence à remplir, alors type et banqueAgence sont requis
      return !!(data.type && data.type.trim() !== "" && data.banqueAgence && data.banqueAgence.trim() !== "");
    }
    return true; // Si tout est vide, on ignore cette domiciliation
  },
  {
    message: "Le type et l'agence de banque sont requis pour une domiciliation",
    path: ["banqueAgence"],
  }
);

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

