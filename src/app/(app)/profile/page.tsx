"use client"

import { useSession } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { User, Mail, Calendar, Shield, Settings, Edit } from "lucide-react"
import { useRouter } from "next/navigation"
import { useBanques } from "@/hooks/useBanques"

export default function ProfilePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { data: banques, isLoading, error } = useBanques()

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
    // TODO: Implement edit profile functionality
    console.log("Edit profile clicked")
  }

  const handleChangePassword = () => {
    // TODO: Implement change password functionality
    console.log("Change password clicked")
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
            <p className="text-gray-600 mt-1">Gérez vos informations personnelles et paramètres de compte</p>
          </div>
          <Button onClick={handleEditProfile} className="bg-emerald-600 hover:bg-emerald-700">
            <Edit className="mr-2 h-4 w-4" />
            Modifier
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="overflow-hidden">
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
                    <span className="text-sm text-gray-600">Session ID</span>
                    <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                      {(session as any)?.user?.sessionId || "N/A"}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Statut</span>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      En ligne
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Details Cards */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5 text-emerald-600" />
                  Informations personnelles
                </CardTitle>
                <CardDescription>
                  Vos informations de base et coordonnées
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Nom complet</label>
                    <p className="text-sm text-gray-900 mt-1">{(session as any)?.user?.name || "Non renseigné"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Nom d'utilisateur</label>
                    <p className="text-sm text-gray-900 mt-1">{(session as any)?.user?.username || "Non renseigné"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-sm text-gray-900 mt-1">{(session as any)?.user?.email || "Non renseigné"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">ID utilisateur</label>
                    <p className="text-sm text-gray-900 mt-1 font-mono">{(session as any)?.user?.id || "N/A"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5 text-emerald-600" />
                  Sécurité du compte
                </CardTitle>
                <CardDescription>
                  Gérez la sécurité de votre compte et vos mots de passe
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center">
                    <Mail className="mr-3 h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium">Mot de passe</p>
                      {/* <p className="text-sm text-gray-600">Dernière modification il y a 30 jours</p> */}
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleChangePassword}>
                    Modifier
                  </Button>
                </div>
                {/* <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center">
                    <Calendar className="mr-3 h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium">Session active</p>
                      <p className="text-sm text-gray-600">Connecté depuis aujourd'hui</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Actif
                  </Badge>
                </div> */}
              </CardContent>
            </Card>

            {/* System Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5 text-emerald-600" />
                  Informations système
                </CardTitle>
                <CardDescription>
                  Détails techniques de votre session
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Session ID</label>
                    <p className="text-sm text-gray-900 mt-1 font-mono break-all">
                      {(session as any)?.user?.sessionId || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Type de session</label>
                    <p className="text-sm text-gray-900 mt-1">JWT</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Dernière connexion</label>
                    <p className="text-sm text-gray-900 mt-1">Aujourd'hui</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Statut</label>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      Authentifié
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Test API */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Test API</CardTitle>
                <CardDescription>
                  Test de l'authentification avec l'API des banques
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <p className="text-sm font-medium mb-2">Statut de l'API :</p>
                  {isLoading && <p className="text-blue-600">🔄 Chargement...</p>}
                  {error && <p className="text-red-600">❌ Erreur: {error.message}</p>}
                  {banques && <p className="text-green-600">✅ API accessible - {banques.length} banques trouvées</p>}
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm font-medium mb-2">Token d'authentification :</p>
                  <p className="text-xs font-mono break-all bg-gray-100 p-2 rounded">
                    {(session as any)?.accessToken ? 
                      `Bearer ${(session as any).accessToken.substring(0, 50)}...` : 
                      'Aucun token trouvé'
                    }
                  </p>
                  <div className="mt-2 text-xs text-gray-500">
                    <p>Session complète : {JSON.stringify(session, null, 2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
