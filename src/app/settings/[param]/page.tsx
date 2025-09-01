"use client"

import { useParams } from 'next/navigation'
import { menuItems } from '../../../lib/configs/menu.data'
import SimpleParameterView from '../../../components/parameter-views/simple-parameter-view'
import BanqueView from '../../../components/parameter-views/banque-view'
import CiviliteView from '../../../components/parameter-views/civilite-view'
import CategorieDebiteurView from '../../../components/parameter-views/categorie-debiteur-view'
import Link from 'next/link'

export default function ParameterPage() {
    const params = useParams()
    const paramPath = params.param as string
    
    // Trouver le menu des paramètres
    const settingsMenu = menuItems.find(menu => menu.path === '/settings')
    
    if (!settingsMenu?.subMenus) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <h1>Paramètres non trouvés</h1>
            </div>
        )
    }
    
    // Trouver le sous-menu correspondant en utilisant le nom converti en path
    const subMenu = settingsMenu.subMenus.find((sub: any) => {
        const subPath = sub.name.toLowerCase().replace(/\s+/g, '_').replace(/[éèê]/g, 'e').replace(/[àâ]/g, 'a').replace(/[ùû]/g, 'u').replace(/[ôö]/g, 'o').replace(/[îï]/g, 'i').replace(/[ç]/g, 'c')
        return subPath === paramPath
    })
    
    if (!subMenu) {
        return (
            <div style={{ 
                padding: '2rem', 
                backgroundColor: '#f8fafc', 
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem'
            }}>
                <Link href="/settings" style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#059669',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '0.5rem',
                    fontWeight: '500'
                }}>
                    ← Retour aux paramètres
                </Link>
                <h1 style={{ color: '#ef4444', fontSize: '1.5rem' }}>
                    Paramètre "{paramPath}" non trouvé
                </h1>
            </div>
        )
    }

    // Fonction pour déterminer quelle vue utiliser
    const getParameterView = () => {
        switch (paramPath) {
            case 'banque':
                return <BanqueView />
            case 'civilite':
                return <CiviliteView />
            case 'categorie_de_debiteur':
                return <CategorieDebiteurView />
            case 'classe':
            case 'fonction':
            case 'profession':
            case 'nationalite':
            case 'quartier':
            case 'ville':
            case 'zone':
                return <SimpleParameterView 
                    title={subMenu.name}
                    description={`Gérez les ${subMenu.name.toLowerCase()}`}
                />
            default:
                return <SimpleParameterView 
                    title={subMenu.name}
                    description={`Gérez les ${subMenu.name.toLowerCase()}`}
                />
        }
    }

    return (
        <div>
            {getParameterView()}
        </div>
    )
}
