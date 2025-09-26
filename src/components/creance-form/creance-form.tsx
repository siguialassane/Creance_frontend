"use client"

import { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from "react";
import { Box, VStack, HStack, FormControl, FormLabel, Input, Select, Textarea, Text, Divider, Grid, GridItem, Checkbox, Stack } from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useGroupesCreance } from "@/hooks/useGroupesCreance";
import { useObjetsCreance } from "@/hooks/useObjetsCreance";
import { useEntites } from "@/hooks/useEntites";
import { useClasses } from "@/hooks/useClasses";
import { useQuartiers } from "@/hooks/useQuartiers";

// Schémas de validation pour chaque étape
const step1Schema = z.object({
  debiteur: z.string().optional(),
  groupeCreance: z.string().optional(),
  typeObjet: z.string().optional(),
  capitalInitial: z.number().optional(),
  montantDecaisse: z.number().optional(),
  steCaution: z.string().optional(),
  statutRecouvrement: z.string().optional(),
  numeroPrecedent: z.string().optional(),
  numeroAncien: z.string().optional(),
  typeStructure: z.string().optional(),
  classeCreance: z.string().optional(),
});

const step2Schema = z.object({
  numeroCreance: z.string().optional(),
  entite: z.string().optional(),
  objetCreance: z.string().optional(),
  periodicite: z.string().optional(),
  nbEch: z.number().optional(),
  dateReconnaissance: z.string().optional(),
  datePremiereEcheance: z.string().optional(),
  dateDerniereEcheance: z.string().optional(),
  dateOctroi: z.string().optional(),
  datePremierPrecept: z.string().optional(),
  creanceSoldeAvantLid: z.string().optional(),
});

const step3Schema = z.object({
  ordonnateur: z.string().optional(),
  montantRembourse: z.number().optional(),
  montantDu: z.number().optional(),
  montantDejaRembourse: z.number().optional(),
  montantImpaye: z.number().optional(),
  diversFrais: z.number().optional(),
  commission: z.number().optional(),
  montantAss: z.number().optional(),
  intConvPourcentage: z.number().optional(),
  montantIntConvPaye: z.number().optional(),
  intRetPourcentage: z.number().optional(),
  encours: z.number().optional(),
  totalDu: z.number().optional(),
  penalite1Pourcent: z.number().optional(),
  totalARecouvrer: z.number().optional(),
});

const step4Schema = z.object({
  typePiece: z.string().optional(),
  reference: z.string().optional(),
  libelle: z.string().optional(),
  dateEmission: z.string().optional(),
  dateReception: z.string().optional(),
});

