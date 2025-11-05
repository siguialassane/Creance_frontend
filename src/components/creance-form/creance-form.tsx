"use client"

import { useState, useEffect, useCallback, useMemo, forwardRef, useImperativeHandle, FC, useRef } from "react";
import { useForm, Controller, ControllerRenderProps } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useGroupesCreance } from "@/hooks/useGroupesCreance";
import { useObjetsCreance } from "@/hooks/useObjetsCreance";
import { useEntites } from "@/hooks/useEntites";
import { useClasses } from "@/hooks/useClasses";
import { useQuartiers } from "@/hooks/useQuartiers";
import { useGroupesCreanceSearchable } from "@/hooks/useGroupesCreanceSearchable";
import { useObjetsCreanceSearchable } from "@/hooks/useObjetsCreanceSearchable";
import { useEntitesSearchable } from "@/hooks/useEntitesSearchable";
import { useQuartiersSearchable } from "@/hooks/useQuartiersSearchable";
import { useDebiteursSearchable } from "@/hooks/useDebiteursSearchable";
import { useOrdonnateursSearchable } from "@/hooks/useOrdonnateursSearchable";
import { useTypeGarantieReellesSearchable } from "@/hooks/useTypeGarantieReellesSearchable";
import { useTypeGarantiePersonnellesSearchable } from "@/hooks/useTypeGarantiePersonnellesSearchable";
import { useTypePiecesSearchable } from "@/hooks/useTypePiecesSearchable";
import { useCivilitesSearchable } from "@/hooks/useCivilitesSearchable";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { step1Schema, step2Schema, step3Schema, step4Schema, step5Schema, getSchemaForStep as getSchemaForStepFromLib } from "@/lib/validations/creance-schemas";

// Composant NumberInput personnalisé pour gérer la saisie de nombres avec formatage
interface NumberInputFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value: number | undefined | null;
  onChange: (value: number | undefined) => void;
}

