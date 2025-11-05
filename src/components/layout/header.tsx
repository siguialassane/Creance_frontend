"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Menu, User, Settings, LogOut } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { handleSignOut } from "@/lib/auth-helpers"

interface HeaderProps {
  onMenuToggle: () => void
  isMobile: boolean
}

export default function Header({ onMenuToggle, isMobile }: HeaderProps) {
  const { data: session } = useSession()
  const router = useRouter()

  const onSignOutClick = async () => {
    await handleSignOut("/login")
  }

  const handleProfile = () => {
    router.push("/profile")
  }

  const handleSettings = () => {
    router.push("/settings")
  }

  // Get user initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <header 
      className="h-16 flex items-center  bg-white justify-between px-4 lg:px-6"
      style={{ 
        boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)',
        borderBottom: '1px solid #E2E8F0',
      }}
    >
      {/* Menu burger pour mobile */}
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuToggle}
          className="lg:hidden hover:bg-green-600/30 text-white"
        >
          <Menu className="h-6 w-6" />
        </Button>
      )}

      {/* Logo/Titre - Masqué sur desktop car déjà dans sidebar */}
      <div className="flex items-center gap-3 lg:hidden">
        <img 
          src="/assets/logo.png" 
          alt="Logo" 
          className="h-8 w-8 object-contain"
        />
        <h1 className="text-xl font-semibold text-white hidden sm:block">
          Appli-Trésor
        </h1>
      </div>

      {/* Spacer pour desktop */}
      <div className="hidden lg:block flex-1"></div>

      {/* Profil utilisateur */}
      <div className="flex items-center gap-3">
        <div className="hidden md:block text-right">
          <p className="text-sm font-semibold text-gray-900">
            {(session as any)?.user?.username || "Utilisateur"}
          </p>
          <p className="text-xs text-emerald-600 font-medium">En ligne</p>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-12 w-12 rounded-full hover:bg-gray-100 p-0">
              <Avatar className="h-11 w-11 ring-2 ring-emerald-200">
                <AvatarImage src="/avatars/default.png" alt="Profil" />
                <AvatarFallback className="bg-emerald-600 text-white font-semibold text-sm">
                  {(session as any)?.user?.username ? getInitials((session as any).user.username) : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0 h-3.5 w-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuLabel className="px-4 py-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="/avatars/default.png" alt="Profil" />
                  <AvatarFallback className="bg-emerald-600 text-white font-semibold">
                    {(session as any)?.user?.username ? getInitials((session as any).user.username) : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{(session as any)?.user?.username || "Utilisateur"}</p>
                  <p className="text-xs text-gray-500 truncate">{(session as any)?.user?.email || ""}</p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={handleProfile}>
              <User className="mr-2 h-4 w-4 text-emerald-600" /> Mon Profil
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={handleSettings}>
              <Settings className="mr-2 h-4 w-4 text-emerald-600" /> Paramètres
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={onSignOutClick}>
              <LogOut className="mr-2 h-4 w-4" /> Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
