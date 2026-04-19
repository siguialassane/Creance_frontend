"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { signIn, getSession } from "next-auth/react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Loader2, Eye, EyeOff, Shield, UserPlus, KeyRound } from "lucide-react"
import Image from "next/image"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const schema = z.object({
  username: z.string().min(2, { message: "Nom d'utilisateur invalide" }),
  password: z.string().min(1, { message: "Mot de passe requis" }),
})

export default function LoginPage() {
  const router = useRouter()
  const [isChecking, setIsChecking] = React.useState(true)
  const [isAuthenticated, setIsAuthenticated] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)
  const [isAdminModalOpen, setIsAdminModalOpen] = React.useState(false)
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { username: "", password: "" },
  })

  // Vérifier la session au chargement
  // Ajouter un petit délai pour éviter les sessions "fantômes" après déconnexion
  React.useEffect(() => {
    const checkSession = async () => {
      try {
        // Attendre un peu pour que la déconnexion se termine complètement
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Vérifier si on vient d'une déconnexion (query param)
        const isFromSignOut = typeof window !== 'undefined' && 
          new URLSearchParams(window.location.search).has('signout');
        
        if (isFromSignOut) {
          // Ignorer la session et permettre l'affichage du formulaire
          // Ne pas vérifier getSession() car il peut encore retourner une session en cache
          setIsChecking(false);
          return;
        }
        
        const session = await getSession()
        
        // Vérifier que la session est vraiment valide (pas juste un cache)
        if (session?.user?.sessionId) {
          // Double vérification : s'assurer que ce n'est pas une session "fantôme"
          // Si on a été redirigé vers login, c'est probablement après une déconnexion
          const wasRedirectedToLogin = typeof window !== 'undefined' && 
            document.referrer && 
            !document.referrer.includes('/login');
          
          if (!wasRedirectedToLogin) {
            setIsAuthenticated(true)
            router.push("/overview")
          } else {
            // Probablement une session fantôme après déconnexion
            setIsChecking(false);
          }
        } else {
          setIsChecking(false)
        }
      } catch (error) {
        console.error("Error checking session:", error)
        setIsChecking(false)
      }
    }
    
    checkSession()
  }, [router])

  // Afficher un loader pendant la vérification de la session
  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-slate-600 font-medium">Vérification de la session...</p>
        </div>
      </div>
    )
  }

  // Ne pas afficher le formulaire si déjà connecté
  if (isAuthenticated) {
    return null
  }

  async function onSubmit(values: z.infer<typeof schema>) {
    const pending = toast.loading("Connexion en cours...")
    
    try {
      const result = await signIn("credentials", {
        redirect: false,
        username: values.username,
        password: values.password,
      })
      
      if (result?.error) {
        // Gérer les erreurs spécifiques
        let errorMessage = "Identifiants invalides"
        console.log("🚨 Erreur de connexion:", result)
        if (result.error.includes("ORA-01017") || result.error.includes("invalid username/password")) {
          errorMessage = "Nom d'utilisateur ou mot de passe incorrect"
        } else if (result.error.includes("INVALID_CREDENTIALS") || result.error.includes("CredentialsSignin") || result.error.includes("Configuration")) {
          errorMessage = "Nom d'utilisateur ou mot de passe incorrect"
        } else if (result.error.includes("INVALID_RESPONSE")) {
          errorMessage = "Erreur de configuration du serveur"
        } else if (result.error.includes("Configuration")) {
          errorMessage = "Erreur de configuration du serveur"
        } else {
          // Utiliser le message d'erreur original s'il est compréhensible
          errorMessage = result.error
        }
        
        form.setError("password", { message: errorMessage })
        toast.error(errorMessage, { id: pending })
        return
      }
      
      // Vérifier la session après connexion réussie
      const session = await getSession()
      const hasSession = Boolean(session?.user && 'sessionId' in session.user && session.user.sessionId)
      
      if (hasSession) {
        toast.success("Connexion réussie", { id: pending })
        router.push("/overview")
      } else {
        form.setError("password", { message: "Erreur de session" })
        toast.error("Erreur de session", { id: pending })
      }
    } catch (error) {
      console.error("Erreur de connexion:", error)
      const errorMessage = "Erreur de connexion au serveur"
      form.setError("password", { message: errorMessage })
      toast.error(errorMessage, { id: pending })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-7xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
        {/* Left: Formulaire de connexion */}
        <div className="p-8 lg:p-16 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            {/* Header */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-100 rounded-xl">
                  <Image src="/assets/logo.png" alt="logo" width={40} height={40} className="h-10 w-10" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Appli ACCC</h1>
                  <p className="text-sm text-slate-500">Gestion des créances</p>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Connexion</h2>
              <p className="text-slate-600">Accédez à votre espace de gestion</p>
            </div>

            {/* Formulaire */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-slate-700">Nom d&apos;utilisateur</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="nom.utilisateur" 
                          type="text" 
                          className="h-12 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl transition-all duration-200" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-slate-700">Mot de passe</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            placeholder="••••••••" 
                            type={showPassword ? "text" : "password"} 
                            className="h-12 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl pr-12 transition-all duration-200" 
                            {...field} 
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-end">
                  <Dialog open={isAdminModalOpen} onOpenChange={setIsAdminModalOpen}>
                    <DialogTrigger asChild>
                      <button 
                        type="button" 
                        className="cursor-pointer text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors flex items-center gap-1"
                      >
                        <KeyRound className="h-4 w-4" />
                        Mot de passe oublié ?
                      </button>
                    </DialogTrigger>
                  </Dialog>
                </div>

                <Button 
                  type="submit" 
                  className="cursor-pointer w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/25" 
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Connexion en cours...
                    </>
                  ) : (
                    "Se connecter"
                  )}
                </Button>

                <div className="text-center">
                  <p className="text-sm text-slate-500">
                    Pas de compte ? 
                    <Dialog open={isAdminModalOpen} onOpenChange={setIsAdminModalOpen}>
                      <DialogTrigger asChild>
                        <span className="text-emerald-600 hover:text-emerald-700 cursor-pointer font-medium ml-1 transition-colors flex items-center gap-1 justify-center">
                          <UserPlus className="h-4 w-4" />
                          Contactez l&apos;administrateur
                        </span>
                      </DialogTrigger>
                    </Dialog>
                  </p>
                </div>
              </form>
            </Form>
          </div>
        </div>

        {/* Right: Section visuelle */}
        <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 relative overflow-hidden">
          {/* Éléments décoratifs */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
          <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white/5 rounded-full"></div>
          
          {/* Contenu principal */}
          <div className="relative z-10 text-center text-white px-12">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-2xl mb-6">
                <Shield className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-bold mb-4">Sécurité & Performance</h3>
              <p className="text-emerald-100 text-lg leading-relaxed">
                Gestion des créances contentieuses en toute sécurité et simplicité.
              </p>
            </div>

            {/* Fonctionnalités */}
            {/* <div className="space-y-4">
              <div className="flex items-center gap-3 text-emerald-100">
                <div className="w-2 h-2 bg-emerald-200 rounded-full"></div>
                <span className="text-sm">Interface moderne et responsive</span>
              </div>
              <div className="flex items-center gap-3 text-emerald-100">
                <div className="w-2 h-2 bg-emerald-200 rounded-full"></div>
                <span className="text-sm">Données chiffrées et sécurisées</span>
              </div>
              <div className="flex items-center gap-3 text-emerald-100">
                <div className="w-2 h-2 bg-emerald-200 rounded-full"></div>
                <span className="text-sm">Rapports détaillés en temps réel</span>
              </div>
            </div> */}
          </div>

          {/* Image de fond */}
          <div className="absolute inset-0 opacity-10">
            <Image 
              src="/home.png" 
              alt="Illustration" 
              fill
              className="object-cover" 
            />
          </div>
        </div>
      </div>

      {/* Modal d'information administrateur */}
      <Dialog open={isAdminModalOpen} onOpenChange={setIsAdminModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-100 rounded-xl">
                <Shield className="h-6 w-6 text-emerald-600" />
              </div>
              <DialogTitle className="text-xl font-semibold text-slate-900">
                Contactez l&apos;administrateur
              </DialogTitle>
            </div>
            <DialogDescription className="text-slate-600 text-base">
              Pour des raisons de sécurité, la gestion des comptes utilisateurs est centralisée.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="bg-slate-50 rounded-xl p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-1 bg-emerald-100 rounded-lg">
                  <UserPlus className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm">Création de compte</h4>
                  <p className="text-slate-600 text-sm">
                    Pour obtenir un accès à l&apos;application, contactez votre administrateur système.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="p-1 bg-emerald-100 rounded-lg">
                  <KeyRound className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm">Mot de passe oublié</h4>
                  <p className="text-slate-600 text-sm">
                    En cas d&apos;oubli de mot de passe, l&apos;administrateur peut le réinitialiser.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-emerald-800 text-sm font-medium">
                  Cette approche garantit la sécurité et l&apos;intégrité des données de votre organisation.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              onClick={() => setIsAdminModalOpen(false)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6"
            >
              Compris
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}


