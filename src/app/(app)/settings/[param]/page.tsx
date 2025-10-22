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
                type="agence_de_banque"
                useServerPagination={true} />
            case 'banque':
                return <ParameterView 
                key={subMenu.name}
                title={subMenu.name} 
                description={`Gestion des ${subMenu.name.toLowerCase()}`} 
                columns={COLUMN_CONFIGS['banque']}
                type="banque"
                useServerPagination={false}
                />
            case 'civilite':
                return <ParameterView 
                    key={subMenu.name}
                    title={subMenu.name} 
                    description={`Gestion des ${subMenu.name.toLowerCase()}`} 
                    type="civilite"
                    columns={COLUMN_CONFIGS['civilite']}
                    useServerPagination={false}

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
                type="classe"
                useServerPagination={false} />
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
            case 'mode_de_paiement':
                return <ParameterView
                    title={subMenu.name}
                    description={`Gestion des ${subMenu.name.toLowerCase()}`}
                    columns={COLUMN_CONFIGS['mode_paiement']}
                    type="mode_paiement" />
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
            case 'type_dacte':
                return <ParameterView
                    title={subMenu.name}
                    description={`Gestion des ${subMenu.name.toLowerCase()}`}
                    columns={COLUMN_CONFIGS['type_acte']}
                    type="type_acte" />
            case 'type_dauxiliaire':
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
            case 'type_de_charge':
                return <ParameterView
                    title={subMenu.name}
                    description={`Gestion des ${subMenu.name.toLowerCase()}`}
                    columns={COLUMN_CONFIGS['type_charge']}
                    type="type_charge" />
            case 'type_de_contrat':
                return <ParameterView
                    title={subMenu.name}
                    description={`Gestion des ${subMenu.name.toLowerCase()}`}
                    columns={COLUMN_CONFIGS['type_contrat']}
                    type="type_contrat" />
            case 'type_de_compte':
                return <ParameterView
                    title={subMenu.name}
                    description={`Gestion des ${subMenu.name.toLowerCase()}`}
                    columns={COLUMN_CONFIGS['type_compte']}
                    type="type_compte" />
            case 'type_de_domiciliation':
                return <ParameterView
                    title={subMenu.name}
                    description={`Gestion des ${subMenu.name.toLowerCase()}`}
                    columns={COLUMN_CONFIGS['type_domiciliation']}
                    type="type_domiciliation" />
            case 'type_decheancier':
                return <ParameterView
                    title={subMenu.name}
                    description={`Gestion des ${subMenu.name.toLowerCase()}`}
                    columns={COLUMN_CONFIGS['type_echeancier']}
                    type="type_echeancier" />
            case 'type_effet':
                return <ParameterView
                    title={subMenu.name}
                    description={`Gestion des ${subMenu.name.toLowerCase()}`}
                    columns={COLUMN_CONFIGS['type_effet']}
                    type="type_effet" />
            case 'type_employeur':
                return <ParameterView
                    title={subMenu.name}
                    description={`Gestion des ${subMenu.name.toLowerCase()}`}
                    columns={COLUMN_CONFIGS['type_employeur']}
                    type="type_employeur" />
            case 'type_de_frais':
                return <ParameterView
                    title={subMenu.name}
                    description={`Gestion des ${subMenu.name.toLowerCase()}`}
                    columns={COLUMN_CONFIGS['type_frais']}
                    type="type_frais" />
            case 'type_logement':
                return <ParameterView
                    title={subMenu.name}
                    description={`Gestion des ${subMenu.name.toLowerCase()}`}
                    columns={COLUMN_CONFIGS['type_logement']}
                    type="type_logement" />
            case 'type_ovp':
                return <ParameterView
                    title={subMenu.name}
                    description={`Gestion des ${subMenu.name.toLowerCase()}`}
                    columns={COLUMN_CONFIGS['type_ovp']}
                    type="type_ovp" />
            case 'type_piece':
                return <ParameterView
                    title={subMenu.name}
                    description={`Gestion des ${subMenu.name.toLowerCase()}`}
                    columns={COLUMN_CONFIGS['type_piece']}
                    type="type_piece" />
            case 'type_regularisation':
                return <ParameterView
                    title={subMenu.name}
                    description={`Gestion des ${subMenu.name.toLowerCase()}`}
                    columns={COLUMN_CONFIGS['type_regularisation']}
                    type="type_regularisation" />
            case 'type_saisie':
                return <ParameterView
                    title={subMenu.name}
                    description={`Gestion des ${subMenu.name.toLowerCase()}`}
                    columns={COLUMN_CONFIGS['type_saisie']}
                    type="type_saisie" />
            case 'type_garantie_personnelle':
                return <ParameterView
                    title={subMenu.name}
                    description={`Gestion des ${subMenu.name.toLowerCase()}`}
                    columns={COLUMN_CONFIGS['type_garantie_personnelle']}
                    type="type_garantie_personnelle" />
            case 'type_garantie_reelle':
                return <ParameterView
                    title={subMenu.name}
                    description={`Gestion des ${subMenu.name.toLowerCase()}`}
                    columns={COLUMN_CONFIGS['type_garantie_reelle']}
                    type="type_garantie_reelle" />
            case 'compte_doperation':
                return <ParameterView
                    title={subMenu.name}
                    description={`Gestion des ${subMenu.name.toLowerCase()}`}
                    columns={COLUMN_CONFIGS['compte_operation']}
                    type="compte_operation" />
            case 'entite':
                return <ParameterView
                    title={subMenu.name}
                    description={`Gestion des ${subMenu.name.toLowerCase()}`}
                    columns={COLUMN_CONFIGS['entite']}
                    type="entite" />
            case 'etape':
                return <ParameterView
                    title={subMenu.name}
                    description={`Gestion des ${subMenu.name.toLowerCase()}`}
                    columns={COLUMN_CONFIGS['etape']}
                    type="etape" />
            case 'exercice':
                return <ParameterView
                    title={subMenu.name}
                    description={`Gestion des ${subMenu.name.toLowerCase()}`}
                    columns={COLUMN_CONFIGS['exercice']}
                    type="exercice" />
            case 'groupe_creance':
                return <ParameterView
                    title={subMenu.name}
                    description={`Gestion des ${subMenu.name.toLowerCase()}`}
                    columns={COLUMN_CONFIGS['groupe_creance']}
                    type="groupe_creance" />

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
