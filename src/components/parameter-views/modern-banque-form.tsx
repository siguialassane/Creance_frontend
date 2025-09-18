"use client"

import { useState, useEffect } from 'react'
import { Banque } from '@/types/banque'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { X, Building2 } from 'lucide-react'

interface ModernBanqueFormProps {
  banque?: Banque | null
  onSubmit: (data: any) => void
  onClose: () => void
  isLoading?: boolean
}

export default function ModernBanqueForm({ 
  banque, 
  onSubmit, 
  onClose, 
  isLoading = false 
}: ModernBanqueFormProps) {
  const [formData, setFormData] = useState({
    BQ_LIB: '',
    BQ_RESPONS: '',
    BQ_ADRESS: '',
    BQ_CONTACT: '',
    BQ_LIBLONG: '',
    BQ_SIGLE: '',
    BQ_AUTLIB: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (banque) {
      setFormData({
        BQ_LIB: banque.BQ_LIB || '',
        BQ_RESPONS: banque.BQ_RESPONS || '',
        BQ_ADRESS: banque.BQ_ADRESS || '',
        BQ_CONTACT: banque.BQ_CONTACT || '',
        BQ_LIBLONG: banque.BQ_LIBLONG || '',
        BQ_SIGLE: banque.BQ_SIGLE || '',
        BQ_AUTLIB: banque.BQ_AUTLIB || ''
      })
    }
  }, [banque])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.BQ_LIB.trim()) {
      newErrors.BQ_LIB = 'Le nom de la banque est requis'
    }

    if (formData.BQ_LIB && formData.BQ_LIB.length < 2) {
      newErrors.BQ_LIB = 'Le nom de la banque doit contenir au moins 2 caractères'
    }

    if (formData.BQ_CONTACT && !/^[\d\s\-\+\(\)]+$/.test(formData.BQ_CONTACT)) {
      newErrors.BQ_CONTACT = 'Format de contact invalide'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-emerald-600" />
            {banque ? 'Modifier la banque' : 'Ajouter une nouvelle banque'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nom de la banque */}
            <div className="space-y-2">
              <Label htmlFor="BQ_LIB" className="text-sm font-medium">
                Nom de la banque *
              </Label>
              <Input
                id="BQ_LIB"
                value={formData.BQ_LIB}
                onChange={(e) => handleChange('BQ_LIB', e.target.value)}
                placeholder="Ex: Banque Atlantique"
                className={errors.BQ_LIB ? 'border-red-500' : ''}
              />
              {errors.BQ_LIB && (
                <p className="text-sm text-red-500">{errors.BQ_LIB}</p>
              )}
            </div>

            {/* Sigle */}
            <div className="space-y-2">
              <Label htmlFor="BQ_SIGLE" className="text-sm font-medium">
                Sigle
              </Label>
              <Input
                id="BQ_SIGLE"
                value={formData.BQ_SIGLE}
                onChange={(e) => handleChange('BQ_SIGLE', e.target.value)}
                placeholder="Ex: BA"
                className="uppercase"
              />
            </div>

            {/* Responsable */}
            <div className="space-y-2">
              <Label htmlFor="BQ_RESPONS" className="text-sm font-medium">
                Responsable
              </Label>
              <Input
                id="BQ_RESPONS"
                value={formData.BQ_RESPONS}
                onChange={(e) => handleChange('BQ_RESPONS', e.target.value)}
                placeholder="Ex: M. Koné"
              />
            </div>

            {/* Contact */}
            <div className="space-y-2">
              <Label htmlFor="BQ_CONTACT" className="text-sm font-medium">
                Contact
              </Label>
              <Input
                id="BQ_CONTACT"
                value={formData.BQ_CONTACT}
                onChange={(e) => handleChange('BQ_CONTACT', e.target.value)}
                placeholder="Ex: +225 20 30 40 50"
                className={errors.BQ_CONTACT ? 'border-red-500' : ''}
              />
              {errors.BQ_CONTACT && (
                <p className="text-sm text-red-500">{errors.BQ_CONTACT}</p>
              )}
            </div>
          </div>

          {/* Adresse */}
          <div className="space-y-2">
            <Label htmlFor="BQ_ADRESS" className="text-sm font-medium">
              Adresse
            </Label>
            <Textarea
              id="BQ_ADRESS"
              value={formData.BQ_ADRESS}
              onChange={(e) => handleChange('BQ_ADRESS', e.target.value)}
              placeholder="Ex: 01 BP 6928 Abidjan 01"
              rows={3}
            />
          </div>

          {/* Libellé long */}
          <div className="space-y-2">
            <Label htmlFor="BQ_LIBLONG" className="text-sm font-medium">
              Libellé long
            </Label>
            <Input
              id="BQ_LIBLONG"
              value={formData.BQ_LIBLONG}
              onChange={(e) => handleChange('BQ_LIBLONG', e.target.value)}
              placeholder="Ex: Banque Atlantique Côte d'Ivoire"
            />
          </div>

          {/* Autre libellé */}
          <div className="space-y-2">
            <Label htmlFor="BQ_AUTLIB" className="text-sm font-medium">
              Autre libellé
            </Label>
            <Input
              id="BQ_AUTLIB"
              value={formData.BQ_AUTLIB}
              onChange={(e) => handleChange('BQ_AUTLIB', e.target.value)}
              placeholder="Ex: l'AFRILANG FIRST BANK"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {banque ? 'Modification...' : 'Création...'}
                </>
              ) : (
                banque ? 'Modifier' : 'Créer'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

