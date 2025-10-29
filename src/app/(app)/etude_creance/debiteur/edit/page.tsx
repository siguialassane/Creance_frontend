"use client"

import { Suspense } from "react";
import * as React from "react";
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation";
import DebiteurForm from "@/components/debiteur-form/debiteur-form";
import { useToast } from "@chakra-ui/react";
import { useApiClient } from "@/hooks/useApiClient";
import { DebiteurService } from "@/services/debiteur.service";

const EditerDebiteurPageInner = () => {
  const [step, setStep] = React.useState(0)
  const [loading, setLoading] = React.useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()
  const debiteurId = searchParams.get('id')
  const formRef = React.useRef<any>(null)
  const toast = useToast()
  const apiClient = useApiClient()

  const [formData, setFormData] = React.useState({})

  const steps = [
    { id: 0, title: "Informations générales", description: "Code, catégorie, adresse, email et type de débiteur" },
    { id: 1, title: "Personne physique/morale", description: "Informations détaillées selon le type sélectionné" },
    { id: 2, title: "Domiciliation", description: "Type, compte, banque et agence" }
  ]

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

  React.useEffect(() => {
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
        console.log('Chargement du débiteur pour modification avec le code:', debiteurId);
        const response = await DebiteurService.getByCode(apiClient, debiteurId);
        console.log('Données du débiteur reçues:', response);

        // Transformer les données API vers le format du formulaire
        const transformedData = transformApiDataToFormData(response);
        console.log('Données transformées pour le formulaire:', transformedData);

        setFormData(transformedData);
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
        router.push('/etude_creance/debiteur/views');
      } finally {
        setLoading(false);
      }
    };

    loadDebiteur();
  }, [debiteurId, apiClient, toast, router])

  const handleSubmit = async (data: any) => {
    console.log("Données du débiteur à modifier:", data);

    if (!debiteurId) {
      toast({
        title: "Erreur",
        description: "Aucun code débiteur fourni",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      console.log('Envoi de la mise à jour vers l\'API...');
      const response = await DebiteurService.update(apiClient, debiteurId, data);
      console.log('Réponse de l\'API:', response);

      if (response.status === "SUCCESS") {
        toast({
          title: "Débiteur modifié avec succès !",
          description: `Le débiteur ${data.codeDebiteur || debiteurId} a été mis à jour.`,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top",
        });

        // Rediriger vers la liste après un court délai
        setTimeout(() => {
          router.push("/etude_creance/debiteur/views");
        }, 1500);
      } else {
        throw new Error(response.message || "Erreur lors de la modification");
      }
    } catch (error: any) {
      console.error('Erreur lors de la modification:', error);
      toast({
        title: "Erreur de modification",
        description: error.message || "Une erreur s'est produite lors de la modification",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Chargement du débiteur...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-6 py-6">
        {/* En-tête comme dans l'image */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold mb-2" style={{ color: '#28A325' }}>Modifier un débiteur</h1>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center justify-between w-full">
              <div className={`text-sm font-medium ${step >= 0 ? 'text-orange-600' : 'text-gray-500'}`}>
                Informations générales
              </div>
              <div className={`text-sm font-medium ${step >= 1 ? 'text-orange-600' : 'text-gray-500'}`}>
                Personne physique/morale
              </div>
              <div className={`text-sm font-medium ${step >= 2 ? 'text-orange-600' : 'text-gray-500'}`}>
                Domiciliation
              </div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div 
              className="bg-orange-500 h-1 rounded-full transition-all duration-300" 
              style={{ width: `${((step + 1) / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-12 space-y-6">

            {/* Contenu du formulaire */}
            <div className="bg-white rounded-lg border p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-orange-600 mb-2">
                  {steps[step].title}
                </h2>
                <p className="text-sm text-gray-600">
                  {steps[step].description}
                </p>
              </div>

              <DebiteurForm
                ref={formRef}
                currentStep={step + 1}
                formData={formData}
                onDataChange={setFormData}
                onSubmit={handleSubmit}
                isEditMode={true}
              />
            </div>

            {/* Navigation comme dans l'image - pied de page */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  {step > 0 && (
                    <Button 
                      variant="outline" 
                      onClick={() => setStep(step - 1)}
                      className="text-gray-600 border-gray-300 hover:bg-gray-50 bg-white px-24 py-4 text-base min-w-[120px]"
                    >
                      Précédent
                    </Button>
                  )}
                </div>
                <div>
                  {step < 2 ? (
                    <Button 
                      onClick={() => setStep(step + 1)}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-24 py-4 text-base min-w-[120px]"
                      style={{ backgroundColor: '#f97316', color: 'white' }}
                    >
                      Suivant
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => handleSubmit(formData)}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-24 py-4 text-base min-w-[120px]"
                      style={{ backgroundColor: '#f97316', color: 'white' }}
                    >
                      Mettre à jour
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


export default function EditerDebiteurPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <EditerDebiteurPageInner />
    </Suspense>
  )
}
