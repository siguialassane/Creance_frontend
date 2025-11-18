"use client"

import { useState, useEffect } from "react"
import { ReactNode } from "react"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import Sidebar from "./sidebar"
import Header from "./header"

interface MainLayoutProps {
    children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
    const [isMobile, setIsMobile] = useState<boolean | null>(null)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

    // Détecter la taille d'écran
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 1024)
        }

        checkScreenSize()
        window.addEventListener('resize', checkScreenSize)
        return () => window.removeEventListener('resize', checkScreenSize)
    }, [])

    // Éviter l'erreur d'hydratation en attendant que isMobile soit défini
    if (isMobile === null) {
        return (
            <div className="h-screen flex bg-gray-50">
                {/* Desktop Sidebar par défaut pendant le chargement */}
                <div className="w-72 flex-shrink-0">
                    <Sidebar isCollapsed={false} onToggleCollapse={() => {}} />
                </div>
                <main className="flex-1 flex flex-col overflow-hidden">
                    <Header 
                        onMenuToggle={() => setSidebarOpen(true)}
                        isMobile={false}
                    />
                    <div 
                        className="flex-1 overflow-y-auto bg-white"
                        style={{
                            maxHeight: 'calc(100vh - 80px)',
                            overflowY: 'scroll'
                        }}
                    >
                        {children}
                    </div>
                </main>
            </div>
        )
    }

    return (
        <div className="h-screen flex bg-gray-50">
            {/* Desktop Sidebar */}
            {!isMobile && (
                <div className={`${sidebarCollapsed ? 'w-16' : 'w-72'} flex-shrink-0 transition-all duration-300`}>
                    <Sidebar isCollapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} />
                </div>
            )}

            {/* Mobile Sidebar */}
            {isMobile && (
                <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                    <SheetContent side="left" className="p-0 w-64">
                        <Sidebar onClose={() => setSidebarOpen(false)} />
                    </SheetContent>
                </Sheet>
            )}

            {/* Main Content avec Header */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <Header 
                    onMenuToggle={() => setSidebarOpen(true)}
                    isMobile={isMobile}
                />
                
                {/* Contenu principal */}
                <div 
                    className="flex-1 overflow-y-auto bg-white"
                    style={{
                        maxHeight: 'calc(100vh - 80px)', // Ajustez selon la hauteur du header
                        overflowY: 'scroll'
                    }}
                >
                    {children}
                </div>
            </main>
        </div>
    )
}

export default MainLayout
