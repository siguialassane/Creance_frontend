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
  Divider,
} from "@chakra-ui/react";
import { useDebiteurFormContext } from "./DebiteurFormContext";

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

export function DebiteurFormStep2Physical({ control, errors, readOnly = false }: Props) {
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
        Personne physique
      </Text>

      {/* Identité */}
      <Grid templateColumns="repeat(3, 1fr)" gap={2}>
        <GridItem>
          <FormControl isInvalid={!!errors.civilite} isRequired>
            <FormLabel color={labelColor}>Civilité</FormLabel>
            <Controller
              name="civilite"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Sélectionner" borderColor={primaryGreen} bg="gray.100">
                  {formData.civilites.map((civ: any) => (
                    <option key={civ.CIV_CODE || civ.code} value={civ.CIV_CODE || civ.code}>
                      {civ.CIV_LIB || civ.libelle}
                    </option>
                  ))}
                </Select>
              )}
            />
            {errors.civilite && <Text color={errorRed} fontSize="sm">{String(errors.civilite.message)}</Text>}
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.nom} isRequired>
            <FormLabel color={labelColor}>Nom</FormLabel>
            <Controller name="nom" control={control} render={({ field }) => (
              <Input {...field} placeholder="Ex: Koné" {...getFieldStyles(!!errors.nom)} />
            )} />
            {errors.nom && <Text color={errorRed} fontSize="sm">{String(errors.nom.message)}</Text>}
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.prenom} isRequired>
            <FormLabel color={labelColor}>Prénom</FormLabel>
            <Controller name="prenom" control={control} render={({ field }) => (
              <Input {...field} placeholder="Ex: Amadou" {...getFieldStyles(!!errors.prenom)} />
            )} />
            {errors.prenom && <Text color={errorRed} fontSize="sm">{String(errors.prenom.message)}</Text>}
          </FormControl>
        </GridItem>
      </Grid>

      {/* Naissance */}
      <Grid templateColumns="repeat(3, 1fr)" gap={2}>
        <GridItem>
          <FormControl isInvalid={!!errors.dateNaissance} isRequired>
            <FormLabel color={labelColor}>Date de naissance</FormLabel>
            <Controller name="dateNaissance" control={control} render={({ field }) => (
              <Input {...field} type="date" {...getFieldStyles(!!errors.dateNaissance)} />
            )} />
            {errors.dateNaissance && <Text color={errorRed} fontSize="sm">{String(errors.dateNaissance.message)}</Text>}
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.lieuNaissance} isRequired>
            <FormLabel color={labelColor}>Lieu de naissance</FormLabel>
            <Controller name="lieuNaissance" control={control} render={({ field }) => (
              <Input {...field} placeholder="Ex: Abidjan" {...getFieldStyles(!!errors.lieuNaissance)} />
            )} />
            {errors.lieuNaissance && <Text color={errorRed} fontSize="sm">{String(errors.lieuNaissance.message)}</Text>}
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.quartier} isRequired>
            <FormLabel color={labelColor}>Quartier</FormLabel>
            <Controller name="quartier" control={control} render={({ field }) => (
              <Select {...field} placeholder="Sélectionner" bg="gray.100" borderColor={primaryGreen}>
                {formData.quartiers.map((q: any) => (
                  <option key={q.QUART_CODE || q.code} value={q.QUART_CODE || q.code}>
                    {q.QUART_LIB || q.libelle}
                  </option>
                ))}
              </Select>
            )} />
            {errors.quartier && <Text color={errorRed} fontSize="sm">{String(errors.quartier.message)}</Text>}
          </FormControl>
        </GridItem>
      </Grid>

      {/* Nationalité et Profession */}
      <Grid templateColumns="repeat(3, 1fr)" gap={2}>
        <GridItem>
          <FormControl isInvalid={!!errors.nationalite} isRequired>
            <FormLabel color={labelColor}>Nationalité</FormLabel>
            <Controller name="nationalite" control={control} render={({ field }) => (
              <Select {...field} placeholder="Sélectionner" bg="gray.100" borderColor={primaryGreen}>
                {formData.nationalites.map((n: any) => (
                  <option key={n.NAT_CODE || n.code} value={n.NAT_CODE || n.code}>
                    {n.NAT_LIB || n.libelle}
                  </option>
                ))}
              </Select>
            )} />
            {errors.nationalite && <Text color={errorRed} fontSize="sm">{String(errors.nationalite.message)}</Text>}
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.fonction} isRequired>
            <FormLabel color={labelColor}>Fonction</FormLabel>
            <Controller name="fonction" control={control} render={({ field }) => (
              <Select {...field} placeholder="Sélectionner" bg="gray.100" borderColor={primaryGreen}>
                {formData.fonctions.map((f: any) => (
                  <option key={f.FONCT_CODE || f.code} value={f.FONCT_CODE || f.code}>
                    {f.FONCT_LIB || f.libelle}
                  </option>
                ))}
              </Select>
            )} />
            {errors.fonction && <Text color={errorRed} fontSize="sm">{String(errors.fonction.message)}</Text>}
          </FormControl>
        </GridItem>
      </Grid>

      {/* Emploi */}
      <Grid templateColumns="repeat(3, 1fr)" gap={2}>
        <GridItem>
          <FormControl isInvalid={!!errors.profession} isRequired>
            <FormLabel color={labelColor}>Profession</FormLabel>
            <Controller name="profession" control={control} render={({ field }) => (
              <Select {...field} placeholder="Sélectionner" bg="gray.100" borderColor={primaryGreen}>
                {formData.professions.map((p: any) => (
                  <option key={p.PROFES_CODE || p.code} value={p.PROFES_CODE || p.code}>
                    {p.PROFES_LIB || p.libelle}
                  </option>
                ))}
              </Select>
            )} />
            {errors.profession && <Text color={errorRed} fontSize="sm">{String(errors.profession.message)}</Text>}
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.employeur} isRequired>
            <FormLabel color={labelColor}>Employeur</FormLabel>
            <Controller name="employeur" control={control} render={({ field }) => (
              <Select {...field} placeholder="Sélectionner" bg="gray.100" borderColor={primaryGreen}>
                {formData.entites.map((e: any) => (
                  <option key={e.ENT_CODE || e.code} value={e.ENT_CODE || e.code}>
                    {e.ENT_LIB || e.libelle}
                  </option>
                ))}
              </Select>
            )} />
            {errors.employeur && <Text color={errorRed} fontSize="sm">{String(errors.employeur.message)}</Text>}
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.statutSalarie} isRequired>
            <FormLabel color={labelColor}>Statut Salarié</FormLabel>
            <Controller name="statutSalarie" control={control} render={({ field }) => (
              <Select {...field} placeholder="Sélectionner" bg="gray.100" borderColor={primaryGreen}>
                {formData.statutsSalarie.map((s: any) => (
                  <option key={s.STATSAL_CODE || s.code} value={s.STATSAL_CODE || s.code}>
                    {s.STATSAL_LIB || s.libelle}
                  </option>
                ))}
              </Select>
            )} />
            {errors.statutSalarie && <Text color={errorRed} fontSize="sm">{String(errors.statutSalarie.message)}</Text>}
          </FormControl>
        </GridItem>
      </Grid>

      {/* Autres infos */}
      <Grid templateColumns="repeat(3, 1fr)" gap={2}>
        <GridItem>
          <FormControl>
            <FormLabel color={labelColor}>Matricule</FormLabel>
            <Controller name="matricule" control={control} render={({ field }) => (
              <Input {...field} placeholder="Ex: MAT123456" {...getFieldStyles()} />
            )} />
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.sexe} isRequired>
            <FormLabel color={labelColor}>Sexe</FormLabel>
            <Controller name="sexe" control={control} render={({ field }) => (
              <Select {...field} placeholder="Sélectionner" bg="gray.100" borderColor={primaryGreen}>
                <option value="M">Masculin</option>
                <option value="F">Féminin</option>
              </Select>
            )} />
            {errors.sexe && <Text color={errorRed} fontSize="sm">{String(errors.sexe.message)}</Text>}
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl>
            <FormLabel color={labelColor}>Date de décès</FormLabel>
            <Controller name="dateDeces" control={control} render={({ field }) => (
              <Input {...field} type="date" {...getFieldStyles()} />
            )} />
          </FormControl>
        </GridItem>
      </Grid>

      <Divider my={4} />

      {/* Note: Les autres sections (pièce d'identité, mariage, conjoint, parents)
          peuvent être ajoutées de la même manière. Pour l'instant, on garde les champs essentiels. */}

      <Text fontSize="sm" color="gray.600">
        Autres champs disponibles : Pièce d'identité, Statut matrimonial, Informations du conjoint, Parents, etc.
        (À compléter selon besoins)
      </Text>
    </VStack>
  );
}
