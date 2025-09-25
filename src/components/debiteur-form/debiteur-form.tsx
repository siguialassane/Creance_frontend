"use client"

import { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from "react";
import { Box, VStack, HStack, FormControl, FormLabel, Input, Select, Textarea, Text, Divider, Grid, GridItem, Checkbox, Stack } from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Schémas de validation pour chaque étape
const step1Schema = z.object({
  codeDebiteur: z.string().min(1, "Le code débiteur est requis"),
  categorieDebiteur: z.string().min(1, "La catégorie débiteur est requise"),
  typeDebiteur: z.string().min(1, "Le type débiteur est requis"),
  civilite: z.string().min(1, "La civilité est requise"),
  nationalite: z.string().min(1, "La nationalité est requise"),
});

const step2Schema = z.object({
  nom: z.string().min(1, "Le nom est requis"),
  prenom: z.string().min(1, "Le prénom est requis"),
  adresse: z.string().min(1, "L'adresse est requise"),
  quartier: z.string().min(1, "Le quartier est requis"),
  numeroCellulaire: z.string().min(1, "Le numéro de cellulaire est requis"),
  numeroTelephone: z.string().optional(),
  localisation: z.string().min(1, "La localisation est requise"),
});

const step3Schema = z.object({
  profession: z.string().optional(),
  fonction: z.string().optional(),
  employeur: z.string().optional(),
  statutSalarie: z.string().optional(),
  typeDomicil: z.string().optional(),
  agenceBanque: z.string().optional(),
});

const step4Schema = z.object({
  validation: z.boolean().refine(val => val === true, "Vous devez valider les informations"),
  commentaires: z.string().optional(),
});

interface DebiteurFormProps {
  currentStep: number;
  formData: any;
  onDataChange: (data: any) => void;
  onSubmit: (data: any) => void;
}

const DebiteurForm = forwardRef<any, DebiteurFormProps>(({ currentStep, formData, onDataChange, onSubmit }, ref) => {
  const [stepData, setStepData] = useState({});
  const [typeDebiteur, setTypeDebiteur] = useState<string>('');

  const getSchemaForStep = (step: number) => {
    switch (step) {
      case 1: return step1Schema;
      case 2: return step2Schema;
      case 3: return step3Schema;
      case 4: return step4Schema;
      default: return z.object({});
    }
  };

  const { control, handleSubmit, formState: { errors }, watch, setValue, reset, trigger } = useForm({
    resolver: zodResolver(getSchemaForStep(currentStep)),
    defaultValues: formData
  });

  // Utiliser useCallback pour éviter la boucle infinie
  const handleDataChange = useCallback((newData: any) => {
    onDataChange(newData);
  }, [onDataChange]);

  // Souscription aux changements du formulaire pour éviter les boucles infinies
  useEffect(() => {
    const subscription = watch((value) => {
      setStepData(value as any);
      handleDataChange(value);
      
      // Mettre à jour le type débiteur pour l'affichage conditionnel
      if (value.typeDebiteur) {
        setTypeDebiteur(value.typeDebiteur);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, handleDataChange]);

  useEffect(() => {
    reset(formData);
  }, [currentStep, reset]);

  // Exposer la méthode de validation au composant parent
  useImperativeHandle(ref, () => ({
    validateStep: async () => {
      const isValid = await trigger();
      return isValid;
    }
  }));

  // Styles unifiés (alignés avec agence-banque-form)
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
    bg: hasError ? errorBg : 'white',
    _focus: { borderColor: primaryGreen },
  })

  const renderStep1 = () => (
    <VStack spacing={4} align="stretch">
      <Text fontSize="lg" fontWeight="bold" mb={4} color={titleColor}>Informations générales</Text>
      
      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <GridItem>
          <FormControl isInvalid={!!errors.codeDebiteur}>
            <FormLabel color={labelColor}>Code débiteur *</FormLabel>
            <Controller
              name="codeDebiteur"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Ex: DEB-2024-001" {...getFieldStyles(!!errors.codeDebiteur)} />
              )}
            />
            {errors.codeDebiteur && (
              <Text color={errorRed} fontSize="sm">{String(errors.codeDebiteur.message)}</Text>
            )}
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.categorieDebiteur}>
            <FormLabel color={labelColor}>Catégorie débiteur *</FormLabel>
            <Controller
              name="categorieDebiteur"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Sélectionner une catégorie" {...getFieldStyles(!!errors.categorieDebiteur)}>
                  <option value="particulier">Particulier</option>
                  <option value="entreprise">Entreprise</option>
                  <option value="association">Association</option>
                </Select>
              )}
            />
            {errors.categorieDebiteur && (
              <Text color={errorRed} fontSize="sm">{String(errors.categorieDebiteur.message)}</Text>
            )}
          </FormControl>
        </GridItem>
      </Grid>

      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <GridItem>
          <FormControl isInvalid={!!errors.typeDebiteur}>
            <FormLabel color={labelColor}>Type débiteur *</FormLabel>
            <Controller
              name="typeDebiteur"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Sélectionner un type" {...getFieldStyles(!!errors.typeDebiteur)}>
                  <option value="physique">Débiteur physique</option>
                  <option value="moral">Débiteur moral</option>
                </Select>
              )}
            />
            {errors.typeDebiteur && (
              <Text color={errorRed} fontSize="sm">{String(errors.typeDebiteur.message)}</Text>
            )}
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.civilite}>
            <FormLabel color={labelColor}>Civilité *</FormLabel>
            <Controller
              name="civilite"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Sélectionner une civilité" {...getFieldStyles(!!errors.civilite)}>
                  <option value="monsieur">Monsieur</option>
                  <option value="madame">Madame</option>
                  <option value="mademoiselle">Mademoiselle</option>
                </Select>
              )}
            />
            {errors.civilite && (
              <Text color={errorRed} fontSize="sm">{String(errors.civilite.message)}</Text>
            )}
          </FormControl>
        </GridItem>
      </Grid>

      <FormControl isInvalid={!!errors.nationalite}>
        <FormLabel color={labelColor}>Nationalité *</FormLabel>
        <Controller
          name="nationalite"
          control={control}
          render={({ field }) => (
            <Select {...field} placeholder="Sélectionner une nationalité" {...getFieldStyles(!!errors.nationalite)}>
              <option value="ivoirienne">Ivoirienne</option>
              <option value="francaise">Française</option>
              <option value="malienne">Malienne</option>
              <option value="burkinabe">Burkinabé</option>
              <option value="autre">Autre</option>
            </Select>
          )}
        />
        {errors.nationalite && (
          <Text color={errorRed} fontSize="sm">{String(errors.nationalite.message)}</Text>
        )}
      </FormControl>
    </VStack>
  );

  const renderStep2 = () => (
    <VStack spacing={4} align="stretch">
      <Text fontSize="lg" fontWeight="bold" mb={4} color={titleColor}>
        {typeDebiteur === 'physique' ? 'Informations personnelles' : 'Informations de l\'entité'}
      </Text>
      
      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <GridItem>
          <FormControl isInvalid={!!errors.nom}>
            <FormLabel color={labelColor}>
              {typeDebiteur === 'physique' ? 'Nom *' : 'Nom de l\'entité *'}
            </FormLabel>
            <Controller
              name="nom"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder={typeDebiteur === 'physique' ? 'Ex: Koné' : 'Ex: Entreprise ABC'} {...getFieldStyles(!!errors.nom)} />
              )}
            />
            {errors.nom && (
              <Text color={errorRed} fontSize="sm">{String(errors.nom.message)}</Text>
            )}
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.prenom}>
            <FormLabel color={labelColor}>
              {typeDebiteur === 'physique' ? 'Prénom *' : 'Sigle'}
            </FormLabel>
            <Controller
              name="prenom"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder={typeDebiteur === 'physique' ? 'Ex: Amadou' : 'Ex: ABC'} {...getFieldStyles(!!errors.prenom)} />
              )}
            />
            {errors.prenom && (
              <Text color={errorRed} fontSize="sm">{String(errors.prenom.message)}</Text>
            )}
          </FormControl>
        </GridItem>
      </Grid>

      <FormControl isInvalid={!!errors.adresse}>
        <FormLabel color={labelColor}>Adresse *</FormLabel>
        <Controller
          name="adresse"
          control={control}
          render={({ field }) => (
            <Textarea {...field} placeholder="Ex: Cocody, Angré 8ème Tranche" rows={3} {...getFieldStyles(!!errors.adresse)} />
          )}
        />
        {errors.adresse && (
          <Text color={errorRed} fontSize="sm">{String(errors.adresse.message)}</Text>
        )}
      </FormControl>

      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <GridItem>
          <FormControl isInvalid={!!errors.quartier}>
            <FormLabel color={labelColor}>Quartier *</FormLabel>
            <Controller
              name="quartier"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Sélectionner un quartier" {...getFieldStyles(!!errors.quartier)}>
                  <option value="cocody">Cocody</option>
                  <option value="plateau">Plateau</option>
                  <option value="yopougon">Yopougon</option>
                  <option value="abobo">Abobo</option>
                  <option value="autre">Autre</option>
                </Select>
              )}
            />
            {errors.quartier && (
              <Text color={errorRed} fontSize="sm">{String(errors.quartier.message)}</Text>
            )}
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.localisation}>
            <FormLabel color={labelColor}>Localisation *</FormLabel>
            <Controller
              name="localisation"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Ex: Abidjan, Côte d'Ivoire" {...getFieldStyles(!!errors.localisation)} />
              )}
            />
            {errors.localisation && (
              <Text color={errorRed} fontSize="sm">{String(errors.localisation.message)}</Text>
            )}
          </FormControl>
        </GridItem>
      </Grid>

      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <GridItem>
          <FormControl isInvalid={!!errors.numeroCellulaire}>
            <FormLabel color={labelColor}>Numéro de cellulaire *</FormLabel>
            <Controller
              name="numeroCellulaire"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Ex: +225 07 12 34 56 78" {...getFieldStyles(!!errors.numeroCellulaire)} />
              )}
            />
            {errors.numeroCellulaire && (
              <Text color={errorRed} fontSize="sm">{String(errors.numeroCellulaire.message)}</Text>
            )}
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.numeroTelephone}>
            <FormLabel color={labelColor}>Numéro de téléphone</FormLabel>
            <Controller
              name="numeroTelephone"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Ex: +225 20 30 40 50" {...getFieldStyles(!!errors.numeroTelephone)} />
              )}
            />
            {errors.numeroTelephone && (
              <Text color={errorRed} fontSize="sm">{String(errors.numeroTelephone.message)}</Text>
            )}
          </FormControl>
        </GridItem>
      </Grid>
    </VStack>
  );

  const renderStep3 = () => (
    <VStack spacing={4} align="stretch">
      <Text fontSize="lg" fontWeight="bold" mb={4} color={titleColor}>Informations professionnelles</Text>
      
      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <GridItem>
          <FormControl isInvalid={!!errors.profession}>
            <FormLabel color={labelColor}>Profession</FormLabel>
            <Controller
              name="profession"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Sélectionner une profession" {...getFieldStyles(!!errors.profession)}>
                  <option value="fonctionnaire">Fonctionnaire</option>
                  <option value="commercant">Commerçant</option>
                  <option value="artisan">Artisan</option>
                  <option value="agriculteur">Agriculteur</option>
                  <option value="autre">Autre</option>
                </Select>
              )}
            />
            {errors.profession && (
              <Text color={errorRed} fontSize="sm">{String(errors.profession.message)}</Text>
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
                <Select {...field} placeholder="Sélectionner une fonction" {...getFieldStyles(!!errors.fonction)}>
                  <option value="directeur">Directeur</option>
                  <option value="manager">Manager</option>
                  <option value="employe">Employé</option>
                  <option value="autre">Autre</option>
                </Select>
              )}
            />
            {errors.fonction && (
              <Text color={errorRed} fontSize="sm">{String(errors.fonction.message)}</Text>
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
                <Input {...field} placeholder="Ex: Ministère des Finances" {...getFieldStyles(!!errors.employeur)} />
              )}
            />
            {errors.employeur && (
              <Text color={errorRed} fontSize="sm">{String(errors.employeur.message)}</Text>
            )}
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.statutSalarie}>
            <FormLabel color={labelColor}>Statut salarié</FormLabel>
            <Controller
              name="statutSalarie"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Sélectionner un statut" {...getFieldStyles(!!errors.statutSalarie)}>
                  <option value="actif">Actif</option>
                  <option value="retraite">Retraité</option>
                  <option value="chomeur">Chômeur</option>
                  <option value="autre">Autre</option>
                </Select>
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
          <FormControl isInvalid={!!errors.typeDomicil}>
            <FormLabel color={labelColor}>Type de domiciliation</FormLabel>
            <Controller
              name="typeDomicil"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Sélectionner un type" {...getFieldStyles(!!errors.typeDomicil)}>
                  <option value="domicile">Domicile</option>
                  <option value="bureau">Bureau</option>
                  <option value="autre">Autre</option>
                </Select>
              )}
            />
            {errors.typeDomicil && (
              <Text color={errorRed} fontSize="sm">{String(errors.typeDomicil.message)}</Text>
            )}
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.agenceBanque}>
            <FormLabel color={labelColor}>Agence de banque</FormLabel>
            <Controller
              name="agenceBanque"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Sélectionner une agence" {...getFieldStyles(!!errors.agenceBanque)}>
                  <option value="agence1">Agence Plateau</option>
                  <option value="agence2">Agence Cocody</option>
                  <option value="agence3">Agence Yopougon</option>
                </Select>
              )}
            />
            {errors.agenceBanque && (
              <Text color={errorRed} fontSize="sm">{String(errors.agenceBanque.message)}</Text>
            )}
          </FormControl>
        </GridItem>
      </Grid>
    </VStack>
  );

  const renderStep4 = () => (
    <VStack spacing={4} align="stretch">
      <Text fontSize="lg" fontWeight="bold" mb={4} color={titleColor}>Validation et enregistrement</Text>
      
      <Box p={4} bg="gray.50" borderRadius="md">
        <Text fontSize="md" fontWeight="semibold" mb={2}>Récapitulatif</Text>
        <VStack align="stretch" spacing={2}>
          <HStack justify="space-between">
            <Text>Code débiteur:</Text>
            <Text fontWeight="bold">{formData.codeDebiteur || 'Non défini'}</Text>
          </HStack>
          <HStack justify="space-between">
            <Text>Nom:</Text>
            <Text fontWeight="bold">{formData.nom || 'Non défini'}</Text>
          </HStack>
          <HStack justify="space-between">
            <Text>Prénom:</Text>
            <Text fontWeight="bold">{formData.prenom || 'Non défini'}</Text>
          </HStack>
          <HStack justify="space-between">
            <Text>Type:</Text>
            <Text fontWeight="bold">{formData.typeDebiteur || 'Non défini'}</Text>
          </HStack>
          <HStack justify="space-between">
            <Text>Localisation:</Text>
            <Text fontWeight="bold">{formData.localisation || 'Non défini'}</Text>
          </HStack>
        </VStack>
      </Box>

      <FormControl isInvalid={!!errors.validation}>
        <Controller
          name="validation"
          control={control}
          render={({ field }) => (
            <Checkbox 
              isChecked={field.value || false} 
              onChange={(e) => field.onChange(e.target.checked)}
              _checked={{ bg: primaryGreen, borderColor: primaryGreen }}
            >
              Je confirme que toutes les informations sont exactes et valides
            </Checkbox>
          )}
        />
        {errors.validation && (
          <Text color={errorRed} fontSize="sm">{String(errors.validation.message)}</Text>
        )}
      </FormControl>

      <FormControl>
        <FormLabel color={labelColor}>Commentaires (optionnel)</FormLabel>
        <Controller
          name="commentaires"
          control={control}
          render={({ field }) => (
            <Textarea {...field} placeholder="Commentaires supplémentaires" rows={3} {...getFieldStyles(false)} />
          )}
        />
      </FormControl>
    </VStack>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      default: return null;
    }
  };

  return (
    <Box>
      {renderCurrentStep()}
    </Box>
  );
});

DebiteurForm.displayName = 'DebiteurForm';

export default DebiteurForm;
export { DebiteurForm };
