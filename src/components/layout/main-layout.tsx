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
    const [isMobile, setIsMobile] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(false)

    // Détecter la taille d'écran
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 1024)
        }

        checkScreenSize()
        window.addEventListener('resize', checkScreenSize)
        return () => window.removeEventListener('resize', checkScreenSize)
    }, [])

    return (
        <div className="h-screen flex bg-gray-50">
            {/* Desktop Sidebar */}
            {!isMobile && (
                <div className="w-64 flex-shrink-0">
                    <Sidebar />
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
                <div className="flex-1 bg-white">
                    {children}
                </div>
            </main>
        </div>
    )
}

export default MainLayout
