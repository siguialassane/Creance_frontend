"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Printer, Download, X, Loader2 } from "lucide-react"
import { useState } from "react"
import { useApiClient } from "@/hooks/useApiClient"
import { toast } from "sonner"

interface RecuPaiementModalProps {
  open: boolean
  onClose: () => void
  title: string
  data: {
    effetNum?: string  // Numéro d'effet pour récupérer le PDF depuis le backend
    paieCode?: string  // Code paiement (utilisé si effetNum n'est pas disponible)
    fraisCode?: string // Code frais (pour les paiements de frais)
    numeroPaiement?: string
    [key: string]: any
  }
}

export function RecuPaiementModal({ open, onClose, title, data }: RecuPaiementModalProps) {
  const apiClient = useApiClient()
  const [loading, setLoading] = useState(false)

  const handleImprimerTelecharger = async (type: 'comptabilite' | 'debiteur' | 'archive', action: 'print' | 'download') => {
    let url: string
    let useCode = false

    // Déterminer l'endpoint selon le type de paiement
    if (data.fraisCode) {
      // Paiement de frais - utiliser fraisCode
      url = `/paiements/frais/${data.fraisCode}/recu/${type}`
    } else if (data.effetNum) {
      // Paiement par effet - utiliser effetNum
      url = `/paiements/${data.effetNum}/recu/${type}`
    } else if (data.paieCode) {
      // Paiement par code - utiliser paieCode
      url = `/paiements/code/${data.paieCode}/recu/${type}`
      useCode = true
    } else {
      toast.error("Identifiant de paiement non disponible")
      return
    }

    setLoading(true)
    try {

      // Appeler l'API pour générer le PDF
      const response = await apiClient.get(url, {
        responseType: 'blob'
      })

      // Créer un URL pour le blob
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url_blob = window.URL.createObjectURL(blob)

      if (action === 'print') {
        // Ouvrir dans une nouvelle fenêtre pour impression
        const printWindow = window.open(url_blob, '_blank')
        if (printWindow) {
          // Attendre que le PDF soit chargé avant d'imprimer
          const checkPDFLoaded = () => {
            try {
              // Vérifier si le document est prêt
              if (printWindow.document.readyState === 'complete' || 
                  printWindow.document.readyState === 'interactive') {
                // Attendre encore un peu pour que le PDF soit complètement rendu
                setTimeout(() => {
                  printWindow.print()
                }, 500)
              } else {
                // Réessayer après un court délai
                setTimeout(checkPDFLoaded, 100)
              }
            } catch (e) {
              // Si on ne peut pas accéder au document (PDF dans iframe), attendre et imprimer
              setTimeout(() => {
                printWindow.print()
              }, 1000)
            }
          }
          
          // Démarrer la vérification après un court délai initial
          setTimeout(checkPDFLoaded, 300)
        }
      } else {
        // Télécharger le fichier
        const link = document.createElement('a')
        link.href = url_blob
        // Déterminer le nom du fichier selon le type de paiement
        const fileName = data.fraisCode 
          ? `recu_frais_${data.fraisCode}_${type}.pdf`
          : data.effetNum 
          ? `recu_${data.effetNum}_${type}.pdf`
          : `recu_${data.paieCode}_${type}.pdf`
        link.download = fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }

      window.URL.revokeObjectURL(url_blob)
    } catch (error: any) {
      console.error('Erreur lors de la génération du reçu:', error)
      toast.error(error.response?.data?.message || error.message || 'Impossible de générer le reçu')
    } finally {
      setLoading(false)
    }
  }

  const handleImprimerTous = async () => {
    let baseUrl: string
    let useCode = false

    // Déterminer l'endpoint selon le type de paiement
    if (data.fraisCode) {
      baseUrl = `/paiements/frais/${data.fraisCode}/recu`
    } else if (data.effetNum) {
      baseUrl = `/paiements/${data.effetNum}/recu`
    } else if (data.paieCode) {
      baseUrl = `/paiements/code/${data.paieCode}/recu`
      useCode = true
    } else {
      toast.error("Identifiant de paiement non disponible")
      return
    }

    setLoading(true)
    try {
      // Générer et ouvrir les 3 exemplaires en parallèle
      const types: ('comptabilite' | 'debiteur' | 'archive')[] = ['comptabilite', 'debiteur', 'archive']

      for (const type of types) {
        const url = `${baseUrl}/${type}`

        const response = await apiClient.get(url, {
          responseType: 'blob'
        })

        const blob = new Blob([response.data], { type: 'application/pdf' })
        const url_blob = window.URL.createObjectURL(blob)

        // Ouvrir dans une nouvelle fenêtre pour impression
        const printWindow = window.open(url_blob, '_blank')
        if (printWindow) {
          // Attendre que le PDF soit chargé avant d'imprimer
          const checkPDFLoaded = () => {
            try {
              if (printWindow.document.readyState === 'complete' || 
                  printWindow.document.readyState === 'interactive') {
                setTimeout(() => {
                  printWindow.print()
                }, 500)
              } else {
                setTimeout(checkPDFLoaded, 100)
              }
            } catch (e) {
              setTimeout(() => {
                printWindow.print()
              }, 1000)
            }
          }
          setTimeout(checkPDFLoaded, 300)
        }

        // Attendre un peu avant d'ouvrir le suivant
        await new Promise(resolve => setTimeout(resolve, 1500))
        window.URL.revokeObjectURL(url_blob)
      }

      toast.success("Les 3 exemplaires ont été générés")
    } catch (error: any) {
      console.error('Erreur lors de la génération des reçus:', error)
      toast.error(error.response?.data?.message || error.message || 'Impossible de générer les reçus')
    } finally {
      setLoading(false)
    }
  }

  const handleTelechargerTous = async () => {
    let baseUrl: string
    let identifier: string

    // Déterminer l'endpoint selon le type de paiement
    if (data.fraisCode) {
      baseUrl = `/paiements/frais/${data.fraisCode}/recu`
      identifier = data.fraisCode
    } else if (data.effetNum) {
      baseUrl = `/paiements/${data.effetNum}/recu`
      identifier = data.effetNum
    } else if (data.paieCode) {
      baseUrl = `/paiements/code/${data.paieCode}/recu`
      identifier = data.paieCode
    } else {
      toast.error("Identifiant de paiement non disponible")
      return
    }

    setLoading(true)
    try {
      const types: ('comptabilite' | 'debiteur' | 'archive')[] = ['comptabilite', 'debiteur', 'archive']

      for (const type of types) {
        const url = `${baseUrl}/${type}`

        const response = await apiClient.get(url, {
          responseType: 'blob'
        })

        const blob = new Blob([response.data], { type: 'application/pdf' })
        const url_blob = window.URL.createObjectURL(blob)

        const link = document.createElement('a')
        link.href = url_blob
        // Nom du fichier selon le type de paiement
        const fileName = data.fraisCode 
          ? `recu_frais_${identifier}_${type}.pdf`
          : `recu_${identifier}_${type}.pdf`
        link.download = fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        window.URL.revokeObjectURL(url_blob)
      }

      toast.success("Les 3 exemplaires ont été téléchargés")
    } catch (error: any) {
      console.error('Erreur lors du téléchargement des reçus:', error)
      toast.error(error.response?.data?.message || error.message || 'Impossible de télécharger les reçus')
    } finally {
      setLoading(false)
    }
  }

  const handleTelechargerRecuCombine = async () => {
    if (!data.paieCode) {
      toast.error("Code paiement non disponible pour le reçu combiné")
      return
    }

    setLoading(true)
    try {
      const { PaiementService } = await import("@/services/paiement.service")
      const blob = await PaiementService.getRecuCombine(
        apiClient, 
        parseInt(data.paieCode), 
        'ALL'
      )

      const url_blob = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url_blob
      link.download = `recu_combine_${data.paieCode}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url_blob)

      toast.success("Reçu combiné téléchargé avec succès (3 pages)")
    } catch (error: any) {
      console.error('Erreur lors du téléchargement du reçu combiné:', error)
      toast.error(error.response?.data?.message || error.message || 'Impossible de générer le reçu combiné')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-gray-800 text-center">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="py-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Paiement enregistré avec succès
            </h3>
            {data.numeroPaiement && (
              <p className="text-lg text-gray-600">
                Numéro de paiement : <span className="font-semibold text-gray-800">{data.numeroPaiement}</span>
              </p>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <div className="flex items-start justify-center gap-3">
                
                <div className="flex-1">
                  <h4 className="font-semibold text-blue-900 mb-1">Reçu Officiel PDF</h4>
                  <p className="text-sm text-blue-700">
                    Document de 3 pages comprenant les exemplaires Client, Comptabilité et Archives
                  </p>
                </div>
              </div>
            </div>

            {data.paieCode ? (
              <div className="flex justify-center mt-6">
                <Button
                  onClick={handleTelechargerRecuCombine}
                  disabled={loading}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-base"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Génération du PDF en cours...
                    </>
                  ) : (
                    <>
                      <Download className="h-5 w-5 mr-2" />
                      Télécharger le Reçu (PDF - 3 pages)
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">
                  Le reçu sera disponible dans quelques instants...
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-gray-300"
          >
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
