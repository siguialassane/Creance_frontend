"use client"

import { useState, useEffect, useCallback, forwardRef, useImperativeHandle, useRef } from "react";
import { Box, VStack, HStack, FormControl, FormLabel, Input, Select, Textarea, Text, Divider, Grid, GridItem, Checkbox, Stack, Alert, AlertIcon } from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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
  email: z.string().email("Email invalide").min(1, "L'email est requis"),
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

  const { control, handleSubmit, formState: { errors }, watch, setValue, reset, trigger } = useForm({
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

  // Reset seulement quand l'étape change
  useEffect(() => {
    // Seulement si l'étape change réellement
    if (prevStepRef.current !== currentStep) {
      prevStepRef.current = currentStep;
      
      const currentFormData = formDataRef.current;
      if (currentFormData) {
        // S'assurer que toutes les valeurs sont définies pour éviter les erreurs de champs contrôlés/non-contrôlés
        const sanitizedFormData = Object.keys(currentFormData).reduce((acc, key) => {
          acc[key] = currentFormData[key] ?? '';
          return acc;
        }, {} as any);
        
        resetRef.current(sanitizedFormData);
        
        if (currentFormData.typeDebiteur) {
          typeDebiteurRef.current = currentFormData.typeDebiteur;
          setTypeDebiteur(currentFormData.typeDebiteur);
        }
      }
    }
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

  const getFieldStyles = (hasError?: boolean) => ({
    borderColor: hasError ? errorRed : borderGray,
    bg: hasError ? errorBg : (readOnly ? 'gray.50' : 'white'),
    _focus: { borderColor: primaryGreen },
    isDisabled: readOnly,
  })

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
    if (!banques || !Array.isArray(banques)) return id;
    const banque: any = banques.find((b: any) => b.id === id);
    return banque?.libelle || id;
  }

  const getAgenceBanqueLibelle = (id: string) => {
    if (!id) return '';
    if (!agencesBanque || !Array.isArray(agencesBanque)) return id;
    const agence: any = agencesBanque.find((a: any) => a.id === id);
    return agence?.libelle || id;
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
    <VStack spacing={2} align="stretch">
      <Text fontSize="lg" fontWeight="bold" mb={4} color={titleColor}>Informations générales</Text>
      
      <Grid templateColumns="repeat(3, 1fr)" gap={2}>
        <GridItem>
          <FormControl isInvalid={!!errors.codeDebiteur}>
            <FormLabel color={labelColor}>Code débiteur</FormLabel>
            <Box flex="1">
              {isEditMode || readOnly ? (
                <Input 
                  value={formData.codeDebiteur || "Code non disponible"} 
                  isReadOnly 
                  color="gray.700"
                  {...getFieldStyles(!!errors.codeDebiteur)} 
                  bg="gray.100"
                />
              ) : (
                <Input 
                  value="Sera généré automatiquement" 
                  isReadOnly 
                  color="gray.500"
                  {...getFieldStyles(!!errors.codeDebiteur)} 
                  bg="gray.100"
                />
              )}
              {!isEditMode && !readOnly && (
                <Text fontSize="xs" color="gray.500" mt={1}>
                  Le code sera généré automatiquement après validation
                </Text>
              )}
              {isEditMode && !readOnly && (
                <Text fontSize="xs" color="gray.500" mt={1}>
                  Code existant du débiteur
                </Text>
              )}
            </Box>
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.categorieDebiteur}>
            <FormLabel color={labelColor}>Catégorie débiteur</FormLabel>
            <Controller
              name="categorieDebiteur"
              control={control}
              render={({ field }) => (
                readOnly ? (
                  <Input 
                    value={getCategorieLibelle(field.value)} 
                    isReadOnly 
                    color="gray.700"
                    {...getFieldStyles(!!errors.categorieDebiteur)} 
                    bg="gray.100"
                  />
                ) : (
                  <Select 
                    {...field} 
                    placeholder="Sélectionner une catégorie" 
                    borderColor={primaryGreen}
                    bg="gray.100"
                    color="gray.700"
                    _focus={{ borderColor: primaryGreen }}
                    _hover={{ bg: "gray.100" }}
                  >
                    {loadingCategoriesDebiteur ? (
                      <option key="loading" value="">Chargement...</option>
                    ) : (
                      Array.isArray(categoriesDebiteur) && categoriesDebiteur.map((categorie: any) => {
                        // Support pour les deux formats : API (CATEG_DEB_CODE/CATEG_DEB_LIB) et mock (id/libelle)
                        const code = categorie.CATEG_DEB_CODE || categorie.id || categorie.code;
                        const libelle = categorie.CATEG_DEB_LIB || categorie.libelle;
                        return (
                          <option key={code} value={code}>
                            {libelle}
                          </option>
                        );
                      })
                    )}
                  </Select>
                )
              )}
            />
            {errors.categorieDebiteur && (
              <Text color={errorRed} fontSize="sm">{String(errors.categorieDebiteur.message)}</Text>
            )}
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.adressePostale}>
            <FormLabel color={labelColor}>Adresse postale</FormLabel>
            <Controller
              name="adressePostale"
              control={control}
              render={({ field }) => (
                <Textarea {...field} placeholder="Ex: Cocody" rows={2} {...getFieldStyles(!!errors.adressePostale)} />
              )}
            />
            {errors.adressePostale && (
              <Text color={errorRed} fontSize="sm">{String(errors.adressePostale.message)}</Text>
            )}
          </FormControl>
        </GridItem>
      </Grid>

      <Grid templateColumns="repeat(3, 1fr)" gap={2}>
        <GridItem>
          <FormControl isInvalid={!!errors.email}>
            <FormLabel color={labelColor}>Email</FormLabel>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Ex: debiteur@example.com" type="email" {...getFieldStyles(!!errors.email)} />
              )}
            />
            {errors.email && (
              <Text color={errorRed} fontSize="sm">{String(errors.email.message)}</Text>
            )}
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.telephone}>
            <FormLabel color={labelColor}>Téléphone</FormLabel>
            <Controller
              name="telephone"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Ex: +225 27 12 34 56 78" {...getFieldStyles(!!errors.telephone)} />
              )}
            />
            {errors.telephone && (
              <Text color={errorRed} fontSize="sm">{String(errors.telephone.message)}</Text>
            )}
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.numeroCell}>
            <FormLabel color={labelColor}>N° Cellulaire</FormLabel>
            <Controller
              name="numeroCell"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Ex: +225 07 12 34 56 78" {...getFieldStyles(!!errors.numeroCell)} />
              )}
            />
            {errors.numeroCell && (
              <Text color={errorRed} fontSize="sm">{String(errors.numeroCell.message)}</Text>
            )}
          </FormControl>
        </GridItem>
      </Grid>

      <Grid templateColumns="repeat(3, 1fr)" gap={2}>
        <GridItem>
          <FormControl isInvalid={!!errors.typeDebiteur}>
            <FormLabel color={labelColor}>Type débiteur</FormLabel>
            <Controller
              name="typeDebiteur"
              control={control}
              render={({ field }) => (
                readOnly ? (
                  <Input 
                    value={getTypeDebiteurLibelle(field.value)} 
                    isReadOnly 
                    color="gray.700"
                    {...getFieldStyles(!!errors.typeDebiteur)} 
                    bg="gray.100"
                  />
                ) : (
                  <Select 
                    {...field} 
                    placeholder="Sélectionner un type" 
                    borderColor={primaryGreen}
                    bg="gray.100"
                    color="gray.700"
                    _focus={{ borderColor: primaryGreen }}
                    _hover={{ bg: "gray.100" }}
                  >
                    {loadingTypesDebiteur ? (
                      <option key="loading" value="">Chargement...</option>
                    ) : (
                      <>
                        {Array.isArray(typesDebiteur) && typesDebiteur.length > 0 ? (
                          typesDebiteur.filter((t: any) => t).map((type: any, index: number) => {
                            // Support pour les deux formats : API (TYPDEB_CODE/TYPDEB_LIB) et mock (id/libelle/code)
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
                  </Select>
                )
              )}
            />
            {errors.typeDebiteur && (
              <Text color={errorRed} fontSize="sm">{String(errors.typeDebiteur.message)}</Text>
            )}
          </FormControl>
        </GridItem>
      </Grid>
    </VStack>
  );

  // Étape 2: Personne physique
  const renderStep2Physique = () => (
    <VStack spacing={2} align="stretch">
      <Text fontSize="lg" fontWeight="bold" mb={4} color={titleColor}>Personne physique</Text>
      
      <Grid templateColumns="repeat(3, 1fr)" gap={2}>
        <GridItem>
          <FormControl isInvalid={!!errors.civilite}>
            <FormLabel color={labelColor}>Civilité</FormLabel>
            <Controller
              name="civilite"
              control={control}
              render={({ field }) => (
                readOnly ? (
                  <Input 
                    value={getCiviliteLibelle(field.value)} 
                    isReadOnly 
                    color="gray.700"
                    {...getFieldStyles(!!errors.civilite)} 
                    bg="gray.100"
                  />
                ) : (
                  <Select 
                    {...field}
                    placeholder="Sélectionner" 
                    borderColor={primaryGreen}
                    bg="gray.100"
                    color="gray.700"
                    _focus={{ borderColor: primaryGreen }}
                    _hover={{ bg: "gray.100" }}
                  >
                    {loadingCivilites ? (
                      <option key="loading" value="">Chargement...</option>
                    ) : (
                      <>
                        {Array.isArray(civilites) && civilites.length > 0 ? (
                          civilites.filter((c: any) => c).map((civilite: any, index: number) => {
                            // Support pour les deux formats : API (CIV_CODE/CIV_LIB) et mock (id/libelle/code)
                            const code = civilite.CIV_CODE || civilite.code || civilite.id;
                            const libelle = civilite.CIV_LIB || civilite.libelle;
                            return (
                              <option key={code || `civilite-${index}`} value={code}>
                                {libelle}
                              </option>
                            );
                          })
                        ) : (
                          <option key="empty" value="">Aucune civilité disponible</option>
                        )}
                      </>
                    )}
                  </Select>
                )
              )}
            />
            {errors.civilite && (
              <Text color={errorRed} fontSize="sm">{String(errors.civilite.message)}</Text>
            )}
          </FormControl>
        </GridItem>
        

        <GridItem>
          <FormControl isInvalid={!!errors.nom}>
            <FormLabel color={labelColor}>Nom</FormLabel>
            <Controller
              name="nom"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Ex: Koné" {...getFieldStyles(!!errors.nom)} />
              )}
            />
            {errors.nom && (
              <Text color={errorRed} fontSize="sm">{String(errors.nom.message)}</Text>
            )}
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.prenom}>
            <FormLabel color={labelColor}>Prénom</FormLabel>
            <Controller
              name="prenom"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Ex: Amadou" {...getFieldStyles(!!errors.prenom)} />
              )}
            />
            {errors.prenom && (
              <Text color={errorRed} fontSize="sm">{String(errors.prenom.message)}</Text>
            )}
          </FormControl>
        </GridItem>
      </Grid>

      <Grid templateColumns="repeat(3, 1fr)" gap={2}>
        <GridItem>
          <FormControl isInvalid={!!errors.dateNaissance}>
            <FormLabel color={labelColor}>Date de naissance</FormLabel>
            <Controller
              name="dateNaissance"
              control={control}
              render={({ field }) => (
                <Input {...field} type="date" {...getFieldStyles(!!errors.dateNaissance)} />
              )}
            />
            {errors.dateNaissance && (
              <Text color={errorRed} fontSize="sm">{String(errors.dateNaissance.message)}</Text>
            )}
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.lieuNaissance}>
            <FormLabel color={labelColor}>Lieu de naissance</FormLabel>
            <Controller
              name="lieuNaissance"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Ex: Abidjan" {...getFieldStyles(!!errors.lieuNaissance)} />
              )}
            />
            {errors.lieuNaissance && (
              <Text color={errorRed} fontSize="sm">{String(errors.lieuNaissance.message)}</Text>
            )}
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.quartier}>
            <FormLabel color={labelColor}>Quartier</FormLabel>
            <Controller
              name="quartier"
              control={control}
              render={({ field }) => (
                readOnly ? (
                  <Input 
                    value={getQuartierLibelle(field.value)} 
                    isReadOnly 
                    color="gray.700"
                    {...getFieldStyles(!!errors.quartier)} 
                    bg="gray.100"
                  />
                ) : (
                  <Select 
                    {...field}
                    value={field.value || ''}
                    placeholder="Sélectionner" 
                    {...getFieldStyles(!!errors.quartier)}
                    bg="gray.100"
                    color="gray.700"
                    _hover={{ bg: "gray.100" }}
                  >
                    {loadingQuartiers ? (
                      <option key="loading" value="">Chargement...</option>
                    ) : (
                      <>
                        {Array.isArray(quartiers) && quartiers.length > 0 ? (
                          quartiers.filter((q: any) => q).map((quartier: any, index: number) => {
                            const code = quartier.QUART_CODE || quartier.code || quartier.id;
                            const libelle = quartier.QUART_LIB || quartier.libelle;
                            return (
                              <option key={code || `quartier-${index}`} value={code}>
                                {libelle}
                              </option>
                            );
                          })
                        ) : (
                          <option key="empty" value="">Aucun quartier disponible</option>
                        )}
                      </>
                    )}
                  </Select>
                )
              )}
            />
            {errors.quartier && (
              <Text color={errorRed} fontSize="sm">{String(errors.quartier.message)}</Text>
            )}
          </FormControl>
        </GridItem>
      </Grid>

      <Grid templateColumns="repeat(3, 1fr)" gap={2}>
        <GridItem>
          <FormControl isInvalid={!!errors.nationalite}>
            <FormLabel color={labelColor}>Nationalité</FormLabel>
            <Controller
              name="nationalite"
              control={control}
              render={({ field }) => (
                readOnly ? (
                  <Input 
                    value={getNationaliteLibelle(field.value)} 
                    isReadOnly 
                    color="gray.700"
                    {...getFieldStyles(!!errors.nationalite)} 
                    bg="gray.100"
                  />
                ) : (
                  <Select 
                    {...field}
                    value={field.value || ''}
                    placeholder="Sélectionner" 
                    {...getFieldStyles(!!errors.nationalite)}
                    bg="gray.100"
                    color="gray.700"
                    _hover={{ bg: "gray.100" }}
                  >
                    {loadingNationalites ? (
                      <option key="loading" value="">Chargement...</option>
                    ) : (
                      <>
                        {Array.isArray(nationalites) && nationalites.length > 0 ? (
                          nationalites.filter((n: any) => n).map((nationalite: any, index: number) => {
                            const code = nationalite.NAT_CODE || nationalite.code || nationalite.id;
                            const libelle = nationalite.NAT_LIB || nationalite.libelle;
                            return (
                              <option key={code || `nationalite-${index}`} value={code}>
                                {libelle}
                              </option>
                            );
                          })
                        ) : (
                          <option key="empty" value="">Aucune nationalité disponible</option>
                        )}
                      </>
                    )}
                  </Select>
                )
              )}
            />
            {errors.nationalite && (
              <Text color={errorRed} fontSize="sm">{String(errors.nationalite.message)}</Text>
            )}
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.fonction}>
            <FormLabel color={labelColor}>Fonction</FormLabel>
            <Controller
              name="fonction"
              control={control}
              render={({ field }) => (
                readOnly ? (
                  <Input 
                    value={getFonctionLibelle(field.value)} 
                    isReadOnly 
                    color="gray.700"
                    {...getFieldStyles(!!errors.fonction)} 
                    bg="gray.100"
                  />
                ) : (
                  <Select 
                    {...field} 
                    placeholder="Sélectionner" 
                    borderColor={primaryGreen}
                    bg="gray.100"
                    color="gray.700"
                    _focus={{ borderColor: primaryGreen }}
                    _hover={{ bg: "gray.100" }}
                  >
                    {loadingFonctions ? (
                      <option key="loading" value="">Chargement...</option>
                    ) : (
                      <>
                        {Array.isArray(fonctions) && fonctions.length > 0 ? (
                          fonctions.filter((f: any) => f).map((fonction: any, index: number) => {
                            const code = fonction.FONCT_CODE || fonction.code || fonction.id;
                            const libelle = fonction.FONCT_LIB || fonction.libelle;
                            return (
                              <option key={code || `fonction-${index}`} value={code}>
                                {libelle}
                              </option>
                            );
                          })
                        ) : (
                          <option key="empty" value="">Aucune fonction disponible</option>
                        )}
                      </>
                    )}
                  </Select>
                )
              )}
            />
            {errors.fonction && (
              <Text color={errorRed} fontSize="sm">{String(errors.fonction.message)}</Text>
            )}
          </FormControl>
        </GridItem>
      </Grid>

      <Grid templateColumns="repeat(3, 1fr)" gap={2}>
        <GridItem>
          <FormControl isInvalid={!!errors.profession}>
            <FormLabel color={labelColor}>Profession</FormLabel>
            <Controller
              name="profession"
              control={control}
              render={({ field }) => (
                readOnly ? (
                  <Input 
                    value={getProfessionLibelle(field.value)} 
                    isReadOnly 
                    color="gray.700"
                    {...getFieldStyles(!!errors.profession)} 
                    bg="gray.100"
                  />
                ) : (
                  <Select 
                    {...field} 
                    placeholder="Sélectionner" 
                    {...getFieldStyles(!!errors.profession)}
                    bg="gray.100"
                    color="gray.700"
                    _hover={{ bg: "gray.100" }}
                  >
                    {loadingProfessions ? (
                      <option value="">Chargement...</option>
                    ) : (
                      Array.isArray(professions) && professions.map((profession: any) => {
                        const code = profession.PROFES_CODE || profession.code || profession.id;
                        const libelle = profession.PROFES_LIB || profession.libelle;
                        return (
                          <option key={code} value={code}>
                            {libelle}
                          </option>
                        );
                      })
                    )}
                  </Select>
                )
              )}
            />
            {errors.profession && (
              <Text color={errorRed} fontSize="sm">{String(errors.profession.message)}</Text>
            )}
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.employeur}>
            <FormLabel color={labelColor}>Employeur</FormLabel>
            <Controller
              name="employeur"
              control={control}
              render={({ field }) => (
                readOnly ? (
                  <Input 
                    value={getEntiteLibelle(field.value)} 
                    isReadOnly 
                    color="gray.700"
                    {...getFieldStyles(!!errors.employeur)} 
                    bg="gray.100"
                  />
                ) : (
                  <Select 
                    {...field}
                    value={field.value || ''}
                    placeholder="Sélectionner" 
                    {...getFieldStyles(!!errors.employeur)}
                    bg="gray.100"
                    color="gray.700"
                    _hover={{ bg: "gray.100" }}
                  >
                    {loadingEntites ? (
                      <option key="loading" value="">Chargement...</option>
                    ) : (
                      <>
                        {Array.isArray(entites) && entites.length > 0 ? (
                          entites.filter((e: any) => e).map((entite: any, index: number) => {
                            const code = entite.ENTITE_CODE || entite.ENT_CODE || entite.code || entite.id;
                            const libelle = entite.ENTITE_LIB || entite.ENT_LIB || entite.libelle;
                            return (
                              <option key={code || `entite-${index}`} value={code}>
                                {libelle}
                              </option>
                            );
                          })
                        ) : (
                          <option key="empty" value="">Aucun employeur disponible</option>
                        )}
                      </>
                    )}
                  </Select>
                )
              )}
            />
            {errors.employeur && (
              <Text color={errorRed} fontSize="sm">{String(errors.employeur.message)}</Text>
            )}
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.statutSalarie}>
            <FormLabel color={labelColor}>Statut Salarié</FormLabel>
            <Controller
              name="statutSalarie"
              control={control}
              render={({ field }) => (
                readOnly ? (
                  <Input 
                    value={getStatutSalarieLibelle(field.value)} 
                    isReadOnly 
                    color="gray.700"
                    {...getFieldStyles(!!errors.statutSalarie)} 
                    bg="gray.100"
                  />
                ) : (
                  <Select 
                    {...field} 
                    placeholder="Sélectionner" 
                    {...getFieldStyles(!!errors.statutSalarie)}
                    bg="gray.100"
                    color="gray.700"
                    _hover={{ bg: "gray.100" }}
                  >
                    {loadingStatutsSalarie ? (
                      <option value="">Chargement...</option>
                    ) : (
                      Array.isArray(statutsSalarie) && statutsSalarie.map((statut: any) => {
                        const code = statut.STATSAL_CODE || statut.code || statut.id;
                        const libelle = statut.STATSAL_LIB || statut.libelle;
                        return (
                          <option key={code} value={code}>
                            {libelle}
                          </option>
                        );
                      })
                    )}
                  </Select>
                )
              )}
            />
            {errors.statutSalarie && (
              <Text color={errorRed} fontSize="sm">{String(errors.statutSalarie.message)}</Text>
            )}
          </FormControl>
        </GridItem>
      </Grid>
      
      <Grid templateColumns="repeat(3, 1fr)" gap={2}>
        <GridItem>
          <FormControl isInvalid={!!errors.matricule}>
            <FormLabel color={labelColor}>Matricule</FormLabel>
            <Controller
              name="matricule"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Ex: MAT123456" {...getFieldStyles(!!errors.matricule)} />
              )}
            />
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.sexe}>
            <FormLabel color={labelColor}>Sexe</FormLabel>
            <Controller
              name="sexe"
              control={control}
              render={({ field }) => (
                readOnly ? (
                  <Input 
                    value={field.value === 'M' ? 'Masculin' : field.value === 'F' ? 'Féminin' : field.value} 
                    isReadOnly 
                    color="gray.700"
                    {...getFieldStyles(!!errors.sexe)} 
                    bg="gray.100"
                  />
                ) : (
                  <Select 
                    {...field} 
                    placeholder="Sélectionner" 
                    {...getFieldStyles(!!errors.sexe)}
                    bg="gray.100"
                    color="gray.700"
                    _hover={{ bg: "gray.100" }}
                  >
                    <option value="M">Masculin</option>
                    <option value="F">Féminin</option>
                  </Select>
                )
              )}
            />
            {errors.sexe && (
              <Text color={errorRed} fontSize="sm">{String(errors.sexe.message)}</Text>
            )}
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.dateDeces}>
            <FormLabel color={labelColor}>Date de décès</FormLabel>
            <Controller
              name="dateDeces"
              control={control}
              render={({ field }) => (
                <Input {...field} type="date" {...getFieldStyles(!!errors.dateDeces)} />
              )}
            />
          </FormControl>
        </GridItem>
      </Grid>

      <Grid templateColumns="repeat(3, 1fr)" gap={2}>
        <GridItem>
          <FormControl isInvalid={!!errors.naturePieceIdentite}>
            <FormLabel color={labelColor}>Nature de pièce d'identité</FormLabel>
            <Controller
              name="naturePieceIdentite"
              control={control}
              render={({ field }) => (
                readOnly ? (
                  <Input 
                    value={field.value === 'CNI' ? 'CNI' : field.value === 'Passeport' ? 'Passeport' : field.value === 'Permis' ? 'Permis de conduire' : field.value === 'autre' ? 'Autre' : field.value} 
                    isReadOnly 
                    color="gray.700"
                    {...getFieldStyles(!!errors.naturePieceIdentite)} 
                    bg="gray.100"
                  />
                ) : (
                  <Select 
                    {...field} 
                    placeholder="Sélectionner" 
                    {...getFieldStyles(!!errors.naturePieceIdentite)}
                    bg="gray.100"
                    color="gray.700"
                    _hover={{ bg: "gray.100" }}
                  >
                    <option value="CNI">CNI</option>
                    <option value="Passeport">Passeport</option>
                    <option value="Permis">Permis de conduire</option>
                    <option value="autre">Autre</option>
                  </Select>
                )
              )}
            />
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.numeroPieceIdentite}>
            <FormLabel color={labelColor}>Numéro de pièce d'identité</FormLabel>
            <Controller
              name="numeroPieceIdentite"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Ex: 123456789" {...getFieldStyles(!!errors.numeroPieceIdentite)} />
              )}
            />
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.dateEtablie}>
            <FormLabel color={labelColor}>Date établie</FormLabel>
            <Controller
              name="dateEtablie"
              control={control}
              render={({ field }) => (
                <Input {...field} type="date" {...getFieldStyles(!!errors.dateEtablie)} />
              )}
            />
          </FormControl>
        </GridItem>
      </Grid>

      <Grid templateColumns="repeat(3, 1fr)" gap={2}>
        <GridItem>
          <FormControl isInvalid={!!errors.lieuEtablie}>
            <FormLabel color={labelColor}>Lieu établi</FormLabel>
            <Controller
              name="lieuEtablie"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Ex: Abidjan" {...getFieldStyles(!!errors.lieuEtablie)} />
              )}
            />
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.statutMatrimonial}>
            <FormLabel color={labelColor}>Statut matrimonial</FormLabel>
            <Controller
              name="statutMatrimonial"
              control={control}
              render={({ field }) => (
                readOnly ? (
                  <Input 
                    value={field.value === 'celibataire' ? 'Célibataire' : field.value === 'marie' ? 'Marié(e)' : field.value === 'divorce' ? 'Divorcé(e)' : field.value === 'veuf' ? 'Veuf/Veuve' : field.value} 
                    isReadOnly 
                    color="gray.700"
                    {...getFieldStyles(!!errors.statutMatrimonial)} 
                    bg="gray.100"
                  />
                ) : (
                  <Select 
                    {...field} 
                    placeholder="Sélectionner" 
                    {...getFieldStyles(!!errors.statutMatrimonial)}
                    bg="gray.100"
                    color="gray.700"
                    _hover={{ bg: "gray.100" }}
                  >
                    <option value="celibataire">Célibataire</option>
                    <option value="marie">Marié(e)</option>
                    <option value="divorce">Divorcé(e)</option>
                    <option value="veuf">Veuf/Veuve</option>
                  </Select>
                )
              )}
            />
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.regimeMariage}>
            <FormLabel color={labelColor}>Régime de mariage</FormLabel>
            <Controller
              name="regimeMariage"
              control={control}
              render={({ field }) => (
                readOnly ? (
                  <Input 
                    value={field.value === 'communaute' ? 'Communauté' : field.value === 'separation' ? 'Séparation de biens' : field.value === 'participation' ? 'Participation aux acquêts' : field.value} 
                    isReadOnly 
                    color="gray.700"
                    {...getFieldStyles(!!errors.regimeMariage)} 
                    bg="gray.100"
                  />
                ) : (
                  <Select 
                    {...field} 
                    placeholder="Sélectionner" 
                    {...getFieldStyles(!!errors.regimeMariage)}
                    bg="gray.100"
                    color="gray.700"
                    _hover={{ bg: "gray.100" }}
                  >
                    <option value="communaute">Communauté</option>
                    <option value="separation">Séparation de biens</option>
                    <option value="participation">Participation aux acquêts</option>
                  </Select>
                )
              )}
            />
          </FormControl>
        </GridItem>
      </Grid>

      <Grid templateColumns="repeat(3, 1fr)" gap={2}>
        <GridItem>
          <FormControl isInvalid={!!errors.nombreEnfant}>
            <FormLabel color={labelColor}>Nombre d'enfant</FormLabel>
            <Controller
              name="nombreEnfant"
              control={control}
              render={({ field }) => (
                <Input {...field} type="number" placeholder="0" min="0" {...getFieldStyles(!!errors.nombreEnfant)} />
              )}
            />
          </FormControl>
        </GridItem>
      </Grid>

      <Divider />

      <Text fontSize="md" fontWeight="semibold" color={titleColor}>Informations du conjoint</Text>

      <Grid templateColumns="repeat(3, 1fr)" gap={2}>
        <GridItem>
          <FormControl isInvalid={!!errors.nomConjoint}>
            <FormLabel color={labelColor}>Nom du conjoint</FormLabel>
            <Controller
              name="nomConjoint"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Ex: Traoré" {...getFieldStyles(!!errors.nomConjoint)} />
              )}
            />
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.prenomsConjoint}>
            <FormLabel color={labelColor}>Prénoms du conjoint</FormLabel>
            <Controller
              name="prenomsConjoint"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Ex: Fatou" {...getFieldStyles(!!errors.prenomsConjoint)} />
              )}
            />
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.dateNaissanceConjoint}>
            <FormLabel color={labelColor}>Date de naissance du conjoint</FormLabel>
            <Controller
              name="dateNaissanceConjoint"
              control={control}
              render={({ field }) => (
                <Input {...field} type="date" {...getFieldStyles(!!errors.dateNaissanceConjoint)} />
              )}
            />
          </FormControl>
        </GridItem>
      </Grid>

      <Grid templateColumns="repeat(3, 1fr)" gap={2}>
        <GridItem>
          <FormControl isInvalid={!!errors.telConjoint}>
            <FormLabel color={labelColor}>Téléphone du conjoint</FormLabel>
            <Controller
              name="telConjoint"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Ex: +225 07 12 34 56 78" {...getFieldStyles(!!errors.telConjoint)} />
              )}
            />
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.numeroPieceConjoint}>
            <FormLabel color={labelColor}>Numéro de pièce du conjoint</FormLabel>
            <Controller
              name="numeroPieceConjoint"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Ex: 987654321" {...getFieldStyles(!!errors.numeroPieceConjoint)} />
              )}
            />
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.adresseConjoint}>
            <FormLabel color={labelColor}>Adresse du conjoint</FormLabel>
            <Controller
              name="adresseConjoint"
              control={control}
              render={({ field }) => (
                <Textarea {...field} placeholder="Adresse complète" rows={2} {...getFieldStyles(!!errors.adresseConjoint)} />
              )}
            />
          </FormControl>
        </GridItem>
      </Grid>

      <Divider />

      <Text fontSize="md" fontWeight="semibold" color={titleColor}>Informations des parents</Text>

      <Grid templateColumns="repeat(3, 1fr)" gap={2}>
        <GridItem>
          <FormControl isInvalid={!!errors.nomPere}>
            <FormLabel color={labelColor}>Nom du père</FormLabel>
            <Controller
              name="nomPere"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Ex: Koné" {...getFieldStyles(!!errors.nomPere)} />
              )}
            />
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.prenomsPere}>
            <FormLabel color={labelColor}>Prénoms du père</FormLabel>
            <Controller
              name="prenomsPere"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Ex: Mamadou" {...getFieldStyles(!!errors.prenomsPere)} />
              )}
            />
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.nomMere}>
            <FormLabel color={labelColor}>Nom de la mère</FormLabel>
            <Controller
              name="nomMere"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Ex: Traoré" {...getFieldStyles(!!errors.nomMere)} />
              )}
            />
          </FormControl>
        </GridItem>
      </Grid>

      <Grid templateColumns="repeat(3, 1fr)" gap={2}>
        <GridItem>
          <FormControl isInvalid={!!errors.prenomsMere}>
            <FormLabel color={labelColor}>Prénoms de la mère</FormLabel>
            <Controller
              name="prenomsMere"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Ex: Aminata" {...getFieldStyles(!!errors.prenomsMere)} />
              )}
            />
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.rue}>
            <FormLabel color={labelColor}>Rue</FormLabel>
            <Controller
              name="rue"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Ex: Rue des Écoles, N°123" {...getFieldStyles(!!errors.rue)} />
              )}
            />
          </FormControl>
        </GridItem>
      </Grid>
    </VStack>
  );

  // Étape 2: Personne morale
  const renderStep2Moral = () => (
    <VStack spacing={2} align="stretch">
      <Text fontSize="lg" fontWeight="bold" mb={4} color={titleColor}>Personne morale</Text>
      
      <Grid templateColumns="repeat(3, 1fr)" gap={2}>
        <GridItem>
          <FormControl isInvalid={!!errors.registreCommerce}>
            <FormLabel color={labelColor}>Registre de commerce</FormLabel>
            <Controller
              name="registreCommerce"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Ex: CI-ABJ-2024-A-12345" {...getFieldStyles(!!errors.registreCommerce)} />
              )}
            />
            {errors.registreCommerce && (
              <Text color={errorRed} fontSize="sm">{String(errors.registreCommerce.message)}</Text>
            )}
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.raisonSociale}>
            <FormLabel color={labelColor}>Raison sociale</FormLabel>
            <Controller
              name="raisonSociale"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Ex: Société ABC SARL" {...getFieldStyles(!!errors.raisonSociale)} />
              )}
            />
            {errors.raisonSociale && (
              <Text color={errorRed} fontSize="sm">{String(errors.raisonSociale.message)}</Text>
            )}
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.capitalSocial}>
            <FormLabel color={labelColor}>Capital social</FormLabel>
            <Controller
              name="capitalSocial"
              control={control}
              render={({ field }) => (
                <Input 
                  {...field}
                  placeholder="Ex: 10 000 000"
                  {...getFieldStyles(!!errors.capitalSocial)}
                  onChange={(e) => {
                    // Enlever tous les espaces
                    let value = e.target.value.replace(/\s/g, '');
                    
                    // Ne garder que les chiffres
                    const numbers = value.replace(/\D/g, '');
                    
                    // Formater avec des espaces tous les 3 chiffres
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
          </FormControl>
        </GridItem>
      </Grid>

      <Grid templateColumns="repeat(3, 1fr)" gap={2}>
        <GridItem>
          <FormControl isInvalid={!!errors.formeJuridique}>
            <FormLabel color={labelColor}>Forme juridique</FormLabel>
            <Controller
              name="formeJuridique"
              control={control}
              render={({ field }) => (
                readOnly ? (
                  <Input 
                    value={field.value === 'SARL' ? 'SARL' : field.value === 'SA' ? 'SA' : field.value === 'SNC' ? 'SNC' : field.value === 'EURL' ? 'EURL' : field.value === 'SAS' ? 'SAS' : field.value === 'autre' ? 'Autre' : field.value} 
                    isReadOnly 
                    color="gray.700"
                    {...getFieldStyles(!!errors.formeJuridique)} 
                    bg="gray.100"
                  />
                ) : (
                  <Select 
                    {...field} 
                    placeholder="Sélectionner" 
                    {...getFieldStyles(!!errors.formeJuridique)}
                    bg="gray.100"
                    color="gray.700"
                    _hover={{ bg: "gray.100" }}
                  >
                    <option value="SARL">SARL</option>
                    <option value="SA">SA</option>
                    <option value="SNC">SNC</option>
                    <option value="EURL">EURL</option>
                    <option value="SAS">SAS</option>
                    <option value="autre">Autre</option>
                  </Select>
                )
              )}
            />
            {errors.formeJuridique && (
              <Text color={errorRed} fontSize="sm">{String(errors.formeJuridique.message)}</Text>
            )}
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.domaineActivite}>
            <FormLabel color={labelColor}>Domaine d'activité</FormLabel>
            <Box flex="1">
              <Controller
                name="domaineActivite"
                control={control}
                render={({ field }) => (
                  readOnly ? (
                    <Input 
                      value={field.value === 'commerce' ? 'Commerce' : field.value === 'industrie' ? 'Industrie' : field.value === 'services' ? 'Services' : field.value === 'agriculture' ? 'Agriculture' : field.value === 'batiment' ? 'Bâtiment' : field.value === 'transport' ? 'Transport' : field.value === 'autre' ? 'Autre' : field.value} 
                      isReadOnly 
                      color="gray.700"
                      {...getFieldStyles(!!errors.domaineActivite)} 
                      bg="gray.100"
                    />
                  ) : (
                    <Select 
                      {...field} 
                      placeholder="Sélectionner" 
                      {...getFieldStyles(!!errors.domaineActivite)}
                      bg="gray.100"
                      color="gray.700"
                      _hover={{ bg: "gray.100" }}
                    >
                      <option value="commerce">Commerce</option>
                      <option value="industrie">Industrie</option>
                      <option value="services">Services</option>
                      <option value="agriculture">Agriculture</option>
                      <option value="batiment">Bâtiment</option>
                      <option value="transport">Transport</option>
                      <option value="autre">Autre</option>
                    </Select>
                  )
                )}
              />
            </Box>
            {errors.domaineActivite && (
              <Text color={errorRed} fontSize="sm">{String(errors.domaineActivite.message)}</Text>
            )}
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.nomGerant}>
            <FormLabel color={labelColor}>Nom du gérant</FormLabel>
            <Box flex="1">
              <Controller
                name="nomGerant"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="Ex: Koné Amadou" {...getFieldStyles(!!errors.nomGerant)} />
                )}
              />
            </Box>
            {errors.nomGerant && (
              <Text color={errorRed} fontSize="sm">{String(errors.nomGerant.message)}</Text>
            )}
          </FormControl>
        </GridItem>
      </Grid>

      <Grid templateColumns="repeat(3, 1fr)" gap={2}>
        <GridItem colSpan={3}>
          <FormControl isInvalid={!!errors.siegeSocial}>
            <FormLabel color={labelColor}>Siège social</FormLabel>
            <Box flex="1">
              <Controller
                name="siegeSocial"
                control={control}
                render={({ field }) => (
                  <Textarea {...field} placeholder="Ex: Cocody, Angré 8ème Tranche, Abidjan" rows={2} {...getFieldStyles(!!errors.siegeSocial)} />
                )}
              />
            </Box>
            {errors.siegeSocial && (
              <Text color={errorRed} fontSize="sm">{String(errors.siegeSocial.message)}</Text>
            )}
          </FormControl>
        </GridItem>
      </Grid>
        </VStack>
  );

  // Étape 3: Domiciliation
  const renderStep3 = () => (
    <VStack spacing={2} align="stretch">
      <Text fontSize="lg" fontWeight="bold" mb={4} color={titleColor}>Domiciliation</Text>
      
      <Grid templateColumns="repeat(3, 1fr)" gap={2}>
        <GridItem>
          <FormControl isInvalid={!!errors.type}>
            <FormLabel color={labelColor}>Type</FormLabel>
            <Box flex="1">
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  readOnly ? (
                    <Input 
                      value={getTypeDomicilLibelle(field.value)} 
                      isReadOnly 
                      color="gray.700"
                      {...getFieldStyles(!!errors.type)} 
                      bg="gray.100"
                    />
                  ) : (
                    <Select 
                      {...field} 
                      placeholder="Sélectionner" 
                      {...getFieldStyles(!!errors.type)}
                      bg="gray.100"
                      color="gray.700"
                      isDisabled={loadingTypesDomicil}
                      _hover={{ bg: "gray.100" }}
                    >
                      {loadingTypesDomicil ? (
                        <option value="">Chargement...</option>
                      ) : (
                        Array.isArray(typesDomicil) && typesDomicil.map((type: any) => {
                          const code = type.TYPDOM_CODE || type.code || type.id;
                          const libelle = type.TYPDOM_LIB || type.libelle;
                          return (
                            <option key={code} value={code}>
                              {libelle}
                            </option>
                          );
                        })
                      )}
                    </Select>
                  )
                )}
              />
            </Box>
            {errors.type && (
              <Text color={errorRed} fontSize="sm">{String(errors.type.message)}</Text>
            )}
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.numeroCompte}>
            <FormLabel color={labelColor}>Numéro du compte</FormLabel>
            <Box flex="1">
              <Controller
                name="numeroCompte"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="Ex: 1234567890123456" {...getFieldStyles(!!errors.numeroCompte)} />
                )}
              />
            </Box>
            {errors.numeroCompte && (
              <Text color={errorRed} fontSize="sm">{String(errors.numeroCompte.message)}</Text>
            )}
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.libelle}>
            <FormLabel color={labelColor}>Libellé</FormLabel>
            <Box flex="1">
              <Controller
                name="libelle"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="Ex: Compte principal" {...getFieldStyles(!!errors.libelle)} />
                )}
              />
            </Box>
            {errors.libelle && (
              <Text color={errorRed} fontSize="sm">{String(errors.libelle.message)}</Text>
            )}
          </FormControl>
        </GridItem>
      </Grid>

      <Grid templateColumns="repeat(3, 1fr)" gap={2}>
        <GridItem>
          <FormControl isInvalid={!!errors.banque}>
            <FormLabel color={labelColor}>Banque</FormLabel>
            <Box flex="1">
              <Controller
                name="banque"
                control={control}
                render={({ field }) => (
                  readOnly ? (
                    <Input 
                      value={getBanqueLibelle(field.value)} 
                      isReadOnly 
                      color="gray.700"
                      {...getFieldStyles(!!errors.banque)} 
                      bg="gray.100"
                    />
                  ) : (
                    <Select 
                      {...field} 
                      placeholder="Sélectionner" 
                      {...getFieldStyles(!!errors.banque)}
                      bg="gray.100"
                      color="gray.700"
                      _hover={{ bg: "gray.100" }}
                    >
                      {loadingBanques ? (
                        <option value="">Chargement...</option>
                      ) : (
                        Array.isArray(banques) && banques.map((banque: any) => {
                          const code = banque.BQ_CODE || banque.BANQ_CODE || banque.code || banque.id;
                          const libelle = banque.BQ_LIB || banque.BANQ_LIB || banque.libelle;
                          return (
                            <option key={code} value={code}>
                              {code} - {libelle}
                            </option>
                          );
                        })
                      )}
                    </Select>
                  )
                )}
              />
            </Box>
            {errors.banque && (
              <Text color={errorRed} fontSize="sm">{String(errors.banque.message)}</Text>
            )}
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.banqueAgence}>
            <FormLabel color={labelColor}>Banque agence</FormLabel>
            <Box flex="1">
              <Controller
                name="banqueAgence"
                control={control}
                render={({ field }) => (
                  readOnly ? (
                    <Input 
                      value={getAgenceBanqueLibelle(field.value)} 
                      isReadOnly 
                      color="gray.700"
                      {...getFieldStyles(!!errors.banqueAgence)} 
                      bg="gray.100"
                    />
                  ) : (
                    <Select 
                      {...field} 
                      placeholder="Sélectionner" 
                      {...getFieldStyles(!!errors.banqueAgence)}
                      bg="gray.100"
                      color="gray.700"
                      _hover={{ bg: "gray.100" }}
                    >
                      {loadingAgencesBanque ? (
                        <option value="">Chargement...</option>
                      ) : (
                        Array.isArray(agencesBanque) && agencesBanque
                          .filter((agence: any) => {
                            // Filtrer par banque sélectionnée
                            const banqueSelectionnee = formData.domiciliation?.banque;
                            if (!banqueSelectionnee) return true; // Afficher toutes si aucune banque sélectionnée
                            const banqueAgence = agence.BQ_CODE || agence.banqueCode;
                            return banqueAgence === banqueSelectionnee;
                          })
                          .map((agence: any, index: number) => {
                            const code = agence.BQAG_NUM || agence.AGENCE_CODE || agence.code || agence.id || index;
                            const libelle = agence.BQAG_LIB || agence.AGENCE_LIB || agence.libelle;
                            return (
                              <option key={code} value={code}>
                                {code} - {libelle}
                              </option>
                            );
                          })
                      )}
                    </Select>
                  )
                )}
              />
            </Box>
            {errors.banqueAgence && (
              <Text color={errorRed} fontSize="sm">{String(errors.banqueAgence.message)}</Text>
            )}
          </FormControl>
        </GridItem>
      </Grid>
    </VStack>
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
    <Box
      sx={{
        '.chakra-form-control': {
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        },
        '.chakra-form__label': {
          marginBottom: 0,
          width: '120px',
          fontWeight: 600,
          color: '#111827',
          fontSize: '0.875rem',
          marginRight: '6px'
        },
        '.chakra-input, .chakra-textarea': {
          flex: 1,
          borderColor: '#d1d5db',
          backgroundColor: '#ffffff'
        },
        '.chakra-select': {
          flex: 1,
          borderColor: '#28A325 !important',
          backgroundColor: '#f3f4f6 !important',
          color: '#374151 !important',
          // Style pour les options du select
          '& option': {
            backgroundColor: 'white !important',
            color: 'black !important'
          }
        },
        '.chakra-input[readonly], .chakra-textarea[readonly]': {
          borderColor: '#28A325',
          backgroundColor: '#f3f4f6' // gray.100
        },
        // Bordure verte pour tous les champs désactivés/grisés
        '.chakra-input[disabled], .chakra-select[disabled], .chakra-textarea[disabled],\
         .chakra-input[aria-disabled="true"], .chakra-select[aria-disabled="true"], .chakra-textarea[aria-disabled="true"],\
         .chakra-input[data-disabled="true"], .chakra-select[data-disabled="true"], .chakra-textarea[data-disabled="true"]': {
          borderColor: '#28A325',
          backgroundColor: '#f3f4f6'
        }
      }}
    >
      {renderCurrentStep()}
    </Box>
  );
});

DebiteurForm.displayName = 'DebiteurForm';

export default DebiteurForm;
export { DebiteurForm };
