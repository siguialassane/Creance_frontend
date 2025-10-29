"use client"

import { Control, Controller, FieldErrors } from "react-hook-form";
import {
  VStack,
  Grid,
  GridItem,
  FormControl,
  FormLabel,
  Input,
  Select,
  Text,
} from "@chakra-ui/react";
import { useDebiteurFormContext } from "./DebiteurFormContext";
import { useAgencesByBanque } from "@/hooks/useDebiteurFormData";
import { useState, useEffect } from "react";

const primaryGreen = '#28A325';
const borderGray = '#d1d5db';
const errorRed = '#ef4444';
const errorBg = '#fef2f2';
const labelColor = '#374151';
const titleColor = '#1a202c';

type Props = {
  control: Control<any>;
  errors: FieldErrors<any>;
  readOnly?: boolean;
  watch: any; // react-hook-form watch function
};

export function DebiteurFormStep3({ control, errors, readOnly = false, watch }: Props) {
  const { formData } = useDebiteurFormContext();
  const [selectedBanque, setSelectedBanque] = useState<string | null>(null);

  // Écouter les changements de banque pour filtrer les agences
  useEffect(() => {
    const subscription = watch((value: any) => {
      if (value.banque) {
        setSelectedBanque(value.banque);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // Obtenir les agences filtrées par banque sélectionnée
  const agencesFiltrees = useAgencesByBanque(formData, selectedBanque);

  const getFieldStyles = (hasError?: boolean) => ({
    borderColor: hasError ? errorRed : borderGray,
    bg: hasError ? errorBg : (readOnly ? 'gray.50' : 'white'),
    _focus: { borderColor: primaryGreen },
    isDisabled: readOnly,
  });

  return (
    <VStack spacing={2} align="stretch">
      <Text fontSize="lg" fontWeight="bold" mb={4} color={titleColor}>
        Domiciliation
      </Text>

      <Grid templateColumns="repeat(3, 1fr)" gap={2}>
        <GridItem>
          <FormControl isInvalid={!!errors.type} isRequired>
            <FormLabel color={labelColor}>Type</FormLabel>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Sélectionner" bg="gray.100" borderColor={primaryGreen}>
                  {formData.typesDomicil.map((type: any) => (
                    <option key={type.TYPDOM_CODE || type.code} value={type.TYPDOM_CODE || type.code}>
                      {type.TYPDOM_LIB || type.libelle}
                    </option>
                  ))}
                </Select>
              )}
            />
            {errors.type && <Text color={errorRed} fontSize="sm">{String(errors.type.message)}</Text>}
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.numeroCompte} isRequired>
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

        <GridItem>
          <FormControl isInvalid={!!errors.libelle} isRequired>
            <FormLabel color={labelColor}>Libellé</FormLabel>
            <Controller
              name="libelle"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Ex: Compte principal" {...getFieldStyles(!!errors.libelle)} />
              )}
            />
            {errors.libelle && <Text color={errorRed} fontSize="sm">{String(errors.libelle.message)}</Text>}
          </FormControl>
        </GridItem>
      </Grid>

      <Grid templateColumns="repeat(3, 1fr)" gap={2}>
        <GridItem>
          <FormControl isInvalid={!!errors.banque} isRequired>
            <FormLabel color={labelColor}>Banque</FormLabel>
            <Controller
              name="banque"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder="Sélectionner"
                  bg="gray.100"
                  borderColor={primaryGreen}
                  onChange={(e) => {
                    field.onChange(e);
                    setSelectedBanque(e.target.value);
                  }}
                >
                  {formData.banques.map((banque: any) => {
                    const code = banque.BQ_CODE || banque.code;
                    const libelle = banque.BQ_LIB || banque.libelle;
                    return (
                      <option key={code} value={code}>
                        {code} - {libelle}
                      </option>
                    );
                  })}
                </Select>
              )}
            />
            {errors.banque && <Text color={errorRed} fontSize="sm">{String(errors.banque.message)}</Text>}
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.banqueAgence} isRequired>
            <FormLabel color={labelColor}>Agence de banque</FormLabel>
            <Controller
              name="banqueAgence"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder={selectedBanque ? "Sélectionner une agence" : "Sélectionner d'abord une banque"}
                  bg="gray.100"
                  borderColor={primaryGreen}
                  isDisabled={!selectedBanque || readOnly}
                >
                  {agencesFiltrees.map((agence: any) => {
                    const num = agence.BQAG_NUM || agence.code;
                    const libelle = agence.BQAG_LIB || agence.libelle;
                    return (
                      <option key={num} value={num}>
                        {num} - {libelle}
                      </option>
                    );
                  })}
                </Select>
              )}
            />
            {errors.banqueAgence && (
              <Text color={errorRed} fontSize="sm">{String(errors.banqueAgence.message)}</Text>
            )}
            {!selectedBanque && (
              <Text fontSize="xs" color="gray.500" mt={1}>
                Veuillez d'abord sélectionner une banque
              </Text>
            )}
          </FormControl>
        </GridItem>
      </Grid>
    </VStack>
  );
}
