"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import DebiteurForm from "@/components/debiteur-form/debiteur-form"

export default function NouveauDebiteurPage() {
  const router = useRouter()
  const [step, setStep] = React.useState(0)
  const [formData, setFormData] = React.useState({})
  const formRef = React.useRef<any>(null)

  const steps = [
    { id: 0, title: "Informations générales", description: "Code, catégorie, adresse, email et type de débiteur" },
    { id: 1, title: "Personne physique/morale", description: "Informations détaillées selon le type sélectionné" },
    { id: 2, title: "Domiciliation", description: "Type, compte, banque et agence" }
  ]

  const handleSubmit = (data: any) => {
    console.log("Données du débiteur:", data);
    router.push("/etude_creance/debiteur/views");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-6 py-6">
        {/* En-tête comme dans l'image */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold mb-2" style={{ color: '#28A325' }}>Ajouter un débiteur</h1>
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
                      Enregistrer
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
