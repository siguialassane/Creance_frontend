"use client"

import { useParams } from 'next/navigation'
import { menuItems } from '../../../../lib/configs/menu.data'
import Link from 'next/link'
import ParameterView from '../../../../components/parameter-views/parameter-view'
import ApiParameterView from '../../../../components/parameter-views/api-parameter-view'
import { COLUMN_CONFIGS } from '@/lib/column'
import type { MenuItem, SubMenuItem, ParameterColumnType } from '@/lib/types/menu'

export default function ParameterPage() {
    const params = useParams()
    const paramPath = params.param as string
    
    // Trouver le menu des paramètres
    const settingsMenu = menuItems.find((menu: MenuItem) => menu.path === '/settings') as MenuItem | undefined
    
    if (!settingsMenu?.subMenus) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <h1>Paramètres non trouvés</h1>
            </div>
        )
    }
    
    // Trouver le sous-menu correspondant en utilisant le nom converti en path
    const subMenu = settingsMenu.subMenus.find((sub: SubMenuItem) => {
        const subPath = sub.name
            .toLowerCase()
            .replace(/\s+/g, '_')
            .replace(/[éèêë]/g, 'e')
            .replace(/[àâä]/g, 'a')
            .replace(/[ùûü]/g, 'u')
            .replace(/[ôö]/g, 'o')
            .replace(/[îï]/g, 'i')
            .replace(/[ç]/g, 'c')
            .replace(/[’']/g, '')
        return subPath === paramPath
    }) as SubMenuItem | undefined
    
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
                    backgroundColor: '#28A325',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '0.5rem',
                    fontWeight: '500'
                }}>
                    ← Retour aux paramètres
                </Link>
                <h1 style={{ color: '#ef4444', fontSize: '1.5rem' }}>
                    Paramètre &quot;{paramPath}&quot; non trouvé
                </h1>
            </div>
        )
    }

    // Préparer les colonnes définies dans le menu (avec fallback par défaut)
    const rawColumns: ParameterColumnType[] = (subMenu.columns || [
        { key: 'code', label: 'Code' },
        { key: 'libelle', label: 'Libellé' },
    ]) as ParameterColumnType[]

    const typedColumns = (key: keyof typeof COLUMN_CONFIGS | undefined) => key ? COLUMN_CONFIGS[key] : rawColumns


    // Fonction pour déterminer quelle vue utiliser
    const getParameterView = () => {
        
        switch (paramPath) {
            case 'agence_de_banque':
                return <ParameterView 
                key={subMenu.name}
                title={subMenu.name} 
                description={`Gestion des ${subMenu.name.toLowerCase()}`} 
                columns={COLUMN_CONFIGS['agence_de_banque']}
                type="agence_de_banque" />
            case 'banque':
                return <ParameterView 
                key={subMenu.name}
                title={subMenu.name} 
                description={`Gestion des ${subMenu.name.toLowerCase()}`} 
                columns={COLUMN_CONFIGS['banque']}
                type="banque"
                />
            case 'civilite':
                return <ApiParameterView 
                    key={subMenu.name}
                    title={subMenu.name} 
                    description={`Gestion des ${subMenu.name.toLowerCase()}`} 
                    paramType="civilite"
                />
            case 'categorie_de_debiteur':
                return <ParameterView title={subMenu.name} 
                description={`Gestion des ${subMenu.name.toLowerCase()}`} 
                columns={COLUMN_CONFIGS['categorie_debiteur']}
                type="categorie_debiteur" />
            case 'classe':
                return <ParameterView title={subMenu.name} 
                description={`Gestion des ${subMenu.name.toLowerCase()}`} 
                columns={COLUMN_CONFIGS['classe']}
                type="classe" />
            case 'fonction':
                return <ParameterView title={subMenu.name} 
                description={`Gestion des ${subMenu.name.toLowerCase()}`} 
                columns={COLUMN_CONFIGS['fonction']}
                type="fonction" />
            case 'nationalite':
                return <ParameterView title={subMenu.name} 
                description={`Gestion des ${subMenu.name.toLowerCase()}`} 
                columns={COLUMN_CONFIGS['nationalite']}
                type="nationalite" />
            case 'profession':
                return <ParameterView title={subMenu.name} 
                description={`Gestion des ${subMenu.name.toLowerCase()}`} 
                columns={COLUMN_CONFIGS['profession']}
                type="profession" />
            case 'quartier':
                return <ParameterView title={subMenu.name} 
                description={`Gestion des ${subMenu.name.toLowerCase()}`} 
                columns={COLUMN_CONFIGS['quartier']}
                type="quartier" />
            case 'ville':
                return <ParameterView title={subMenu.name} 
                description={`Gestion des ${subMenu.name.toLowerCase()}`} 
                columns={COLUMN_CONFIGS['ville']}
                type="ville" />
            case 'zone':
                return <ParameterView title={subMenu.name} 
                description={`Gestion des ${subMenu.name.toLowerCase()}`} 
                columns={COLUMN_CONFIGS['zone']}
                type="zone" />
            case 'statut_creance':
                return <ParameterView 
                    title={subMenu.name}
                    description={`Gestion des ${subMenu.name.toLowerCase()}`}
                    columns={COLUMN_CONFIGS['statut_creance']}
                    type="statut_creance" />
            case 'statut_salarie':
                return <ParameterView 
                    title={subMenu.name}
                    description={`Gestion des ${subMenu.name.toLowerCase()}`}
                    columns={COLUMN_CONFIGS['statut_salarie']}
                    type="statut_salarie" />
            case 'type_acte':
                return <ParameterView 
                    title={subMenu.name}
                    description={`Gestion des ${subMenu.name.toLowerCase()}`}
                    columns={COLUMN_CONFIGS['type_acte']}
                    type="type_acte" />
            case 'type_auxiliaire':
                return <ParameterView 
                    title={subMenu.name}
                    description={`Gestion des ${subMenu.name.toLowerCase()}`}
                    columns={COLUMN_CONFIGS['type_auxiliaire']}
                    type="type_auxiliaire" />
            case 'type_operation':
                return <ParameterView 
                    title={subMenu.name}
                    description={`Gestion des ${subMenu.name.toLowerCase()}`}
                    columns={COLUMN_CONFIGS['type_operation']}
                    type="type_operation" />
            case 'type_ovp':
                return <ParameterView 
                    title={subMenu.name}
                    description={`Gestion des ${subMenu.name.toLowerCase()}`}
                    columns={typedColumns(undefined)}
                    type="type_ovp" />
            case 'type_piece':
                return <ParameterView 
                    title={subMenu.name}
                    description={`Gestion des ${subMenu.name.toLowerCase()}`}
                    columns={typedColumns(undefined)}
                    type="type_piece" />
            case 'type_regularisation':
                return <ParameterView 
                    title={subMenu.name}
                    description={`Gestion des ${subMenu.name.toLowerCase()}`}
                    columns={typedColumns(undefined)}
                    type="type_regularisation" />
            case 'type_saisie':
                return <ParameterView 
                    title={subMenu.name}
                    description={`Gestion des ${subMenu.name.toLowerCase()}`}
                    columns={typedColumns(undefined)}
                    type="type_saisie" />
            
            default:
                return <ParameterView 
                    title={subMenu.name}
                    description={`Gestion des ${subMenu.name.toLowerCase()}`}
                    columns={rawColumns}
                />
        }
    }

    return (
        <div>
            {getParameterView()}
        </div>
    )
}
