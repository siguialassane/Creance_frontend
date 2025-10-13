"use client"

import { useState, useEffect, useCallback, forwardRef, useImperativeHandle, useRef } from "react";
import { Box, VStack, HStack, FormControl, FormLabel, Input, Select, Textarea, Text, Divider, Grid, GridItem, Checkbox, Stack, Alert, AlertIcon } from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Import des hooks pour les données de sélection
import { useCivilites } from "@/hooks/useCivilites";
import { useNationalites } from "@/hooks/useNationalites";
import { useQuartiers } from "@/hooks/useQuartiers";
import { useFonctions } from "@/hooks/useFonctions";
import { useProfessions } from "@/hooks/useProfessions";
import { useStatutsSalarie } from "@/hooks/useStatutsSalarie";
import { useBanques } from "@/hooks/useBanques";
import { useAgencesBanque } from "@/hooks/useAgencesBanque";
import { useEntites } from "@/hooks/useEntites";
import { useTypesDebiteur } from "@/hooks/useTypesDebiteur";
import { useCategoriesDebiteur } from "@/hooks/useCategoriesDebiteur";
import { useTypesDomicil } from "@/hooks/useTypesDomicil";
import { useUtilisateurs } from "@/hooks/useUtilisateurs";

// Schémas de validation pour chaque étape
const step1Schema = z.object({
  codeDebiteur: z.string().optional(), // Auto-généré après validation
  categorieDebiteur: z.string().min(1, "La catégorie débiteur est requise"),
  adressePostale: z.string().min(1, "L'adresse postale est requise"),
  email: z.string().email("Email invalide").min(1, "L'email est requis"),
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

  // Hooks pour les données de sélection
  const { data: civilites, isLoading: loadingCivilites } = useCivilites();
  const { data: nationalites, isLoading: loadingNationalites } = useNationalites();
  const { data: quartiers, isLoading: loadingQuartiers } = useQuartiers();
  const { data: fonctions, isLoading: loadingFonctions } = useFonctions();
  const { data: professions, isLoading: loadingProfessions } = useProfessions();
  const { data: statutsSalarie, isLoading: loadingStatutsSalarie } = useStatutsSalarie();
  const { data: banques, isLoading: loadingBanques } = useBanques();
  const { data: agencesBanque, isLoading: loadingAgencesBanque } = useAgencesBanque();
  const { data: entites, isLoading: loadingEntites } = useEntites();
  
  // Hooks pour les champs d'interrogation (récupérés automatiquement)
  const { data: typesDebiteur, isLoading: loadingTypesDebiteur } = useTypesDebiteur();
  const { data: categoriesDebiteur, isLoading: loadingCategoriesDebiteur } = useCategoriesDebiteur();
  const { data: typesDomicil, isLoading: loadingTypesDomicil } = useTypesDomicil();
  const { data: utilisateurs, isLoading: loadingUtilisateurs } = useUtilisateurs();

  const getSchemaForStep = (step: number) => {
    switch (step) {
      case 1: return step1Schema;
      case 2: return typeDebiteur === 'physique' ? step2PhysiqueSchema : step2MoralSchema;
      case 3: return step3Schema;
      default: return z.object({});
    }
  };

  const { control, handleSubmit, formState: { errors }, watch, setValue, reset, trigger } = useForm({
    resolver: zodResolver(getSchemaForStep(currentStep)),
    defaultValues: formData
  });

  // Utiliser useRef pour éviter la boucle infinie
  const onDataChangeRef = useRef(onDataChange);
  onDataChangeRef.current = onDataChange;

  const handleDataChange = useCallback((newData: any) => {
    onDataChangeRef.current(newData);
  }, []);

  // Souscription aux changements du formulaire
  useEffect(() => {
    const subscription = watch((value) => {
      setStepData(value as any);
      handleDataChange(value);
      
      // Mettre à jour le type débiteur pour l'affichage conditionnel
      if (value.typeDebiteur && value.typeDebiteur !== typeDebiteur) {
        setTypeDebiteur(value.typeDebiteur);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, handleDataChange, typeDebiteur]);

  // Reset seulement quand l'étape change
  useEffect(() => {
    reset(formData);
    if (formData?.typeDebiteur) {
      setTypeDebiteur(formData.typeDebiteur);
    }
  }, [currentStep, reset]);

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
    const categorie: any = categoriesDebiteur.find((c: any) => c.id === id);
    return categorie?.libelle || id;
  }

  const getNationaliteLibelle = (id: string) => {
    if (!id) return '';
    if (!nationalites || !Array.isArray(nationalites)) return id;
    const nat: any = nationalites.find((n: any) => n.id === id);
    return nat?.libelle || id;
  }

  const getQuartierLibelle = (id: string) => {
    if (!id) return '';
    if (!quartiers || !Array.isArray(quartiers)) return id;
    const quartier: any = quartiers.find((q: any) => q.id === id);
    return quartier?.libelle || id;
  }

  const getFonctionLibelle = (id: string) => {
    if (!id) return '';
    if (!fonctions || !Array.isArray(fonctions)) return id;
    const fonction: any = fonctions.find((f: any) => f.id === id);
    return fonction?.libelle || id;
  }

  const getProfessionLibelle = (id: string) => {
    if (!id) return '';
    if (!professions || !Array.isArray(professions)) return id;
    const profession: any = professions.find((p: any) => p.id === id);
    return profession?.libelle || id;
  }

  const getEntiteLibelle = (id: string) => {
    if (!id) return '';
    if (!entites || !Array.isArray(entites)) return id;
    const entite: any = entites.find((e: any) => e.id === id);
    return entite?.libelle || id;
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
    const type: any = typesDomicil.find((t: any) => t.id === id);
    return type?.libelle || id;
  }

  // Étape 1: Informations générales
  const renderStep1 = () => (
    <VStack spacing={4} align="stretch">
      <Text fontSize="lg" fontWeight="bold" mb={4} color={titleColor}>Informations générales</Text>
      
      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <GridItem colSpan={isEditMode || readOnly ? 1 : 2}>
          <FormControl isInvalid={!!errors.codeDebiteur}>
            <FormLabel color={labelColor}>Code débiteur</FormLabel>
            {isEditMode || readOnly ? (
              <>
                <Input 
                  value={formData.codeDebiteur || "Code non disponible"} 
                  isReadOnly 
                  color="gray.700"
                  {...getFieldStyles(!!errors.codeDebiteur)} 
                  bg="gray.100"
                />
                {!readOnly && (
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    Code existant du débiteur
                  </Text>
                )}
              </>
            ) : (
              <>
                <Input 
                  value="Sera généré automatiquement" 
                  isReadOnly 
                  color="gray.500"
                  {...getFieldStyles(!!errors.codeDebiteur)} 
                  bg="gray.100"
                />
                <Text fontSize="xs" color="gray.500" mt={1}>
                  Le code sera généré automatiquement après validation
                </Text>
              </>
            )}
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
                    isDisabled={loadingCategoriesDebiteur}
                    _focus={{ borderColor: primaryGreen }}
                    _hover={{ bg: "gray.100" }}
                  >
                    {loadingCategoriesDebiteur ? (
                      <option value="">Chargement...</option>
                    ) : (
                      Array.isArray(categoriesDebiteur) && categoriesDebiteur.map((categorie: any) => (
                        <option key={categorie.id} value={categorie.id} style={{ backgroundColor: 'white', color: 'black' }}>
                          {categorie.libelle}
                        </option>
                      ))
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
      </Grid>

      <FormControl isInvalid={!!errors.adressePostale}>
        <FormLabel color={labelColor}>Adresse postale</FormLabel>
        <Controller
          name="adressePostale"
          control={control}
          render={({ field }) => (
            <Textarea {...field} placeholder="Ex: Cocody, Angré 8ème Tranche, Abidjan" rows={3} {...getFieldStyles(!!errors.adressePostale)} />
          )}
        />
        {errors.adressePostale && (
          <Text color={errorRed} fontSize="sm">{String(errors.adressePostale.message)}</Text>
        )}
      </FormControl>

      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
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
          <FormControl isInvalid={!!errors.typeDebiteur}>
            <FormLabel color={labelColor}>Type débiteur</FormLabel>
            <Controller
              name="typeDebiteur"
              control={control}
              render={({ field }) => (
                readOnly ? (
                  <Input 
                    value={field.value === 'physique' ? 'Personne physique' : field.value === 'moral' ? 'Personne morale' : field.value} 
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
                    <option value="physique" style={{ backgroundColor: 'white', color: 'black' }}>Personne physique</option>
                    <option value="moral" style={{ backgroundColor: 'white', color: 'black' }}>Personne morale</option>
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
    <VStack spacing={4} align="stretch">
      <Text fontSize="lg" fontWeight="bold" mb={4} color={titleColor}>Personne physique</Text>
      
      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <GridItem>
          <FormControl isInvalid={!!errors.civilite}>
            <FormLabel color={labelColor}>Civilité</FormLabel>
            <Controller
              name="civilite"
              control={control}
              render={({ field }) => (
                readOnly ? (
                  <Input 
                    value={field.value === 'monsieur' ? 'Monsieur' : field.value === 'madame' ? 'Madame' : field.value === 'mademoiselle' ? 'Mademoiselle' : field.value} 
                    isReadOnly 
                    color="gray.700"
                    {...getFieldStyles(!!errors.civilite)} 
                    bg="gray.100"
                  />
                ) : (
                  <Select 
                    {...field} 
                    placeholder="Sélectionner" 
                    {...getFieldStyles(!!errors.civilite)}
                    bg="gray.100"
                    color="gray.700"
                    _hover={{ bg: "gray.100" }}
                  >
                    <option value="monsieur" style={{ backgroundColor: 'white', color: 'black' }}>Monsieur</option>
                    <option value="madame" style={{ backgroundColor: 'white', color: 'black' }}>Madame</option>
                    <option value="mademoiselle" style={{ backgroundColor: 'white', color: 'black' }}>Mademoiselle</option>
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

        <GridItem colSpan={2}>
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

      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
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
      </Grid>

      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
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
                    placeholder="Sélectionner" 
                    {...getFieldStyles(!!errors.quartier)}
                    bg="gray.100"
                    color="gray.700"
                    _hover={{ bg: "gray.100" }}
                  >
                    {loadingQuartiers ? (
                      <option value="">Chargement...</option>
                    ) : (
                      Array.isArray(quartiers) && quartiers.map((quartier: any) => (
                        <option key={quartier.id} value={quartier.id} style={{ backgroundColor: 'white', color: 'black' }}>
                          {quartier.libelle}
                        </option>
                      ))
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
                    placeholder="Sélectionner" 
                    {...getFieldStyles(!!errors.nationalite)}
                    bg="gray.100"
                    color="gray.700"
                    _hover={{ bg: "gray.100" }}
                  >
                    {loadingNationalites ? (
                      <option value="">Chargement...</option>
                    ) : (
                      Array.isArray(nationalites) && nationalites.map((nationalite: any) => (
                        <option key={nationalite.id} value={nationalite.id} style={{ backgroundColor: 'white', color: 'black' }}>
                          {nationalite.libelle}
                        </option>
                      ))
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
      </Grid>

      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
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
                    {...getFieldStyles(!!errors.fonction)}
                    bg="gray.100"
                    color="gray.700"
                    _hover={{ bg: "gray.100" }}
                  >
                    {loadingFonctions ? (
                      <option value="">Chargement...</option>
                    ) : (
                      Array.isArray(fonctions) && fonctions.map((fonction: any) => (
                        <option key={fonction.id} value={fonction.id} style={{ backgroundColor: 'white', color: 'black' }}>
                          {fonction.libelle}
                        </option>
                      ))
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
                      Array.isArray(professions) && professions.map((profession: any) => (
                        <option key={profession.id} value={profession.id} style={{ backgroundColor: 'white', color: 'black' }}>
                          {profession.libelle}
                        </option>
                      ))
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
      </Grid>

      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
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
                    placeholder="Sélectionner" 
                    {...getFieldStyles(!!errors.employeur)}
                    bg="gray.100"
                    color="gray.700"
                    _hover={{ bg: "gray.100" }}
                  >
                    {loadingEntites ? (
                      <option value="">Chargement...</option>
                    ) : (
                      Array.isArray(entites) && entites.map((entite: any) => (
                        <option key={entite.id} value={entite.id} style={{ backgroundColor: 'white', color: 'black' }}>
                          {entite.libelle}
                        </option>
                      ))
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
                      Array.isArray(statutsSalarie) && statutsSalarie.map((statut: any) => (
                        <option key={statut.id} value={statut.id} style={{ backgroundColor: 'white', color: 'black' }}>
                          {statut.libelle}
                        </option>
                      ))
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
      
      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
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
                    <option value="M" style={{ backgroundColor: 'white', color: 'black' }}>Masculin</option>
                    <option value="F" style={{ backgroundColor: 'white', color: 'black' }}>Féminin</option>
                  </Select>
                )
              )}
            />
            {errors.sexe && (
              <Text color={errorRed} fontSize="sm">{String(errors.sexe.message)}</Text>
            )}
          </FormControl>
        </GridItem>
      </Grid>

      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
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
                    <option value="CNI" style={{ backgroundColor: 'white', color: 'black' }}>CNI</option>
                    <option value="Passeport" style={{ backgroundColor: 'white', color: 'black' }}>Passeport</option>
                    <option value="Permis" style={{ backgroundColor: 'white', color: 'black' }}>Permis de conduire</option>
                    <option value="autre" style={{ backgroundColor: 'white', color: 'black' }}>Autre</option>
                  </Select>
                )
              )}
            />
          </FormControl>
        </GridItem>
      </Grid>

      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
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

      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
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
                    <option value="celibataire" style={{ backgroundColor: 'white', color: 'black' }}>Célibataire</option>
                    <option value="marie" style={{ backgroundColor: 'white', color: 'black' }}>Marié(e)</option>
                    <option value="divorce" style={{ backgroundColor: 'white', color: 'black' }}>Divorcé(e)</option>
                    <option value="veuf" style={{ backgroundColor: 'white', color: 'black' }}>Veuf/Veuve</option>
                  </Select>
                )
              )}
            />
          </FormControl>
        </GridItem>
      </Grid>

      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
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
                    <option value="communaute" style={{ backgroundColor: 'white', color: 'black' }}>Communauté</option>
                    <option value="separation" style={{ backgroundColor: 'white', color: 'black' }}>Séparation de biens</option>
                    <option value="participation" style={{ backgroundColor: 'white', color: 'black' }}>Participation aux acquêts</option>
                  </Select>
                )
              )}
            />
          </FormControl>
        </GridItem>

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

      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
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
      </Grid>

      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
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
      </Grid>

      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
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
      </Grid>

      <Divider />

      <Text fontSize="md" fontWeight="semibold" color={titleColor}>Informations des parents</Text>

      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
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
      </Grid>

      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
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
      </Grid>

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
    </VStack>
  );

  // Étape 2: Personne morale
  const renderStep2Moral = () => (
    <VStack spacing={4} align="stretch">
      <Text fontSize="lg" fontWeight="bold" mb={4} color={titleColor}>Personne morale</Text>
      
      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
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
      </Grid>

      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <GridItem>
          <FormControl isInvalid={!!errors.capitalSocial}>
            <FormLabel color={labelColor}>Capital social</FormLabel>
            <Controller
              name="capitalSocial"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Ex: 10 000 000 FCFA" {...getFieldStyles(!!errors.capitalSocial)} />
              )}
            />
          </FormControl>
        </GridItem>

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
                    <option value="SARL" style={{ backgroundColor: 'white', color: 'black' }}>SARL</option>
                    <option value="SA" style={{ backgroundColor: 'white', color: 'black' }}>SA</option>
                    <option value="SNC" style={{ backgroundColor: 'white', color: 'black' }}>SNC</option>
                    <option value="EURL" style={{ backgroundColor: 'white', color: 'black' }}>EURL</option>
                    <option value="SAS" style={{ backgroundColor: 'white', color: 'black' }}>SAS</option>
                    <option value="autre" style={{ backgroundColor: 'white', color: 'black' }}>Autre</option>
                  </Select>
                )
              )}
            />
            {errors.formeJuridique && (
              <Text color={errorRed} fontSize="sm">{String(errors.formeJuridique.message)}</Text>
            )}
          </FormControl>
        </GridItem>
      </Grid>

      <FormControl isInvalid={!!errors.domaineActivite}>
        <FormLabel color={labelColor}>Domaine d'activité</FormLabel>
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
                <option value="commerce" style={{ backgroundColor: 'white', color: 'black' }}>Commerce</option>
                <option value="industrie" style={{ backgroundColor: 'white', color: 'black' }}>Industrie</option>
                <option value="services" style={{ backgroundColor: 'white', color: 'black' }}>Services</option>
                <option value="agriculture" style={{ backgroundColor: 'white', color: 'black' }}>Agriculture</option>
                <option value="batiment" style={{ backgroundColor: 'white', color: 'black' }}>Bâtiment</option>
                <option value="transport" style={{ backgroundColor: 'white', color: 'black' }}>Transport</option>
                <option value="autre" style={{ backgroundColor: 'white', color: 'black' }}>Autre</option>
              </Select>
            )
          )}
        />
        {errors.domaineActivite && (
          <Text color={errorRed} fontSize="sm">{String(errors.domaineActivite.message)}</Text>
        )}
      </FormControl>

      <FormControl isInvalid={!!errors.siegeSocial}>
        <FormLabel color={labelColor}>Siège social</FormLabel>
        <Controller
          name="siegeSocial"
          control={control}
          render={({ field }) => (
            <Textarea {...field} placeholder="Ex: Cocody, Angré 8ème Tranche, Abidjan" rows={3} {...getFieldStyles(!!errors.siegeSocial)} />
          )}
        />
        {errors.siegeSocial && (
          <Text color={errorRed} fontSize="sm">{String(errors.siegeSocial.message)}</Text>
        )}
      </FormControl>

      <FormControl isInvalid={!!errors.nomGerant}>
        <FormLabel color={labelColor}>Nom du gérant</FormLabel>
        <Controller
          name="nomGerant"
          control={control}
          render={({ field }) => (
            <Input {...field} placeholder="Ex: Koné Amadou" {...getFieldStyles(!!errors.nomGerant)} />
          )}
        />
        {errors.nomGerant && (
          <Text color={errorRed} fontSize="sm">{String(errors.nomGerant.message)}</Text>
        )}
      </FormControl>
        </VStack>
  );

  // Étape 3: Domiciliation
  const renderStep3 = () => (
    <VStack spacing={4} align="stretch">
      <Text fontSize="lg" fontWeight="bold" mb={4} color={titleColor}>Domiciliation</Text>
      
      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <GridItem>
          <FormControl isInvalid={!!errors.type}>
            <FormLabel color={labelColor}>Type</FormLabel>
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
                      Array.isArray(typesDomicil) && typesDomicil.map((type: any) => (
                        <option key={type.id} value={type.id} style={{ backgroundColor: 'white', color: 'black' }}>
                          {type.libelle}
                        </option>
                      ))
                    )}
                  </Select>
                )
              )}
            />
            {errors.type && (
              <Text color={errorRed} fontSize="sm">{String(errors.type.message)}</Text>
        )}
      </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.numeroCompte}>
            <FormLabel color={labelColor}>Numéro du compte</FormLabel>
        <Controller
              name="numeroCompte"
          control={control}
          render={({ field }) => (
                <Input {...field} placeholder="Ex: 1234567890123456" {...getFieldStyles(!!errors.numeroCompte)} />
          )}
        />
            {errors.numeroCompte && (
              <Text color={errorRed} fontSize="sm">{String(errors.numeroCompte.message)}</Text>
            )}
      </FormControl>
        </GridItem>
      </Grid>

      <FormControl isInvalid={!!errors.libelle}>
        <FormLabel color={labelColor}>Libellé</FormLabel>
        <Controller
          name="libelle"
          control={control}
          render={({ field }) => (
            <Input {...field} placeholder="Ex: Compte principal" {...getFieldStyles(!!errors.libelle)} />
          )}
        />
        {errors.libelle && (
          <Text color={errorRed} fontSize="sm">{String(errors.libelle.message)}</Text>
        )}
      </FormControl>

      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <GridItem>
          <FormControl isInvalid={!!errors.banque}>
            <FormLabel color={labelColor}>Banque</FormLabel>
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
                      Array.isArray(banques) && banques.map((banque: any) => (
                        <option key={banque.id} value={banque.id} style={{ backgroundColor: 'white', color: 'black' }}>
                          {banque.libelle}
                        </option>
                      ))
                    )}
                  </Select>
                )
              )}
            />
            {errors.banque && (
              <Text color={errorRed} fontSize="sm">{String(errors.banque.message)}</Text>
            )}
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.banqueAgence}>
            <FormLabel color={labelColor}>Banque agence</FormLabel>
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
                      Array.isArray(agencesBanque) && agencesBanque.map((agence: any) => (
                        <option key={agence.id} value={agence.id} style={{ backgroundColor: 'white', color: 'black' }}>
                          {agence.libelle}
                        </option>
                      ))
                    )}
                  </Select>
                )
              )}
            />
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
      case 2: return typeDebiteur === 'physique' ? renderStep2Physique() : renderStep2Moral();
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
          gap: '8px'
        },
        '.chakra-form__label': {
          marginBottom: 0,
          width: '180px',
          fontWeight: 600,
          color: '#111827',
          fontSize: '0.875rem'
        },
        '.chakra-input, .chakra-textarea': {
          flex: 1,
          borderColor: '#d1d5db',
          backgroundColor: '#ffffff'
        },
        '.chakra-select': {
          flex: 1,
          borderColor: '#28A325 !important',
          backgroundColor: '#f3f4f6 !important'
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