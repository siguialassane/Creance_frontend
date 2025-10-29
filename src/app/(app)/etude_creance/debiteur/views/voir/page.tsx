"use client"

import { Suspense } from "react";
import { useState, useEffect, useRef } from "react";
import {
  Box,
  Button as ChakraButton,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Divider,
  Grid,
  GridItem,
  useToast
} from "@chakra-ui/react";
import { ArrowBackIcon, EditIcon } from "@chakra-ui/icons";
import { useRouter, useSearchParams } from "next/navigation";
import DebiteurForm from "@/components/debiteur-form/debiteur-form";
import { Button } from "@/components/ui/button";
import { useApiClient } from "@/hooks/useApiClient";
import { DebiteurService } from "@/services/debiteur.service";

// Types pour les débiteurs
interface Debiteur {
  id: string;
  // Étape 1: Informations générales
  codeDebiteur: string;
  categorieDebiteur: string;
  adressePostale: string;
  email: string;
  typeDebiteur: string;
  
  // Étape 2: Personne physique/morale
  civilite?: string;
  nom: string;
  prenom?: string;
  dateNaissance?: string;
  lieuNaissance?: string;
  quartier?: string;
  nationalite?: string;
  numeroCellulaire?: string;
  numeroTelephone?: string;
  fonction?: string;
  profession?: string;
  employeur?: string;
  statutSalarie?: string;
  matricule?: string;
  sexe?: string;
  dateDeces?: string;
  naturePieceIdentite?: string;
  numeroPieceIdentite?: string;
  dateEtablie?: string;
  lieuEtablie?: string;
  statutMatrimonial?: string;
  regimeMariage?: string;
  nombreEnfant?: string;
  nomConjoint?: string;
  prenomsConjoint?: string;
  dateNaissanceConjoint?: string;
  adresseConjoint?: string;
  telConjoint?: string;
  numeroPieceConjoint?: string;
  nomPere?: string;
  prenomsPere?: string;
  nomMere?: string;
  prenomsMere?: string;
  rue?: string;
  
  // Personne morale
  registreCommerce?: string;
  raisonSociale?: string;
  capitalSocial?: string;
  formeJuridique?: string;
  domaineActivite?: string;
  siegeSocial?: string;
  nomGerant?: string;
  
  // Étape 3: Domiciliation
  type?: string;
  numeroCompte?: string;
  libelle?: string;
  banque?: string;
  banqueAgence?: string;
  
  // Métadonnées
  dateCreation: string;
  statut: string;
}

