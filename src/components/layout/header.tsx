"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Menu, User, Settings, LogOut } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface HeaderProps {
  onMenuToggle: () => void
  isMobile: boolean
}

export default function Header({ onMenuToggle, isMobile }: HeaderProps) {

  return (
    <header 
      className="h-16 flex items-center justify-between px-4 lg:px-6 shadow-lg!"
      style={{ 
        background: `#032211` 
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
      <div className="flex items-center gap-4">
        <div className="hidden md:block text-right">
          <p className="text-sm font-medium text-white">Agent Trésor</p>
          <p className="text-xs text-green-200 font-medium">En ligne</p>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-12 w-12 rounded-full hover:bg-green-600/30">
              <Avatar className="h-10 w-10 ring-2 ring-green-300">
                <AvatarImage src="/avatars/default.png" alt="Profil" />
                <AvatarFallback className="bg-green-500 text-white font-semibold">AT</AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-400 border-2 border-green-800 rounded-full"></div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/avatars/default.png" alt="Profil" />
                  <AvatarFallback className="bg-emerald-600 text-white font-semibold">AT</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">Agent Trésor</p>
                  <p className="text-xs text-gray-500">agent.tresor@gouv.ci</p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4 text-emerald-600" /> Mon Profil
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4 text-emerald-600" /> Paramètres
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" /> Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
