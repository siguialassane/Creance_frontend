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
import { useDebiteurFormContext } from "./DebiteurFormContext";

type Step1FormData = {
  codeDebiteur?: string;
  categorieDebiteur: string;
  adressePostale: string;
  email: string;
  telephone?: string;
  numeroCell?: string;
  typeDebiteur: string;
};

type Props = {
  control: Control<any>;
  errors: FieldErrors<Step1FormData>;
  isEditMode?: boolean;
  readOnly?: boolean;
};

const primaryGreen = '#28A325';
const borderGray = '#d1d5db';
const errorRed = '#ef4444';
const errorBg = '#fef2f2';
const labelColor = '#374151';
const titleColor = '#1a202c';

export function DebiteurFormStep1({ control, errors, isEditMode = false, readOnly = false }: Props) {
  const { formData } = useDebiteurFormContext();

  const getFieldStyles = (hasError?: boolean) => ({
    borderColor: hasError ? errorRed : borderGray,
    bg: hasError ? errorBg : (readOnly ? 'gray.50' : 'white'),
    _focus: { borderColor: primaryGreen },
    isDisabled: readOnly,
  });

  return (
    <VStack spacing={2} align="stretch">
      <Text fontSize="lg" fontWeight="bold" mb={4} color={titleColor}>
        Informations générales
      </Text>

      <Grid templateColumns="repeat(3, 1fr)" gap={2}>
        {/* Code Débiteur */}
        <GridItem>
          <FormControl isInvalid={!!errors.codeDebiteur}>
            <FormLabel color={labelColor}>Code débiteur</FormLabel>
            <Controller
              name="codeDebiteur"
              control={control}
              render={({ field }) => (
                isEditMode || readOnly ? (
                  <Input
                    {...field}
                    value={field.value || "Code non disponible"}
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
                )
              )}
            />
            {!isEditMode && !readOnly && (
              <Text fontSize="xs" color="gray.500" mt={1}>
                Le code sera généré automatiquement après validation
              </Text>
            )}
          </FormControl>
        </GridItem>

        {/* Catégorie Débiteur */}
        <GridItem>
          <FormControl isInvalid={!!errors.categorieDebiteur} isRequired>
            <FormLabel color={labelColor}>Catégorie débiteur</FormLabel>
            <Controller
              name="categorieDebiteur"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder="Sélectionner une catégorie"
                  borderColor={primaryGreen}
                  bg="gray.100"
                  color="gray.700"
                  _focus={{ borderColor: primaryGreen }}
                  _hover={{ bg: "gray.100" }}
                  isDisabled={readOnly}
                >
                  {formData.categoriesDebiteur.map((categorie: any) => {
                    const code = categorie.CATEG_DEB_CODE || categorie.id || categorie.code;
                    const libelle = categorie.CATEG_DEB_LIB || categorie.libelle;
                    return (
                      <option key={code} value={code}>
                        {libelle}
                      </option>
                    );
                  })}
                </Select>
              )}
            />
            {errors.categorieDebiteur && (
              <Text color={errorRed} fontSize="sm">{String(errors.categorieDebiteur.message)}</Text>
            )}
          </FormControl>
        </GridItem>

        {/* Adresse Postale */}
        <GridItem>
          <FormControl isInvalid={!!errors.adressePostale} isRequired>
            <FormLabel color={labelColor}>Adresse postale</FormLabel>
            <Controller
              name="adressePostale"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  placeholder="Ex: Cocody"
                  rows={2}
                  {...getFieldStyles(!!errors.adressePostale)}
                />
              )}
            />
            {errors.adressePostale && (
              <Text color={errorRed} fontSize="sm">{String(errors.adressePostale.message)}</Text>
            )}
          </FormControl>
        </GridItem>
      </Grid>

      <Grid templateColumns="repeat(3, 1fr)" gap={2}>
        {/* Email */}
        <GridItem>
          <FormControl isInvalid={!!errors.email} isRequired>
            <FormLabel color={labelColor}>Email</FormLabel>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Ex: debiteur@example.com"
                  type="email"
                  {...getFieldStyles(!!errors.email)}
                />
              )}
            />
            {errors.email && (
              <Text color={errorRed} fontSize="sm">{String(errors.email.message)}</Text>
            )}
          </FormControl>
        </GridItem>

        {/* Téléphone */}
        <GridItem>
          <FormControl isInvalid={!!errors.telephone}>
            <FormLabel color={labelColor}>Téléphone</FormLabel>
            <Controller
              name="telephone"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Ex: +225 27 12 34 56 78"
                  {...getFieldStyles(!!errors.telephone)}
                />
              )}
            />
          </FormControl>
        </GridItem>

        {/* N° Cellulaire */}
        <GridItem>
          <FormControl isInvalid={!!errors.numeroCell}>
            <FormLabel color={labelColor}>N° Cellulaire</FormLabel>
            <Controller
              name="numeroCell"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Ex: +225 07 12 34 56 78"
                  {...getFieldStyles(!!errors.numeroCell)}
                />
              )}
            />
          </FormControl>
        </GridItem>
      </Grid>

      <Grid templateColumns="repeat(3, 1fr)" gap={2}>
        {/* Type Débiteur */}
        <GridItem>
          <FormControl isInvalid={!!errors.typeDebiteur} isRequired>
            <FormLabel color={labelColor}>Type débiteur</FormLabel>
            <Controller
              name="typeDebiteur"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder="Sélectionner un type"
                  borderColor={primaryGreen}
                  bg="gray.100"
                  color="gray.700"
                  _focus={{ borderColor: primaryGreen }}
                  _hover={{ bg: "gray.100" }}
                  isDisabled={readOnly}
                >
                  {formData.typesDebiteur.map((type: any) => {
                    const code = type.TYPDEB_CODE || type.code || type.id;
                    const libelle = type.TYPDEB_LIB || type.libelle;
                    return (
                      <option key={code} value={code}>
                        {libelle}
                      </option>
                    );
                  })}
                </Select>
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
}
