"use client"

import { useState, useMemo } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Search, Settings } from "lucide-react"
import { Icon } from "@iconify/react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { menuItems } from "@/lib/configs/menu.data"
import { cn } from "@/lib/utils"
import colors from "@/lib/theme/colors"

interface SettingsLayoutProps {
  children: React.ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [searchTerm, setSearchTerm] = useState("")

  // Récupérer tous les sous-menus de paramètres
  const settingsMenu = menuItems.find(menu => menu.path === '/settings')
  const settingsSubMenus = settingsMenu?.subMenus || []

  // Filtrer les sous-menus selon la recherche
  const filteredSubMenus = useMemo(() => {
    if (!searchTerm.trim()) return settingsSubMenus
    
    return settingsSubMenus.filter(subMenu =>
      subMenu.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [settingsSubMenus, searchTerm])

  // Déterminer le sous-menu actif
  const activeSubMenu = settingsSubMenus.find(subMenu => {
    const subMenuPath = `/settings/${subMenu.path}`
    return pathname === subMenuPath
  })

  const handleSubMenuClick = (subMenu: any) => {
    router.push(`/settings/${subMenu.path}`)
  }

  return (
    <div className="h-screen flex bg-gray-50 border border-[black]!">
      {/* Sidebar des paramètres */}
      <div className="w-80 flex flex-col" style={{ backgroundColor: '#1d6b1b' }}>
        {/* En-tête */}
        <div className="p-6 border-b border-emerald-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-emerald-700 rounded-xl">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">Paramètres</h1>
              <p className="text-sm text-emerald-100">Paramétrage de l'application</p>
            </div>
          </div>
          
          {/* Barre de recherche */}
          <div className="relative">
            {/* <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" /> */}
            <Input
              type="text"
              placeholder="Rechercher un paramètre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 bg-white border rounded-none"
              style={{
                border: '1px solid #000',
                padding: '0px 8px',
                borderRadius: '6px',
              }}
            />
          </div>
        </div>

        {/* Liste scrollable - CORRECTION ICI */}
        <div className="flex-1 min-h-0">
          <div 
            className="h-full overflow-y-auto p-4"
            style={{
              maxHeight: 'calc(100vh - 280px)',
              overflowY: 'scroll'
            }}
          >
            <div className="space-y-2">
              
              {filteredSubMenus.length > 0 ?
               (
                
                filteredSubMenus.map((subMenu, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    onClick={() => handleSubMenuClick(subMenu)}
                    className={cn(
                      "w-full justify-start h-12 px-4 text-left rounded-lg transition-all duration-200 cursor-pointer",
                      activeSubMenu?.id === subMenu.id ? "text-white! font-bold bg-emerald-700!" : "text-emerald-100",
                      "hover:bg-emerald-700 hover:text-white"
                    )}
                  >
                    <div className="flex items-center gap-3 w-full cursor-pointer">
                      <Icon icon={"mdi:chevron-right"} 
                        width={20}
                        height={20}
                        color={activeSubMenu?.id === subMenu.id ? "#ffffff" : "#a7f3d0"}
                        className="transition-colors"
                      />
                      <span className="text-sm flex-1 truncate">{subMenu.name}</span>
                    </div>
                  </Button>
                ))
              ) : (
                <div className="text-center py-8 text-emerald-100">
                  <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Aucun paramètre trouvé</p>
                  <p className="text-xs text-emerald-200 mt-1">
                    Essayez avec d'autres termes
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-emerald-700" style={{ backgroundColor: '#1d6b1b' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-300 rounded-full"></div>
              <span className="text-xs font-medium text-emerald-100">
                {filteredSubMenus.length} paramètre{filteredSubMenus.length > 1 ? 's' : ''}
              </span>
            </div>
            {searchTerm && (
              <span className="text-xs text-white bg-emerald-700 px-2 py-1 rounded-full">
                {filteredSubMenus.length}/{settingsSubMenus.length}
              </span>
            )}
          </div>
          {activeSubMenu && (
            <div className="mt-2 pt-2 border-t border-emerald-700">
              <p className="text-xs text-white font-medium truncate">
                📍 {activeSubMenu.name}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto bg-white">
          {children}
        </div>
      </div>
    </div>
  )
}
