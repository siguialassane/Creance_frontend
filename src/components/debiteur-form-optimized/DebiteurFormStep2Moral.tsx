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
  Textarea,
  Text,
} from "@chakra-ui/react";

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
};

export function DebiteurFormStep2Moral({ control, errors, readOnly = false }: Props) {
  const getFieldStyles = (hasError?: boolean) => ({
    borderColor: hasError ? errorRed : borderGray,
    bg: hasError ? errorBg : (readOnly ? 'gray.50' : 'white'),
    _focus: { borderColor: primaryGreen },
    isDisabled: readOnly,
  });

  return (
    <VStack spacing={2} align="stretch">
      <Text fontSize="lg" fontWeight="bold" mb={4} color={titleColor}>
        Personne morale
      </Text>

      <Grid templateColumns="repeat(3, 1fr)" gap={2}>
        <GridItem>
          <FormControl isInvalid={!!errors.registreCommerce} isRequired>
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
          <FormControl isInvalid={!!errors.raisonSociale} isRequired>
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
          <FormControl>
            <FormLabel color={labelColor}>Capital social</FormLabel>
            <Controller
              name="capitalSocial"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Ex: 10 000 000"
                  {...getFieldStyles()}
                  onChange={(e) => {
                    // Formater avec espaces
                    const numbers = e.target.value.replace(/\D/g, '');
                    const formatted = numbers ? numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : '';
                    field.onChange(formatted);
                  }}
                />
              )}
            />
          </FormControl>
        </GridItem>
      </Grid>

      <Grid templateColumns="repeat(3, 1fr)" gap={2}>
        <GridItem>
          <FormControl isInvalid={!!errors.formeJuridique} isRequired>
            <FormLabel color={labelColor}>Forme juridique</FormLabel>
            <Controller
              name="formeJuridique"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Sélectionner" bg="gray.100" borderColor={primaryGreen}>
                  <option value="SARL">SARL</option>
                  <option value="SA">SA</option>
                  <option value="SNC">SNC</option>
                  <option value="EURL">EURL</option>
                  <option value="SAS">SAS</option>
                  <option value="autre">Autre</option>
                </Select>
              )}
            />
            {errors.formeJuridique && (
              <Text color={errorRed} fontSize="sm">{String(errors.formeJuridique.message)}</Text>
            )}
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.domaineActivite} isRequired>
            <FormLabel color={labelColor}>Domaine d'activité</FormLabel>
            <Controller
              name="domaineActivite"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Sélectionner" bg="gray.100" borderColor={primaryGreen}>
                  <option value="commerce">Commerce</option>
                  <option value="industrie">Industrie</option>
                  <option value="services">Services</option>
                  <option value="agriculture">Agriculture</option>
                  <option value="batiment">Bâtiment</option>
                  <option value="transport">Transport</option>
                  <option value="autre">Autre</option>
                </Select>
              )}
            />
            {errors.domaineActivite && (
              <Text color={errorRed} fontSize="sm">{String(errors.domaineActivite.message)}</Text>
            )}
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.nomGerant} isRequired>
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
        </GridItem>
      </Grid>

      <Grid templateColumns="repeat(1, 1fr)" gap={2}>
        <GridItem>
          <FormControl isInvalid={!!errors.siegeSocial} isRequired>
            <FormLabel color={labelColor}>Siège social</FormLabel>
            <Controller
              name="siegeSocial"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  placeholder="Ex: Cocody, Angré 8ème Tranche, Abidjan"
                  rows={2}
                  {...getFieldStyles(!!errors.siegeSocial)}
                />
              )}
            />
            {errors.siegeSocial && (
              <Text color={errorRed} fontSize="sm">{String(errors.siegeSocial.message)}</Text>
            )}
          </FormControl>
        </GridItem>
      </Grid>
    </VStack>
  );
}