const step5Schema = z.object({
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

interface CreanceFormProps {
  currentStep: number;
  formData: any;
  onDataChange: (data: any) => void;
  onSubmit: (data: any) => void;
  readOnly?: boolean;
}

const CreanceForm = forwardRef<any, CreanceFormProps>(({ currentStep, formData, onDataChange, onSubmit, readOnly = false }, ref) => {
  const [stepData, setStepData] = useState({});
  const [typeGarantie, setTypeGarantie] = useState<string>("");

  // Hooks pour les données dynamiques
  const { data: groupesCreance } = useGroupesCreance();
  const { data: objetsCreance } = useObjetsCreance();
  const { data: entites } = useEntites();
  const { data: classes } = useClasses();
  const { data: quartiers } = useQuartiers();

  const getSchemaForStep = (step: number) => {
    switch (step) {
      case 1: return step1Schema;
      case 2: return step2Schema;
      case 3: return step3Schema;
      case 4: return step4Schema;
      case 5: return step5Schema;
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

      // Calculs automatiques des montants dérivés (étape 3)
      const v: any = value || {}
      
      // Variables de base
      const capitalInitial = Number(v.capitalInitial || 0) // CREAN_CAPIT_INIT
      const pourcentageIntConv = Number(v.intConvPourcentage || 0) // Pourcentage d'intérêt conventionnel
      const commissionBanque = Number(v.commission || 0) // CREAN_COMM_BANQ
      const montantDejaRembourse = Number(v.montantDejaRembourse || 0) // crean_dej_remb
      const pourcentageIntRetard = Number(v.intRetPourcentage || 0) // Pourcentage d'intérêt de retard
      const frais = Number(v.diversFrais || 0) // CREAN_FRAIS
      const encours = Number(v.encours || 0) // crean_encours

      // Conversion des pourcentages en montants
      const montantIntConv = Math.round((capitalInitial * pourcentageIntConv) / 100) // crean_mont_ic
      const montantIntRetard = Math.round((capitalInitial * pourcentageIntRetard) / 100) // crean_mont_ir

      // 1) MONTANT À REMBOURSER : CAPITAL INITIAL + MONTANT INTERÊT CONVENTIONNEL + MONTANT COMMISSION BANQUE
      const calcMontantARembourser = capitalInitial + montantIntConv + commissionBanque

      // 2) MONTANT DÉJÀ REMBOURSÉ : CREAN_MONT_REMB (saisi manuellement)

      // 3) MONTANT IMPAYÉ : MONTANT DU - MONTANT DÉJÀ REMBOURSÉ
      const montantDu = Number(v.montantDu || 0) // Montant dû saisi manuellement
      const calcMontantImpaye = Math.max(montantDu - montantDejaRembourse, 0)

      // 4) FRAIS : CREAN_FRAIS (saisi manuellement)

      // 5) TOTAL DÛ : MONTANT IMPAYÉ + MONTANT INTÉRÊT DE RETARD + FRAIS
      const calcTotalDu = calcMontantImpaye + montantIntRetard + frais

      // 6) PÉNALITÉ : CREAN_PENALITE (1/100) - calculée automatiquement
      const calcPenalite = Math.round(calcTotalDu * 0.01) // 1% du total dû

      // 7) TOTAL SOLDE (À RECOUVRER) : TOTAL DÛ + ENCOURS + PÉNALITÉ
      const calcTotalSolde = calcTotalDu + encours + calcPenalite

      // Appliquer les valeurs calculées si différentes pour éviter les boucles
      if (typeof v.montantIntConvPaye !== 'number' || v.montantIntConvPaye !== montantIntConv) {
        setValue('montantIntConvPaye', montantIntConv, { shouldValidate: false, shouldDirty: false, shouldTouch: false })
      }
      if (typeof v.montantRembourse !== 'number' || v.montantRembourse !== calcMontantARembourser) {
        setValue('montantRembourse', calcMontantARembourser, { shouldValidate: false, shouldDirty: false, shouldTouch: false })
      }
      if (typeof v.montantImpaye !== 'number' || v.montantImpaye !== calcMontantImpaye) {
        setValue('montantImpaye', calcMontantImpaye, { shouldValidate: false, shouldDirty: false, shouldTouch: false })
      }
      if (typeof v.totalDu !== 'number' || v.totalDu !== calcTotalDu) {
        setValue('totalDu', calcTotalDu, { shouldValidate: false, shouldDirty: false, shouldTouch: false })
      }
      if (typeof v.penalite1Pourcent !== 'number' || v.penalite1Pourcent !== calcPenalite) {
        setValue('penalite1Pourcent', calcPenalite, { shouldValidate: false, shouldDirty: false, shouldTouch: false })
      }
      if (typeof v.totalARecouvrer !== 'number' || v.totalARecouvrer !== calcTotalSolde) {
        setValue('totalARecouvrer', calcTotalSolde, { shouldValidate: false, shouldDirty: false, shouldTouch: false })
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
    bg: hasError ? errorBg : (readOnly ? 'gray.50' : 'white'),
    _focus: { borderColor: primaryGreen },
    isReadOnly: readOnly,
    isDisabled: readOnly,
  })

  // Fonction pour formater les nombres avec séparateurs de milliers
  const formatNumber = (value: string) => {
    const numericValue = value.replace(/\D/g, '')
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  }

  // Fonction pour parser les nombres formatés
  const parseNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '')
    if (cleaned === '' || cleaned === '0') return 0
    return parseFloat(cleaned) || 0
  }

  const renderStep1 = () => (
    <VStack spacing={4} align="stretch">
      <Text fontSize="lg" fontWeight="bold" mb={4} color={titleColor}>Informations générales</Text>
      
      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <GridItem>
          <FormControl isInvalid={!!errors.debiteur}>
            <FormLabel color={labelColor}>Débiteur</FormLabel>
            <Controller
              name="debiteur"
              control={control}
              render={({ field }) => (
                <Select 
                  {...field} 
                  placeholder="Sélectionner un débiteur" 
                  {...getFieldStyles(!!errors.debiteur)} 
                  isDisabled={readOnly}
                  bg="white"
                  color="gray.800"
                >
                  <option value="">Chargement...</option>
                  <option value="deb1">Koné Amadou</option>
                  <option value="deb2">Traoré Fatou</option>
                  <option value="deb3">Société ABC SARL</option>
                </Select>
              )}
            />
            {errors.debiteur && (
              <Text color={errorRed} fontSize="sm">{String(errors.debiteur.message)}</Text>
            )}
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.groupeCreance}>
            <FormLabel color={labelColor}>Groupe créance</FormLabel>
            <Controller
              name="groupeCreance"
              control={control}
              render={({ field }) => (
                <Select 
                  {...field} 
                  placeholder="Sélectionner un groupe" 
                  {...getFieldStyles(!!errors.groupeCreance)} 
                  isDisabled={readOnly}
                  bg="white"
                  color="gray.800"
                >
                  <option value="">Chargement...</option>
                  {Array.isArray(groupesCreance) && groupesCreance.map((groupe) => (
                    <option key={groupe.GC_CODE} value={groupe.GC_CODE} style={{ backgroundColor: 'white', color: 'black' }}>
                      {groupe.GC_LIB}
                    </option>
                  ))}
                </Select>
              )}
            />
            {errors.groupeCreance && (
              <Text color={errorRed} fontSize="sm">{String(errors.groupeCreance.message)}</Text>
            )}
          </FormControl>
        </GridItem>
      </Grid>

      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <GridItem>
          <FormControl isInvalid={!!errors.typeObjet}>
            <FormLabel color={labelColor}>Type d'objet</FormLabel>
            <Controller
              name="typeObjet"
              control={control}
              render={({ field }) => (
                <Select 
                  {...field} 
                  placeholder="Sélectionner un type" 
                  {...getFieldStyles(!!errors.typeObjet)} 
                  isDisabled={readOnly}
                  bg="white"
                  color="gray.800"
                >
                  <option value="">Chargement...</option>
                  {Array.isArray(objetsCreance) && objetsCreance.map((objet) => (
                    <option key={objet.OC_CODE} value={objet.OC_CODE} style={{ backgroundColor: 'white', color: 'black' }}>
                      {objet.OC_LIB}
                    </option>
                  ))}
                </Select>
              )}
            />
            {errors.typeObjet && (
              <Text color={errorRed} fontSize="sm">{String(errors.typeObjet.message)}</Text>
            )}
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.capitalInitial}>
            <FormLabel color={labelColor}>Capital initial</FormLabel>
            <Controller
              name="capitalInitial"
              control={control}
              render={({ field }) => (
                <Input 
                  {...field} 
                  type="text" 
                  placeholder="0" 
                  value={field.value !== undefined && field.value !== null ? formatNumber(field.value.toString()) : ''}
                  onChange={(e) => {
                    const formatted = formatNumber(e.target.value)
                    field.onChange(parseNumber(formatted))
                  }}
                  {...getFieldStyles(!!errors.capitalInitial)} 
                  isDisabled={readOnly}
                />
              )}
            />
            {errors.capitalInitial && (
              <Text color={errorRed} fontSize="sm">{String(errors.capitalInitial.message)}</Text>
            )}
          </FormControl>
        </GridItem>
      </Grid>

      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <GridItem>
          <FormControl isInvalid={!!errors.montantDecaisse}>
            <FormLabel color={labelColor}>Montant décaissé</FormLabel>
            <Controller
              name="montantDecaisse"
              control={control}
              render={({ field }) => (
                <Input 
                  {...field} 
                  type="text" 
                  placeholder="0" 
                  value={field.value !== undefined && field.value !== null ? formatNumber(field.value.toString()) : ''}
                  onChange={(e) => {
                    const formatted = formatNumber(e.target.value)
                    field.onChange(parseNumber(formatted))
                  }}
                  {...getFieldStyles(!!errors.montantDecaisse)} 
                  isDisabled={readOnly}
                />
              )}
            />
            {errors.montantDecaisse && (
              <Text color={errorRed} fontSize="sm">{String(errors.montantDecaisse.message)}</Text>
            )}
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.steCaution}>
            <FormLabel color={labelColor}>Sté caution</FormLabel>
            <Controller
              name="steCaution"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Société de caution" {...getFieldStyles(!!errors.steCaution)} isDisabled={readOnly} />
              )}
            />
            {errors.steCaution && (
              <Text color={errorRed} fontSize="sm">{String(errors.steCaution.message)}</Text>
            )}
          </FormControl>
        </GridItem>
      </Grid>

      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <GridItem>
          <FormControl isInvalid={!!errors.statutRecouvrement}>
            <FormLabel color={labelColor}>Statut recouvrement</FormLabel>
            <Controller
              name="statutRecouvrement"
              control={control}
              render={({ field }) => (
                <Select 
                  {...field} 
                  placeholder="Sélectionner" 
                  {...getFieldStyles(!!errors.statutRecouvrement)} 
                  isDisabled={readOnly}
                  bg="white"
                  color="gray.800"
                >
                  <option value="oui">Oui</option>
                  <option value="non">Non</option>
                </Select>
              )}
            />
            {errors.statutRecouvrement && (
              <Text color={errorRed} fontSize="sm">{String(errors.statutRecouvrement.message)}</Text>
            )}
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.numeroPrecedent}>
            <FormLabel color={labelColor}>Numéro précédent</FormLabel>
            <Controller
              name="numeroPrecedent"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Numéro précédent" {...getFieldStyles(!!errors.numeroPrecedent)} isDisabled={readOnly} />
              )}
            />
            {errors.numeroPrecedent && (
              <Text color={errorRed} fontSize="sm">{String(errors.numeroPrecedent.message)}</Text>
            )}
          </FormControl>
        </GridItem>
      </Grid>

      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <GridItem>
          <FormControl isInvalid={!!errors.numeroAncien}>
            <FormLabel color={labelColor}>Numéro ancien</FormLabel>
            <Controller
              name="numeroAncien"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Numéro ancien" {...getFieldStyles(!!errors.numeroAncien)} isDisabled={readOnly} />
              )}
            />
            {errors.numeroAncien && (
              <Text color={errorRed} fontSize="sm">{String(errors.numeroAncien.message)}</Text>
            )}
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.typeStructure}>
            <FormLabel color={labelColor}>Type structure</FormLabel>
            <Controller
              name="typeStructure"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Type de structure" {...getFieldStyles(!!errors.typeStructure)} isDisabled={readOnly} />
              )}
            />
            {errors.typeStructure && (
              <Text color={errorRed} fontSize="sm">{String(errors.typeStructure.message)}</Text>
            )}
          </FormControl>
        </GridItem>
      </Grid>

      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <GridItem>
          <FormControl isInvalid={!!errors.classeCreance}>
            <FormLabel color={labelColor}>Classe créance</FormLabel>
            <Controller
              name="classeCreance"
              control={control}
              render={({ field }) => (
                <Select 
                  {...field} 
                  placeholder="Sélectionner une classe" 
                  {...getFieldStyles(!!errors.classeCreance)} 
                  isDisabled={readOnly}
                  bg="white"
                  color="gray.800"
                >
                  <option value="">Chargement...</option>
                  {Array.isArray(classes) && classes.map((classe) => (
                    <option key={classe.CLAS_CODE} value={classe.CLAS_CODE} style={{ backgroundColor: 'white', color: 'black' }}>
                      {classe.CLAS_LIB}
                    </option>
                  ))}
                </Select>
              )}
            />
            {errors.classeCreance && (
              <Text color={errorRed} fontSize="sm">{String(errors.classeCreance.message)}</Text>
            )}
          </FormControl>
        </GridItem>
      </Grid>
    </VStack>
  );

  const renderStep2 = () => (
    <VStack spacing={4} align="stretch">
      <Text fontSize="lg" fontWeight="bold" mb={4} color={titleColor}>Informations générales 2</Text>
      
      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <GridItem>
          <FormControl isInvalid={!!errors.numeroCreance}>
            <FormLabel color={labelColor}>Numéro de créance</FormLabel>
            <Controller
              name="numeroCreance"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Ex: CRE-2024-001" {...getFieldStyles(!!errors.numeroCreance)} isDisabled={readOnly} />
              )}
            />
            {errors.numeroCreance && (
              <Text color={errorRed} fontSize="sm">{String(errors.numeroCreance.message)}</Text>
            )}
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.entite}>
            <FormLabel color={labelColor}>Entité</FormLabel>
            <Controller
              name="entite"
              control={control}
              render={({ field }) => (
                <Select 
                  {...field} 
                  placeholder="Sélectionner une entité" 
                  {...getFieldStyles(!!errors.entite)} 
                  isDisabled={readOnly}
                  bg="white"
                  color="gray.800"
                >
                  <option value="">Chargement...</option>
                  {Array.isArray(entites) && entites.map((entite) => (
                    <option key={entite.ENT_CODE} value={entite.ENT_CODE} style={{ backgroundColor: 'white', color: 'black' }}>
                      {entite.ENT_LIB}
                    </option>
                  ))}
                </Select>
              )}
            />
            {errors.entite && (
              <Text color={errorRed} fontSize="sm">{String(errors.entite.message)}</Text>
            )}
          </FormControl>
        </GridItem>
      </Grid>

      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <GridItem>
          <FormControl isInvalid={!!errors.objetCreance}>
            <FormLabel color={labelColor}>Objet créance</FormLabel>
            <Controller
              name="objetCreance"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Objet de la créance" {...getFieldStyles(!!errors.objetCreance)} isDisabled={readOnly} />
              )}
            />
            {errors.objetCreance && (
              <Text color={errorRed} fontSize="sm">{String(errors.objetCreance.message)}</Text>
            )}
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.periodicite}>
            <FormLabel color={labelColor}>Périodicité</FormLabel>
            <Controller
              name="periodicite"
              control={control}
              render={({ field }) => (
                <Select 
                  {...field} 
                  placeholder="Sélectionner une périodicité" 
                  {...getFieldStyles(!!errors.periodicite)} 
                  isDisabled={readOnly}
                  bg="white"
                  color="gray.800"
                >
                  <option value="mensuelle">Mensuelle</option>
                  <option value="trimestrielle">Trimestrielle</option>
                  <option value="semestrielle">Semestrielle</option>
                  <option value="annuelle">Annuelle</option>
                </Select>
              )}
            />
            {errors.periodicite && (
              <Text color={errorRed} fontSize="sm">{String(errors.periodicite.message)}</Text>
            )}
          </FormControl>
        </GridItem>
      </Grid>

      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <GridItem>
          <FormControl isInvalid={!!errors.nbEch}>
            <FormLabel color={labelColor}>Nb. Échéances</FormLabel>
        <Controller
              name="nbEch"
          control={control}
          render={({ field }) => (
                <Input 
                  {...field} 
                  type="number" 
                  placeholder="0" 
                  value={field.value || ''}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  {...getFieldStyles(!!errors.nbEch)} 
                  isDisabled={readOnly}
                />
              )}
            />
            {errors.nbEch && (
              <Text color={errorRed} fontSize="sm">{String(errors.nbEch.message)}</Text>
        )}
      </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.dateReconnaissance}>
            <FormLabel color={labelColor}>Date de reconnaissance</FormLabel>
        <Controller
              name="dateReconnaissance"
          control={control}
          render={({ field }) => (
                <Input {...field} type="date" {...getFieldStyles(!!errors.dateReconnaissance)} isDisabled={readOnly} />
              )}
            />
            {errors.dateReconnaissance && (
              <Text color={errorRed} fontSize="sm">{String(errors.dateReconnaissance.message)}</Text>
        )}
      </FormControl>
        </GridItem>
      </Grid>

      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <GridItem>
          <FormControl isInvalid={!!errors.datePremiereEcheance}>
            <FormLabel color={labelColor}>Date de 1ère échéance</FormLabel>
            <Controller
              name="datePremiereEcheance"
              control={control}
              render={({ field }) => (
                <Input {...field} type="date" {...getFieldStyles(!!errors.datePremiereEcheance)} isDisabled={readOnly} />
              )}
            />
            {errors.datePremiereEcheance && (
              <Text color={errorRed} fontSize="sm">{String(errors.datePremiereEcheance.message)}</Text>
            )}
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.dateDerniereEcheance}>
            <FormLabel color={labelColor}>Date de dernière échéance</FormLabel>
            <Controller
              name="dateDerniereEcheance"
              control={control}
              render={({ field }) => (
                <Input {...field} type="date" {...getFieldStyles(!!errors.dateDerniereEcheance)} isDisabled={readOnly} />
              )}
            />
            {errors.dateDerniereEcheance && (
              <Text color={errorRed} fontSize="sm">{String(errors.dateDerniereEcheance.message)}</Text>
            )}
          </FormControl>
        </GridItem>
      </Grid>

      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <GridItem>
          <FormControl isInvalid={!!errors.dateOctroi}>
            <FormLabel color={labelColor}>Date d'octroi</FormLabel>
            <Controller
              name="dateOctroi"
              control={control}
              render={({ field }) => (
                <Input {...field} type="date" {...getFieldStyles(!!errors.dateOctroi)} isDisabled={readOnly} />
              )}
            />
            {errors.dateOctroi && (
              <Text color={errorRed} fontSize="sm">{String(errors.dateOctroi.message)}</Text>
            )}
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.datePremierPrecept}>
            <FormLabel color={labelColor}>Date de 1er précept</FormLabel>
            <Controller
              name="datePremierPrecept"
              control={control}
              render={({ field }) => (
                <Input {...field} type="date" {...getFieldStyles(!!errors.datePremierPrecept)} isDisabled={readOnly} />
              )}
            />
            {errors.datePremierPrecept && (
              <Text color={errorRed} fontSize="sm">{String(errors.datePremierPrecept.message)}</Text>
            )}
          </FormControl>
        </GridItem>
      </Grid>

      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <GridItem>
          <FormControl isInvalid={!!errors.creanceSoldeAvantLid}>
            <FormLabel color={labelColor}>Créance solde avant LID</FormLabel>
            <Controller
              name="creanceSoldeAvantLid"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Solde avant LID" {...getFieldStyles(!!errors.creanceSoldeAvantLid)} isDisabled={readOnly} />
              )}
            />
            {errors.creanceSoldeAvantLid && (
              <Text color={errorRed} fontSize="sm">{String(errors.creanceSoldeAvantLid.message)}</Text>
            )}
          </FormControl>
        </GridItem>
      </Grid>
    </VStack>
  );

  const renderStep3 = () => (
    <VStack spacing={4} align="stretch">
      <Text fontSize="lg" fontWeight="bold" mb={4} color={titleColor}>Détails financiers</Text>
      
      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <GridItem>
          <FormControl isInvalid={!!errors.ordonnateur}>
            <FormLabel color={labelColor}>Ordonnateur</FormLabel>
            <Controller
              name="ordonnateur"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Ordonnateur" {...getFieldStyles(!!errors.ordonnateur)} isDisabled={readOnly} />
              )}
            />
            {errors.ordonnateur && (
              <Text color={errorRed} fontSize="sm">{String(errors.ordonnateur.message)}</Text>
            )}
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.montantRembourse}>
            <FormLabel color={labelColor}>Montant à rembourser</FormLabel>
            <Controller
              name="montantRembourse"
              control={control}
              render={({ field }) => (
                <Input 
                  {...field} 
                  type="text" 
                  placeholder="0" 
                  value={field.value !== undefined && field.value !== null ? formatNumber(field.value.toString()) : ''}
                  onChange={(e) => {
                    const formatted = formatNumber(e.target.value)
                    field.onChange(parseNumber(formatted))
                  }}
                  {...getFieldStyles(!!errors.montantRembourse)} 
                  isDisabled={true}
                  bg="gray.50"
                  color="gray.700"
                />
              )}
            />
            <Text fontSize="xs" color="gray.500" mt={1}>
              Calculé automatiquement : Capital + Intérêt Conv + Commission
            </Text>
            {errors.montantRembourse && (
              <Text color={errorRed} fontSize="sm">{String(errors.montantRembourse.message)}</Text>
            )}
          </FormControl>
        </GridItem>
      </Grid>

      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <GridItem>
          <FormControl isInvalid={!!errors.montantDu}>
            <FormLabel color={labelColor}>Montant dû</FormLabel>
            <Controller
              name="montantDu"
              control={control}
              render={({ field }) => (
                <Input 
                  {...field} 
                  type="text" 
                  placeholder="0" 
                  value={field.value !== undefined && field.value !== null ? formatNumber(field.value.toString()) : ''}
                  onChange={(e) => {
                    const formatted = formatNumber(e.target.value)
                    field.onChange(parseNumber(formatted))
                  }}
                  {...getFieldStyles(!!errors.montantDu)} 
                  isDisabled={readOnly}
                />
              )}
            />
            {errors.montantDu && (
              <Text color={errorRed} fontSize="sm">{String(errors.montantDu.message)}</Text>
            )}
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.montantDejaRembourse}>
            <FormLabel color={labelColor}>Montant déjà remboursé</FormLabel>
            <Controller
              name="montantDejaRembourse"
              control={control}
              render={({ field }) => (
                <Input 
                  {...field} 
                  type="text" 
                  placeholder="0" 
                  value={field.value !== undefined && field.value !== null ? formatNumber(field.value.toString()) : ''}
                  onChange={(e) => {
                    const formatted = formatNumber(e.target.value)
                    field.onChange(parseNumber(formatted))
                  }}
                  {...getFieldStyles(!!errors.montantDejaRembourse)} 
                  isDisabled={readOnly}
                />
              )}
            />
            {errors.montantDejaRembourse && (
              <Text color={errorRed} fontSize="sm">{String(errors.montantDejaRembourse.message)}</Text>
            )}
          </FormControl>
        </GridItem>
      </Grid>

      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <GridItem>
          <FormControl isInvalid={!!errors.montantImpaye}>
            <FormLabel color={labelColor}>Montant impayé</FormLabel>
            <Controller
              name="montantImpaye"
              control={control}
              render={({ field }) => (
                <Input 
                  {...field} 
                  type="text" 
                  placeholder="0" 
                  value={field.value !== undefined && field.value !== null ? formatNumber(field.value.toString()) : ''}
                  onChange={(e) => {
                    const formatted = formatNumber(e.target.value)
                    field.onChange(parseNumber(formatted))
                  }}
                  {...getFieldStyles(!!errors.montantImpaye)} 
                  isDisabled={true}
                  bg="gray.50"
                  color="gray.700"
                />
              )}
            />
            <Text fontSize="xs" color="gray.500" mt={1}>
              Calculé automatiquement : Montant dû - Montant déjà remboursé
            </Text>
            {errors.montantImpaye && (
              <Text color={errorRed} fontSize="sm">{String(errors.montantImpaye.message)}</Text>
            )}
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.diversFrais}>
            <FormLabel color={labelColor}>Divers frais</FormLabel>
            <Controller
              name="diversFrais"
              control={control}
              render={({ field }) => (
                <Input 
                  {...field} 
                  type="text" 
                  placeholder="0" 
                  value={field.value !== undefined && field.value !== null ? formatNumber(field.value.toString()) : ''}
                  onChange={(e) => {
                    const formatted = formatNumber(e.target.value)
                    field.onChange(parseNumber(formatted))
                  }}
                  {...getFieldStyles(!!errors.diversFrais)} 
                  isDisabled={readOnly}
                />
              )}
            />
            {errors.diversFrais && (
              <Text color={errorRed} fontSize="sm">{String(errors.diversFrais.message)}</Text>
            )}
          </FormControl>
        </GridItem>
      </Grid>

      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <GridItem>
          <FormControl isInvalid={!!errors.commission}>
            <FormLabel color={labelColor}>Commission</FormLabel>
            <Controller
              name="commission"
              control={control}
              render={({ field }) => (
                <Input 
                  {...field} 
                  type="text" 
                  placeholder="0" 
                  value={field.value !== undefined && field.value !== null ? formatNumber(field.value.toString()) : ''}
                  onChange={(e) => {
                    const formatted = formatNumber(e.target.value)
                    field.onChange(parseNumber(formatted))
                  }}
                  {...getFieldStyles(!!errors.commission)} 
                  isDisabled={readOnly}
                />
              )}
            />
            {errors.commission && (
              <Text color={errorRed} fontSize="sm">{String(errors.commission.message)}</Text>
            )}
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.montantAss}>
            <FormLabel color={labelColor}>Montant Ass</FormLabel>
            <Controller
              name="montantAss"
              control={control}
              render={({ field }) => (
                <Input 
                  {...field} 
                  type="text" 
                  placeholder="0" 
                  value={field.value !== undefined && field.value !== null ? formatNumber(field.value.toString()) : ''}
                  onChange={(e) => {
                    const formatted = formatNumber(e.target.value)
                    field.onChange(parseNumber(formatted))
                  }}
                  {...getFieldStyles(!!errors.montantAss)} 
                  isDisabled={readOnly}
                />
              )}
            />
            {errors.montantAss && (
              <Text color={errorRed} fontSize="sm">{String(errors.montantAss.message)}</Text>
            )}
          </FormControl>
        </GridItem>
      </Grid>

      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <GridItem>
          <FormControl isInvalid={!!errors.intConvPourcentage}>
            <FormLabel color={labelColor}>Int. Conv (pourcentage)</FormLabel>
            <Controller
              name="intConvPourcentage"
              control={control}
              render={({ field }) => (
                <Input 
                  {...field} 
                  type="number" 
                  placeholder="0" 
                  step="0.01"
                  value={field.value || ''}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  {...getFieldStyles(!!errors.intConvPourcentage)} 
                  isDisabled={readOnly}
                />
              )}
            />
            <Text fontSize="xs" color="gray.500" mt={1}>
              Pourcentage d'intérêt conventionnel
            </Text>
            {errors.intConvPourcentage && (
              <Text color={errorRed} fontSize="sm">{String(errors.intConvPourcentage.message)}</Text>
            )}
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.montantIntConvPaye}>
            <FormLabel color={labelColor}>Montant Int Conv</FormLabel>
            <Controller
              name="montantIntConvPaye"
              control={control}
              render={({ field }) => (
                <Input 
                  {...field} 
                  type="text" 
                  placeholder="0" 
                  value={field.value !== undefined && field.value !== null ? formatNumber(field.value.toString()) : ''}
                  onChange={(e) => {
                    const formatted = formatNumber(e.target.value)
                    field.onChange(parseNumber(formatted))
                  }}
                  {...getFieldStyles(!!errors.montantIntConvPaye)} 
                  isDisabled={true}
                  bg="gray.50"
                  color="gray.700"
                />
              )}
            />
            <Text fontSize="xs" color="gray.500" mt={1}>
              Calculé automatiquement : Capital × Pourcentage Int. Conv
            </Text>
            {errors.montantIntConvPaye && (
              <Text color={errorRed} fontSize="sm">{String(errors.montantIntConvPaye.message)}</Text>
            )}
          </FormControl>
        </GridItem>
      </Grid>

      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <GridItem>
          <FormControl isInvalid={!!errors.intRetPourcentage}>
            <FormLabel color={labelColor}>Int. Ret (pourcentage)</FormLabel>
            <Controller
              name="intRetPourcentage"
              control={control}
              render={({ field }) => (
                <Input 
                  {...field} 
                  type="number" 
                  placeholder="0" 
                  step="0.01"
                  value={field.value || ''}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  {...getFieldStyles(!!errors.intRetPourcentage)} 
                  isDisabled={readOnly}
                />
              )}
            />
            <Text fontSize="xs" color="gray.500" mt={1}>
              Pourcentage d'intérêt de retard
            </Text>
            {errors.intRetPourcentage && (
              <Text color={errorRed} fontSize="sm">{String(errors.intRetPourcentage.message)}</Text>
            )}
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.encours}>
            <FormLabel color={labelColor}>Encours</FormLabel>
            <Controller
              name="encours"
              control={control}
              render={({ field }) => (
                <Input 
                  {...field} 
                  type="text" 
                  placeholder="0" 
                  value={field.value !== undefined && field.value !== null ? formatNumber(field.value.toString()) : ''}
                  onChange={(e) => {
                    const formatted = formatNumber(e.target.value)
                    field.onChange(parseNumber(formatted))
                  }}
                  {...getFieldStyles(!!errors.encours)} 
                  isDisabled={readOnly}
                />
              )}
            />
            {errors.encours && (
              <Text color={errorRed} fontSize="sm">{String(errors.encours.message)}</Text>
            )}
          </FormControl>
        </GridItem>
      </Grid>

      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <GridItem>
          <FormControl isInvalid={!!errors.totalDu}>
            <FormLabel color={labelColor}>Total dû</FormLabel>
            <Controller
              name="totalDu"
              control={control}
              render={({ field }) => (
                <Input 
                  {...field} 
                  type="text" 
                  placeholder="0" 
                  value={field.value !== undefined && field.value !== null ? formatNumber(field.value.toString()) : ''}
                  onChange={(e) => {
                    const formatted = formatNumber(e.target.value)
                    field.onChange(parseNumber(formatted))
                  }}
                  {...getFieldStyles(!!errors.totalDu)} 
                  isDisabled={true}
                  bg="gray.50"
                  color="gray.700"
                />
              )}
            />
            <Text fontSize="xs" color="gray.500" mt={1}>
              Calculé automatiquement : Montant impayé + Intérêt retard + Frais
            </Text>
            {errors.totalDu && (
              <Text color={errorRed} fontSize="sm">{String(errors.totalDu.message)}</Text>
            )}
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.penalite1Pourcent}>
            <FormLabel color={labelColor}>Pénalité 1%</FormLabel>
            <Controller
              name="penalite1Pourcent"
              control={control}
              render={({ field }) => (
                <Input 
                  {...field} 
                  type="text" 
                  placeholder="0" 
                  value={field.value !== undefined && field.value !== null ? formatNumber(field.value.toString()) : ''}
                  onChange={(e) => {
                    const formatted = formatNumber(e.target.value)
                    field.onChange(parseNumber(formatted))
                  }}
                  {...getFieldStyles(!!errors.penalite1Pourcent)} 
                  isDisabled={true}
                  bg="gray.50"
                  color="gray.700"
                />
              )}
            />
            <Text fontSize="xs" color="gray.500" mt={1}>
              Calculé automatiquement : 1% du Total dû
            </Text>
            {errors.penalite1Pourcent && (
              <Text color={errorRed} fontSize="sm">{String(errors.penalite1Pourcent.message)}</Text>
            )}
          </FormControl>
        </GridItem>
      </Grid>

      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <GridItem>
          <FormControl isInvalid={!!errors.totalARecouvrer}>
            <FormLabel color={labelColor}>Total à recouvrer</FormLabel>
            <Controller
              name="totalARecouvrer"
              control={control}
              render={({ field }) => (
                <Input 
                  {...field} 
                  type="text" 
                  placeholder="0" 
                  value={field.value !== undefined && field.value !== null ? formatNumber(field.value.toString()) : ''}
                  onChange={(e) => {
                    const formatted = formatNumber(e.target.value)
                    field.onChange(parseNumber(formatted))
                  }}
                  {...getFieldStyles(!!errors.totalARecouvrer)} 
                  isDisabled={true}
                  bg="gray.50"
                  color="gray.700"
                />
              )}
            />
            <Text fontSize="xs" color="gray.500" mt={1}>
              Calculé automatiquement : Total dû + Encours + Pénalité
            </Text>
            {errors.totalARecouvrer && (
              <Text color={errorRed} fontSize="sm">{String(errors.totalARecouvrer.message)}</Text>
            )}
          </FormControl>
        </GridItem>
      </Grid>
    </VStack>
  );

  const renderStep4 = () => (
    <VStack spacing={4} align="stretch">
      <Text fontSize="lg" fontWeight="bold" mb={4} color={titleColor}>Pièces</Text>
      
      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <GridItem>
          <FormControl isInvalid={!!errors.typePiece}>
            <FormLabel color={labelColor}>Type de pièce</FormLabel>
            <Controller
              name="typePiece"
              control={control}
              render={({ field }) => (
                <Select 
                  {...field} 
                  placeholder="Sélectionner un type" 
                  {...getFieldStyles(!!errors.typePiece)} 
                  isDisabled={readOnly}
                  bg="white"
                  color="gray.800"
                >
                  <option value="contrat">Contrat</option>
                  <option value="facture">Facture</option>
                  <option value="bon_commande">Bon de commande</option>
                  <option value="lettre_engagement">Lettre d'engagement</option>
                  <option value="autre">Autre</option>
                </Select>
              )}
            />
            {errors.typePiece && (
              <Text color={errorRed} fontSize="sm">{String(errors.typePiece.message)}</Text>
            )}
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.reference}>
            <FormLabel color={labelColor}>Référence</FormLabel>
            <Controller
              name="reference"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Référence de la pièce" {...getFieldStyles(!!errors.reference)} isDisabled={readOnly} />
              )}
            />
            {errors.reference && (
              <Text color={errorRed} fontSize="sm">{String(errors.reference.message)}</Text>
            )}
          </FormControl>
        </GridItem>
      </Grid>

      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <GridItem>
          <FormControl isInvalid={!!errors.libelle}>
            <FormLabel color={labelColor}>Libellé</FormLabel>
            <Controller
              name="libelle"
              control={control}
              render={({ field }) => (
                <Textarea 
                  {...field} 
                  placeholder="Description de la pièce" 
                  rows={3}
                  {...getFieldStyles(!!errors.libelle)} 
                  isDisabled={readOnly} 
                />
              )}
            />
            {errors.libelle && (
              <Text color={errorRed} fontSize="sm">{String(errors.libelle.message)}</Text>
            )}
          </FormControl>
        </GridItem>

        <GridItem>
          <VStack spacing={4} align="stretch">
            <FormControl isInvalid={!!errors.dateEmission}>
              <FormLabel color={labelColor}>Date d'émission</FormLabel>
              <Controller
                name="dateEmission"
                control={control}
                render={({ field }) => (
                  <Input {...field} type="date" {...getFieldStyles(!!errors.dateEmission)} isDisabled={readOnly} />
                )}
              />
              {errors.dateEmission && (
                <Text color={errorRed} fontSize="sm">{String(errors.dateEmission.message)}</Text>
              )}
            </FormControl>

            <FormControl isInvalid={!!errors.dateReception}>
              <FormLabel color={labelColor}>Date de réception</FormLabel>
              <Controller
                name="dateReception"
                control={control}
                render={({ field }) => (
                  <Input {...field} type="date" {...getFieldStyles(!!errors.dateReception)} isDisabled={readOnly} />
                )}
              />
              {errors.dateReception && (
                <Text color={errorRed} fontSize="sm">{String(errors.dateReception.message)}</Text>
              )}
            </FormControl>
          </VStack>
        </GridItem>
      </Grid>
    </VStack>
  );

  const renderStep5 = () => {
    const watchedTypeGarantie = watch("typeGarantie");
    
    return (
    <VStack spacing={4} align="stretch">
        <Text fontSize="lg" fontWeight="bold" mb={4} color={titleColor}>Garanties</Text>
      
        <FormControl isInvalid={!!errors.typeGarantie}>
          <FormLabel color={labelColor}>Type de garantie</FormLabel>
        <Controller
            name="typeGarantie"
          control={control}
          render={({ field }) => (
              <Select 
                {...field} 
                placeholder="Sélectionner un type de garantie" 
                {...getFieldStyles(!!errors.typeGarantie)} 
                isDisabled={readOnly}
                bg="white"
                color="gray.800"
              onChange={(e) => {
                  field.onChange(e.target.value);
                  setTypeGarantie(e.target.value);
                }}
              >
                <option value="personnelles">Garanties personnelles</option>
                <option value="reelles">Garanties réelles</option>
              </Select>
            )}
          />
          {errors.typeGarantie && (
            <Text color={errorRed} fontSize="sm">{String(errors.typeGarantie.message)}</Text>
          )}
        </FormControl>

        {watchedTypeGarantie === "personnelles" && (
          <VStack spacing={4} align="stretch">
            <Text fontSize="md" fontWeight="semibold" color={titleColor}>Informations garanties personnelles</Text>
            
            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              <GridItem>
                <FormControl isInvalid={!!errors.type}>
                  <FormLabel color={labelColor}>Type</FormLabel>
                  <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="Type de garantie" {...getFieldStyles(!!errors.type)} isDisabled={readOnly} />
                    )}
                  />
                  {errors.type && (
                    <Text color={errorRed} fontSize="sm">{String(errors.type.message)}</Text>
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
                      <Select 
                        {...field} 
                        placeholder="Sélectionner un employeur" 
                        {...getFieldStyles(!!errors.employeur)} 
              isDisabled={readOnly}
                        bg="white"
                        color="gray.800"
                      >
                        <option value="">Chargement...</option>
                        {Array.isArray(entites) && entites.map((entite) => (
                          <option key={entite.ENT_CODE} value={entite.ENT_CODE} style={{ backgroundColor: 'white', color: 'black' }}>
                            {entite.ENT_LIB}
                          </option>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.employeur && (
                    <Text color={errorRed} fontSize="sm">{String(errors.employeur.message)}</Text>
                  )}
                </FormControl>
              </GridItem>
            </Grid>

            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              <GridItem>
                <FormControl isInvalid={!!errors.statutSal}>
                  <FormLabel color={labelColor}>Statut sal.</FormLabel>
        <Controller
                    name="statutSal"
          control={control}
          render={({ field }) => (
                      <Input {...field} placeholder="Statut salarié" {...getFieldStyles(!!errors.statutSal)} isDisabled={readOnly} />
                    )}
                  />
                  {errors.statutSal && (
                    <Text color={errorRed} fontSize="sm">{String(errors.statutSal.message)}</Text>
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
                      <Select 
                        {...field} 
                        placeholder="Sélectionner un quartier" 
                        {...getFieldStyles(!!errors.quartier)} 
              isDisabled={readOnly}
                        bg="white"
                        color="gray.800"
                      >
                        <option value="">Chargement...</option>
                  {Array.isArray(quartiers) && quartiers.map((quartier) => (
                    <option key={quartier.Q_CODE} value={quartier.Q_CODE} style={{ backgroundColor: 'white', color: 'black' }}>
                      {quartier.Q_LIB}
                    </option>
                  ))}
                      </Select>
                    )}
                  />
                  {errors.quartier && (
                    <Text color={errorRed} fontSize="sm">{String(errors.quartier.message)}</Text>
                  )}
                </FormControl>
              </GridItem>
            </Grid>

            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              <GridItem>
                <FormControl isInvalid={!!errors.priorite}>
                  <FormLabel color={labelColor}>Priorité</FormLabel>
                  <Controller
                    name="priorite"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="Priorité" {...getFieldStyles(!!errors.priorite)} isDisabled={readOnly} />
                    )}
                  />
                  {errors.priorite && (
                    <Text color={errorRed} fontSize="sm">{String(errors.priorite.message)}</Text>
                  )}
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl isInvalid={!!errors.dateInscription}>
                  <FormLabel color={labelColor}>Date d'inscription</FormLabel>
                  <Controller
                    name="dateInscription"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} type="date" {...getFieldStyles(!!errors.dateInscription)} isDisabled={readOnly} />
                    )}
                  />
                  {errors.dateInscription && (
                    <Text color={errorRed} fontSize="sm">{String(errors.dateInscription.message)}</Text>
                  )}
                </FormControl>
              </GridItem>
            </Grid>

            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              <GridItem>
                <FormControl isInvalid={!!errors.nom}>
                  <FormLabel color={labelColor}>Nom</FormLabel>
                  <Controller
                    name="nom"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="Nom" {...getFieldStyles(!!errors.nom)} isDisabled={readOnly} />
                    )}
                  />
                  {errors.nom && (
                    <Text color={errorRed} fontSize="sm">{String(errors.nom.message)}</Text>
                  )}
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl isInvalid={!!errors.prenoms}>
                  <FormLabel color={labelColor}>Prénoms</FormLabel>
                  <Controller
                    name="prenoms"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="Prénoms" {...getFieldStyles(!!errors.prenoms)} isDisabled={readOnly} />
                    )}
                  />
                  {errors.prenoms && (
                    <Text color={errorRed} fontSize="sm">{String(errors.prenoms.message)}</Text>
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
                      <Input {...field} placeholder="Fonction" {...getFieldStyles(!!errors.fonction)} isDisabled={readOnly} />
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
                      <Input {...field} placeholder="Profession" {...getFieldStyles(!!errors.profession)} isDisabled={readOnly} />
                    )}
                  />
                  {errors.profession && (
                    <Text color={errorRed} fontSize="sm">{String(errors.profession.message)}</Text>
                  )}
                </FormControl>
              </GridItem>
            </Grid>

            <GridItem>
              <FormControl isInvalid={!!errors.adressePostale}>
                <FormLabel color={labelColor}>Adresse postale</FormLabel>
                <Controller
                  name="adressePostale"
                  control={control}
                  render={({ field }) => (
                    <Textarea 
                      {...field} 
                      placeholder="Adresse postale complète" 
                      rows={3}
                      {...getFieldStyles(!!errors.adressePostale)} 
                      isDisabled={readOnly} 
                    />
                  )}
                />
                {errors.adressePostale && (
                  <Text color={errorRed} fontSize="sm">{String(errors.adressePostale.message)}</Text>
                )}
              </FormControl>
            </GridItem>
    </VStack>
        )}

        {watchedTypeGarantie === "reelles" && (
    <VStack spacing={4} align="stretch">
            <Text fontSize="md" fontWeight="semibold" color={titleColor}>Informations garanties réelles</Text>
            
            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              <GridItem>
                <FormControl isInvalid={!!errors.type}>
                  <FormLabel color={labelColor}>Type</FormLabel>
                  <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="Type de garantie" {...getFieldStyles(!!errors.type)} isDisabled={readOnly} />
                    )}
                  />
                  {errors.type && (
                    <Text color={errorRed} fontSize="sm">{String(errors.type.message)}</Text>
                  )}
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl isInvalid={!!errors.numeroGarantie}>
                  <FormLabel color={labelColor}>Numéro garantie</FormLabel>
        <Controller
                    name="numeroGarantie"
          control={control}
          render={({ field }) => (
                      <Input {...field} placeholder="Numéro de garantie" {...getFieldStyles(!!errors.numeroGarantie)} isDisabled={readOnly} />
          )}
        />
                  {errors.numeroGarantie && (
                    <Text color={errorRed} fontSize="sm">{String(errors.numeroGarantie.message)}</Text>
        )}
      </FormControl>
              </GridItem>
            </Grid>

            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              <GridItem>
                <FormControl isInvalid={!!errors.dateInscription}>
                  <FormLabel color={labelColor}>Date d'inscription</FormLabel>
        <Controller
                    name="dateInscription"
          control={control}
          render={({ field }) => (
                      <Input {...field} type="date" {...getFieldStyles(!!errors.dateInscription)} isDisabled={readOnly} />
          )}
        />
                  {errors.dateInscription && (
                    <Text color={errorRed} fontSize="sm">{String(errors.dateInscription.message)}</Text>
                  )}
      </FormControl>
              </GridItem>

              <GridItem>
                <FormControl isInvalid={!!errors.objetMontant}>
                  <FormLabel color={labelColor}>Objet montant</FormLabel>
                  <Controller
                    name="objetMontant"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="Objet et montant" {...getFieldStyles(!!errors.objetMontant)} isDisabled={readOnly} />
                    )}
                  />
                  {errors.objetMontant && (
                    <Text color={errorRed} fontSize="sm">{String(errors.objetMontant.message)}</Text>
                  )}
                </FormControl>
              </GridItem>
            </Grid>

            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              <GridItem>
                <FormControl isInvalid={!!errors.libelle}>
                  <FormLabel color={labelColor}>Libellé</FormLabel>
                  <Controller
                    name="libelle"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="Libellé" {...getFieldStyles(!!errors.libelle)} isDisabled={readOnly} />
                    )}
                  />
                  {errors.libelle && (
                    <Text color={errorRed} fontSize="sm">{String(errors.libelle.message)}</Text>
                  )}
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl isInvalid={!!errors.terrain}>
                  <FormLabel color={labelColor}>Terrain</FormLabel>
                  <Controller
                    name="terrain"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="Terrain" {...getFieldStyles(!!errors.terrain)} isDisabled={readOnly} />
                    )}
                  />
                  {errors.terrain && (
                    <Text color={errorRed} fontSize="sm">{String(errors.terrain.message)}</Text>
                  )}
                </FormControl>
              </GridItem>
            </Grid>

            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              <GridItem>
                <FormControl isInvalid={!!errors.logement}>
                  <FormLabel color={labelColor}>Logement</FormLabel>
                  <Controller
                    name="logement"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="Logement" {...getFieldStyles(!!errors.logement)} isDisabled={readOnly} />
                    )}
                  />
                  {errors.logement && (
                    <Text color={errorRed} fontSize="sm">{String(errors.logement.message)}</Text>
                  )}
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl isInvalid={!!errors.code}>
                  <FormLabel color={labelColor}>Code</FormLabel>
                  <Controller
                    name="code"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="Code" {...getFieldStyles(!!errors.code)} isDisabled={readOnly} />
                    )}
                  />
                  {errors.code && (
                    <Text color={errorRed} fontSize="sm">{String(errors.code.message)}</Text>
                  )}
                </FormControl>
              </GridItem>
            </Grid>
          </VStack>
        )}
    </VStack>
  );
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
      default: return null;
    }
  };

  return (
    <Box>
      {renderCurrentStep()}
    </Box>
  );
});

CreanceForm.displayName = 'CreanceForm';

export default CreanceForm;
export { CreanceForm };
