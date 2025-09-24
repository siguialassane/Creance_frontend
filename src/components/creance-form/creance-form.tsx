"use client"

import { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from "react";
import { Box, VStack, HStack, FormControl, FormLabel, Input, Select, Textarea, Text, Divider, Grid, GridItem, Checkbox, Stack } from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Schémas de validation pour chaque étape
const step1Schema = z.object({
  numeroCreance: z.string().min(1, "Le numéro de créance est requis"),
  objetCreance: z.string().min(1, "L'objet de créance est requis"),
  groupeCreance: z.string().min(1, "Le groupe de créance est requis"),
  debiteurCode: z.string().min(1, "Le débiteur est requis"),
  periodicite: z.string().min(1, "La périodicité est requise"),
});

const step2Schema = z.object({
  capitalInitial: z.number().min(0, "Le capital initial doit être positif"),
  montantInteretConventionnel: z.number().min(0, "Le montant d'intérêt conventionnel doit être positif"),
  montantCommissionBanque: z.number().min(0, "Le montant de commission banque doit être positif"),
  montantARembourser: z.number().min(0, "Le montant à rembourser doit être positif"),
  montantDejaRembourse: z.number().min(0, "Le montant déjà remboursé doit être positif"),
  montantImpaye: z.number().min(0, "Le montant impayé doit être positif"),
  montantInteretRetard: z.number().min(0, "Le montant d'intérêt de retard doit être positif"),
  frais: z.number().min(0, "Les frais doivent être positifs"),
  penalite: z.number().min(0, "La pénalité doit être positive"),
  totalSolde: z.number().min(0, "Le total solde doit être positif"),
});

const step3Schema = z.object({
  garantiePersonnelle: z.boolean().optional(),
  garantieReelle: z.boolean().optional(),
});

const step4Schema = z.object({
  validation: z.boolean().refine(val => val === true, "Vous devez valider les informations"),
  commentaires: z.string().optional(),
});

interface CreanceFormProps {
  currentStep: number;
  formData: any;
  onDataChange: (data: any) => void;
  onSubmit: (data: any) => void;
}

const CreanceForm = forwardRef<any, CreanceFormProps>(({ currentStep, formData, onDataChange, onSubmit }, ref) => {
  const [stepData, setStepData] = useState({});

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

      // Calculs automatiques des montants dérivés (étape 2)
      const v: any = value || {}
      const capitalInitial = Number(v.capitalInitial || 0)
      const interetConv = Number(v.montantInteretConventionnel || 0)
      const commissionBanque = Number(v.montantCommissionBanque || 0)
      const dejaRembourse = Number(v.montantDejaRembourse || 0)
      const interetRetard = Number(v.montantInteretRetard || 0)
      const frais = Number(v.frais || 0)
      const penalite = Number(v.penalite || 0)

      // 1) Montant à rembourser = capital + intérêt conventionnel + commission banque
      const calcMontantARemb = capitalInitial + interetConv + commissionBanque

      // 3) Montant impayé = montant dû - montant déjà remboursé
      const calcMontantImpaye = Math.max(calcMontantARemb - dejaRembourse, 0)

      // 5) Total dû = impayé + intérêt de retard + frais
      const calcTotalDu = calcMontantImpaye + interetRetard + frais

      // 7) Total solde (à recouvrer) = total dû + pénalité (+ encours si distinct)
      const calcTotalSolde = calcTotalDu + penalite

      // Appliquer les valeurs si différentes pour éviter les boucles
      if (typeof v.montantARembourser !== 'number' || v.montantARembourser !== calcMontantARemb) {
        setValue('montantARembourser', calcMontantARemb, { shouldValidate: false, shouldDirty: false, shouldTouch: false })
      }
      if (typeof v.montantImpaye !== 'number' || v.montantImpaye !== calcMontantImpaye) {
        setValue('montantImpaye', calcMontantImpaye, { shouldValidate: false, shouldDirty: false, shouldTouch: false })
      }
      if (typeof v.totalSolde !== 'number' || v.totalSolde !== calcTotalSolde) {
        setValue('totalSolde', calcTotalSolde, { shouldValidate: false, shouldDirty: false, shouldTouch: false })
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
          <FormControl isInvalid={!!errors.numeroCreance}>
            <FormLabel color={labelColor}>Numéro de créance *</FormLabel>
            <Controller
              name="numeroCreance"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Ex: CRE-2024-001" {...getFieldStyles(!!errors.numeroCreance)} />
              )}
            />
            {errors.numeroCreance && (
              <Text color={errorRed} fontSize="sm">{String(errors.numeroCreance.message)}</Text>
            )}
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.dateCreation}>
            <FormLabel color={labelColor}>Date de création *</FormLabel>
            <Controller
              name="dateCreation"
              control={control}
              render={({ field }) => (
                <Input {...field} type="date" {...getFieldStyles(!!errors.dateCreation)} />
              )}
            />
            {errors.dateCreation && (
              <Text color={errorRed} fontSize="sm">{String(errors.dateCreation.message)}</Text>
            )}
          </FormControl>
        </GridItem>
      </Grid>

      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <GridItem>
          <FormControl isInvalid={!!errors.debiteurCode}>
            <FormLabel color={labelColor}>Débiteur *</FormLabel>
            <Controller
              name="debiteurCode"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Sélectionner un débiteur" {...getFieldStyles(!!errors.debiteurCode)}>
                  <option value="deb1">Débiteur 1</option>
                  <option value="deb2">Débiteur 2</option>
                  <option value="deb3">Débiteur 3</option>
                </Select>
              )}
            />
            {errors.debiteurCode && (
              <Text color={errorRed} fontSize="sm">{String(errors.debiteurCode.message)}</Text>
            )}
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.periodicite}>
            <FormLabel color={labelColor}>Périodicité *</FormLabel>
            <Controller
              name="periodicite"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Sélectionner une périodicité" {...getFieldStyles(!!errors.periodicite)}>
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

      <FormControl isInvalid={!!errors.objetCreance}>
        <FormLabel color={labelColor}>Objet de créance *</FormLabel>
        <Controller
          name="objetCreance"
          control={control}
          render={({ field }) => (
            <Select {...field} placeholder="Sélectionner un objet" {...getFieldStyles(!!errors.objetCreance)}>
              <option value="pret">Prêt</option>
              <option value="credit">Crédit</option>
              <option value="avance">Avance</option>
              <option value="autre">Autre</option>
            </Select>
          )}
        />
        {errors.objetCreance && (
          <Text color={errorRed} fontSize="sm">{String(errors.objetCreance.message)}</Text>
        )}
      </FormControl>

      <FormControl isInvalid={!!errors.groupeCreance}>
        <FormLabel color={labelColor}>Groupe de créance *</FormLabel>
        <Controller
          name="groupeCreance"
          control={control}
          render={({ field }) => (
            <Select {...field} placeholder="Sélectionner un groupe" {...getFieldStyles(!!errors.groupeCreance)}>
              <option value="groupe1">Groupe 1</option>
              <option value="groupe2">Groupe 2</option>
              <option value="groupe3">Groupe 3</option>
            </Select>
          )}
        />
        {errors.groupeCreance && (
          <Text color={errorRed} fontSize="sm">{String(errors.groupeCreance.message)}</Text>
        )}
      </FormControl>
    </VStack>
  );

  const renderStep2 = () => (
    <VStack spacing={4} align="stretch">
      <Text fontSize="lg" fontWeight="bold" mb={4} color={titleColor}>Détails financiers</Text>
      
      <Grid templateColumns="repeat(3, 1fr)" gap={4}>
        <GridItem>
          <FormControl isInvalid={!!errors.capitalInitial}>
            <FormLabel color={labelColor}>Capital initial *</FormLabel>
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
                />
              )}
            />
            {errors.capitalInitial && (
              <Text color={errorRed} fontSize="sm">{String(errors.capitalInitial.message)}</Text>
            )}
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.montantInteretConventionnel}>
            <FormLabel color={labelColor}>Intérêt conventionnel *</FormLabel>
            <Controller
              name="montantInteretConventionnel"
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
                  {...getFieldStyles(!!errors.montantInteretConventionnel)} 
                />
              )}
            />
            {errors.montantInteretConventionnel && (
              <Text color={errorRed} fontSize="sm">{String(errors.montantInteretConventionnel.message)}</Text>
            )}
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.montantCommissionBanque}>
            <FormLabel color={labelColor}>Commission banque *</FormLabel>
            <Controller
              name="montantCommissionBanque"
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
                  {...getFieldStyles(!!errors.montantCommissionBanque)} 
                />
              )}
            />
            {errors.montantCommissionBanque && (
              <Text color={errorRed} fontSize="sm">{String(errors.montantCommissionBanque.message)}</Text>
            )}
          </FormControl>
        </GridItem>
      </Grid>

      <Grid templateColumns="repeat(3, 1fr)" gap={4}>
        <GridItem>
          <FormControl isInvalid={!!errors.montantARembourser}>
            <FormLabel color={labelColor}>Montant à rembourser *</FormLabel>
            <Controller
              name="montantARembourser"
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
                  {...getFieldStyles(!!errors.montantARembourser)} 
                />
              )}
            />
            {errors.montantARembourser && (
              <Text color={errorRed} fontSize="sm">{String(errors.montantARembourser.message)}</Text>
            )}
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.montantDejaRembourse}>
            <FormLabel color={labelColor}>Montant déjà remboursé *</FormLabel>
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
                />
              )}
            />
            {errors.montantDejaRembourse && (
              <Text color={errorRed} fontSize="sm">{String(errors.montantDejaRembourse.message)}</Text>
            )}
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.montantImpaye}>
            <FormLabel color={labelColor}>Montant impayé *</FormLabel>
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
                />
              )}
            />
            {errors.montantImpaye && (
              <Text color={errorRed} fontSize="sm">{String(errors.montantImpaye.message)}</Text>
            )}
          </FormControl>
        </GridItem>
      </Grid>

      <Grid templateColumns="repeat(3, 1fr)" gap={4}>
        <GridItem>
          <FormControl isInvalid={!!errors.montantInteretRetard}>
            <FormLabel color={labelColor}>Intérêt de retard *</FormLabel>
            <Controller
              name="montantInteretRetard"
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
                  {...getFieldStyles(!!errors.montantInteretRetard)} 
                />
              )}
            />
            {errors.montantInteretRetard && (
              <Text color={errorRed} fontSize="sm">{String(errors.montantInteretRetard.message)}</Text>
            )}
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.frais}>
            <FormLabel color={labelColor}>Frais *</FormLabel>
            <Controller
              name="frais"
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
                  {...getFieldStyles(!!errors.frais)} 
                />
              )}
            />
            {errors.frais && (
              <Text color={errorRed} fontSize="sm">{String(errors.frais.message)}</Text>
            )}
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.penalite}>
            <FormLabel color={labelColor}>Pénalité (1/100) *</FormLabel>
            <Controller
              name="penalite"
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
                  {...getFieldStyles(!!errors.penalite)} 
                />
              )}
            />
            {errors.penalite && (
              <Text color={errorRed} fontSize="sm">{String(errors.penalite.message)}</Text>
            )}
          </FormControl>
        </GridItem>
      </Grid>

      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <GridItem>
          <FormControl isInvalid={!!errors.totalSolde}>
            <FormLabel color={labelColor}>Total solde (à recouvrer) *</FormLabel>
            <Controller
              name="totalSolde"
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
                  {...getFieldStyles(!!errors.totalSolde)} 
                />
              )}
            />
            {errors.totalSolde && (
              <Text color={errorRed} fontSize="sm">{String(errors.totalSolde.message)}</Text>
            )}
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.devise}>
            <FormLabel color={labelColor}>Devise *</FormLabel>
            <Controller
              name="devise"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Sélectionner une devise" {...getFieldStyles(!!errors.devise)}>
                  <option value="XOF">XOF (Franc CFA)</option>
                  <option value="EUR">EUR (Euro)</option>
                  <option value="USD">USD (Dollar US)</option>
                </Select>
              )}
            />
            {errors.devise && (
              <Text color={errorRed} fontSize="sm">{String(errors.devise.message)}</Text>
            )}
          </FormControl>
        </GridItem>
      </Grid>


    </VStack>
  );

  const renderStep3 = () => (
    <VStack spacing={4} align="stretch">
      <Text fontSize="lg" fontWeight="bold" mb={4} color={titleColor}>Garanties et sûretés</Text>
      
      <Stack spacing={2}>
        <Controller
          name="garantiePersonnelle"
          control={control}
          render={({ field }) => (
            <Checkbox 
              isChecked={field.value || false} 
              onChange={(e) => {
                if (e.target.checked) {
                  field.onChange(true)
                  setValue('garantieReelle', false)
                } else {
                  field.onChange(false)
                }
              }}
              _checked={{ bg: primaryGreen, borderColor: primaryGreen }}
            >
              Garantie personnelle
            </Checkbox>
          )}
        />
        <Controller
          name="garantieReelle"
          control={control}
          render={({ field }) => (
            <Checkbox 
              isChecked={field.value || false} 
              onChange={(e) => {
                if (e.target.checked) {
                  field.onChange(true)
                  setValue('garantiePersonnelle', false)
                } else {
                  field.onChange(false)
                }
              }}
              _checked={{ bg: primaryGreen, borderColor: primaryGreen }}
            >
              Garantie réelle
            </Checkbox>
          )}
        />
      </Stack>
    </VStack>
  );

  const renderStep4 = () => (
    <VStack spacing={4} align="stretch">
      <Text fontSize="lg" fontWeight="bold" mb={4}>Validation et enregistrement</Text>
      
      <Box p={4} bg="gray.50" borderRadius="md">
        <Text fontSize="md" fontWeight="semibold" mb={2}>Récapitulatif</Text>
        <VStack align="stretch" spacing={2}>
          <HStack justify="space-between">
            <Text>Numéro de créance:</Text>
            <Text fontWeight="bold">{formData.numeroCreance || 'Non défini'}</Text>
          </HStack>
          <HStack justify="space-between">
            <Text>Capital initial:</Text>
            <Text fontWeight="bold">{formData.capitalInitial ? formatNumber(formData.capitalInitial.toString()) : '0'}</Text>
          </HStack>
          <HStack justify="space-between">
            <Text>Montant à rembourser:</Text>
            <Text fontWeight="bold">{formData.montantARembourser ? formatNumber(formData.montantARembourser.toString()) : '0'}</Text>
          </HStack>
          <HStack justify="space-between">
            <Text>Total solde:</Text>
            <Text fontWeight="bold">{formData.totalSolde ? formatNumber(formData.totalSolde.toString()) : '0'}</Text>
          </HStack>
        </VStack>
      </Box>

      <FormControl isInvalid={!!errors.validation}>
        <Controller
          name="validation"
          control={control}
          render={({ field }) => (
            <Checkbox {...field} isChecked={field.value}>
              Je confirme que toutes les informations sont exactes et valides
            </Checkbox>
          )}
        />
        {errors.validation && (
          <Text color="red.500" fontSize="sm">{String(errors.validation.message)}</Text>
        )}
      </FormControl>

      <FormControl>
        <FormLabel>Commentaires (optionnel)</FormLabel>
        <Controller
          name="commentaires"
          control={control}
          render={({ field }) => (
            <Textarea {...field} placeholder="Commentaires supplémentaires" rows={3} />
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

CreanceForm.displayName = 'CreanceForm';

export default CreanceForm;
export { CreanceForm };
