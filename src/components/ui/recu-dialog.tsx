"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, Printer, ExternalLink } from "lucide-react"
import { PaiementService } from "@/services/paiement.service"
import { useState } from "react"
import { toast } from "sonner"

interface RecuDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  effetNum: string
}

export function RecuDialog({ open, onOpenChange, effetNum }: RecuDialogProps) {
  const [loadingType, setLoadingType] = useState<string | null>(null)

  const exemplaires = [
    { type: 'comptabilite' as const, label: 'Comptabilité', color: 'blue' },
    { type: 'debiteur' as const, label: 'Débiteur', color: 'green' },
    { type: 'archive' as const, label: 'Archive', color: 'gray' },
  ]

  const handleView = (type: 'comptabilite' | 'debiteur' | 'archive') => {
    const url = PaiementService.getRecuPdfUrl(effetNum, type)
    window.open(url, '_blank')
  }

  const handleDownload = async (type: 'comptabilite' | 'debiteur' | 'archive') => {
    setLoadingType(type)
    try {
      const url = PaiementService.getRecuPdfUrl(effetNum, type)

      // Télécharger le PDF
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      })

      if (!response.ok) {
        throw new Error('Erreur lors du téléchargement')
      }

      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = downloadUrl
      a.download = `recu_${effetNum}_${type}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(downloadUrl)
      document.body.removeChild(a)

      toast.success(`Reçu ${type} téléchargé avec succès`)
    } catch (error) {
      console.error('Erreur téléchargement:', error)
      toast.error('Erreur lors du téléchargement du reçu')
    } finally {
      setLoadingType(null)
    }
  }

  const handlePrint = (type: 'comptabilite' | 'debiteur' | 'archive') => {
    const url = PaiementService.getRecuPdfUrl(effetNum, type)

    // Ouvrir dans une nouvelle fenêtre pour impression
    const printWindow = window.open(url, '_blank')
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print()
      }
    }
  }

  const handleDownloadAll = async () => {
    setLoadingType('all')
    try {
      for (const ex of exemplaires) {
        await handleDownload(ex.type)
        // Petit délai entre chaque téléchargement
        await new Promise(resolve => setTimeout(resolve, 500))
      }
      toast.success('Tous les reçus ont été téléchargés')
    } catch (error) {
      console.error('Erreur téléchargement multiple:', error)
      toast.error('Erreur lors du téléchargement des reçus')
    } finally {
      setLoadingType(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>Reçus de paiement N° {effetNum}</DialogTitle>
          <DialogDescription>
            Sélectionnez l'exemplaire que vous souhaitez consulter ou télécharger
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {exemplaires.map((ex) => (
            <div
              key={ex.type}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">
                  Exemplaire {ex.label}
                </h3>
                <p className="text-sm text-gray-600">
                  Reçu destiné à {ex.label.toLowerCase()}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleView(ex.type)}
                  className="gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Voir
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePrint(ex.type)}
                  className="gap-2"
                >
                  <Printer className="h-4 w-4" />
                  Imprimer
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(ex.type)}
                  disabled={loadingType === ex.type}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  {loadingType === ex.type ? 'Téléchargement...' : 'Télécharger'}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Fermer
          </Button>

          <Button
            onClick={handleDownloadAll}
            disabled={loadingType === 'all'}
            className="bg-orange-500 hover:bg-orange-600 text-white gap-2"
          >
            <Download className="h-4 w-4" />
            {loadingType === 'all' ? 'Téléchargement...' : 'Télécharger tout'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
