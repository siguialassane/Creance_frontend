"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"

const schema = z.object({
  email: z.string().email({ message: "Email invalide" }),
  password: z.string().min(4, { message: "Mot de passe trop court" }),
  remember: z.boolean().optional(),
})

export default function LoginPage() {
  const router = useRouter()
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", remember: false },
  })

  function onSubmit(values: z.infer<typeof schema>) {
    // Pour l'instant: aucune vérification; si rempli -> redirect
    router.push("/overview")
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* Left: form */}
        <div className="p-8 lg:p-12">
          <div className="mb-8">
            <div className="flex items-center gap-2">
              <img src="/assets/logo.png" alt="logo" className="h-8 w-8" />
              <span className="text-xl font-semibold text-emerald-700">Appli-Trésor</span>
            </div>
            <h1 className="mt-6 text-2xl font-bold text-gray-900">Connexion</h1>
            <p className="text-gray-600 text-sm">Bienvenue ! Veuillez vous connecter pour continuer.</p>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-10">Google</Button>
              <Button variant="outline" className="h-10">Facebook</Button>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Separator className="flex-1" />
              <span>ou via email</span>
              <Separator className="flex-1" />
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email@exemple.ci" type="email" className="h-11" {...field} />
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
              <div className="flex items-center justify-between">
                <FormField
                  control={form.control}
                  name="remember"
                  render={({ field }) => (
                    <div className="flex items-center gap-2">
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} id="remember" />
                      <label htmlFor="remember" className="text-sm text-gray-700">Se souvenir de moi</label>
                    </div>
                  )}
                />
                <button type="button" className="text-xs text-emerald-700">Mot de passe oublié ?</button>
              </div>
              <Button type="submit" className="w-full h-11 bg-emerald-600 hover:bg-emerald-700">Se connecter</Button>
              <div className="text-xs text-gray-600 text-center">Pas de compte ? <span className="text-emerald-700 cursor-pointer">Créer un compte</span></div>
            </form>
          </Form>
        </div>

        {/* Right: illustration */}
        <div className="hidden lg:flex items-center justify-center bg-emerald-600 relative">
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.12) 0%, transparent 60%)' }} />
          <div className="relative z-10 text-white max-w-md text-center px-8">
            <h2 className="text-xl font-semibold mb-2">Connectez-vous à toutes vos applications</h2>
            <p className="text-sm opacity-90">Un tableau de bord personnalisable et simple pour votre institution.</p>
          </div>
        </div>
      </div>
    </div>
  )
}


