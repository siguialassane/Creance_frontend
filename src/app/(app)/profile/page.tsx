"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { User, Mail, Calendar, Shield, Edit, Save, X } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useApiClient } from "@/hooks/useApiClient"

export default function ProfilePage() {
  const { data: session, update } = useSession()
  const apiClient = useApiClient()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: (session as any)?.user?.name || "",
    email: (session as any)?.user?.email || "",
    username: (session as any)?.user?.username || "",
  })

  // Get user initials for avatar fallback
  const getInitials = (username: string) => {
    return username
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const handleEditProfile = () => {
    setFormData({
      name: (session as any)?.user?.name || "",
      email: (session as any)?.user?.email || "",
      username: (session as any)?.user?.username || "",
    })
    setIsEditing(true)
  }

  const handleSaveProfile = async () => {
    setIsLoading(true)
    try {
      // Ici vous pouvez ajouter un appel API pour mettre à jour le profil
      // Pour l'instant, on met juste à jour la session locale
      await update({
        ...session,
        user: {
          ...(session as any)?.user,
          name: formData.name,
          email: formData.email,
          username: formData.username,
        }
      })
      
      toast.success("Profil mis à jour avec succès")
      setIsEditing(false)
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error)
      toast.error("Erreur lors de la mise à jour du profil")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: (session as any)?.user?.name || "",
      email: (session as any)?.user?.email || "",
      username: (session as any)?.user?.username || "",
    })
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
            <p className="text-gray-600 mt-1">Gérez vos informations personnelles</p>
          </div>
          <Button 
            onClick={handleEditProfile} 
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Edit className="mr-2 h-4 w-4" />
            Modifier
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="overflow-hidden shadow-lg">
              <CardHeader className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white text-center pb-8">
                <div className="flex justify-center mb-4">
                  <Avatar className="h-24 w-24 ring-4 ring-white/20">
                    <AvatarImage src="/avatars/default.png" alt="Profil" />
                    <AvatarFallback className="bg-white/20 text-white text-2xl font-bold">
                      {(session as any)?.user?.username ? getInitials((session as any).user.username) : "U"}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-xl">{(session as any)?.user?.username || "Utilisateur"}</CardTitle>
                <CardDescription className="text-emerald-100">
                  {(session as any)?.user?.email || "email@exemple.ci"}
                </CardDescription>
                <Badge variant="secondary" className="mt-2 bg-white/20 text-white border-white/30">
                  <Shield className="mr-1 h-3 w-3" />
                  Actif
                </Badge>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Statut</span>
                    <Badge variant="outline" className="text-emerald-600 border-emerald-600">
                      En ligne
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-sm text-gray-600">Dernière connexion</span>
                    <span className="text-sm text-gray-900">Aujourd'hui</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Details Cards */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5 text-emerald-600" />
                  Informations personnelles
                </CardTitle>
                <CardDescription>
                  Vos informations de base et coordonnées
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-600">Nom complet</Label>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <User className="h-4 w-4 text-gray-400" />
                      <p className="text-sm text-gray-900 font-medium">
                        {(session as any)?.user?.name || "Non renseigné"}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-600">Nom d'utilisateur</Label>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <User className="h-4 w-4 text-gray-400" />
                      <p className="text-sm text-gray-900 font-medium">
                        {(session as any)?.user?.username || "Non renseigné"}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-sm font-medium text-gray-600">Email</Label>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <p className="text-sm text-gray-900 font-medium">
                        {(session as any)?.user?.email || "Non renseigné"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Security */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5 text-emerald-600" />
                  Sécurité du compte
                </CardTitle>
                <CardDescription>
                  Informations de sécurité de votre compte
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">Mot de passe</p>
                      <p className="text-sm text-gray-500">Pour des raisons de sécurité, la modification du mot de passe doit être effectuée par un administrateur</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Dialog de modification */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier mon profil</DialogTitle>
            <DialogDescription>
              Mettez à jour vos informations personnelles
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Votre nom complet"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Nom d'utilisateur</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Votre nom d'utilisateur"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Votre adresse email"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
              <X className="mr-2 h-4 w-4" />
              Annuler
            </Button>
            <Button onClick={handleSaveProfile} disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700">
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Enregistrer
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
