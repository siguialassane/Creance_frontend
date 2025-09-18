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
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

const schema = z.object({
  username: z.string().min(2, { message: "Nom d'utilisateur invalide" }),
  password: z.string().min(4, { message: "Mot de passe trop court" }),
  remember: z.boolean().optional(),
})

export default function LoginPage() {
  const router = useRouter()
  const [isChecking, setIsChecking] = React.useState(true)
  const [isAuthenticated, setIsAuthenticated] = React.useState(false)
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { username: "", password: "", remember: false },
  })

  // Vérifier la session au chargement
  React.useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await getSession()
        if (session?.user?.sessionId) {
          setIsAuthenticated(true)
          router.push("/overview")
        }
      } catch (error) {
        console.error("Error checking session:", error)
      } finally {
        setIsChecking(false)
      }
    }
    
    checkSession()
  }, [router])

  // Afficher un loader pendant la vérification de la session
  if (isChecking) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Vérification de la session...</p>
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
    const result = await signIn("credentials", {
      redirect: false,
      username: values.username,
      password: values.password,
    })
    const session = await getSession()
    const hasSession = Boolean((session as any)?.user?.sessionId)
    if (result && !result.error && hasSession) {
      toast.success("Connexion réussie", { id: pending })
      router.push("/overview")
      return
    }

    const message = result?.error || "Identifiants invalides"
    form.setError("password", { message })
    toast.error(message, { id: pending })
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* Left: form */}
        <div className="p-8 lg:p-12">
          <div className="mb-8">
            <div className="flex items-center gap-2">
              <img src="/assets/logo.png" alt="logo" className="h-16 w-16" />
              {/* <span className="text-xl font-semibold text-emerald-700">Appli-Trésor</span> */}
            </div>
            <h1 className="mt-6 text-2xl font-bold text-gray-900">Connexion</h1>
            <p className="text-gray-600 text-sm">Bienvenue ! Veuillez vous connecter pour continuer.</p>
          </div>



          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom d'utilisateur</FormLabel>
                    <FormControl>
                      <Input placeholder="nom.utilisateur" type="text" className="h-11" {...field} />
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
                    <FormLabel>Mot de passe</FormLabel>
                    <FormControl>
                      <Input placeholder="********" type="password" className="h-11" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center justify-end">
                
                <button type="button" className="text-xs text-emerald-700">Mot de passe oublié ? Contactez l'administrateur</button>
              </div>
              <Button type="submit" className="cursor-pointer w-full h-11 bg-emerald-600 hover:bg-emerald-700" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Se connecter
              </Button>
              <div className="text-xs text-gray-600 text-center">Pas de compte ? <span className="text-emerald-700 cursor-pointer">Contactez l'administrateur</span></div>
            </form>
          </Form>
        </div>

        {/* Right: illustration */}
        <div className="hidden lg:flex items-center justify-center bg-emerald-600 relative"
      
        >
          <img src="/home.png" alt="home" className="h-full w-full object-contain" />
         
        </div>
      </div>
    </div>
  )
}


