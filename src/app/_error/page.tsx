"use client"

import { Button } from "@/components/ui/button"
import { AlertTriangle, Home, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function ErrorPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Une erreur s'est produite
          </h1>
          <p className="text-gray-600">
            Désolé, une erreur inattendue s'est produite. Veuillez réessayer.
          </p>
        </div>
        
        <div className="space-y-3">
          <Button 
            onClick={() => window.location.reload()} 
            className="w-full bg-emerald-600 hover:bg-emerald-700"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Réessayer
          </Button>
          
          <Link href="/">
            <Button variant="outline" className="w-full">
              <Home className="mr-2 h-4 w-4" />
              Retour à l'accueil
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

