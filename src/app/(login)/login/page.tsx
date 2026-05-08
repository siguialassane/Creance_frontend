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
  // Rediriger directement vers le dashboard (authentification désactivée temporairement)
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      window.location.replace('/overview')
    }
  }, [])
  
  // Afficher un loader pendant la redirection
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
        <p className="mt-4 text-slate-600 font-medium">Redirection vers le dashboard...</p>
      </div>
    </div>
  )
}


