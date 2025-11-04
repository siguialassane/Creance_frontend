"use client"

import { useState, useEffect, useCallback, forwardRef, useImperativeHandle, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

// Import des composants shadcn/ui
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

// Import des hooks pour les données de sélection
import { useStaticData } from "@/hooks/useStaticData";
import { useFonctions } from "@/hooks/useFonctions";
import { useProfessions } from "@/hooks/useProfessions";
import { useStatutsSalarie } from "@/hooks/useStatutsSalarie";
import { useAgencesBanque } from "@/hooks/useAgencesBanque";
import { useEntites } from "@/hooks/useEntites";
import { useTypesDomicil } from "@/hooks/useTypesDomicil";
import { useUtilisateurs } from "@/hooks/useUtilisateurs";

// Schémas de validation pour chaque étape
const step1Schema = z.object({
  codeDebiteur: z.string().optional(), // Auto-généré après validation
  categorieDebiteur: z.string().min(1, "La catégorie débiteur est requise"),
  adressePostale: z.string().min(1, "L'adresse postale est requise"),
  email: z.string()
    .min(1, "L'email est requis")
    .email("Email invalide (format attendu: exemple@domaine.com)"),
  telephone: z.string().optional(),
  numeroCell: z.string().optional(),
  typeDebiteur: z.string().min(1, "Le type débiteur est requis"),
});

const step2PhysiqueSchema = z.object({
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
  naturePieceIdentite: z.string().optional(),
  numeroPieceIdentite: z.string().optional(),
  dateEtablie: z.string().optional(),
  lieuEtablie: z.string().optional(),
  statutMatrimonial: z.string().optional(),
  regimeMariage: z.string().optional(),
  nombreEnfant: z.string().optional(),
  nomConjoint: z.string().optional(),
  prenomsConjoint: z.string().optional(),
  dateNaissanceConjoint: z.string().optional(),
  adresseConjoint: z.string().optional(),
  telConjoint: z.string().optional(),
  numeroPieceConjoint: z.string().optional(),
  nomPere: z.string().optional(),
  prenomsPere: z.string().optional(),
  nomMere: z.string().optional(),
  prenomsMere: z.string().optional(),
  rue: z.string().optional(),
});

const step2MoralSchema = z.object({
  registreCommerce: z.string().min(1, "Le registre de commerce est requis"),
  raisonSociale: z.string().min(1, "La raison sociale est requise"),
  capitalSocial: z.string().optional(),
  formeJuridique: z.string().min(1, "La forme juridique est requise"),
  domaineActivite: z.string().min(1, "Le domaine d'activité est requis"),
  siegeSocial: z.string().min(1, "Le siège social est requis"),
  nomGerant: z.string().min(1, "Le nom du gérant est requis"),
});

const step3Schema = z.object({
  type: z.string().min(1, "Le type de domiciliation est requis"),
  numeroCompte: z.string().min(1, "Le numéro du compte est requis"),
  libelle: z.string().min(1, "Le libellé est requis"),
  banqueAgence: z.string().min(1, "L'agence de banque est requise"),
  banque: z.string().min(1, "La banque est requise"),
});

interface DebiteurFormProps {
  currentStep: number;
  formData: any;
  onDataChange: (data: any) => void;
  onSubmit: (data: any) => void;
  isEditMode?: boolean;
  readOnly?: boolean;
}

const DebiteurForm = forwardRef<any, DebiteurFormProps>(({ currentStep, formData, onDataChange, onSubmit, isEditMode = false, readOnly = false }, ref) => {
  const [stepData, setStepData] = useState({});
  const [typeDebiteur, setTypeDebiteur] = useState<string>(formData?.typeDebiteur || '');
  const typeDebiteurRef = useRef<string>(formData?.typeDebiteur || '');
  const prevStepRef = useRef<number>(currentStep);
  const formDataRef = useRef(formData);
  formDataRef.current = formData;

  // Utilisation du hook de données statiques (chargement unique)
  const {
    quartiers,
    nationalites,
    banques,
    civilites,
    typesDebiteur,
    categoriesDebiteur,
    loadingQuartiers,
    loadingNationalites,
    loadingBanques,
    loadingCivilites,
    loadingTypesDebiteur,
    loadingCategoriesDebiteur,
    reloadQuartiers,
    reloadNationalites,
    reloadBanques,
    reloadCivilites,
    reloadTypesDebiteur,
    reloadCategoriesDebiteur,
  } = useStaticData({ autoLoad: false });

  const hasReachedStep2 = currentStep >= 2;
  const hasReachedStep3 = currentStep >= 3;

  // Hooks pour les autres données (chargées uniquement pour l'étape courante)
  const { data: fonctions, isLoading: loadingFonctions } = useFonctions({ enabled: currentStep === 2 });
  const { data: professions, isLoading: loadingProfessions } = useProfessions({ enabled: currentStep === 2 });
  const { data: statutsSalarie, isLoading: loadingStatutsSalarie } = useStatutsSalarie({ enabled: currentStep === 2 });
  const { data: agencesBanque, isLoading: loadingAgencesBanque } = useAgencesBanque({ enabled: currentStep === 3 });
  const { data: entites, isLoading: loadingEntites } = useEntites({ enabled: currentStep === 2 });
  const { data: typesDomicil, isLoading: loadingTypesDomicil } = useTypesDomicil({ enabled: currentStep === 3 });
  const { data: utilisateurs, isLoading: loadingUtilisateurs } = useUtilisateurs({ enabled: currentStep === 3 });

  // Logs pour déboguer les listes déroulantes
  useEffect(() => {
    console.log('🎯 [debiteur-form] Fonctions reçues:', { fonctions, loadingFonctions, count: Array.isArray(fonctions) ? fonctions.length : 'N/A' });
  }, [fonctions, loadingFonctions]);

  useEffect(() => {
    console.log('🎯 [debiteur-form] Entités reçues:', { entites, loadingEntites, count: Array.isArray(entites) ? entites.length : 'N/A' });
  }, [entites, loadingEntites]);

  const getSchemaForStep = useCallback((step: number) => {
    switch (step) {
      case 1: return step1Schema;
      case 2: return (typeDebiteurRef.current === 'P' || typeDebiteurRef.current === 'physique') ? step2PhysiqueSchema : step2MoralSchema;
      case 3: return step3Schema;
      default: return z.object({});
    }
  }, []);

  const { control, handleSubmit, formState: { errors }, watch, setValue, reset, trigger, getValues } = useForm({
    resolver: zodResolver(getSchemaForStep(currentStep)),
    defaultValues: formData
  });

  // Utiliser useRef pour éviter la boucle infinie
  const onDataChangeRef = useRef(onDataChange);
  onDataChangeRef.current = onDataChange;

  const resetRef = useRef(reset);
  resetRef.current = reset;

  // Souscription aux changements du formulaire
  useEffect(() => {
    const subscription = watch((value) => {
      setStepData(value as any);
      onDataChangeRef.current(value);

      // Mettre à jour le type débiteur pour l'affichage conditionnel
      if (value.typeDebiteur && value.typeDebiteur !== typeDebiteurRef.current) {
        typeDebiteurRef.current = value.typeDebiteur;
        setTypeDebiteur(value.typeDebiteur);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    if (currentStep >= 1) {
      void reloadTypesDebiteur();
      void reloadCategoriesDebiteur();
    }
  }, [currentStep, reloadCategoriesDebiteur, reloadTypesDebiteur]);

  useEffect(() => {
    if (currentStep >= 2) {
      void reloadCivilites();
      void reloadQuartiers();
      void reloadNationalites();
    }
  }, [currentStep, reloadCivilites, reloadQuartiers, reloadNationalites]);

  useEffect(() => {
    if (currentStep >= 3) {
      void reloadBanques();
    }
  }, [currentStep, reloadBanques]);

  // Synchroniser les valeurs du formulaire avec formData UNIQUEMENT au chargement initial
  useEffect(() => {
    if (formData && Object.keys(formData).length > 0) {
      // Utiliser reset avec les données de formData pour initialiser le formulaire
      reset(formData);

      // Mettre à jour le type de débiteur
      if (formData.typeDebiteur) {
        typeDebiteurRef.current = formData.typeDebiteur;
        setTypeDebiteur(formData.typeDebiteur);
      }
    }
  }, []); // Exécuter uniquement au montage initial

  // Mettre à jour prevStepRef quand currentStep change (pour le tracking seulement)
  useEffect(() => {
    prevStepRef.current = currentStep;
  }, [currentStep]);

  // Exposer la méthode de validation au composant parent
  useImperativeHandle(ref, () => ({
    validateStep: async () => {
      const isValid = await trigger();
      return isValid;
    }
  }));


  // Styles unifiés
  const primaryGreen = '#28A325'
  const primaryGreenHover = '#047857'
  const borderGray = '#d1d5db'
  const dividerGray = '#e2e8f0'
  const titleColor = '#1a202c'
  const labelColor = '#374151'
  const errorRed = '#ef4444'
  const errorBg = '#fef2f2'

  const getFieldClassName = (hasError?: boolean) => {
    const baseClasses = "w-full rounded-md border px-3 py-2 text-sm";
    const errorClasses = hasError ? "border-red-500 bg-red-50" : "border-gray-300";
    const readOnlyClasses = readOnly ? "bg-gray-100 text-gray-700" : "bg-white";
    const focusClasses = "focus:outline-none focus:ring-2 focus:ring-[#28A325] focus:border-transparent";
    return `${baseClasses} ${errorClasses} ${readOnlyClasses} ${focusClasses}`;
  }

  const getSelectClassName = () => {
    return "w-full rounded-md border border-[#28A325] bg-gray-100 text-gray-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#28A325] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed";
  }

  // Fonction helper pour obtenir le libellé d'une option à partir de son ID
  const getCategorieLibelle = (id: string) => {
    if (!id) return '';
    if (!categoriesDebiteur || !Array.isArray(categoriesDebiteur)) return id;
    const categorie: any = categoriesDebiteur.find((c: any) => c.CATEG_DEB_CODE === id || c.id === id || c.code === id);
    return categorie?.CATEG_DEB_LIB || categorie?.libelle || id;
  }

  const getNationaliteLibelle = (code: string) => {
    if (!code) return '';
    if (!nationalites || !Array.isArray(nationalites)) return code;
    const nat: any = nationalites.find((n: any) => n.NAT_CODE === code || n.code === code || n.id === code);
    return nat?.NAT_LIB || nat?.libelle || code;
  }

  const getQuartierLibelle = (code: string) => {
    if (!code) return '';
    if (!quartiers || !Array.isArray(quartiers)) return code;
    const quartier: any = quartiers.find((q: any) => q.QUART_CODE === code || q.code === code || q.id === code);
    return quartier?.QUART_LIB || quartier?.libelle || code;
  }

  const getFonctionLibelle = (id: string) => {
    if (!id) return '';
    if (!fonctions || !Array.isArray(fonctions)) return id;
    const fonction: any = fonctions.find((f: any) => f.FONCT_CODE === id || f.id === id || f.code === id);
    return fonction?.FONCT_LIB || fonction?.libelle || id;
  }

  const getProfessionLibelle = (id: string) => {
    if (!id) return '';
    if (!professions || !Array.isArray(professions)) return id;
    const profession: any = professions.find((p: any) => p.id === id);
    return profession?.libelle || id;
  }

  const getEntiteLibelle = (code: string) => {
    if (!code) return '';
    if (!entites || !Array.isArray(entites)) return code;
    const entite: any = entites.find((e: any) => e.ENT_CODE === code || e.code === code || e.id === code);
    return entite?.ENT_LIB || entite?.libelle || code;
  }

  const getStatutSalarieLibelle = (id: string) => {
    if (!id) return '';
    if (!statutsSalarie || !Array.isArray(statutsSalarie)) return id;
    const statut: any = statutsSalarie.find((s: any) => s.id === id);
    return statut?.libelle || id;
  }

  const getBanqueLibelle = (id: string) => {
    if (!id) return '';

    // Si on a le libellé directement dans formData (mode visualisation), l'utiliser
    if (formData.banqueLibelle) {
      return `${id} - ${formData.banqueLibelle}`;
    }

    // Sinon chercher dans la liste des banques
    if (!banques || !Array.isArray(banques)) return id;
    const banque: any = banques.find((b: any) => {
      const code = b.BQ_CODE || b.BANQ_CODE || b.code || b.id;
      return code === id;
    });
    const libelle = banque?.BQ_LIB || banque?.BANQ_LIB || banque?.libelle;
    return libelle ? `${id} - ${libelle}` : id;
  }

  const getAgenceBanqueLibelle = (id: string) => {
    if (!id) return '';

    // Si on a le libellé directement dans formData (mode visualisation), l'utiliser
    if (formData.agenceLibelle) {
      return `${id} - ${formData.agenceLibelle}`;
    }

    // Sinon chercher dans la liste des agences
    if (!agencesBanque || !Array.isArray(agencesBanque)) return id;
    const agence: any = agencesBanque.find((a: any) => {
      const code = a.BQAG_CODE || a.code || a.id;
      return code === id;
    });
    const libelle = agence?.BQAG_LIB || agence?.libelle;
    return libelle ? `${id} - ${libelle}` : id;
  }

  const getTypeDomicilLibelle = (id: string) => {
    if (!id) return '';
    if (!typesDomicil || !Array.isArray(typesDomicil)) return id;
    const type: any = typesDomicil.find((t: any) =>
      t.TYPDOM_CODE === id || t.code === id || t.id === id
    );
    return type?.TYPDOM_LIB || type?.libelle || id;
  }

  const getCiviliteLibelle = (code: string) => {
    if (!code) return '';
    if (!civilites || !Array.isArray(civilites)) return code;
    const civilite: any = civilites.find((c: any) => c.CIV_CODE === code || c.code === code || c.id === code);
    return civilite?.CIV_LIB || civilite?.libelle || code;
  }

  const getTypeDebiteurLibelle = (code: string) => {
    if (!code) return '';
    if (!typesDebiteur || !Array.isArray(typesDebiteur)) return code;
    const type: any = typesDebiteur.find((t: any) => t.TYPDEB_CODE === code || t.code === code || t.id === code);
    return type?.TYPDEB_LIB || type?.libelle || code;
  }

  // Étape 1: Informations générales
  const renderStep1 = () => (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-gray-900">Informations générales</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="codeDebiteur" className="w-32 font-semibold text-gray-900 text-sm">
            Code débiteur
          </Label>
          <div className="flex-1">
            {isEditMode || readOnly ? (
              <Input
                id="codeDebiteur"
                value={formData.codeDebiteur || "Code non disponible"}
                readOnly
                className="bg-gray-100 text-gray-700 border-gray-300"
              />
            ) : (
              <Input
                id="codeDebiteur"
                value="Sera généré automatiquement"
                readOnly
                className="bg-gray-100 text-gray-500 border-gray-300"
              />
            )}
            {!isEditMode && !readOnly && (
              <p className="text-xs text-gray-500 mt-1">
                Le code sera généré automatiquement après validation
              </p>
            )}
            {isEditMode && !readOnly && (
              <p className="text-xs text-gray-500 mt-1">
                Code existant du débiteur
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="categorieDebiteur" className="w-32 font-semibold text-gray-900 text-sm">
            Catégorie débiteur
          </Label>
          <div className="flex-1">
            <Controller
              name="categorieDebiteur"
              control={control}
              render={({ field }) => (
                readOnly ? (
                  <Input
                    id="categorieDebiteur"
                    value={getCategorieLibelle(field.value)}
                    readOnly
                    className="bg-gray-100 text-gray-700 border-gray-300"
                  />
                ) : (
                  <select
                    {...field}
                    id="categorieDebiteur"
                    disabled={loadingCategoriesDebiteur}
                    className={getSelectClassName()}
                  >
                    <option value="">{loadingCategoriesDebiteur ? "- Chargement -" : "Sélectionner une catégorie"}</option>
                    {loadingCategoriesDebiteur ? (
                      <option key="loading" value="">Chargement...</option>
                    ) : (
                      Array.isArray(categoriesDebiteur) && categoriesDebiteur.map((categorie: any) => {
                        const code = categorie.CATEG_DEB_CODE || categorie.id || categorie.code;
                        const libelle = categorie.CATEG_DEB_LIB || categorie.libelle;
                        return (
                          <option key={code} value={code}>
                            {libelle}
                          </option>
                        );
                      })
                    )}
                  </select>
                )
              )}
            />
            {errors.categorieDebiteur && (
              <p className="text-sm text-red-500 mt-1">{String(errors.categorieDebiteur.message)}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="adressePostale" className="w-32 font-semibold text-gray-900 text-sm">
            Adresse postale
          </Label>
          <div className="flex-1">
            <Controller
              name="adressePostale"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  id="adressePostale"
                  placeholder="Ex: Cocody"
                  rows={2}
                  className={getFieldClassName(!!errors.adressePostale)}
                  disabled={readOnly}
                />
              )}
            />
            {errors.adressePostale && (
              <p className="text-sm text-red-500 mt-1">{String(errors.adressePostale.message)}</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="email" className="w-32 font-semibold text-gray-900 text-sm">
            Email
          </Label>
          <div className="flex-1">
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="email"
                  type="email"
                  placeholder="Ex: debiteur@example.com"
                  className={getFieldClassName(!!errors.email)}
                  disabled={readOnly}
                />
              )}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{String(errors.email.message)}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="telephone" className="w-32 font-semibold text-gray-900 text-sm">
            Téléphone
          </Label>
          <div className="flex-1">
            <Controller
              name="telephone"
              control={control}
              render={({ field }) => (
                <PhoneInput
                  {...field}
                  defaultCountry="CI"
                  international
                  placeholder="Ex: 27 12 34 56 78"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '0.375rem',
                    border: `1px solid ${!!errors.telephone ? errorRed : borderGray}`,
                    backgroundColor: readOnly ? '#f7fafc' : 'white',
                  }}
                  disabled={readOnly}
                />
              )}
            />
            {errors.telephone && (
              <p className="text-sm text-red-500 mt-1">{String(errors.telephone.message)}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="numeroCell" className="w-32 font-semibold text-gray-900 text-sm">
            N° Cellulaire
          </Label>
          <div className="flex-1">
            <Controller
              name="numeroCell"
              control={control}
              render={({ field }) => (
                <PhoneInput
                  {...field}
                  defaultCountry="CI"
                  international
                  placeholder="Ex: 07 12 34 56 78"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '0.375rem',
                    border: `1px solid ${!!errors.numeroCell ? errorRed : borderGray}`,
                    backgroundColor: readOnly ? '#f7fafc' : 'white',
                  }}
                  disabled={readOnly}
                />
              )}
            />
            {errors.numeroCell && (
              <p className="text-sm text-red-500 mt-1">{String(errors.numeroCell.message)}</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="typeDebiteur" className="w-32 font-semibold text-gray-900 text-sm">
            Type débiteur
          </Label>
          <div className="flex-1">
            <Controller
              name="typeDebiteur"
              control={control}
              render={({ field }) => (
                readOnly ? (
                  <Input
                    id="typeDebiteur"
                    value={getTypeDebiteurLibelle(field.value)}
                    readOnly
                    className="bg-gray-100 text-gray-700 border-gray-300"
                  />
                ) : (
                  <select
                    {...field}
                    id="typeDebiteur"
                    disabled={loadingTypesDebiteur}
                    className={getSelectClassName()}
                  >
                    <option value="">{loadingTypesDebiteur ? "- Chargement -" : "Sélectionner un type"}</option>
                    {loadingTypesDebiteur ? (
                      <option key="loading" value="">Chargement...</option>
                    ) : (
                      <>
                        {Array.isArray(typesDebiteur) && typesDebiteur.length > 0 ? (
                          typesDebiteur.filter((t: any) => t).map((type: any, index: number) => {
                            const code = type.TYPDEB_CODE || type.code || type.id;
                            const libelle = type.TYPDEB_LIB || type.libelle;
                            return (
                              <option key={code || `type-${index}`} value={code}>
                                {libelle}
                              </option>
                            );
                          })
                        ) : (
                          <option key="empty" value="">Aucun type disponible</option>
                        )}
                      </>
                    )}
                  </select>
                )
              )}
            />
            {errors.typeDebiteur && (
              <p className="text-sm text-red-500 mt-1">{String(errors.typeDebiteur.message)}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Étape 2: Personne physique
  const renderStep2Physique = () => (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-gray-900">Personne physique</h2>

      {/* Civilité, Nom, Prénom */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="civilite" className="w-32 font-semibold text-gray-900 text-sm">Civilité</Label>
          <div className="flex-1">
            <Controller
              name="civilite"
              control={control}
              render={({ field }) => (
                readOnly ? (
                  <Input id="civilite" value={getCiviliteLibelle(field.value)} readOnly className="bg-gray-100 text-gray-700 border-gray-300" />
                ) : (
                  <select {...field} id="civilite" disabled={loadingCivilites} className={getSelectClassName()}>
                    <option value="">{loadingCivilites ? "- Chargement -" : "Sélectionner"}</option>
                    {!loadingCivilites && Array.isArray(civilites) && civilites.length > 0 ? (
                      civilites.filter((c: any) => c).map((civilite: any, index: number) => {
                        const code = civilite.CIV_CODE || civilite.code || civilite.id;
                        const libelle = civilite.CIV_LIB || civilite.libelle;
                        return <option key={code || `civilite-${index}`} value={code}>{libelle}</option>;
                      })
                    ) : (
                      <option key="empty" value="">Aucune civilité disponible</option>
                    )}
                  </select>
                )
              )}
            />
            {errors.civilite && <p className="text-sm text-red-500 mt-1">{String(errors.civilite.message)}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="nom" className="w-32 font-semibold text-gray-900 text-sm">Nom</Label>
          <div className="flex-1">
            <Controller
              name="nom"
              control={control}
              render={({ field }) => (
                <Input {...field} id="nom" placeholder="Ex: Koné" className={getFieldClassName(!!errors.nom)} disabled={readOnly} />
              )}
            />
            {errors.nom && <p className="text-sm text-red-500 mt-1">{String(errors.nom.message)}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="prenom" className="w-32 font-semibold text-gray-900 text-sm">Prénom</Label>
          <div className="flex-1">
            <Controller
              name="prenom"
              control={control}
              render={({ field }) => (
                <Input {...field} id="prenom" placeholder="Ex: Amadou" className={getFieldClassName(!!errors.prenom)} disabled={readOnly} />
              )}
            />
            {errors.prenom && <p className="text-sm text-red-500 mt-1">{String(errors.prenom.message)}</p>}
          </div>
        </div>
      </div>

      {/* Date/Lieu naissance, Quartier */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="dateNaissance" className="w-32 font-semibold text-gray-900 text-sm">Date de naissance</Label>
          <div className="flex-1">
            <Controller
              name="dateNaissance"
              control={control}
              render={({ field }) => (
                <Input {...field} id="dateNaissance" type="date" className={getFieldClassName(!!errors.dateNaissance)} disabled={readOnly} />
              )}
            />
            {errors.dateNaissance && <p className="text-sm text-red-500 mt-1">{String(errors.dateNaissance.message)}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="lieuNaissance" className="w-32 font-semibold text-gray-900 text-sm">Lieu de naissance</Label>
          <div className="flex-1">
            <Controller
              name="lieuNaissance"
              control={control}
              render={({ field }) => (
                <Input {...field} id="lieuNaissance" placeholder="Ex: Abidjan" className={getFieldClassName(!!errors.lieuNaissance)} disabled={readOnly} />
              )}
            />
            {errors.lieuNaissance && <p className="text-sm text-red-500 mt-1">{String(errors.lieuNaissance.message)}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="quartier" className="w-32 font-semibold text-gray-900 text-sm">Quartier</Label>
          <div className="flex-1">
            <Controller
              name="quartier"
              control={control}
              render={({ field }) => (
                readOnly ? (
                  <Input id="quartier" value={getQuartierLibelle(field.value)} readOnly className="bg-gray-100 text-gray-700 border-gray-300" />
                ) : (
                  <select {...field} id="quartier" value={field.value || ''} disabled={loadingQuartiers} className={getSelectClassName()}>
                    <option value="">{loadingQuartiers ? "- Chargement -" : "Sélectionner"}</option>
                    {!loadingQuartiers && Array.isArray(quartiers) && quartiers.length > 0 ? (
                      quartiers.filter((q: any) => q).map((quartier: any, index: number) => {
                        const code = quartier.QUART_CODE || quartier.code || quartier.id;
                        const libelle = quartier.QUART_LIB || quartier.libelle;
                        return <option key={code || `quartier-${index}`} value={code}>{libelle}</option>;
                      })
                    ) : (
                      <option key="empty" value="">Aucun quartier disponible</option>
                    )}
                  </select>
                )
              )}
            />
            {errors.quartier && <p className="text-sm text-red-500 mt-1">{String(errors.quartier.message)}</p>}
          </div>
        </div>
      </div>

      {/* Nationalité, Fonction */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="nationalite" className="w-32 font-semibold text-gray-900 text-sm">Nationalité</Label>
          <div className="flex-1">
            <Controller
              name="nationalite"
              control={control}
              render={({ field }) => (
                readOnly ? (
                  <Input id="nationalite" value={getNationaliteLibelle(field.value)} readOnly className="bg-gray-100 text-gray-700 border-gray-300" />
                ) : (
                  <select {...field} id="nationalite" value={field.value || ''} disabled={loadingNationalites} className={getSelectClassName()}>
                    <option value="">{loadingNationalites ? "- Chargement -" : "Sélectionner"}</option>
                    {!loadingNationalites && Array.isArray(nationalites) && nationalites.length > 0 ? (
                      nationalites.filter((n: any) => n).map((nationalite: any, index: number) => {
                        const code = nationalite.NAT_CODE || nationalite.code || nationalite.id;
                        const libelle = nationalite.NAT_LIB || nationalite.libelle;
                        return <option key={code || `nationalite-${index}`} value={code}>{libelle}</option>;
                      })
                    ) : (
                      <option key="empty" value="">Aucune nationalité disponible</option>
                    )}
                  </select>
                )
              )}
            />
            {errors.nationalite && <p className="text-sm text-red-500 mt-1">{String(errors.nationalite.message)}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="fonction" className="w-32 font-semibold text-gray-900 text-sm">Fonction</Label>
          <div className="flex-1">
            <Controller
              name="fonction"
              control={control}
              render={({ field }) => (
                readOnly ? (
                  <Input id="fonction" value={getFonctionLibelle(field.value)} readOnly className="bg-gray-100 text-gray-700 border-gray-300" />
                ) : (
                  <select {...field} id="fonction" disabled={loadingFonctions} className={getSelectClassName()}>
                    <option value="">{loadingFonctions ? "- Chargement -" : "Sélectionner"}</option>
                    {!loadingFonctions && Array.isArray(fonctions) && fonctions.length > 0 ? (
                      fonctions.filter((f: any) => f).map((fonction: any, index: number) => {
                        const code = fonction.FONCT_CODE || fonction.code || fonction.id;
                        const libelle = fonction.FONCT_LIB || fonction.libelle;
                        return <option key={code || `fonction-${index}`} value={code}>{libelle}</option>;
                      })
                    ) : (
                      <option key="empty" value="">Aucune fonction disponible</option>
                    )}
                  </select>
                )
              )}
            />
            {errors.fonction && <p className="text-sm text-red-500 mt-1">{String(errors.fonction.message)}</p>}
          </div>
        </div>
      </div>

      {/* Profession, Employeur, Statut Salarié */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="profession" className="w-32 font-semibold text-gray-900 text-sm">Profession</Label>
          <div className="flex-1">
            <Controller
              name="profession"
              control={control}
              render={({ field }) => (
                readOnly ? (
                  <Input id="profession" value={getProfessionLibelle(field.value)} readOnly className="bg-gray-100 text-gray-700 border-gray-300" />
                ) : (
                  <select {...field} id="profession" disabled={loadingProfessions} className={getSelectClassName()}>
                    <option value="">{loadingProfessions ? "- Chargement -" : "Sélectionner"}</option>
                    {!loadingProfessions && Array.isArray(professions) ? (
                      professions.map((profession: any) => {
                        const code = profession.PROFES_CODE || profession.code || profession.id;
                        const libelle = profession.PROFES_LIB || profession.libelle;
                        return <option key={code} value={code}>{libelle}</option>;
                      })
                    ) : null}
                  </select>
                )
              )}
            />
            {errors.profession && <p className="text-sm text-red-500 mt-1">{String(errors.profession.message)}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="employeur" className="w-32 font-semibold text-gray-900 text-sm">Employeur</Label>
          <div className="flex-1">
            <Controller
              name="employeur"
              control={control}
              render={({ field }) => (
                readOnly ? (
                  <Input id="employeur" value={getEntiteLibelle(field.value)} readOnly className="bg-gray-100 text-gray-700 border-gray-300" />
                ) : (
                  <select {...field} id="employeur" value={field.value || ''} className={getSelectClassName()}>
                    <option value="">Sélectionner</option>
                    {!loadingEntites && Array.isArray(entites) && entites.length > 0 ? (
                      entites.filter((e: any) => e).map((entite: any, index: number) => {
                        const code = entite.ENTITE_CODE || entite.ENT_CODE || entite.code || entite.id;
                        const libelle = entite.ENTITE_LIB || entite.ENT_LIB || entite.libelle;
                        return <option key={code || `entite-${index}`} value={code}>{libelle}</option>;
                      })
                    ) : (
                      <option key="empty" value="">Aucun employeur disponible</option>
                    )}
                  </select>
                )
              )}
            />
            {errors.employeur && <p className="text-sm text-red-500 mt-1">{String(errors.employeur.message)}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="statutSalarie" className="w-32 font-semibold text-gray-900 text-sm">Statut Salarié</Label>
          <div className="flex-1">
            <Controller
              name="statutSalarie"
              control={control}
              render={({ field }) => (
                readOnly ? (
                  <Input id="statutSalarie" value={getStatutSalarieLibelle(field.value)} readOnly className="bg-gray-100 text-gray-700 border-gray-300" />
                ) : (
                  <select {...field} id="statutSalarie" disabled={loadingStatutsSalarie} className={getSelectClassName()}>
                    <option value="">{loadingStatutsSalarie ? "- Chargement -" : "Sélectionner"}</option>
                    {!loadingStatutsSalarie && Array.isArray(statutsSalarie) ? (
                      statutsSalarie.map((statut: any) => {
                        const code = statut.STATSAL_CODE || statut.code || statut.id;
                        const libelle = statut.STATSAL_LIB || statut.libelle;
                        return <option key={code} value={code}>{libelle}</option>;
                      })
                    ) : null}
                  </select>
                )
              )}
            />
            {errors.statutSalarie && <p className="text-sm text-red-500 mt-1">{String(errors.statutSalarie.message)}</p>}
          </div>
        </div>
      </div>

      {/* Matricule, Sexe, Date de décès */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="matricule" className="w-32 font-semibold text-gray-900 text-sm">Matricule</Label>
          <div className="flex-1">
            <Controller
              name="matricule"
              control={control}
              render={({ field }) => (
                <Input {...field} id="matricule" placeholder="Ex: MAT123456" className={getFieldClassName(!!errors.matricule)} disabled={readOnly} />
              )}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="sexe" className="w-32 font-semibold text-gray-900 text-sm">Sexe</Label>
          <div className="flex-1">
            <Controller
              name="sexe"
              control={control}
              render={({ field }) => (
                readOnly ? (
                  <Input id="sexe" value={field.value === 'M' ? 'Masculin' : field.value === 'F' ? 'Féminin' : field.value} readOnly className="bg-gray-100 text-gray-700 border-gray-300" />
                ) : (
                  <select {...field} id="sexe" className={getSelectClassName()}>
                    <option value="">Sélectionner</option>
                    <option value="M">Masculin</option>
                    <option value="F">Féminin</option>
                  </select>
                )
              )}
            />
            {errors.sexe && <p className="text-sm text-red-500 mt-1">{String(errors.sexe.message)}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="dateDeces" className="w-32 font-semibold text-gray-900 text-sm">Date de décès</Label>
          <div className="flex-1">
            <Controller
              name="dateDeces"
              control={control}
              render={({ field }) => (
                <Input {...field} id="dateDeces" type="date" className={getFieldClassName(!!errors.dateDeces)} disabled={readOnly} />
              )}
            />
          </div>
        </div>
      </div>

      {/* Pièce d'identité */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="naturePieceIdentite" className="w-32 font-semibold text-gray-900 text-sm">Nature de pièce d'identité</Label>
          <div className="flex-1">
            <Controller
              name="naturePieceIdentite"
              control={control}
              render={({ field }) => (
                readOnly ? (
                  <Input id="naturePieceIdentite" value={field.value === 'CNI' ? 'CNI' : field.value === 'Passeport' ? 'Passeport' : field.value === 'Permis' ? 'Permis de conduire' : field.value === 'autre' ? 'Autre' : field.value} readOnly className="bg-gray-100 text-gray-700 border-gray-300" />
                ) : (
                  <select {...field} id="naturePieceIdentite" className={getSelectClassName()}>
                    <option value="">Sélectionner</option>
                    <option value="CNI">CNI</option>
                    <option value="Passeport">Passeport</option>
                    <option value="Permis">Permis de conduire</option>
                    <option value="autre">Autre</option>
                  </select>
                )
              )}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="numeroPieceIdentite" className="w-32 font-semibold text-gray-900 text-sm">Numéro de pièce d'identité</Label>
          <div className="flex-1">
            <Controller
              name="numeroPieceIdentite"
              control={control}
              render={({ field }) => (
                <Input {...field} id="numeroPieceIdentite" placeholder="Ex: 123456789" className={getFieldClassName(!!errors.numeroPieceIdentite)} disabled={readOnly} />
              )}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="dateEtablie" className="w-32 font-semibold text-gray-900 text-sm">Date établie</Label>
          <div className="flex-1">
            <Controller
              name="dateEtablie"
              control={control}
              render={({ field }) => (
                <Input {...field} id="dateEtablie" type="date" className={getFieldClassName(!!errors.dateEtablie)} disabled={readOnly} />
              )}
            />
          </div>
        </div>
      </div>

      {/* Lieu établi, Statut matrimonial, Régime mariage */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="lieuEtablie" className="w-32 font-semibold text-gray-900 text-sm">Lieu établi</Label>
          <div className="flex-1">
            <Controller
              name="lieuEtablie"
              control={control}
              render={({ field }) => (
                <Input {...field} id="lieuEtablie" placeholder="Ex: Abidjan" className={getFieldClassName(!!errors.lieuEtablie)} disabled={readOnly} />
              )}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="statutMatrimonial" className="w-32 font-semibold text-gray-900 text-sm">Statut matrimonial</Label>
          <div className="flex-1">
            <Controller
              name="statutMatrimonial"
              control={control}
              render={({ field }) => (
                readOnly ? (
                  <Input id="statutMatrimonial" value={field.value === 'celibataire' ? 'Célibataire' : field.value === 'marie' ? 'Marié(e)' : field.value === 'divorce' ? 'Divorcé(e)' : field.value === 'veuf' ? 'Veuf/Veuve' : field.value} readOnly className="bg-gray-100 text-gray-700 border-gray-300" />
                ) : (
                  <select {...field} id="statutMatrimonial" className={getSelectClassName()}>
                    <option value="">Sélectionner</option>
                    <option value="celibataire">Célibataire</option>
                    <option value="marie">Marié(e)</option>
                    <option value="divorce">Divorcé(e)</option>
                    <option value="veuf">Veuf/Veuve</option>
                  </select>
                )
              )}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="regimeMariage" className="w-32 font-semibold text-gray-900 text-sm">Régime de mariage</Label>
          <div className="flex-1">
            <Controller
              name="regimeMariage"
              control={control}
              render={({ field }) => (
                readOnly ? (
                  <Input id="regimeMariage" value={field.value === 'communaute' ? 'Communauté' : field.value === 'separation' ? 'Séparation de biens' : field.value === 'participation' ? 'Participation aux acquêts' : field.value} readOnly className="bg-gray-100 text-gray-700 border-gray-300" />
                ) : (
                  <select {...field} id="regimeMariage" className={getSelectClassName()}>
                    <option value="">Sélectionner</option>
                    <option value="communaute">Communauté</option>
                    <option value="separation">Séparation de biens</option>
                    <option value="participation">Participation aux acquêts</option>
                  </select>
                )
              )}
            />
          </div>
        </div>
      </div>

      {/* Nombre d'enfants */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="nombreEnfant" className="w-32 font-semibold text-gray-900 text-sm">Nombre d'enfant</Label>
          <div className="flex-1">
            <Controller
              name="nombreEnfant"
              control={control}
              render={({ field }) => (
                <Input {...field} id="nombreEnfant" type="number" placeholder="0" min="0" className={getFieldClassName(!!errors.nombreEnfant)} disabled={readOnly} />
              )}
            />
          </div>
        </div>
      </div>

      <Separator className="my-6" />
      <h3 className="text-md font-semibold text-gray-900">Informations du conjoint</h3>

      {/* Conjoint */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="nomConjoint" className="w-32 font-semibold text-gray-900 text-sm">Nom du conjoint</Label>
          <div className="flex-1">
            <Controller
              name="nomConjoint"
              control={control}
              render={({ field }) => (
                <Input {...field} id="nomConjoint" placeholder="Ex: Traoré" className={getFieldClassName(!!errors.nomConjoint)} disabled={readOnly} />
              )}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="prenomsConjoint" className="w-32 font-semibold text-gray-900 text-sm">Prénoms du conjoint</Label>
          <div className="flex-1">
            <Controller
              name="prenomsConjoint"
              control={control}
              render={({ field }) => (
                <Input {...field} id="prenomsConjoint" placeholder="Ex: Fatou" className={getFieldClassName(!!errors.prenomsConjoint)} disabled={readOnly} />
              )}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="dateNaissanceConjoint" className="w-32 font-semibold text-gray-900 text-sm">Date de naissance du conjoint</Label>
          <div className="flex-1">
            <Controller
              name="dateNaissanceConjoint"
              control={control}
              render={({ field }) => (
                <Input {...field} id="dateNaissanceConjoint" type="date" className={getFieldClassName(!!errors.dateNaissanceConjoint)} disabled={readOnly} />
              )}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="telConjoint" className="w-32 font-semibold text-gray-900 text-sm">Téléphone du conjoint</Label>
          <div className="flex-1">
            <Controller
              name="telConjoint"
              control={control}
              render={({ field }) => (
                <Input {...field} id="telConjoint" placeholder="Ex: +225 07 12 34 56 78" className={getFieldClassName(!!errors.telConjoint)} disabled={readOnly} />
              )}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="numeroPieceConjoint" className="w-32 font-semibold text-gray-900 text-sm">Numéro de pièce du conjoint</Label>
          <div className="flex-1">
            <Controller
              name="numeroPieceConjoint"
              control={control}
              render={({ field }) => (
                <Input {...field} id="numeroPieceConjoint" placeholder="Ex: 987654321" className={getFieldClassName(!!errors.numeroPieceConjoint)} disabled={readOnly} />
              )}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="adresseConjoint" className="w-32 font-semibold text-gray-900 text-sm">Adresse du conjoint</Label>
          <div className="flex-1">
            <Controller
              name="adresseConjoint"
              control={control}
              render={({ field }) => (
                <Textarea {...field} id="adresseConjoint" placeholder="Adresse complète" rows={2} className={getFieldClassName(!!errors.adresseConjoint)} disabled={readOnly} />
              )}
            />
          </div>
        </div>
      </div>

      <Separator className="my-6" />
      <h3 className="text-md font-semibold text-gray-900">Informations des parents</h3>

      {/* Parents */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="nomPere" className="w-32 font-semibold text-gray-900 text-sm">Nom du père</Label>
          <div className="flex-1">
            <Controller
              name="nomPere"
              control={control}
              render={({ field }) => (
                <Input {...field} id="nomPere" placeholder="Ex: Koné" className={getFieldClassName(!!errors.nomPere)} disabled={readOnly} />
              )}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="prenomsPere" className="w-32 font-semibold text-gray-900 text-sm">Prénoms du père</Label>
          <div className="flex-1">
            <Controller
              name="prenomsPere"
              control={control}
              render={({ field }) => (
                <Input {...field} id="prenomsPere" placeholder="Ex: Mamadou" className={getFieldClassName(!!errors.prenomsPere)} disabled={readOnly} />
              )}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="nomMere" className="w-32 font-semibold text-gray-900 text-sm">Nom de la mère</Label>
          <div className="flex-1">
            <Controller
              name="nomMere"
              control={control}
              render={({ field }) => (
                <Input {...field} id="nomMere" placeholder="Ex: Traoré" className={getFieldClassName(!!errors.nomMere)} disabled={readOnly} />
              )}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="prenomsMere" className="w-32 font-semibold text-gray-900 text-sm">Prénoms de la mère</Label>
          <div className="flex-1">
            <Controller
              name="prenomsMere"
              control={control}
              render={({ field }) => (
                <Input {...field} id="prenomsMere" placeholder="Ex: Aminata" className={getFieldClassName(!!errors.prenomsMere)} disabled={readOnly} />
              )}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="rue" className="w-32 font-semibold text-gray-900 text-sm">Rue</Label>
          <div className="flex-1">
            <Controller
              name="rue"
              control={control}
              render={({ field }) => (
                <Input {...field} id="rue" placeholder="Ex: Rue des Écoles, N°123" className={getFieldClassName(!!errors.rue)} disabled={readOnly} />
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Étape 2: Personne morale
  const renderStep2Moral = () => (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-gray-900">Personne morale</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="registreCommerce" className="w-32 font-semibold text-gray-900 text-sm">Registre de commerce</Label>
          <div className="flex-1">
            <Controller
              name="registreCommerce"
              control={control}
              render={({ field }) => (
                <Input {...field} id="registreCommerce" placeholder="Ex: CI-ABJ-2024-A-12345" className={getFieldClassName(!!errors.registreCommerce)} disabled={readOnly} />
              )}
            />
            {errors.registreCommerce && <p className="text-sm text-red-500 mt-1">{String(errors.registreCommerce.message)}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="raisonSociale" className="w-32 font-semibold text-gray-900 text-sm">Raison sociale</Label>
          <div className="flex-1">
            <Controller
              name="raisonSociale"
              control={control}
              render={({ field }) => (
                <Input {...field} id="raisonSociale" placeholder="Ex: Société ABC SARL" className={getFieldClassName(!!errors.raisonSociale)} disabled={readOnly} />
              )}
            />
            {errors.raisonSociale && <p className="text-sm text-red-500 mt-1">{String(errors.raisonSociale.message)}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="capitalSocial" className="w-32 font-semibold text-gray-900 text-sm">Capital social</Label>
          <div className="flex-1">
            <Controller
              name="capitalSocial"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="capitalSocial"
                  placeholder="Ex: 10 000 000"
                  className={getFieldClassName(!!errors.capitalSocial)}
                  disabled={readOnly}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\s/g, '');
                    const numbers = value.replace(/\D/g, '');
                    if (numbers) {
                      const formatted = numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
                      field.onChange(formatted);
                    } else {
                      field.onChange('');
                    }
                  }}
                />
              )}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="formeJuridique" className="w-32 font-semibold text-gray-900 text-sm">Forme juridique</Label>
          <div className="flex-1">
            <Controller
              name="formeJuridique"
              control={control}
              render={({ field }) => (
                readOnly ? (
                  <Input id="formeJuridique" value={field.value === 'SARL' ? 'SARL' : field.value === 'SA' ? 'SA' : field.value === 'SNC' ? 'SNC' : field.value === 'EURL' ? 'EURL' : field.value === 'SAS' ? 'SAS' : field.value === 'autre' ? 'Autre' : field.value} readOnly className="bg-gray-100 text-gray-700 border-gray-300" />
                ) : (
                  <select {...field} id="formeJuridique" className={getSelectClassName()}>
                    <option value="">Sélectionner</option>
                    <option value="SARL">SARL</option>
                    <option value="SA">SA</option>
                    <option value="SNC">SNC</option>
                    <option value="EURL">EURL</option>
                    <option value="SAS">SAS</option>
                    <option value="autre">Autre</option>
                  </select>
                )
              )}
            />
            {errors.formeJuridique && <p className="text-sm text-red-500 mt-1">{String(errors.formeJuridique.message)}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="domaineActivite" className="w-32 font-semibold text-gray-900 text-sm">Domaine d'activité</Label>
          <div className="flex-1">
            <Controller
              name="domaineActivite"
              control={control}
              render={({ field }) => (
                readOnly ? (
                  <Input id="domaineActivite" value={field.value === 'commerce' ? 'Commerce' : field.value === 'industrie' ? 'Industrie' : field.value === 'services' ? 'Services' : field.value === 'agriculture' ? 'Agriculture' : field.value === 'batiment' ? 'Bâtiment' : field.value === 'transport' ? 'Transport' : field.value === 'autre' ? 'Autre' : field.value} readOnly className="bg-gray-100 text-gray-700 border-gray-300" />
                ) : (
                  <select {...field} id="domaineActivite" className={getSelectClassName()}>
                    <option value="">Sélectionner</option>
                    <option value="commerce">Commerce</option>
                    <option value="industrie">Industrie</option>
                    <option value="services">Services</option>
                    <option value="agriculture">Agriculture</option>
                    <option value="batiment">Bâtiment</option>
                    <option value="transport">Transport</option>
                    <option value="autre">Autre</option>
                  </select>
                )
              )}
            />
            {errors.domaineActivite && <p className="text-sm text-red-500 mt-1">{String(errors.domaineActivite.message)}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="nomGerant" className="w-32 font-semibold text-gray-900 text-sm">Nom du gérant</Label>
          <div className="flex-1">
            <Controller
              name="nomGerant"
              control={control}
              render={({ field }) => (
                <Input {...field} id="nomGerant" placeholder="Ex: Koné Amadou" className={getFieldClassName(!!errors.nomGerant)} disabled={readOnly} />
              )}
            />
            {errors.nomGerant && <p className="text-sm text-red-500 mt-1">{String(errors.nomGerant.message)}</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="siegeSocial" className="w-32 font-semibold text-gray-900 text-sm">Siège social</Label>
          <div className="flex-1">
            <Controller
              name="siegeSocial"
              control={control}
              render={({ field }) => (
                <Textarea {...field} id="siegeSocial" placeholder="Ex: Cocody, Angré 8ème Tranche, Abidjan" rows={2} className={getFieldClassName(!!errors.siegeSocial)} disabled={readOnly} />
              )}
            />
            {errors.siegeSocial && <p className="text-sm text-red-500 mt-1">{String(errors.siegeSocial.message)}</p>}
          </div>
        </div>
      </div>
    </div>
  );

  // Étape 3: Domiciliation
  const renderStep3 = () => (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-gray-900">Domiciliation</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="type" className="w-32 font-semibold text-gray-900 text-sm">Type</Label>
          <div className="flex-1">
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                readOnly ? (
                  <Input id="type" value={getTypeDomicilLibelle(field.value)} readOnly className="bg-gray-100 text-gray-700 border-gray-300" />
                ) : (
                  <select {...field} id="type" disabled={loadingTypesDomicil} className={getSelectClassName()}>
                    <option value="">Sélectionner</option>
                    {!loadingTypesDomicil && Array.isArray(typesDomicil) ? (
                      typesDomicil.map((type: any) => {
                        const code = type.TYPDOM_CODE || type.code || type.id;
                        const libelle = type.TYPDOM_LIB || type.libelle;
                        return <option key={code} value={code}>{libelle}</option>;
                      })
                    ) : null}
                  </select>
                )
              )}
            />
            {errors.type && <p className="text-sm text-red-500 mt-1">{String(errors.type.message)}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="numeroCompte" className="w-32 font-semibold text-gray-900 text-sm">Numéro du compte</Label>
          <div className="flex-1">
            <Controller
              name="numeroCompte"
              control={control}
              render={({ field }) => (
                <Input {...field} id="numeroCompte" placeholder="Ex: 1234567890123456" className={getFieldClassName(!!errors.numeroCompte)} disabled={readOnly} />
              )}
            />
            {errors.numeroCompte && <p className="text-sm text-red-500 mt-1">{String(errors.numeroCompte.message)}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="libelle" className="w-32 font-semibold text-gray-900 text-sm">Libellé</Label>
          <div className="flex-1">
            <Controller
              name="libelle"
              control={control}
              render={({ field }) => (
                <Input {...field} id="libelle" placeholder="Ex: Compte principal" className={getFieldClassName(!!errors.libelle)} disabled={readOnly} />
              )}
            />
            {errors.libelle && <p className="text-sm text-red-500 mt-1">{String(errors.libelle.message)}</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="banque" className="w-32 font-semibold text-gray-900 text-sm">Banque</Label>
          <div className="flex-1">
            <Controller
              name="banque"
              control={control}
              render={({ field }) => (
                readOnly ? (
                  <Input id="banque" value={getBanqueLibelle(field.value)} readOnly className="bg-gray-100 text-gray-700 border-gray-300" />
                ) : (
                  <select {...field} id="banque" className={getSelectClassName()}>
                    <option value="">Sélectionner</option>
                    {!loadingBanques && Array.isArray(banques) ? (
                      banques.map((banque: any) => {
                        const code = banque.BQ_CODE || banque.BANQ_CODE || banque.code || banque.id;
                        const libelle = banque.BQ_LIB || banque.BANQ_LIB || banque.libelle;
                        return <option key={code} value={code}>{code} - {libelle}</option>;
                      })
                    ) : null}
                  </select>
                )
              )}
            />
            {errors.banque && <p className="text-sm text-red-500 mt-1">{String(errors.banque.message)}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="banqueAgence" className="w-32 font-semibold text-gray-900 text-sm">Banque agence</Label>
          <div className="flex-1">
            <Controller
              name="banqueAgence"
              control={control}
              render={({ field }) => (
                readOnly ? (
                  <Input id="banqueAgence" value={getAgenceBanqueLibelle(field.value)} readOnly className="bg-gray-100 text-gray-700 border-gray-300" />
                ) : (
                  <select {...field} id="banqueAgence" className={getSelectClassName()}>
                    <option value="">Sélectionner</option>
                    {!loadingAgencesBanque && Array.isArray(agencesBanque) ? (
                      agencesBanque
                        .filter((agence: any) => {
                          const banqueSelectionnee = formData.domiciliation?.banque;
                          if (!banqueSelectionnee) return true;
                          const banqueAgence = agence.BQ_CODE || agence.banqueCode;
                          return banqueAgence === banqueSelectionnee;
                        })
                        .map((agence: any, index: number) => {
                          const code = agence.BQAG_NUM || agence.AGENCE_CODE || agence.code || agence.id || index;
                          const libelle = agence.BQAG_LIB || agence.AGENCE_LIB || agence.libelle;
                          return <option key={code} value={code}>{code} - {libelle}</option>;
                        })
                    ) : null}
                  </select>
                )
              )}
            />
            {errors.banqueAgence && <p className="text-sm text-red-500 mt-1">{String(errors.banqueAgence.message)}</p>}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return (typeDebiteur === 'P' || typeDebiteur === 'physique') ? renderStep2Physique() : renderStep2Moral();
      case 3: return renderStep3();
      default: return null;
    }
  };

  return (
    <div>
      {renderCurrentStep()}
    </div>
  );
});

DebiteurForm.displayName = 'DebiteurForm';

export default DebiteurForm;
export { DebiteurForm };