const VoirDebiteurPageInner = () => {
  const [debiteur, setDebiteur] = useState<Debiteur | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const totalSteps = 3;
  const formRef = useRef<any>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const debiteurId = searchParams.get('id');
  const toast = useToast();
  const apiClient = useApiClient();

  const steps = [
    { id: 1, title: "Informations générales", description: "Code, catégorie, adresse, email et type de débiteur" },
    { id: 2, title: "Personne physique/morale", description: "Informations détaillées selon le type sélectionné" },
    { id: 3, title: "Domiciliation", description: "Type, compte, banque et agence" }
  ];

  // Transformer les données de l'API vers le format du formulaire
  const transformApiDataToFormData = (apiData: any): any => {
    return {
      // Étape 1: Informations générales
      codeDebiteur: apiData.DEB_CODE?.toString() || '',
      categorieDebiteur: apiData.CATEG_DEB_CODE || '',
      adressePostale: apiData.DEB_ADRPOST || '',
      email: apiData.DEB_EMAIL || '',
      telephone: apiData.DEB_TELBUR || '',
      numeroCell: apiData.DEB_CEL || '',
      typeDebiteur: apiData.TYPDEB_CODE || '',

      // Étape 2: Personne physique
      civilite: apiData.CIV_CODE || '',
      nom: apiData.DEB_NOM || '',
      prenom: apiData.DEB_PREN || '',
      dateNaissance: apiData.DEB_DATNAISS || '',
      lieuNaissance: apiData.DEB_LIEUNAISS || '',
      quartier: apiData.QUART_CODE || '',
      nationalite: apiData.NAT_CODE || '',
      fonction: apiData.FONCT_CODE || '',
      profession: apiData.PROFES_CODE || '',
      employeur: apiData.EMP_CODE || '',
      statutSalarie: apiData.STATSAL_CODE || '',
      matricule: apiData.DEB_MATRIC || '',
      sexe: apiData.DEB_SEXE || '',
      dateDeces: apiData.DEB_DATDEC || '',
      naturePieceIdentite: apiData.DEB_NATPIDENT || '',
      numeroPieceIdentite: apiData.DEB_NUMPIDENT || '',
      dateEtablie: apiData.DEB_DATETPIDENT || '',
      lieuEtablie: apiData.DEB_LIEUETPIDENT || '',
      statutMatrimonial: apiData.DEB_SITMATRI || '',
      regimeMariage: apiData.REGMAT_CODE || '',
      nombreEnfant: apiData.DEB_NBR_ENF?.toString() || '',
      nomConjoint: apiData.DEB_CJ_NOM || '',
      prenomsConjoint: apiData.DEB_CJ_PREN || '',
      dateNaissanceConjoint: apiData.DEB_CJ_DATNAISS || '',
      telConjoint: apiData.DEB_CJ_TEL || '',
      numeroPieceConjoint: apiData.DEB_CJ_NUMPIDENT || '',
      adresseConjoint: apiData.DEB_CJ_ADR || '',
      nomPere: apiData.DEB_NPERE || '',
      prenomsPere: apiData.DEB_PRPERE || '',
      nomMere: apiData.DEB_NMERE || '',
      prenomsMere: apiData.DEB_PRMERE || '',
      rue: apiData.DEB_RUE || '',

      // Étape 2: Personne morale (noms de colonnes réels de l'API)
      registreCommerce: apiData.DEB_REGISTCOM || '',
      raisonSociale: apiData.DEB_RAIS_SOCIALE || '',
      capitalSocial: apiData.DEB_CAPITSOCIAL?.toString() || '',
      formeJuridique: apiData.DEB_FORM_JURID || '',
      domaineActivite: apiData.DEB_DOM_ACTIV || '',
      siegeSocial: apiData.DEB_SIEG_SOCIAL || '',
      nomGerant: apiData.DEB_NOM_GERANT || '',

      // Étape 3: Domiciliation
      type: apiData.TYPDOM_CODE || '',
      numeroCompte: apiData.DOM_NUM_COMPTE || '',
      libelle: apiData.DOM_LIB || '',
      banque: apiData.BQ_CODE || apiData.BANQUE_CODE || '',
      banqueLibelle: apiData.BANQUE_LIB || '',
      banqueAgence: apiData.BQAG_CODE || '',
      agenceLibelle: apiData.AGENCE_LIB || apiData.BQAG_LIB || ''
    };
  };

  useEffect(() => {
    const loadDebiteur = async () => {
      if (!debiteurId) {
        toast({
          title: "Erreur",
          description: "Aucun code débiteur fourni",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        router.push('/etude_creance/debiteur/views');
        return;
      }

      setLoading(true);

      try {
        console.log('Chargement du débiteur avec le code:', debiteurId);
        const response = await DebiteurService.getByCode(apiClient, debiteurId);
        console.log('Données du débiteur reçues:', response);

        // Transformer les données API vers le format du formulaire
        const transformedData = transformApiDataToFormData(response);
        console.log('Données transformées pour le formulaire:', transformedData);

        setFormData(transformedData);
        setDebiteur({
          id: debiteurId,
          codeDebiteur: transformedData.codeDebiteur,
          categorieDebiteur: transformedData.categorieDebiteur,
          adressePostale: transformedData.adressePostale,
          email: transformedData.email,
          typeDebiteur: transformedData.typeDebiteur === 'P' ? 'Physique' : transformedData.typeDebiteur === 'M' ? 'Morale' : transformedData.typeDebiteur,
          nom: transformedData.nom || transformedData.raisonSociale,
          prenom: transformedData.prenom,
          civilite: transformedData.civilite,
          dateNaissance: transformedData.dateNaissance,
          lieuNaissance: transformedData.lieuNaissance,
          quartier: transformedData.quartier,
          nationalite: transformedData.nationalite,
          numeroCellulaire: transformedData.numeroCell,
          numeroTelephone: transformedData.telephone,
          fonction: transformedData.fonction,
          profession: transformedData.profession,
          employeur: transformedData.employeur,
          statutSalarie: transformedData.statutSalarie,
          matricule: transformedData.matricule,
          sexe: transformedData.sexe,
          dateDeces: transformedData.dateDeces,
          naturePieceIdentite: transformedData.naturePieceIdentite,
          numeroPieceIdentite: transformedData.numeroPieceIdentite,
          dateEtablie: transformedData.dateEtablie,
          lieuEtablie: transformedData.lieuEtablie,
          statutMatrimonial: transformedData.statutMatrimonial,
          regimeMariage: transformedData.regimeMariage,
          nombreEnfant: transformedData.nombreEnfant,
          nomConjoint: transformedData.nomConjoint,
          prenomsConjoint: transformedData.prenomsConjoint,
          dateNaissanceConjoint: transformedData.dateNaissanceConjoint,
          adresseConjoint: transformedData.adresseConjoint,
          telConjoint: transformedData.telConjoint,
          numeroPieceConjoint: transformedData.numeroPieceConjoint,
          nomPere: transformedData.nomPere,
          prenomsPere: transformedData.prenomsPere,
          nomMere: transformedData.nomMere,
          prenomsMere: transformedData.prenomsMere,
          rue: transformedData.rue,
          registreCommerce: transformedData.registreCommerce,
          raisonSociale: transformedData.raisonSociale,
          capitalSocial: transformedData.capitalSocial,
          formeJuridique: transformedData.formeJuridique,
          domaineActivite: transformedData.domaineActivite,
          siegeSocial: transformedData.siegeSocial,
          nomGerant: transformedData.nomGerant,
          type: transformedData.type,
          numeroCompte: transformedData.numeroCompte,
          libelle: transformedData.libelle,
          banque: transformedData.banque,
          banqueAgence: transformedData.banqueAgence,
          dateCreation: response.DEB_DATE_CTL || '',
          statut: 'Actif'
        });
      } catch (error: any) {
        console.error('Erreur lors du chargement du débiteur:', error);
        toast({
          title: "Erreur de chargement",
          description: error.message || "Impossible de charger les données du débiteur",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      } finally {
        setLoading(false);
      }
    };

    loadDebiteur();
  }, [debiteurId, apiClient, toast, router]);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Actif": return "green";
      case "Inactif": return "red";
      case "Suspendu": return "orange";
      default: return "gray";
    }
  };

  const handleBack = () => {
    window.location.href = "/etude_creance/debiteur/views";
  };

  const handleEdit = () => {
    window.location.href = `/etude_creance/debiteur/edit?id=${debiteur?.id}`;
  };

  if (loading) {
    return (
      <Box p={6} maxW="1200px" mx="auto">
        <Text>Chargement du débiteur...</Text>
      </Box>
    );
  }

  if (!debiteur) {
    return (
      <Box p={6} maxW="1200px" mx="auto">
        <Text>Débiteur non trouvé</Text>
      </Box>
    );
  }

  return (
    <Box p={6} maxW="1200px" mx="auto">
      <VStack spacing={6} align="stretch">
        {/* En-tête avec design moderne */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold mb-2" style={{ color: '#28A325' }}>
                Gestion des Débiteurs
              </h1>
              <p className="text-base text-gray-600">
                Programme de gestion des débiteurs
              </p>
            </div>
            <HStack spacing={3}>
              <ChakraButton
                leftIcon={<EditIcon />}
                onClick={handleEdit}
                colorScheme="green"
                bg="#28A325"
                _hover={{ bg: "#047857" }}
              >
                Modifier
              </ChakraButton>
              <ChakraButton
                leftIcon={<ArrowBackIcon />}
                onClick={handleBack}
                variant="outline"
                colorScheme="gray"
              >
                Retour à la liste
              </ChakraButton>
            </HStack>
          </div>
          
          {/* Indicateurs des étapes */}
          <div className="flex items-center justify-between mb-4 mt-12">
            <div className="flex items-center justify-between w-full">
              <div className={`text-sm font-medium ${currentStep >= 1 ? 'text-orange-600' : 'text-gray-500'}`}>
                Informations générales
              </div>
              <div className={`text-sm font-medium ${currentStep >= 2 ? 'text-orange-600' : 'text-gray-500'}`}>
                Personne physique/morale
              </div>
              <div className={`text-sm font-medium ${currentStep >= 3 ? 'text-orange-600' : 'text-gray-500'}`}>
                Domiciliation
              </div>
            </div>
          </div>
          
          {/* Barre de progression */}
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div 
              className="bg-orange-500 h-1 rounded-full transition-all duration-300" 
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-lg border p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-orange-600 mb-2">
              {steps[currentStep - 1].title}
            </h2>
            <p className="text-sm text-gray-600">
              {steps[currentStep - 1].description}
            </p>
          </div>

          <div>
            <DebiteurForm
              ref={formRef}
              currentStep={currentStep}
              formData={formData}
              onDataChange={() => {}} // Pas de modification en mode consultation
              onSubmit={() => {}} // Pas de soumission en mode consultation
              readOnly={true} // Mode lecture seule
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="pt-6 pb-6 px-6">
            <div className="flex justify-between items-center">
              <div>
                {currentStep > 1 && (
                  <Button 
                    variant="outline" 
                    onClick={handlePrevious}
                    className="text-gray-600 border-gray-300 hover:bg-gray-50 bg-white px-24 py-4 text-base min-w-[120px]"
                  >
                    Précédent
                  </Button>
                )}
              </div>
              <div>
                <Button 
                  onClick={handleNext}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-24 py-4 text-base min-w-[120px]"
                  style={{ backgroundColor: '#f97316', color: 'white' }}
                  disabled={currentStep === totalSteps}
                >
                  Suivant
                </Button>
              </div>
            </div>
          </div>
        </div>

        
      </VStack>
    </Box>
  );
};

export default function VoirDebiteurPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <VoirDebiteurPageInner />
    </Suspense>
  )
}
