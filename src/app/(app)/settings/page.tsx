"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { menuItems } from "@/lib/configs/menu.data"

export default function SettingsPage() {
  const router = useRouter()

  useEffect(() => {
    // Rediriger vers le premier sous-menu des paramètres
    const settingsMenu = menuItems.find(menu => menu.path === '/settings')
    const firstSubMenu = settingsMenu?.subMenus?.[0]
    
    if (firstSubMenu) {
      router.replace(`/settings/${firstSubMenu.path}`)
    }
  }, [router])

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
        <p className="text-gray-500">Chargement des paramètres...</p>
      </div>
    </div>
  )
}
