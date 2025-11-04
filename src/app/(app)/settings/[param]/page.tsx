"use client"

import { useParams } from 'next/navigation'
import { useMemo } from 'react'
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
    
    // Trouver le sous-menu correspondant en utilisant le nom converti en path
    const subMenu = useMemo(() => {
        if (!settingsMenu?.subMenus) return undefined
        return settingsMenu.subMenus.find((sub: SubMenuItem) => {
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
    }, [settingsMenu, paramPath])
    
    if (!settingsMenu?.subMenus) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <h1>Paramètres non trouvés</h1>
            </div>
        )
    }
    
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
    const rawColumns: ParameterColumnType[] = useMemo(() => (subMenu.columns || [
        { key: 'code', label: 'Code' },
        { key: 'libelle', label: 'Libellé' },
    ]) as ParameterColumnType[], [subMenu.columns])

    // Déterminer les props à utiliser (mémoïsées)
    const viewProps = useMemo(() => {
        if (!subMenu) return null
        
        const baseProps = {
            title: subMenu.name,
            description: `Gestion des ${subMenu.name.toLowerCase()}`,
            useServerPagination: false, // Toujours définir par défaut
        }
        
        switch (paramPath) {
            case 'agence_de_banque':
                return { ...baseProps, columns: COLUMN_CONFIGS['agence_de_banque'], type: 'agence_de_banque', useServerPagination: true }
            case 'banque':
                return { ...baseProps, columns: COLUMN_CONFIGS['banque'], type: 'banque', useServerPagination: false }
            case 'civilite':
                return { ...baseProps, type: 'civilite', columns: COLUMN_CONFIGS['civilite'], useServerPagination: false }
            case 'categorie_de_debiteur':
                return { ...baseProps, columns: COLUMN_CONFIGS['categorie_debiteur'], type: 'categorie_debiteur', useServerPagination: false }
            case 'classe':
                return { ...baseProps, columns: COLUMN_CONFIGS['classe'], type: 'classe', useServerPagination: false }
            case 'fonction':
                return { ...baseProps, columns: COLUMN_CONFIGS['fonction'], type: 'fonction', useServerPagination: false }
            case 'nationalite':
                return { ...baseProps, columns: COLUMN_CONFIGS['nationalite'], type: 'nationalite', useServerPagination: false }
            case 'mode_de_paiement':
                return { ...baseProps, columns: COLUMN_CONFIGS['mode_paiement'], type: 'mode_paiement', useServerPagination: false }
            case 'profession':
                return { ...baseProps, columns: COLUMN_CONFIGS['profession'], type: 'profession', useServerPagination: false }
            case 'quartier':
                return { ...baseProps, columns: COLUMN_CONFIGS['quartier'], type: 'quartier', useServerPagination: false }
            case 'ville':
                return { ...baseProps, columns: COLUMN_CONFIGS['ville'], type: 'ville', useServerPagination: true }
            case 'zone':
                return { ...baseProps, columns: COLUMN_CONFIGS['zone'], type: 'zone', useServerPagination: false }
            case 'statut_creance':
                return { ...baseProps, columns: COLUMN_CONFIGS['statut_creance'], type: 'statut_creance', useServerPagination: false }
            case 'statut_salarie':
                return { ...baseProps, columns: COLUMN_CONFIGS['statut_salarie'], type: 'statut_salarie', useServerPagination: false }
            case 'type_dacte':
                return { ...baseProps, columns: COLUMN_CONFIGS['type_acte'], type: 'type_acte', useServerPagination: false }
            case 'type_dauxiliaire':
                return { ...baseProps, columns: COLUMN_CONFIGS['type_auxiliaire'], type: 'type_auxiliaire', useServerPagination: false }
            case 'type_operation':
                return { ...baseProps, columns: COLUMN_CONFIGS['type_operation'], type: 'type_operation', useServerPagination: false }
            case 'type_de_charge':
                return { ...baseProps, columns: COLUMN_CONFIGS['type_charge'], type: 'type_charge', useServerPagination: false }
            case 'type_de_contrat':
                return { ...baseProps, columns: COLUMN_CONFIGS['type_contrat'], type: 'type_contrat', useServerPagination: false }
            case 'type_de_compte':
                return { ...baseProps, columns: COLUMN_CONFIGS['type_compte'], type: 'type_compte', useServerPagination: false }
            case 'type_de_domiciliation':
                return { ...baseProps, columns: COLUMN_CONFIGS['type_domiciliation'], type: 'type_domiciliation', useServerPagination: false }
            case 'type_decheancier':
                return { ...baseProps, columns: COLUMN_CONFIGS['type_echeancier'], type: 'type_echeancier', useServerPagination: false }
            case 'type_effet':
                return { ...baseProps, columns: COLUMN_CONFIGS['type_effet'], type: 'type_effet', useServerPagination: false }
            case 'type_employeur':
                return { ...baseProps, columns: COLUMN_CONFIGS['type_employeur'], type: 'type_employeur', useServerPagination: false }
            case 'type_de_frais':
                return { ...baseProps, columns: COLUMN_CONFIGS['type_frais'], type: 'type_frais', useServerPagination: false }
            case 'type_logement':
                return { ...baseProps, columns: COLUMN_CONFIGS['type_logement'], type: 'type_logement', useServerPagination: false }
            case 'type_ovp':
                return { ...baseProps, columns: COLUMN_CONFIGS['type_ovp'], type: 'type_ovp', useServerPagination: false }
            case 'type_piece':
                return { ...baseProps, columns: COLUMN_CONFIGS['type_piece'], type: 'type_piece', useServerPagination: false }
            case 'type_regularisation':
                return { ...baseProps, columns: COLUMN_CONFIGS['type_regularisation'], type: 'type_regularisation', useServerPagination: false }
            case 'type_saisie':
                return { ...baseProps, columns: COLUMN_CONFIGS['type_saisie'], type: 'type_saisie', useServerPagination: false }
            case 'type_garantie_personnelle':
                return { ...baseProps, columns: COLUMN_CONFIGS['type_garantie_personnelle'], type: 'type_garantie_personnelle', useServerPagination: false }
            case 'type_garantie_reelle':
                return { ...baseProps, columns: COLUMN_CONFIGS['type_garantie_reelle'], type: 'type_garantie_reelle', useServerPagination: false }
            case 'compte_doperation':
                return { ...baseProps, columns: COLUMN_CONFIGS['compte_operation'], type: 'compte_operation', useServerPagination: false }
            case 'entite':
                return { ...baseProps, columns: COLUMN_CONFIGS['entite'], type: 'entite', useServerPagination: false }
            case 'etape':
                return { ...baseProps, columns: COLUMN_CONFIGS['etape'], type: 'etape', useServerPagination: false }
            case 'exercice':
                return { ...baseProps, columns: COLUMN_CONFIGS['exercice'], type: 'exercice', useServerPagination: false }
            case 'groupe_creance':
                return { ...baseProps, columns: COLUMN_CONFIGS['groupe_creance'], type: 'groupe_creance', useServerPagination: false }
            default:
                return { ...baseProps, columns: rawColumns, useServerPagination: false }
        }
    }, [paramPath, subMenu, rawColumns])

    if (!viewProps) {
        return null
    }

    return (
        <div>
            <ParameterView key={subMenu.name} {...viewProps} />
        </div>
    )
}