const NumberInputField: FC<NumberInputFieldProps> = ({ value, onChange, ...props }) => {
  // Fonction pour formater un nombre pour l'affichage
  const formatNumberForDisplay = useCallback((num: number | undefined | null): string => {
    if (num === undefined || num === null || isNaN(num)) return '';

    const strValue = num.toString();
    const parts = strValue.split('.');
    const integerPart = parts[0];
    const decimalPart = parts[1] || '';

    // Formater avec séparateurs de milliers (espaces)
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

    if (decimalPart) {
      return formattedInteger + ',' + decimalPart;
    }
    return formattedInteger;
  }, []);

  const [localValue, setLocalValue] = useState<string>(() => formatNumberForDisplay(value));
  const [isFocused, setIsFocused] = useState(false);

  // Fonction pour formater un nombre avec séparateurs de milliers pendant la saisie
  const formatWithThousandsSeparator = useCallback((str: string): string => {
    // Séparer la partie entière de la partie décimale
    const parts = str.split(',');
    const integerPart = parts[0].replace(/\D/g, '');
    const decimalPart = parts[1] ? parts[1].replace(/\D/g, '') : '';

    if (!integerPart) return '';

    // Ajouter les séparateurs de milliers (espaces)
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

    // Retourner avec la virgule si il y a une partie décimale
    if (parts.length > 1) {
      return formattedInteger + ',' + decimalPart;
    }
    return formattedInteger;
  }, []);

  // Synchroniser avec la valeur externe quand le champ n'est pas focus
  useEffect(() => {
    if (!isFocused) {
      setLocalValue(formatNumberForDisplay(value));
    }
  }, [value, isFocused, formatNumberForDisplay]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Supprimer tout sauf les chiffres et la virgule
    let cleaned = inputValue.replace(/[^\d,]/g, '');

    // S'assurer qu'il n'y a qu'une seule virgule
    const parts = cleaned.split(',');
    if (parts.length > 2) {
      cleaned = parts[0] + ',' + parts.slice(1).join('');
    }

    // Appliquer le formatage en temps réel
    const formatted = formatWithThousandsSeparator(cleaned);
    setLocalValue(formatted);

    // Parser et envoyer la valeur
    const numericStr = cleaned.replace(/\s/g, '').replace(/,/g, '.');
    if (numericStr === '' || numericStr === '.') {
      onChange(undefined);
    } else {
      const parsed = parseFloat(numericStr);
      onChange(isNaN(parsed) ? undefined : parsed);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Reformater à la sortie
    setLocalValue(formatNumberForDisplay(value));
  };

  return (
    <Input
      {...props}
      type="text"
      value={localValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  );
};

// Fonction helper pour obtenir la date du jour au format YYYY-MM-DD (utilisée dans les validations)
const getToday = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Les schémas de validation sont importés depuis @/lib/validations/creance-schemas
// Ils incluent déjà les validations pour les 8 champs obligatoires

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
  const [garanties, setGaranties] = useState<any[]>(() => {
    // Initialiser avec les garanties existantes ou une garantie vide
    if (formData?.garanties && Array.isArray(formData.garanties) && formData.garanties.length > 0) {
      return formData.garanties.map((g: any, idx: number) => ({ 
        id: idx + 1,
        type: g.type || '',
        employeur: g.employeur || '',
        statutSal: g.statutSal || '',
        quartier: g.quartier || '',
        priorite: g.priorite || '',
        nom: g.nom || '',
        prenoms: g.prenoms || '',
        dateInscription: g.dateInscription || '',
        fonction: g.fonction || '',
        profession: g.profession || '',
        adressePostale: g.adressePostale || '',
        numeroGarantie: g.numeroGarantie || '',
        objetMontant: g.objetMontant || '',
        terrain: g.terrain || '',
        logement: g.logement || '',
        code: g.code || '',
        tel: g.tel || '',
        ville: g.ville || '',
        civCode: g.civCode || '',
        debCode: g.debCode || '',
        revenu: g.revenu || '',
        description: g.description || '',
        valeur: g.valeur || '',
        adresse: g.adresse || '',
        surface: g.surface || '',
        circonscription: g.circonscription || '',
        titreFoncier: g.titreFoncier || '',
        ...g 
      }));
    }
    return [{ 
      id: 1,
      type: '',
      employeur: '',
      statutSal: '',
      quartier: '',
      priorite: '',
      nom: '',
      prenoms: '',
      dateInscription: '',
      fonction: '',
      profession: '',
      adressePostale: '',
      numeroGarantie: '',
      objetMontant: '',
      terrain: '',
      logement: '',
      code: '',
      tel: '',
      ville: '',
      civCode: '',
      debCode: '',
      revenu: '',
      description: '',
      valeur: '',
      adresse: '',
      surface: '',
      circonscription: '',
      titreFoncier: '',
    }];
  });
  
  // État pour les pièces jointes - initialiser avec une pièce vide par défaut
  const [pieces, setPieces] = useState<any[]>(() => {
    if (formData?.pieces && Array.isArray(formData.pieces) && formData.pieces.length > 0) {
      return formData.pieces.map((p: any, idx: number) => ({
        id: idx + 1,
        typePieceCode: p.typePieceCode || '',
        numero: p.numero || '',
        date: p.date || '',
        description: p.description || '',
        fichier: p.fichier || null,
        file: p.file || null, // File object pour upload
        ...p
      }));
    }
    // Par défaut, afficher un formulaire de pièce vide
    return [{
      id: 1,
      typePieceCode: '',
      numero: '',
      date: '',
      description: '',
      fichier: null,
      file: null
    }];
  });


  // Mettre à jour les garanties et pièces quand formData change (pour l'édition)
  useEffect(() => {
    // Traiter les garanties réelles et personnelles depuis l'API
    if (formData?.garantiesReelles && Array.isArray(formData.garantiesReelles) && formData.garantiesReelles.length > 0) {
      const garantiesReellesFormatted = formData.garantiesReelles.map((g: any, idx: number) => ({
        id: idx + 1,
        type: g.GAREEL_TYPGAR || g.type || '',
        typeGarantie: 'reelles',
        description: g.GAR_REEL_DESCRIPTION || g.description || '',
        valeur: g.GAR_REEL_VALEUR || g.valeur || '',
        adresse: g.GAR_REEL_ADRESSE || g.adresse || '',
        surface: g.GAR_REEL_SURFACE || g.surface || '',
        circonscription: g.CIRCONSCRIPTION_CODE || g.circonscription || '',
        titreFoncier: g.TITRE_FONCIER_NUM || g.titreFoncier || '',
        terrain: g.TERRAIN_CODE || g.terrain || '',
        logement: g.LOGEMENT_CODE || g.logement || '',
        ...g
      }));
      
      // Si on a des garanties réelles, les ajouter ou remplacer
      setGaranties((prev) => {
        const hasReelles = prev.some(g => g.typeGarantie === 'reelles' || g.type === 'reelles');
        if (hasReelles) {
          // Remplacer les garanties réelles existantes
          return [...prev.filter(g => g.typeGarantie !== 'reelles' && g.type !== 'reelles'), ...garantiesReellesFormatted];
        } else {
          return [...prev, ...garantiesReellesFormatted];
        }
      });
    }

    // Traiter les garanties personnelles depuis l'API
    if (formData?.garantiesPersonnelles && Array.isArray(formData.garantiesPersonnelles) && formData.garantiesPersonnelles.length > 0) {
      const garantiesPersonnellesFormatted = formData.garantiesPersonnelles.map((g: any, idx: number) => ({
        id: (formData?.garantiesReelles?.length || 0) + idx + 1,
        type: g.GARPHYS_TYPGAR || g.type || '',
        typeGarantie: 'personnelles',
        nom: g.DEB_NOM || g.nom || '',
        prenoms: g.DEB_PREN || g.prenoms || '',
        tel: g.GARPHYS_TEL || g.tel || '',
        adressePostale: g.GARPHYS_ADR || g.adressePostale || '',
        profession: g.GARPHYS_PROFESSION || g.profession || '',
        employeur: g.GARPHYS_EMPLOYEUR || g.employeur || '',
        revenu: g.GARPHYS_REVENU || g.revenu || '',
        civCode: g.CIV_CODE || g.civCode || '',
        quartier: g.QUART_CODE || g.quartier || '',
        ville: g.VILLE_CODE || g.ville || '',
        debCode: g.DEB_CODE || g.debCode || '',
        numeroGarantie: g.GARPHYS_CODE || g.numeroGarantie || '',
        ...g
      }));
      
      // Si on a des garanties personnelles, les ajouter ou remplacer
      setGaranties((prev) => {
        const hasPersonnelles = prev.some(g => g.typeGarantie === 'personnelles' || (g.type !== 'reelles' && g.type));
        if (hasPersonnelles) {
          // Remplacer les garanties personnelles existantes
          return [...prev.filter(g => g.typeGarantie !== 'personnelles' && (g.type === 'reelles' || !g.type)), ...garantiesPersonnellesFormatted];
        } else {
          return [...prev, ...garantiesPersonnellesFormatted];
        }
      });
    }

    // Traiter les pièces depuis l'API
    if (formData?.pieces && Array.isArray(formData.pieces) && formData.pieces.length > 0) {
      const piecesFormatted = formData.pieces.map((p: any, idx: number) => ({
        id: idx + 1,
        typePieceCode: p.PIECE_TYPE || p.TYPE_PIECE_CODE || p.typePieceCode || '',
        numero: p.PIECE_NUM || p.numero || '',
        date: p.PIECE_DATEDEP || p.PIECE_DATE || p.date || '',
        description: p.PIECE_DESCRIPTION || p.description || '',
        fichier: p.PIECE_FICHIER || p.fichier || null,
        file: p.file || null,
        ...p
      }));
      
      setPieces(piecesFormatted);
    }
  }, [formData?.garantiesReelles, formData?.garantiesPersonnelles, formData?.pieces]);

  // Hooks pour les données dynamiques - chargés seulement sur les steps appropriés
  // Step 1: débiteurs, groupes créance, objets créance
  const debiteursSearchable = useDebiteursSearchable();
  const groupesCreanceSearchable = useGroupesCreanceSearchable();
  const objetsCreanceSearchable = useObjetsCreanceSearchable();
  
  // Step 2: ordonnateurs
  const ordonnateursSearchable = useOrdonnateursSearchable();
  
  // Step 5: entités, quartiers, types de garanties, types de pièces, civilités (pour garanties)
  const entitesSearchable = useEntitesSearchable();
  const quartiersSearchable = useQuartiersSearchable();
  const typeGarantieReellesSearchable = useTypeGarantieReellesSearchable();
  const typeGarantiePersonnellesSearchable = useTypeGarantiePersonnellesSearchable();
  const typePiecesSearchable = useTypePiecesSearchable();
  const civilitesSearchable = useCivilitesSearchable();

  // Utiliser les schémas depuis le fichier de validation centralisé
  const getSchemaForStep = useCallback((step: number) => {
    return getSchemaForStepFromLib(step);
  }, []);

  const { control, handleSubmit, formState: { errors }, watch, setValue, reset, trigger, getValues } = useForm({
    resolver: zodResolver(getSchemaForStep(currentStep) as any),
    mode: "onChange",
    defaultValues: {
      // Step 1 - Informations principales
      debiteur: '',
      groupeCreance: '',
      objetCreance: '',
      objetDetail: '',
      capitalInitial: undefined,
      montantDecaisse: undefined,
      numeroPrecedent: '',
      numeroAncien: '',
      // Step 1 - Dates et conditions (déplacées depuis step2)
      dateDeblocage: '',
      dateEcheance: '',
      periodicite: '',
      duree: undefined,
      tauxInteretConventionnel: undefined,
      tauxInteretRetard: undefined,
      ordonnateur: '',
      statut: 'A', // Par défaut "A" pour Actif (initiale)
      // Step 2 - Montants (Détails financiers)
      montantInteretConventionnel: undefined,
      commissionBanque: undefined,
      montantDu: undefined,
      montantRembourse: undefined,
      montantInteretRetard: undefined,
      frais: undefined,
      encours: undefined,
      // Champs calculés (lecture seule)
      montantARembourser: undefined,
      montantImpaye: undefined,
      totalDu: undefined,
      penalite: undefined,
      totalSolde: undefined,
      // Step 3 - Pièces jointes (géré par state)
      // Step 4 - Garanties (géré par state)
      typeGarantie: '',
      employeur: '',
      statutSal: '',
      quartier: '',
      priorite: '',
      nom: '',
      prenoms: '',
      dateInscription: '',
      fonction: '',
      profession: '',
      adressePostale: '',
      numeroGarantie: '',
      objetMontant: '',
      terrain: '',
      logement: '',
      code: '',
      ...formData
    }
  });


  // Utiliser useCallback pour éviter la boucle infinie
  const handleDataChange = useCallback((newData: any) => {
    onDataChange({ ...newData, garanties, pieces });
  }, [onDataChange, garanties, pieces]);

  // Calculs automatiques des montants selon la documentation
  // Formule principale : MONTANT A REMBOURSER = CAPITAL INITIAL + MONTANT INTERÊT CONVENTIONNEL + MONTANT COMMISSION BANQUE
  // (CREAN_CAPIT_INIT + crean_mont_ic + CREAN_COMM_BANQ)
  // Les autres calculs dépendent du step 3 mais le montant à rembourser doit être calculé dès que les champs sont disponibles
  // Utiliser un debounce pour éviter les calculs trop fréquents pendant la saisie
  const calculationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    const subscription = watch((value) => {
      // Annuler le timeout précédent si l'utilisateur saisit encore
      if (calculationTimeoutRef.current) {
        clearTimeout(calculationTimeoutRef.current);
      }
      
      // Attendre un court délai après la dernière modification avant de calculer
      calculationTimeoutRef.current = setTimeout(() => {
        // Récupérer et convertir en nombres les champs sources
        const capitalInitial = parseFloat(String(value.capitalInitial || "0")) || 0;
        const montantInteretConventionnel = parseFloat(String(value.montantInteretConventionnel || "0")) || 0;
        const commissionBanque = parseFloat(String(value.commissionBanque || "0")) || 0;
        
        // CALCUL PRINCIPAL : MONTANT A REMBOURSER = CAPITAL INITIAL + MONTANT INTERÊT CONVENTIONNEL + MONTANT COMMISSION BANQUE
        // Ce calcul doit être fait dès que les champs sont disponibles (pas seulement step 3)
        const montantARembourser = capitalInitial + montantInteretConventionnel + commissionBanque;
        
        // Récupérer la valeur actuelle pour comparer
        const currentMontantARembourser = parseFloat(String(value.montantARembourser || "0")) || 0;
        
        // Mettre à jour le montant à rembourser si différent (tolérance 0.01)
        if (Math.abs(currentMontantARembourser - montantARembourser) > 0.01) {
          setValue("montantARembourser", montantARembourser, { shouldValidate: false, shouldDirty: false, shouldTouch: false });
        }
        
        // Les calculs suivants sont uniquement pour le step 3
        if (currentStep === 3) {
          const montantDu = parseFloat(String(value.montantDu || "0")) || 0;
          // 2. MONTANT DÉJÀ REMBOURSÉ : CREAN_MONT_REMB (saisi manuellement par l'utilisateur)
          const montantRembourse = parseFloat(String(value.montantRembourse || "0")) || 0; // CREAN_MONT_REMB
          
          // 3. MONTANT IMPAYÉ (CREAN_MONT_IMPAYE) = MONTANT DU - MONTANT DÉJÀ REMBOURSÉ
          // Formule : crean_mont_du - crean_dej_remb (CREAN_MONT_DU - CREAN_MONT_REMB)
          const montantImpaye = Math.max(montantDu - montantRembourse, 0);
          
          const montantInteretRetard = parseFloat(String(value.montantInteretRetard || "0")) || 0; // crean_mont_ir
          const frais = parseFloat(String(value.frais || "0")) || 0; // crean_frais
          const encours = parseFloat(String(value.encours || "0")) || 0;
          
          // 4. TOTAL DÛ (CREAN_TOTAL_DU) = MONTANT IMPAYÉ + MONTANT INTÉRÊT DE RETARD + FRAIS
          // Formule : crean_mont_impaye + crean_mont_ir + crean_frais
          const totalDu = montantImpaye + montantInteretRetard + frais;
          
          // 5. PÉNALITÉ (CREAN_PENALITE) = TOTAL DÛ / 100 (1%)
          const penalite = totalDu / 100;
          
          // 7. TOTAL SOLDE À RECOUVRER (CREAN_TOT_SOLDE) = TOTAL DÛ + ENCOURS + PÉNALITÉ
          // Formule : total_du + crean_encours + crean_penalite
          const totalSolde = totalDu + encours + penalite;
          
          // Récupérer les valeurs actuelles pour comparer
          const currentMontantImpaye = parseFloat(String(value.montantImpaye || "0")) || 0;
          const currentTotalDu = parseFloat(String(value.totalDu || "0")) || 0;
          const currentPenalite = parseFloat(String(value.penalite || "0")) || 0;
          const currentTotalSolde = parseFloat(String(value.totalSolde || "0")) || 0;
          
          // Mettre à jour seulement si les valeurs ont changé (tolérance 0.01)
          if (Math.abs(currentMontantImpaye - montantImpaye) > 0.01) {
            setValue("montantImpaye", montantImpaye, { shouldValidate: false, shouldDirty: false, shouldTouch: false });
          }
          if (Math.abs(currentTotalDu - totalDu) > 0.01) {
            setValue("totalDu", totalDu, { shouldValidate: false, shouldDirty: false, shouldTouch: false });
          }
          if (Math.abs(currentPenalite - penalite) > 0.01) {
            setValue("penalite", penalite, { shouldValidate: false, shouldDirty: false, shouldTouch: false });
          }
          if (Math.abs(currentTotalSolde - totalSolde) > 0.01) {
            setValue("totalSolde", totalSolde, { shouldValidate: false, shouldDirty: false, shouldTouch: false });
          }
        }
      }, 300); // Attendre 300ms après la dernière modification
    });

    return () => {
      subscription.unsubscribe();
      if (calculationTimeoutRef.current) {
        clearTimeout(calculationTimeoutRef.current);
      }
    };
  }, [currentStep, watch, setValue]);

  // Souscription aux changements du formulaire pour synchroniser les données (SANS calculs - déjà gérés dans le useEffect précédent)
  useEffect(() => {
    const subscription = watch((value) => {
      setStepData(value as any);
      // Passer toutes les valeurs avec les garanties et pièces pour la synchronisation
      handleDataChange({ ...value, garanties, pieces });
    });

    return () => subscription.unsubscribe();
  }, [watch, handleDataChange, garanties, pieces]);

  // Mémoriser les données formData pour éviter les re-renders inutiles
  const memoizedFormData = useMemo(() => formData, [
    formData?.debiteur,
    formData?.groupeCreance,
    formData?.typeObjet,
    formData?.capitalInitial,
    formData?.montantDecaisse,
    formData?.steCaution,
    formData?.statutRecouvrement,
    formData?.numeroPrecedent,
    formData?.numeroAncien,
    formData?.typeStructure,
    formData?.classeCreance,
    formData?.numeroCreance,
    formData?.entite,
    formData?.objetCreance,
    formData?.periodicite,
    formData?.nbEch,
    formData?.dateReconnaissance,
    formData?.datePremiereEcheance,
    formData?.dateDerniereEcheance,
    formData?.dateOctroi,
    formData?.datePremierPrecept,
    formData?.creanceSoldeAvantLid,
    formData?.ordonnateur,
    formData?.montantRembourse,
    formData?.montantDu,
    formData?.montantDejaRembourse,
    formData?.montantImpaye,
    formData?.diversFrais,
    formData?.commission,
    formData?.montantAss,
    formData?.intConvPourcentage,
    formData?.montantIntConvPaye,
    formData?.intRetPourcentage,
    formData?.encours,
    formData?.totalDu,
    formData?.penalite1Pourcent,
    formData?.totalARecouvrer,
    formData?.typePiece,
    formData?.reference,
    formData?.libelle,
    formData?.dateEmission,
    formData?.dateReception,
    formData?.typeGarantie,
    formData?.employeur,
    formData?.statutSal,
    formData?.quartier,
    formData?.priorite,
    formData?.nom,
    formData?.prenoms,
    formData?.dateInscription,
    formData?.fonction,
    formData?.profession,
    formData?.adressePostale,
    formData?.numeroGarantie,
    formData?.objetMontant,
    formData?.terrain,
    formData?.logement,
    formData?.code
  ]);

  // Utiliser un ref pour suivre le step précédent et éviter les resets inutiles
  const prevStepRef = useRef(currentStep);

  useEffect(() => {
    // Ne faire le reset que lors d'un changement de step réel, pas à chaque modification
    const stepChanged = prevStepRef.current !== currentStep;
    prevStepRef.current = currentStep;
    
    // Si on change de step, préserver les valeurs actuelles
    if (stepChanged) {
      // Récupérer les valeurs actuelles du formulaire pour préserver ce qui est déjà saisi
      const currentValues = getValues();
      
      // Merger les données : PRIORITÉ = valeurs actuelles > memoizedFormData > valeurs par défaut
      // Cela garantit que les données saisies ne sont pas perdues lors de la navigation entre les étapes
    const mergedData = {
        // Step 1
        debiteur: currentValues.debiteur ?? memoizedFormData?.debiteur ?? '',
        groupeCreance: currentValues.groupeCreance ?? memoizedFormData?.groupeCreance ?? '',
        objetCreance: currentValues.objetCreance ?? memoizedFormData?.objetCreance ?? '',
        objetDetail: currentValues.objetDetail ?? memoizedFormData?.objetDetail ?? '',
        capitalInitial: currentValues.capitalInitial ?? memoizedFormData?.capitalInitial ?? undefined,
        montantDecaisse: currentValues.montantDecaisse ?? memoizedFormData?.montantDecaisse ?? undefined,
        numeroPrecedent: currentValues.numeroPrecedent ?? memoizedFormData?.numeroPrecedent ?? '',
        numeroAncien: currentValues.numeroAncien ?? memoizedFormData?.numeroAncien ?? '',
        // Step 2
        dateDeblocage: currentValues.dateDeblocage ?? memoizedFormData?.dateDeblocage ?? '',
        dateEcheance: currentValues.dateEcheance ?? memoizedFormData?.dateEcheance ?? '',
        periodicite: currentValues.periodicite ?? memoizedFormData?.periodicite ?? '',
        duree: currentValues.duree ?? memoizedFormData?.duree ?? undefined,
        tauxInteretConventionnel: currentValues.tauxInteretConventionnel ?? memoizedFormData?.tauxInteretConventionnel ?? undefined,
        tauxInteretRetard: currentValues.tauxInteretRetard ?? memoizedFormData?.tauxInteretRetard ?? undefined,
        ordonnateur: currentValues.ordonnateur ?? memoizedFormData?.ordonnateur ?? '',
        statut: currentValues.statut ?? memoizedFormData?.statut ?? 'A', // Par défaut "A" pour Actif (initiale)
        // Step 2 - Montants (Détails financiers)
        montantInteretConventionnel: currentValues.montantInteretConventionnel ?? memoizedFormData?.montantInteretConventionnel ?? undefined,
        commissionBanque: currentValues.commissionBanque ?? memoizedFormData?.commissionBanque ?? undefined,
        montantDu: currentValues.montantDu ?? memoizedFormData?.montantDu ?? undefined,
        montantRembourse: currentValues.montantRembourse ?? memoizedFormData?.montantRembourse ?? undefined,
        montantInteretRetard: currentValues.montantInteretRetard ?? memoizedFormData?.montantInteretRetard ?? undefined,
        frais: currentValues.frais ?? memoizedFormData?.frais ?? undefined,
        encours: currentValues.encours ?? memoizedFormData?.encours ?? undefined,
        // Champs calculés (préservés pour éviter de perdre les calculs lors de la navigation)
        montantARembourser: currentValues.montantARembourser ?? memoizedFormData?.montantARembourser ?? undefined,
        montantImpaye: currentValues.montantImpaye ?? memoizedFormData?.montantImpaye ?? undefined,
        totalDu: currentValues.totalDu ?? memoizedFormData?.totalDu ?? undefined,
        penalite: currentValues.penalite ?? memoizedFormData?.penalite ?? undefined,
        totalSolde: currentValues.totalSolde ?? memoizedFormData?.totalSolde ?? undefined,
        // Step 4 - Pièces jointes (géré par state)
        // Step 5 - Garanties
        typeGarantie: currentValues.typeGarantie ?? memoizedFormData?.typeGarantie ?? '',
        employeur: currentValues.employeur ?? memoizedFormData?.employeur ?? '',
        statutSal: currentValues.statutSal ?? memoizedFormData?.statutSal ?? '',
        quartier: currentValues.quartier ?? memoizedFormData?.quartier ?? '',
        priorite: currentValues.priorite ?? memoizedFormData?.priorite ?? '',
        nom: currentValues.nom ?? memoizedFormData?.nom ?? '',
        prenoms: currentValues.prenoms ?? memoizedFormData?.prenoms ?? '',
        dateInscription: currentValues.dateInscription ?? memoizedFormData?.dateInscription ?? '',
        fonction: currentValues.fonction ?? memoizedFormData?.fonction ?? '',
        profession: currentValues.profession ?? memoizedFormData?.profession ?? '',
        adressePostale: currentValues.adressePostale ?? memoizedFormData?.adressePostale ?? '',
        numeroGarantie: currentValues.numeroGarantie ?? memoizedFormData?.numeroGarantie ?? '',
        objetMontant: currentValues.objetMontant ?? memoizedFormData?.objetMontant ?? '',
        terrain: currentValues.terrain ?? memoizedFormData?.terrain ?? '',
        logement: currentValues.logement ?? memoizedFormData?.logement ?? '',
        code: currentValues.code ?? memoizedFormData?.code ?? '',
      };
      
      // Utiliser reset pour préserver les valeurs lors de la navigation
      reset(mergedData, { keepValues: false });
    }
  }, [currentStep, reset, memoizedFormData, getValues]);

  // Exposer la méthode de validation au composant parent
  useImperativeHandle(ref, () => ({
    validateStep: async () => {
      // Déclencher d'abord la validation react-hook-form pour récupérer toutes les erreurs
      const isValid = await trigger();
      
      if (!isValid) {
        console.log("❌ Validation react-hook-form échouée pour step", currentStep, "Erreurs:", errors);
        return false;
      }
      
      // Ensuite valider avec Zod pour les validations supplémentaires (dates, etc.)
      const values = getValues();
      const stepSchema = getSchemaForStep(currentStep);
      
      try {
        await stepSchema.parseAsync(values);
        return true;
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.log("❌ Validation Zod échouée pour step", currentStep, error.issues);
          
          // Transformer les erreurs Zod en erreurs react-hook-form en déclenchant la validation
          // pour chaque champ en erreur
          for (const err of error.issues) {
            const path = err.path.join(".");
            // Re-déclencher la validation pour ce champ spécifique
            await trigger(path as any);
          }
        }
        return false;
      }
    },
    // Exposer getValues pour que le parent puisse récupérer toutes les valeurs
    getFormValues: () => {
      return getValues();
    },
    // Exposer les garanties et pièces pour le payload
    getGaranties: () => {
      return garanties;
    },
    getPieces: () => {
      return pieces;
    }
  }), [currentStep, trigger, getValues, errors, garanties, pieces]);

  // Styles unifiés (alignés avec agence-banque-form)
  const primaryGreen = '#28A325'
  const primaryGreenHover = '#047857'
  const borderGray = '#d1d5db'
  const dividerGray = '#e2e8f0'
  const titleColor = '#1a202c'
  const labelColor = '#374151'
  const errorRed = '#ef4444'
  const errorBg = '#fef2f2'

  // Fonctions helper pour obtenir les libellés des options
  const getDebiteurLibelle = (id: string) => {
    if (!id) return '';
    const item = debiteursSearchable.items.find((d: any) => d.value === id || d.DEB_CODE?.toString() === id);
    return item?.label || id;
  }

  const getGroupeCreanceLibelle = (id: string) => {
    if (!id) return '';
    const item = groupesCreanceSearchable.items.find((g: any) => 
      g.value === id || g.GRP_CREAN_CODE === id || g.GC_CODE === id
    );
    return item?.label || item?.GRP_CREAN_LIB || item?.GC_LIB || id;
  }

  const getObjetCreanceLibelle = (id: string) => {
    if (!id) return '';
    const item = objetsCreanceSearchable.items.find((o: any) => 
      o.value === id || o.OBJ_CREAN_CODE === id || o.OC_CODE === id
    );
    return item?.label || item?.OBJ_CREAN_LIB || item?.OC_LIB || id;
  }

  const getOrdonnateurLibelle = (id: string) => {
    if (!id) return '';
    const item = ordonnateursSearchable.items.find((o: any) => 
      o.value === id.toString() || 
      o.ORDO_CODE?.toString() === id.toString() || 
      o.code === id.toString()
    );
    return item?.label || item?.ORDO_NOM || item?.ORDO_LIB || id;
  }

  const getEntiteLibelle = (id: string) => {
    if (!id) return '';
    const item = entitesSearchable.items.find((e: any) => 
      e.value === id || e.ENTITE_CODE === id || e.ENT_CODE === id
    );
    return item?.label || item?.ENTITE_LIB || item?.ENT_LIB || id;
  }

  const getQuartierLibelle = (id: string) => {
    if (!id) return '';
    const item = quartiersSearchable.items.find((q: any) => q.value === id || q.QUART_CODE === id || q.Q_CODE === id);
    return item?.label || item?.QUART_LIB || item?.Q_LIB || id;
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <h2 className="text-lg font-bold mb-4" style={{ color: titleColor }}>Informations générales</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label className="whitespace-nowrap flex-shrink-0" style={{ color: labelColor, minWidth: '120px' }}>
              Débiteur <span style={{ color: '#f97316' }}>*</span>
            </Label>
          <Controller
            name="debiteur"
            control={control}
            rules={{ required: "Le débiteur est obligatoire" }}
            render={({ field }) => (
              readOnly ? (
                <Input
                  value={getDebiteurLibelle(field.value)}
                  className="bg-gray-100 text-gray-700 flex-1"
                  style={{ borderColor: !!errors.debiteur ? errorRed : primaryGreen }}
                  disabled
                />
              ) : (
                <div className="flex-1">
                  <SearchableSelect
                    value={field.value || ""}
                    onValueChange={field.onChange}
                    items={debiteursSearchable.items}
                    placeholder="Sélectionner un débiteur"
                    emptyMessage="Aucun débiteur trouvé"
                    searchPlaceholder="Rechercher un débiteur..."
                    isLoading={debiteursSearchable.isLoading}
                    hasMore={debiteursSearchable.hasMore}
                    onLoadMore={debiteursSearchable.loadMore}
                    isFetchingMore={debiteursSearchable.isFetchingMore}
                    onSearchChange={debiteursSearchable.setSearch}
                    disabled={readOnly}
                  />
                </div>
              )
            )}
          />
          </div>
          {errors.debiteur && (
            <p className="text-sm" style={{ color: errorRed }}>{String(errors.debiteur.message)}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label className="whitespace-nowrap flex-shrink-0" style={{ color: labelColor, minWidth: '120px' }}>
              Groupe créance <span style={{ color: '#f97316' }}>*</span>
            </Label>
          <Controller
            name="groupeCreance"
            control={control}
            rules={{ required: "Le groupe créance est obligatoire" }}
            render={({ field }) => (
              readOnly ? (
                <Input
                  value={getGroupeCreanceLibelle(field.value)}
                  className="bg-gray-100 text-gray-700 flex-1"
                  style={{ borderColor: !!errors.groupeCreance ? errorRed : primaryGreen }}
                  disabled
                />
              ) : (
                <div className="flex-1">
                  <SearchableSelect
                    value={field.value || ""}
                    onValueChange={field.onChange}
                    items={groupesCreanceSearchable.items}
                    placeholder="Sélectionner un groupe créance"
                    emptyMessage="Aucun groupe créance trouvé"
                    searchPlaceholder="Rechercher un groupe..."
                    isLoading={groupesCreanceSearchable.isLoading}
                    hasMore={groupesCreanceSearchable.hasMore}
                    onLoadMore={groupesCreanceSearchable.loadMore}
                    isFetchingMore={groupesCreanceSearchable.isFetchingMore}
                    onSearchChange={groupesCreanceSearchable.setSearch}
                    disabled={readOnly}
                  />
                </div>
              )
            )}
          />
          </div>
          {errors.groupeCreance && (
            <p className="text-sm" style={{ color: errorRed }}>{String(errors.groupeCreance.message)}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label className="whitespace-nowrap flex-shrink-0" style={{ color: labelColor, minWidth: '120px' }}>
            Objet créance <span style={{ color: '#f97316' }}>*</span>
          </Label>
          <Controller
            name="objetCreance"
            control={control}
            rules={{ required: "L'objet créance est obligatoire" }}
            render={({ field }) => (
              readOnly ? (
                <Input
                  value={getObjetCreanceLibelle(field.value)}
                  className="bg-gray-100 text-gray-700 flex-1"
                  style={{ borderColor: !!errors.objetCreance ? errorRed : primaryGreen }}
                  disabled
                />
              ) : (
                <div className="flex-1">
                  <SearchableSelect
                    value={field.value || ""}
                    onValueChange={field.onChange}
                    items={objetsCreanceSearchable.items}
                  placeholder="Sélectionner un objet créance"
                  emptyMessage="Aucun objet créance trouvé"
                  searchPlaceholder="Rechercher un objet..."
                  isLoading={objetsCreanceSearchable.isLoading}
                  hasMore={objetsCreanceSearchable.hasMore}
                  onLoadMore={objetsCreanceSearchable.loadMore}
                  isFetchingMore={objetsCreanceSearchable.isFetchingMore}
                  onSearchChange={objetsCreanceSearchable.setSearch}
                  disabled={readOnly}
                  />
                </div>
              )
            )}
          />
          </div>
          {errors.objetCreance && (
            <p className="text-sm" style={{ color: errorRed }}>{String(errors.objetCreance.message)}</p>
          )}
        </div>
      </div>

        <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label className="whitespace-nowrap flex-shrink-0" style={{ color: labelColor, minWidth: '120px' }}>Détail de l'objet</Label>
          <Controller
            name="objetDetail"
            control={control}
            render={({ field }) => (
              <Textarea
                {...field}
                placeholder="Description détaillée de l'objet de créance"
                rows={3}
                maxLength={255}
                className={`${!!errors.objetDetail ? 'bg-red-50' : readOnly ? 'bg-gray-50' : ''} flex-1`}
                style={{ borderColor: !!errors.objetDetail ? errorRed : primaryGreen }}
                disabled={readOnly}
              />
            )}
          />
        </div>
        {errors.objetDetail && (
          <p className="text-sm" style={{ color: errorRed }}>{String(errors.objetDetail.message)}</p>
          )}
        </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label className="whitespace-nowrap flex-shrink-0" style={{ color: labelColor, minWidth: '120px' }}>
            Capital initial <span style={{ color: '#f97316' }}>*</span>
          </Label>
          <Controller
            name="capitalInitial"
            control={control}
            rules={{ required: "Le capital initial est obligatoire", min: { value: 0.01, message: "Le capital initial doit être supérieur à 0" } }}
            render={({ field }) => (
              <NumberInputField
                value={field.value}
                onChange={field.onChange}
                placeholder="0"
                className={`${!!errors.capitalInitial ? 'bg-red-50' : readOnly ? 'bg-gray-50' : ''} flex-1`}
                style={{ borderColor: !!errors.capitalInitial ? errorRed : primaryGreen }}
                disabled={readOnly}
              />
            )}
          />
          </div>
          {errors.capitalInitial && (
            <p className="text-sm" style={{ color: errorRed }}>{String(errors.capitalInitial.message)}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label className="whitespace-nowrap flex-shrink-0" style={{ color: labelColor, minWidth: '120px' }}>Montant décaissé</Label>
          <Controller
            name="montantDecaisse"
            control={control}
            render={({ field }) => (
              <NumberInputField
                value={field.value}
                onChange={field.onChange}
                placeholder="0"
                className={`${!!errors.montantDecaisse ? 'bg-red-50' : readOnly ? 'bg-gray-50' : ''} flex-1`}
                style={{ borderColor: !!errors.montantDecaisse ? errorRed : primaryGreen }}
                disabled={readOnly}
              />
            )}
          />
        </div>
          {errors.montantDecaisse && (
            <p className="text-sm" style={{ color: errorRed }}>{String(errors.montantDecaisse.message)}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label className="whitespace-nowrap flex-shrink-0" style={{ color: labelColor, minWidth: '120px' }}>Numéro précédent</Label>
          <Controller
            name="numeroPrecedent"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Numéro précédent"
                className={`${!!errors.numeroPrecedent ? 'bg-red-50' : readOnly ? 'bg-gray-50' : ''} flex-1`}
                style={{ borderColor: !!errors.numeroPrecedent ? errorRed : primaryGreen }}
                disabled={readOnly}
              />
            )}
          />
          </div>
          {errors.numeroPrecedent && (
            <p className="text-sm" style={{ color: errorRed }}>{String(errors.numeroPrecedent.message)}</p>
          )}
        </div>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label className="whitespace-nowrap flex-shrink-0" style={{ color: labelColor, minWidth: '120px' }}>Numéro ancien</Label>
          <Controller
            name="numeroAncien"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Numéro ancien"
                className={`${!!errors.numeroAncien ? 'bg-red-50' : readOnly ? 'bg-gray-50' : ''} flex-1`}
                style={{ borderColor: !!errors.numeroAncien ? errorRed : primaryGreen }}
                disabled={readOnly}
              />
            )}
          />
          </div>
          {errors.numeroAncien && (
            <p className="text-sm" style={{ color: errorRed }}>{String(errors.numeroAncien.message)}</p>
          )}
        </div>
      </div>

      {/* Section Dates et conditions - déplacée depuis step2 */}
      <Separator className="my-6" />
      <h2 className="text-lg font-bold mb-4" style={{ color: titleColor }}>Dates et conditions</h2>
      
      {(() => {
        const dateDeblocage = watch("dateDeblocage");
        return (
          <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label className="whitespace-nowrap flex-shrink-0" style={{ color: labelColor, minWidth: '120px' }}>
                    Date de déblocage <span style={{ color: '#f97316' }}>*</span>
                  </Label>
          <Controller
                    name="dateDeblocage"
            control={control}
                    rules={{ required: "La date de déblocage est obligatoire" }}
            render={({ field }) => (
              <Input
                {...field}
                        type="date"
                        max={getToday()}
                        className={`${!!errors.dateDeblocage ? 'bg-red-50' : readOnly ? 'bg-gray-50' : ''} flex-1`}
                        style={{ borderColor: !!errors.dateDeblocage ? errorRed : primaryGreen }}
                disabled={readOnly}
              />
            )}
          />
        </div>
                {errors.dateDeblocage && (
                  <p className="text-sm" style={{ color: errorRed }}>{String(errors.dateDeblocage.message)}</p>
          )}
        </div>

        <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label className="whitespace-nowrap flex-shrink-0" style={{ color: labelColor, minWidth: '120px' }}>
                    Date d'échéance <span style={{ color: '#f97316' }}>*</span>
                  </Label>
          <Controller
                    name="dateEcheance"
            control={control}
                    rules={{ required: "La date d'échéance est obligatoire" }}
            render={({ field }) => (
              <Input
                {...field}
                        type="date"
                        min={dateDeblocage || undefined}
                        className={`${!!errors.dateEcheance ? 'bg-red-50' : readOnly ? 'bg-gray-50' : ''} flex-1`}
                        style={{ borderColor: !!errors.dateEcheance ? errorRed : primaryGreen }}
                disabled={readOnly}
              />
            )}
          />
        </div>
                {errors.dateEcheance && (
                  <p className="text-sm" style={{ color: errorRed }}>{String(errors.dateEcheance.message)}</p>
          )}
        </div>

        <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label className="whitespace-nowrap flex-shrink-0" style={{ color: labelColor, minWidth: '120px' }}>Périodicité</Label>
          <Controller
            name="periodicite"
            control={control}
            render={({ field }) => (
              readOnly ? (
                <Input
                          value={field.value === 'M' ? 'Mensuel' : field.value === 'T' ? 'Trimestriel' : field.value === 'S' ? 'Semestriel' : field.value === 'A' ? 'Annuel' : field.value}
                          className="bg-gray-100 text-gray-700 flex-1"
                  style={{ borderColor: !!errors.periodicite ? errorRed : primaryGreen }}
                  disabled
                />
              ) : (
                <select
                  {...field}
                          className="flex h-10 w-full rounded-md border bg-gray-100 px-3 py-2 text-sm text-gray-700 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex-1"
                  style={{ borderColor: primaryGreen }}
                >
                  <option value="">Sélectionner une périodicité</option>
                          <option value="M">Mensuel (M)</option>
                          <option value="T">Trimestriel (T)</option>
                          <option value="S">Semestriel (S)</option>
                          <option value="A">Annuel (A)</option>
                </select>
              )
            )}
          />
                </div>
          {errors.periodicite && (
            <p className="text-sm" style={{ color: errorRed }}>{String(errors.periodicite.message)}</p>
          )}
        </div>
        </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label className="whitespace-nowrap flex-shrink-0" style={{ color: labelColor, minWidth: '120px' }}>Durée (en mois)</Label>
          <Controller
                    name="duree"
            control={control}
            render={({ field }) => (
                      <NumberInputField
                        value={field.value}
                        onChange={field.onChange}
                placeholder="0"
                        min={1}
                        className={`${!!errors.duree ? 'bg-red-50' : readOnly ? 'bg-gray-50' : ''} flex-1`}
                        style={{ borderColor: !!errors.duree ? errorRed : primaryGreen }}
                disabled={readOnly}
              />
            )}
          />
                </div>
                {errors.duree && (
                  <p className="text-sm" style={{ color: errorRed }}>{String(errors.duree.message)}</p>
          )}
        </div>

        <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label className="whitespace-nowrap flex-shrink-0" style={{ color: labelColor, minWidth: '120px' }}>Taux intérêt conventionnel (%)</Label>
          <Controller
                    name="tauxInteretConventionnel"
            control={control}
            render={({ field }) => (
                      <NumberInputField
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="0.00"
                        step={0.1}
                        className={`${!!errors.tauxInteretConventionnel ? 'bg-red-50' : readOnly ? 'bg-gray-50' : ''} flex-1`}
                        style={{ borderColor: !!errors.tauxInteretConventionnel ? errorRed : primaryGreen }}
                disabled={readOnly}
              />
            )}
          />
        </div>
                {errors.tauxInteretConventionnel && (
                  <p className="text-sm" style={{ color: errorRed }}>{String(errors.tauxInteretConventionnel.message)}</p>
          )}
        </div>

        <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label className="whitespace-nowrap flex-shrink-0" style={{ color: labelColor, minWidth: '120px' }}>Taux intérêt retard (%)</Label>
          <Controller
                    name="tauxInteretRetard"
            control={control}
            render={({ field }) => (
                      <NumberInputField
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="0.00"
                        step={0.1}
                        className={`${!!errors.tauxInteretRetard ? 'bg-red-50' : readOnly ? 'bg-gray-50' : ''} flex-1`}
                        style={{ borderColor: !!errors.tauxInteretRetard ? errorRed : primaryGreen }}
                disabled={readOnly}
              />
            )}
          />
        </div>
                {errors.tauxInteretRetard && (
                  <p className="text-sm" style={{ color: errorRed }}>{String(errors.tauxInteretRetard.message)}</p>
          )}
        </div>
      </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label className="whitespace-nowrap flex-shrink-0" style={{ color: labelColor, minWidth: '120px' }}>
                    Ordonnateur <span style={{ color: '#f97316' }}>*</span>
                  </Label>
          <Controller
                    name="ordonnateur"
            control={control}
                    rules={{ required: "L'ordonnateur est obligatoire" }}
            render={({ field }) => (
              readOnly ? (
              <Input
                          value={getOrdonnateurLibelle(field.value)}
                          className="bg-gray-100 text-gray-700 flex-1"
                          style={{ borderColor: !!errors.ordonnateur ? errorRed : primaryGreen }}
                  disabled
                />
              ) : (
                        <div className="flex-1">
                          <SearchableSelect
                            value={field.value || ""}
                            onValueChange={field.onChange}
                            items={ordonnateursSearchable.items}
                            placeholder="Sélectionner un ordonnateur"
                            emptyMessage="Aucun ordonnateur trouvé"
                            searchPlaceholder="Rechercher un ordonnateur..."
                            isLoading={ordonnateursSearchable.isLoading}
                            hasMore={ordonnateursSearchable.hasMore}
                            onLoadMore={ordonnateursSearchable.loadMore}
                            isFetchingMore={ordonnateursSearchable.isFetchingMore}
                            onSearchChange={ordonnateursSearchable.setSearch}
                disabled={readOnly}
              />
                        </div>
              )
            )}
          />
                </div>
                {errors.ordonnateur && (
                  <p className="text-sm" style={{ color: errorRed }}>{String(errors.ordonnateur.message)}</p>
          )}
        </div>

        <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label className="whitespace-nowrap flex-shrink-0" style={{ color: labelColor, minWidth: '120px' }}>
                    Statut <span style={{ color: '#f97316' }}>*</span>
                  </Label>
          <Controller
                    name="statut"
            control={control}
                    rules={{ required: "Le statut est obligatoire" }}
            render={({ field }) => (
                      readOnly ? (
              <Input
                          value={(() => {
                            // Convertir l'initiale en libellé pour l'affichage
                            if (field.value === 'A') return 'Actif';
                            if (field.value === 'C') return 'Clôturé';
                            if (field.value === 'S') return 'Suspendu';
                            return field.value || '';
                          })()}
                          className="bg-gray-100 text-gray-700 flex-1"
                          style={{ borderColor: !!errors.statut ? errorRed : primaryGreen }}
                          disabled
                        />
                      ) : (
                        <select
                {...field}
                          className="flex h-10 w-full rounded-md border bg-gray-100 px-3 py-2 text-sm text-gray-700 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex-1"
                          style={{ borderColor: primaryGreen }}
                onChange={(e) => {
                            // Stocker l'initiale dans le formulaire mais afficher le libellé complet
                            const value = e.target.value;
                            let initiale = '';
                            if (value === 'ACTIF') initiale = 'A';
                            else if (value === 'CLOTURE') initiale = 'C';
                            else if (value === 'SUSPENDU') initiale = 'S';
                            else initiale = value;
                            field.onChange(initiale);
                          }}
                          value={(() => {
                            // Convertir l'initiale en valeur complète pour l'affichage
                            if (field.value === 'A') return 'ACTIF';
                            if (field.value === 'C') return 'CLOTURE';
                            if (field.value === 'S') return 'SUSPENDU';
                            return field.value || '';
                          })()}
                        >
                          <option value="">Sélectionner un statut</option>
                          <option value="ACTIF">Actif</option>
                          <option value="CLOTURE">Clôturé</option>
                          <option value="SUSPENDU">Suspendu</option>
                        </select>
                      )
                    )}
                  />
        </div>
                {errors.statut && (
                  <p className="text-sm" style={{ color: errorRed }}>{String(errors.statut.message)}</p>
          )}
        </div>
      </div>
          </>
        );
      })()}
    </div>
  );

  // Step 2: Détails financiers (ancien step3)
  const renderStep2 = () => {
    return renderStep3();
  };

  const renderStep3 = () => (
    <div className="space-y-6">
      <h2 className="text-lg font-bold mb-4" style={{ color: titleColor }}>Détails financiers</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label className="whitespace-nowrap flex-shrink-0" style={{ color: labelColor, minWidth: '120px' }}>Commission</Label>
          <Controller
            name="commissionBanque"
            control={control}
            render={({ field }) => (
              <NumberInputField
                value={field.value}
                onChange={field.onChange}
                placeholder="0"
                className={`${!!errors.commissionBanque ? 'bg-red-50' : readOnly ? 'bg-gray-50' : ''} flex-1`}
                style={{ borderColor: !!errors.commissionBanque ? errorRed : primaryGreen }}
                disabled={readOnly}
              />
            )}
          />
          </div>
          {errors.commissionBanque && (
            <p className="text-sm" style={{ color: errorRed }}>{String(errors.commissionBanque.message)}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label className="whitespace-nowrap flex-shrink-0" style={{ color: labelColor, minWidth: '120px' }}>Montant à rembourser</Label>
          <Controller
            name="montantARembourser"
            control={control}
            render={({ field }) => (
              <NumberInputField
                value={typeof field.value === 'number' ? field.value : (parseFloat(String(field.value || "0")) || 0)}
                onChange={(val) => {
                  // Ne pas permettre la modification manuelle (champ calculé)
                }}
                placeholder="0"
                className="bg-gray-100 text-gray-700 cursor-not-allowed"
                style={{ borderColor: !!errors.montantARembourser ? errorRed : primaryGreen }}
                disabled={true}
                readOnly={true}
              />
            )}
          />
          </div>
          {errors.montantARembourser && (
            <p className="text-sm" style={{ color: errorRed }}>{String(errors.montantARembourser.message)}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label className="whitespace-nowrap flex-shrink-0" style={{ color: labelColor, minWidth: '120px' }}>Int. Conv (pourcentage)</Label>
          <Controller
            name="intConvPourcentage"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="number"
                placeholder="0"
                step="0.01"
                value={field.value ?? ''}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === '') { field.onChange(undefined); return; }
                  field.onChange(parseFloat(v));
                }}
                className={`${!!errors.intConvPourcentage ? 'bg-red-50' : readOnly ? 'bg-gray-50' : ''} flex-1`}
                style={{ borderColor: !!errors.intConvPourcentage ? errorRed : primaryGreen }}
                disabled={readOnly}
              />
            )}
          />
          </div>
          {errors.intConvPourcentage && (
            <p className="text-sm" style={{ color: errorRed }}>{String(errors.intConvPourcentage.message)}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label className="whitespace-nowrap flex-shrink-0" style={{ color: labelColor, minWidth: '120px' }}>Montant Int Conv</Label>
          <Controller
            name="montantInteretConventionnel"
            control={control}
            render={({ field }) => (
              <NumberInputField
                value={field.value}
                onChange={field.onChange}
                placeholder="0"
                className={`${!!errors.montantInteretConventionnel ? 'bg-red-50' : readOnly ? 'bg-gray-50' : ''} flex-1`}
                style={{ borderColor: !!errors.montantInteretConventionnel ? errorRed : primaryGreen }}
                disabled={readOnly}
              />
            )}
          />
          </div>
          {errors.montantInteretConventionnel && (
            <p className="text-sm" style={{ color: errorRed }}>{String(errors.montantInteretConventionnel.message)}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label className="whitespace-nowrap flex-shrink-0" style={{ color: labelColor, minWidth: '120px' }}>Montant dû</Label>
          <Controller
            name="montantDu"
            control={control}
            render={({ field }) => (
              <NumberInputField
                value={field.value}
                onChange={field.onChange}
                placeholder="0"
                className={`${!!errors.montantDu ? 'bg-red-50' : readOnly ? 'bg-gray-50' : ''} flex-1`}
                style={{ borderColor: !!errors.montantDu ? errorRed : primaryGreen }}
                disabled={readOnly}
              />
            )}
          />
          </div>
          {errors.montantDu && (
            <p className="text-sm" style={{ color: errorRed }}>{String(errors.montantDu.message)}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label className="whitespace-nowrap flex-shrink-0" style={{ color: labelColor, minWidth: '120px' }}>Int. Ret (pourcentage)</Label>
          <Controller
            name="montantInteretRetard"
            control={control}
            render={({ field }) => (
              <NumberInputField
                value={field.value}
                onChange={field.onChange}
                placeholder="0"
                className={`${!!errors.montantInteretRetard ? 'bg-red-50' : readOnly ? 'bg-gray-50' : ''} flex-1`}
                style={{ borderColor: !!errors.montantInteretRetard ? errorRed : primaryGreen }}
                disabled={readOnly}
              />
            )}
          />
          </div>
          {errors.montantInteretRetard && (
            <p className="text-sm" style={{ color: errorRed }}>{String(errors.montantInteretRetard.message)}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label className="whitespace-nowrap flex-shrink-0" style={{ color: labelColor, minWidth: '120px' }}>Montant déjà remboursé</Label>
          <Controller
            name="montantRembourse"
            control={control}
            render={({ field }) => (
              <NumberInputField
                value={typeof field.value === 'number' ? field.value : (typeof field.value === 'string' && field.value !== '' ? parseFloat(field.value) : undefined)}
                onChange={(val) => {
                  // S'assurer que la valeur est toujours un number ou undefined
                  field.onChange(val !== undefined && !isNaN(val) ? val : undefined);
                }}
                placeholder="0"
                className={`${!!errors.montantRembourse ? 'bg-red-50' : readOnly ? 'bg-gray-50' : ''} flex-1`}
                style={{ borderColor: !!errors.montantRembourse ? errorRed : primaryGreen }}
                disabled={readOnly}
              />
            )}
          />
          </div>
          {errors.montantRembourse && (
            <p className="text-sm" style={{ color: errorRed }}>{String(errors.montantRembourse.message)}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label className="whitespace-nowrap flex-shrink-0" style={{ color: labelColor, minWidth: '120px' }}>Montant impayé</Label>
          <Controller
            name="montantImpaye"
            control={control}
            render={({ field }) => (
              <NumberInputField
                value={typeof field.value === 'number' ? field.value : (parseFloat(String(field.value || "0")) || 0)}
                onChange={() => {}} // Lecture seule - Calculé automatiquement
                placeholder="0"
                className="bg-gray-100 text-gray-700 cursor-not-allowed"
                style={{ borderColor: !!errors.montantImpaye ? errorRed : primaryGreen }}
                disabled={true}
                readOnly={true}
              />
            )}
          />
          </div>
          {errors.montantImpaye && (
            <p className="text-sm" style={{ color: errorRed }}>{String(errors.montantImpaye.message)}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label className="whitespace-nowrap flex-shrink-0" style={{ color: labelColor, minWidth: '120px' }}>Divers frais</Label>
          <Controller
            name="frais"
            control={control}
            render={({ field }) => (
              <NumberInputField
                value={field.value}
                onChange={field.onChange}
                placeholder="0"
                className={`${!!errors.frais ? 'bg-red-50' : readOnly ? 'bg-gray-50' : ''} flex-1`}
                style={{ borderColor: !!errors.frais ? errorRed : primaryGreen }}
                disabled={readOnly}
              />
            )}
          />
          </div>
          {errors.frais && (
            <p className="text-sm" style={{ color: errorRed }}>{String(errors.frais.message)}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label className="whitespace-nowrap flex-shrink-0" style={{ color: labelColor, minWidth: '120px' }}>Montant Ass</Label>
          <Controller
            name="montantAss"
            control={control}
            render={({ field }) => (
              <NumberInputField
                value={field.value}
                onChange={field.onChange}
                placeholder="0"
                className={`${!!errors.montantAss ? 'bg-red-50' : readOnly ? 'bg-gray-50' : ''} flex-1`}
                style={{ borderColor: !!errors.montantAss ? errorRed : primaryGreen }}
                disabled={readOnly}
              />
            )}
          />
          </div>
          {errors.montantAss && (
            <p className="text-sm" style={{ color: errorRed }}>{String(errors.montantAss.message)}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label className="whitespace-nowrap flex-shrink-0" style={{ color: labelColor, minWidth: '120px' }}>Montant en cours de recouvrement</Label>
          <Controller
            name="encours"
            control={control}
            render={({ field }) => (
              <NumberInputField
                value={field.value}
                onChange={field.onChange}
                placeholder="0"
                className={`${!!errors.encours ? 'bg-red-50' : readOnly ? 'bg-gray-50' : ''} flex-1`}
                style={{ borderColor: !!errors.encours ? errorRed : primaryGreen }}
                disabled={readOnly}
              />
            )}
          />
          </div>
          {errors.encours && (
            <p className="text-sm" style={{ color: errorRed }}>{String(errors.encours.message)}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label className="whitespace-nowrap flex-shrink-0" style={{ color: labelColor, minWidth: '120px' }}>Total dû</Label>
          <Controller
            name="totalDu"
            control={control}
            render={({ field }) => (
              <NumberInputField
                value={typeof field.value === 'number' ? field.value : (parseFloat(String(field.value || "0")) || 0)}
                onChange={() => {}} // Lecture seule - Calculé automatiquement
                placeholder="0"
                className="bg-gray-100 text-gray-700 cursor-not-allowed"
                style={{ borderColor: !!errors.totalDu ? errorRed : primaryGreen }}
                disabled={true}
                readOnly={true}
              />
            )}
          />
          </div>
          {errors.totalDu && (
            <p className="text-sm" style={{ color: errorRed }}>{String(errors.totalDu.message)}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label className="whitespace-nowrap flex-shrink-0" style={{ color: labelColor, minWidth: '120px' }}>Pénalité (1%)</Label>
          <Controller
            name="penalite"
            control={control}
            render={({ field }) => (
              <NumberInputField
                value={typeof field.value === 'number' ? field.value : (parseFloat(String(field.value || "0")) || 0)}
                onChange={() => {}} // Lecture seule
                placeholder="0"
                className="bg-gray-100 text-gray-700 cursor-not-allowed"
                style={{ borderColor: !!errors.penalite ? errorRed : primaryGreen }}
                disabled={true}
                readOnly={true}
              />
            )}
          />
          </div>
          {errors.penalite && (
            <p className="text-sm" style={{ color: errorRed }}>{String(errors.penalite.message)}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label className="whitespace-nowrap flex-shrink-0" style={{ color: labelColor, minWidth: '120px' }}>Total à recouvrer</Label>
          <Controller
            name="totalSolde"
            control={control}
            render={({ field }) => (
              <NumberInputField
                value={typeof field.value === 'number' ? field.value : (parseFloat(String(field.value || "0")) || 0)}
                onChange={() => {}} // Lecture seule - Calculé automatiquement
                placeholder="0"
                className="bg-gray-100 text-gray-700 cursor-not-allowed"
                style={{ borderColor: !!errors.totalSolde ? errorRed : primaryGreen }}
                disabled={true}
                readOnly={true}
              />
            )}
          />
          </div>
          {errors.totalSolde && (
            <p className="text-sm" style={{ color: errorRed }}>{String(errors.totalSolde.message)}</p>
          )}
        </div>
      </div>
    </div>
  );

  // Step 4: Pièces jointes
  const renderStep4 = () => (
    <div className="space-y-6">
      <h2 className="text-lg font-bold mb-4" style={{ color: titleColor }}>Pièces jointes</h2>
      
      <div className="space-y-4">
        {pieces.map((piece, index) => (
          <div key={piece.id} className="p-4 border rounded-md" style={{ borderColor: primaryGreen }}>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-semibold" style={{ color: titleColor }}>
                Pièce #{index + 1}
              </h4>
              {!readOnly && pieces.length > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removePiece(piece.id)}
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  Supprimer
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label style={{ color: labelColor }}>Type de pièce</Label>
                {readOnly ? (
                <Input
                    value={piece.typePieceCode || ''}
                  className="bg-gray-100 text-gray-700"
                    style={{ borderColor: primaryGreen }}
                  disabled
                />
              ) : (
                  <SearchableSelect
                    value={piece.typePieceCode || ""}
                    onValueChange={(value) => updatePiece(piece.id, 'typePieceCode', value)}
                    items={typePiecesSearchable.items}
                    placeholder="Sélectionner un type de pièce"
                    emptyMessage="Aucun type trouvé"
                    searchPlaceholder="Rechercher un type..."
                    isLoading={typePiecesSearchable.isLoading}
                    hasMore={typePiecesSearchable.hasMore}
                    onLoadMore={typePiecesSearchable.loadMore}
                    isFetchingMore={typePiecesSearchable.isFetchingMore}
                    onSearchChange={typePiecesSearchable.setSearch}
                    disabled={readOnly}
                  />
          )}
        </div>

        <div className="space-y-2">
                <Label style={{ color: labelColor }}>Numéro</Label>
              <Input
                  value={piece.numero || ''}
                  onChange={(e) => updatePiece(piece.id, 'numero', e.target.value)}
                  placeholder="Numéro de la pièce"
                  style={{ borderColor: primaryGreen }}
                  className="focus:ring-2"
                disabled={readOnly}
              />
        </div>

        <div className="space-y-2">
                <Label style={{ color: labelColor }}>Date</Label>
              <Input
                type="date"
                  value={piece.date || ''}
                  onChange={(e) => updatePiece(piece.id, 'date', e.target.value)}
                  style={{ borderColor: primaryGreen }}
                  className="focus:ring-2"
                disabled={readOnly}
              />
      </div>

        <div className="space-y-2">
                <Label style={{ color: labelColor }}>Description</Label>
                <Input
                  value={piece.description || ''}
                  onChange={(e) => updatePiece(piece.id, 'description', e.target.value)}
                placeholder="Description de la pièce"
                  style={{ borderColor: primaryGreen }}
                  className="focus:ring-2"
                disabled={readOnly}
              />
        </div>

              <div className="space-y-2 md:col-span-2">
                <Label style={{ color: labelColor }}>Fichier</Label>
                {readOnly ? (
              <Input
                    value={piece.fichier || ''}
                    className="bg-gray-100 text-gray-700"
                    style={{ borderColor: primaryGreen }}
                    disabled
                  />
                ) : (
                  <Input
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      handleFileChange(piece.id, file);
                    }}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    style={{ borderColor: primaryGreen }}
                    className="focus:ring-2"
                  />
                )}
                {piece.file && (
                  <p className="text-xs text-gray-500 mt-1">
                    Fichier sélectionné : {piece.file.name}
                  </p>
          )}
        </div>
            </div>
          </div>
        ))}

        {!readOnly && (
          <Button
            onClick={addPiece}
            className="text-white"
            style={{ backgroundColor: primaryGreen }}
            size="sm"
          >
            <span className="mr-2">+</span>
            Ajouter une pièce jointe
          </Button>
        )}
      </div>
    </div>
  );

  const addGarantie = () => {
    const newId = garanties.length > 0 ? Math.max(...garanties.map(g => g.id)) + 1 : 1;
    setGaranties([...garanties, { 
      id: newId,
      type: '',
      employeur: '',
      statutSal: '',
      quartier: '',
      priorite: '',
      nom: '',
      prenoms: '',
      dateInscription: '',
      fonction: '',
      profession: '',
      adressePostale: '',
      numeroGarantie: '',
      objetMontant: '',
      terrain: '',
      logement: '',
      code: '',
      tel: '',
      ville: '',
      civCode: '',
      debCode: '',
      revenu: '',
      description: '',
      valeur: '',
      adresse: '',
      surface: '',
      circonscription: '',
      titreFoncier: '',
    }]);
  };

  const addPiece = () => {
    const newId = pieces.length > 0 ? Math.max(...pieces.map(p => p.id)) + 1 : 1;
    setPieces([...pieces, {
      id: newId,
      typePieceCode: '',
      numero: '',
      date: '',
      description: '',
      fichier: null,
      file: null,
    }]);
  };

  const removePiece = (id: number) => {
    setPieces(pieces.filter(p => p.id !== id));
  };

  const updatePiece = (id: number, field: string, value: any) => {
    setPieces(pieces.map(p =>
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const handleFileChange = (pieceId: number, file: File | null) => {
    updatePiece(pieceId, 'file', file);
    if (file) {
      updatePiece(pieceId, 'fichier', file.name);
    }
  };

  const removeGarantie = (id: number) => {
    if (garanties.length > 1) {
      setGaranties(garanties.filter(g => g.id !== id));
    }
  };

  const updateGarantie = (id: number, field: string, value: any) => {
    setGaranties(garanties.map(g =>
      g.id === id ? { ...g, [field]: value } : g
    ));
  };

  const renderStep5 = () => {
    const watchedTypeGarantie = watch("typeGarantie");

    return (
      <div className="space-y-6">
        <h2 className="text-lg font-bold mb-4" style={{ color: titleColor }}>Garanties</h2>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label className="whitespace-nowrap flex-shrink-0" style={{ color: labelColor, minWidth: '120px' }}>Type de garantie</Label>
          <Controller
            name="typeGarantie"
            control={control}
            render={({ field }) => (
              readOnly ? (
                <Input
                  value={field.value === 'personnelles' ? 'Garanties personnelles' : field.value === 'reelles' ? 'Garanties réelles' : field.value}
                  className="bg-gray-100 text-gray-700 flex-1"
                  style={{ borderColor: !!errors.typeGarantie ? errorRed : primaryGreen }}
                  disabled
                />
              ) : (
                <select
                  {...field}
                  className="flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  style={{ borderColor: !!errors.typeGarantie ? errorRed : primaryGreen }}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    setTypeGarantie(e.target.value);
                  }}
                >
                  <option value="">Sélectionner un type de garantie</option>
                  <option value="personnelles">Garanties personnelles</option>
                  <option value="reelles">Garanties réelles</option>
                </select>
              )
            )}
          />
          </div>
          {errors.typeGarantie && (
            <p className="text-sm" style={{ color: errorRed }}>{String(errors.typeGarantie.message)}</p>
          )}
        </div>

        {watchedTypeGarantie === "personnelles" && garanties.map((garantie, index) => (
          <div key={garantie.id} className="p-4 border rounded-md relative" style={{ borderColor: primaryGreen }}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-md font-semibold" style={{ color: titleColor }}>
                Garantie personnelle #{index + 1}
              </h3>
              {!readOnly && garanties.length > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeGarantie(garantie.id)}
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  Supprimer
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label style={{ color: labelColor }}>Type</Label>
                  {readOnly ? (
                  <Input
                    value={garantie.type || ''}
                      className="bg-gray-100 text-gray-700"
                      style={{ borderColor: primaryGreen }}
                      disabled
                    />
                  ) : (
                    <SearchableSelect
                      value={garantie.type || ""}
                      onValueChange={(value) => updateGarantie(garantie.id, 'type', value)}
                      items={typeGarantiePersonnellesSearchable.items}
                      placeholder="Sélectionner un type de garantie personnelle"
                      emptyMessage="Aucun type trouvé"
                      searchPlaceholder="Rechercher un type..."
                      isLoading={typeGarantiePersonnellesSearchable.isLoading}
                      hasMore={typeGarantiePersonnellesSearchable.hasMore}
                      onLoadMore={typeGarantiePersonnellesSearchable.loadMore}
                      isFetchingMore={typeGarantiePersonnellesSearchable.isFetchingMore}
                      onSearchChange={typeGarantiePersonnellesSearchable.setSearch}
                    disabled={readOnly}
                  />
                  )}
                </div>

                <div className="space-y-2">
                  <Label style={{ color: labelColor }}>Employeur</Label>
                  {readOnly ? (
                    <Input
                      value={getEntiteLibelle(garantie.employeur || '')}
                      className="bg-gray-100 text-gray-700"
                      style={{ borderColor: primaryGreen }}
                      disabled
                    />
                  ) : (
                    <SearchableSelect
                      value={garantie.employeur || ""}
                      onValueChange={(value) => updateGarantie(garantie.id, 'employeur', value)}
                      items={entitesSearchable.items}
                      placeholder="Sélectionner un employeur"
                      emptyMessage="Aucun employeur trouvé"
                      searchPlaceholder="Rechercher un employeur..."
                      isLoading={entitesSearchable.isLoading}
                      hasMore={entitesSearchable.hasMore}
                      onLoadMore={entitesSearchable.loadMore}
                      isFetchingMore={entitesSearchable.isFetchingMore}
                      onSearchChange={entitesSearchable.setSearch}
                      disabled={readOnly}
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <Label style={{ color: labelColor }}>Statut sal.</Label>
                  <Input
                    value={garantie.statutSal || ''}
                    onChange={(e) => updateGarantie(garantie.id, 'statutSal', e.target.value)}
                    placeholder="Statut salarié"
                    style={{ borderColor: primaryGreen }}
                    className="focus:ring-2"
                    disabled={readOnly}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label style={{ color: labelColor }}>Quartier</Label>
                  {readOnly ? (
                        <Input
                      value={getQuartierLibelle(garantie.quartier || '')}
                          className="bg-gray-100 text-gray-700"
                      style={{ borderColor: primaryGreen }}
                          disabled
                        />
                      ) : (
                    <SearchableSelect
                      value={garantie.quartier || ""}
                      onValueChange={(value) => updateGarantie(garantie.id, 'quartier', value)}
                      items={quartiersSearchable.items}
                      placeholder="Sélectionner un quartier"
                      emptyMessage="Aucun quartier trouvé"
                      searchPlaceholder="Rechercher un quartier..."
                      isLoading={quartiersSearchable.isLoading}
                      hasMore={quartiersSearchable.hasMore}
                      onLoadMore={quartiersSearchable.loadMore}
                      isFetchingMore={quartiersSearchable.isFetchingMore}
                      onSearchChange={quartiersSearchable.setSearch}
                      disabled={readOnly}
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <Label style={{ color: labelColor }}>Priorité</Label>
                      <Input
                    value={garantie.priorite || ''}
                    onChange={(e) => updateGarantie(garantie.id, 'priorite', e.target.value)}
                        placeholder="Priorité"
                    style={{ borderColor: primaryGreen }}
                    className="focus:ring-2"
                        disabled={readOnly}
                      />
                </div>

                <div className="space-y-2">
                  <Label style={{ color: labelColor }}>Date d'inscription</Label>
                      <Input
                    value={garantie.dateInscription || ''}
                    onChange={(e) => updateGarantie(garantie.id, 'dateInscription', e.target.value)}
                        type="date"
                    style={{ borderColor: primaryGreen }}
                    className="focus:ring-2"
                        disabled={readOnly}
                      />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label style={{ color: labelColor }}>Nom</Label>
                      <Input
                    value={garantie.nom || ''}
                    onChange={(e) => updateGarantie(garantie.id, 'nom', e.target.value)}
                        placeholder="Nom"
                    style={{ borderColor: primaryGreen }}
                    className="focus:ring-2"
                        disabled={readOnly}
                      />
                </div>

                <div className="space-y-2">
                  <Label style={{ color: labelColor }}>Prénoms</Label>
                      <Input
                    value={garantie.prenoms || ''}
                    onChange={(e) => updateGarantie(garantie.id, 'prenoms', e.target.value)}
                        placeholder="Prénoms"
                    style={{ borderColor: primaryGreen }}
                    className="focus:ring-2"
                        disabled={readOnly}
                      />
                </div>

                <div className="space-y-2">
                  <Label style={{ color: labelColor }}>Fonction</Label>
                      <Input
                    value={garantie.fonction || ''}
                    onChange={(e) => updateGarantie(garantie.id, 'fonction', e.target.value)}
                        placeholder="Fonction"
                    style={{ borderColor: primaryGreen }}
                    className="focus:ring-2"
                        disabled={readOnly}
                      />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label style={{ color: labelColor }}>Profession</Label>
                      <Input
                    value={garantie.profession || ''}
                    onChange={(e) => updateGarantie(garantie.id, 'profession', e.target.value)}
                        placeholder="Profession"
                    style={{ borderColor: primaryGreen }}
                    className="focus:ring-2"
                        disabled={readOnly}
                      />
                </div>

                <div className="space-y-2">
                  <Label style={{ color: labelColor }}>Téléphone</Label>
                  <Input
                    value={garantie.tel || ''}
                    onChange={(e) => updateGarantie(garantie.id, 'tel', e.target.value)}
                    placeholder="Ex: +225 07 08 09 10 11"
                    style={{ borderColor: primaryGreen }}
                    className="focus:ring-2"
                    disabled={readOnly}
                  />
                </div>

                <div className="space-y-2">
                  <Label style={{ color: labelColor }}>Revenu</Label>
                  <Input
                    type="number"
                    value={garantie.revenu || ''}
                    onChange={(e) => updateGarantie(garantie.id, 'revenu', e.target.value ? parseFloat(e.target.value) : '')}
                    placeholder="Revenu mensuel"
                    style={{ borderColor: primaryGreen }}
                    className="focus:ring-2"
                    disabled={readOnly}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label style={{ color: labelColor }}>Code civilité</Label>
                  {readOnly ? (
                    <Input
                      value={garantie.civCode || ''}
                      className="bg-gray-100 text-gray-700"
                      style={{ borderColor: primaryGreen }}
                      disabled
                    />
                  ) : (
                    <SearchableSelect
                      value={garantie.civCode || ""}
                      onValueChange={(value) => updateGarantie(garantie.id, 'civCode', value)}
                      items={civilitesSearchable.items}
                      placeholder="Sélectionner une civilité"
                      emptyMessage="Aucune civilité trouvée"
                      searchPlaceholder="Rechercher une civilité..."
                      isLoading={civilitesSearchable.isLoading}
                      hasMore={civilitesSearchable.hasMore}
                      onLoadMore={civilitesSearchable.loadMore}
                      isFetchingMore={civilitesSearchable.isFetchingMore}
                      onSearchChange={civilitesSearchable.setSearch}
                      disabled={readOnly}
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <Label style={{ color: labelColor }}>Code ville</Label>
                  <Input
                    value={garantie.ville || ''}
                    onChange={(e) => updateGarantie(garantie.id, 'ville', e.target.value)}
                    placeholder="Code ville"
                    style={{ borderColor: primaryGreen }}
                    className="focus:ring-2"
                    disabled={readOnly}
                  />
                </div>

                <div className="space-y-2">
                  <Label style={{ color: labelColor }}>Code débiteur</Label>
                  <Input
                    value={garantie.debCode || ''}
                    onChange={(e) => updateGarantie(garantie.id, 'debCode', e.target.value)}
                    placeholder="Code débiteur (optionnel)"
                    style={{ borderColor: primaryGreen }}
                    className="focus:ring-2"
                    disabled={readOnly}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label style={{ color: labelColor }}>Adresse postale</Label>
                      <Textarea
                    value={garantie.adressePostale || ''}
                    onChange={(e) => updateGarantie(garantie.id, 'adressePostale', e.target.value)}
                        placeholder="Adresse postale complète"
                        rows={2}
                    style={{ borderColor: primaryGreen }}
                    className="focus:ring-2"
                        disabled={readOnly}
                      />
                </div>
              </div>
            </div>
          </div>
        ))}

        {watchedTypeGarantie === "personnelles" && !readOnly && (
          <Button
            onClick={addGarantie}
            className="text-white"
            style={{ backgroundColor: primaryGreen }}
            size="sm"
          >
            <span className="mr-2">+</span>
            Ajouter une garantie personnelle
          </Button>
        )}

        {watchedTypeGarantie === "reelles" && garanties.map((garantie, index) => (
          <div key={garantie.id} className="p-4 border rounded-md relative" style={{ borderColor: primaryGreen }}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-md font-semibold" style={{ color: titleColor }}>
                Garantie réelle #{index + 1}
              </h3>
              {!readOnly && garanties.length > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeGarantie(garantie.id)}
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  Supprimer
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label style={{ color: labelColor }}>Type</Label>
                  {readOnly ? (
                      <Input
                      value={garantie.type || ''}
                      className="bg-gray-100 text-gray-700"
                      style={{ borderColor: primaryGreen }}
                      disabled
                    />
                  ) : (
                    <SearchableSelect
                      value={garantie.type || ""}
                      onValueChange={(value) => updateGarantie(garantie.id, 'type', value)}
                      items={typeGarantieReellesSearchable.items}
                      placeholder="Sélectionner un type de garantie réelle"
                      emptyMessage="Aucun type trouvé"
                      searchPlaceholder="Rechercher un type..."
                      isLoading={typeGarantieReellesSearchable.isLoading}
                      hasMore={typeGarantieReellesSearchable.hasMore}
                      onLoadMore={typeGarantieReellesSearchable.loadMore}
                      isFetchingMore={typeGarantieReellesSearchable.isFetchingMore}
                      onSearchChange={typeGarantieReellesSearchable.setSearch}
                        disabled={readOnly}
                      />
                  )}
                </div>

                <div className="space-y-2">
                  <Label style={{ color: labelColor }}>Numéro garantie</Label>
                      <Input
                    value={garantie.numeroGarantie || ''}
                    onChange={(e) => updateGarantie(garantie.id, 'numeroGarantie', e.target.value)}
                        placeholder="Numéro de garantie"
                    style={{ borderColor: primaryGreen }}
                    className="focus:ring-2"
                        disabled={readOnly}
                      />
                </div>

                <div className="space-y-2">
                  <Label style={{ color: labelColor }}>Date d'inscription</Label>
                      <Input
                    value={garantie.dateInscription || ''}
                    onChange={(e) => updateGarantie(garantie.id, 'dateInscription', e.target.value)}
                        type="date"
                    style={{ borderColor: primaryGreen }}
                    className="focus:ring-2"
                        disabled={readOnly}
                      />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label style={{ color: labelColor }}>Description</Label>
                      <Input
                    value={garantie.description || ''}
                    onChange={(e) => updateGarantie(garantie.id, 'description', e.target.value)}
                    placeholder="Description de la garantie"
                    style={{ borderColor: primaryGreen }}
                    className="focus:ring-2"
                        disabled={readOnly}
                      />
                </div>

                <div className="space-y-2">
                  <Label style={{ color: labelColor }}>Valeur</Label>
                      <Input
                    type="number"
                    value={garantie.valeur || ''}
                    onChange={(e) => updateGarantie(garantie.id, 'valeur', e.target.value ? parseFloat(e.target.value) : '')}
                    placeholder="Valeur de la garantie"
                    style={{ borderColor: primaryGreen }}
                    className="focus:ring-2"
                        disabled={readOnly}
                      />
                </div>

                <div className="space-y-2">
                  <Label style={{ color: labelColor }}>Surface</Label>
                      <Input
                    type="number"
                    value={garantie.surface || ''}
                    onChange={(e) => updateGarantie(garantie.id, 'surface', e.target.value ? parseFloat(e.target.value) : '')}
                    placeholder="Surface en m²"
                    style={{ borderColor: primaryGreen }}
                    className="focus:ring-2"
                        disabled={readOnly}
                      />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label style={{ color: labelColor }}>Adresse</Label>
                      <Input
                    value={garantie.adresse || ''}
                    onChange={(e) => updateGarantie(garantie.id, 'adresse', e.target.value)}
                    placeholder="Adresse de la garantie"
                    style={{ borderColor: primaryGreen }}
                    className="focus:ring-2"
                        disabled={readOnly}
                      />
                </div>

                <div className="space-y-2">
                  <Label style={{ color: labelColor }}>Code circonscription</Label>
                      <Input
                    value={garantie.circonscription || ''}
                    onChange={(e) => updateGarantie(garantie.id, 'circonscription', e.target.value)}
                    placeholder="Code circonscription"
                    style={{ borderColor: primaryGreen }}
                    className="focus:ring-2"
                        disabled={readOnly}
                      />
                  <p className="text-xs text-gray-500">Note: L'API pour les circonscriptions n'est pas encore disponible</p>
                </div>

                <div className="space-y-2">
                  <Label style={{ color: labelColor }}>Numéro titre foncier</Label>
                      <Input
                    value={garantie.titreFoncier || ''}
                    onChange={(e) => updateGarantie(garantie.id, 'titreFoncier', e.target.value)}
                    placeholder="Numéro titre foncier"
                    style={{ borderColor: primaryGreen }}
                    className="focus:ring-2"
                        disabled={readOnly}
                      />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label style={{ color: labelColor }}>Code terrain</Label>
                      <Input
                    value={garantie.terrain || ''}
                    onChange={(e) => updateGarantie(garantie.id, 'terrain', e.target.value)}
                    placeholder="Code terrain (optionnel)"
                    style={{ borderColor: primaryGreen }}
                    className="focus:ring-2"
                        disabled={readOnly}
                      />
                </div>

                <div className="space-y-2">
                  <Label style={{ color: labelColor }}>Code logement</Label>
                  <Input
                    value={garantie.logement || ''}
                    onChange={(e) => updateGarantie(garantie.id, 'logement', e.target.value)}
                    placeholder="Code logement (optionnel)"
                    style={{ borderColor: primaryGreen }}
                    className="focus:ring-2"
                    disabled={readOnly}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        {watchedTypeGarantie === "reelles" && !readOnly && (
          <Button
            onClick={addGarantie}
            className="text-white"
            style={{ backgroundColor: primaryGreen }}
            size="sm"
          >
            <span className="mr-2">+</span>
            Ajouter une garantie réelle
          </Button>
        )}
      </div>
    );
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1(); // Informations générales (fusion step1 + step2)
      case 2: return renderStep2(); // Détails financiers (ancien step3)
      case 3: return renderStep4(); // Pièces jointes
      case 4: return renderStep5(); // Garanties
      default: return null;
    }
  };

  return (
    <div>
      {renderCurrentStep()}
    </div>
  );
});

CreanceForm.displayName = 'CreanceForm';

export default CreanceForm;
export { CreanceForm };
