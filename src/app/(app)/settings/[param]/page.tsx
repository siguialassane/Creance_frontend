"use client"

import { useParams } from 'next/navigation'
import { menuItems } from '../../../../lib/configs/menu.data'
import ProfessionalBanqueView from '../../../../components/parameter-views/professional-banque-view'
import BanqueView from '../../../../components/parameter-views/banque-view'
import ProfessionalCiviliteView from '../../../../components/parameter-views/professional-civilite-view'
import ProfessionalCategorieDebiteurView from '../../../../components/parameter-views/professional-categorie-debiteur-view'
import Link from 'next/link'
import ParameterView from '../../../../components/parameter-views/parameter-view'
import { agencesData, banquesData, categoriesData,civilites, classes, fonctions } from '@/lib/theme/fake-data'
import ApiParameterView from '../../../../components/parameter-views/api-parameter-view'
import { COLUMN_CONFIGS } from '@/lib/column'

export default function ParameterPage() {
    const params = useParams()
    const paramPath = params.param as string
    
    // Plus besoin de hooks ici, ApiParameterView les gère
    
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
                    backgroundColor: '#28A325',
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

    // Préparer les colonnes définies dans le menu (avec fallback par défaut)
    const rawColumns = (subMenu as any).columns || (settingsMenu as any).columns || [
        { key: 'code', label: 'Code', sortable: true },
        { key: 'libelle', label: 'Libellé', sortable: true },
    ]


    // Fonction pour déterminer quelle vue utiliser
    const getParameterView = () => {
        
        switch (paramPath) {
            case 'agence_de_banque':
                return <ParameterView 
                key={subMenu.name}
                title={subMenu.name} 
                description={`Gestion des ${subMenu.name.toLowerCase()}`} 
                columns={rawColumns as any}
                initData={agencesData} />
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
                columns={rawColumns as any}
                initData={categoriesData} />
            case 'classe':
                return <ParameterView title={subMenu.name} 
                description={`Gestion des ${subMenu.name.toLowerCase()}`} 
                columns={rawColumns as any}
                initData={classes} />
            case 'fonction':
                return <ParameterView title={subMenu.name} 
                description={`Gestion des ${subMenu.name.toLowerCase()}`} 
                columns={rawColumns as any}
                initData={fonctions} />
            case 'nationalite':
                return <ParameterView title={subMenu.name} 
                description={`Gestion des ${subMenu.name.toLowerCase()}`} 
                columns={rawColumns as any}
                initData={[]} />
            case 'profession':
                return <ParameterView title={subMenu.name} 
                description={`Gestion des ${subMenu.name.toLowerCase()}`} 
                columns={rawColumns as any}
                initData={[]} />
            case 'quartier':
                return <ParameterView title={subMenu.name} 
                description={`Gestion des ${subMenu.name.toLowerCase()}`} 
                columns={rawColumns as any}
                initData={[]} />
            case 'ville':
                return <ParameterView title={subMenu.name} 
                description={`Gestion des ${subMenu.name.toLowerCase()}`} 
                columns={rawColumns as any}
                initData={[]} />
            case 'zone':
                return <ParameterView title={subMenu.name} 
                description={`Gestion des ${subMenu.name.toLowerCase()}`} 
                columns={rawColumns as any}
                initData={[]} />
            case 'statut_creance':
                return <ParameterView 
                    title={subMenu.name}
                    description={`Gestion des ${subMenu.name.toLowerCase()}`}
                    columns={rawColumns as any}
                    initData={[]} />
            case 'statut_salarie':
                return <ParameterView 
                    title={subMenu.name}
                    description={`Gestion des ${subMenu.name.toLowerCase()}`}
                    columns={rawColumns as any}
                    initData={[]} />
            case 'type_acte':
                return <ParameterView 
                    title={subMenu.name}
                    description={`Gestion des ${subMenu.name.toLowerCase()}`}
                    columns={rawColumns as any}
                    initData={[]} />
            case 'type_auxiliaire':
                return <ParameterView 
                    title={subMenu.name}
                    description={`Gestion des ${subMenu.name.toLowerCase()}`}
                    columns={rawColumns as any}
                    initData={[]} />
            case 'type_echéancier':
                return <ParameterView 
                    title={subMenu.name}
                    description={`Gestion des ${subMenu.name.toLowerCase()}`}
                    columns={rawColumns as any}
                    initData={[]} />
            case 'type_charge':
                return <ParameterView 
                    title={subMenu.name}
                    description={`Gestion des ${subMenu.name.toLowerCase()}`}
                    columns={rawColumns as any}
                    initData={[]} />
            case 'type_compte':
                return <ParameterView 
                    title={subMenu.name}
                    description={`Gestion des ${subMenu.name.toLowerCase()}`}
                    columns={rawColumns as any}
                    initData={[]} />
            case 'type_contrat':
                return <ParameterView 
                    title={subMenu.name}
                    description={`Gestion des ${subMenu.name.toLowerCase()}`}
                    columns={rawColumns as any}
                    initData={[]} />
            case 'type_debiteur':
                return <ParameterView 
                    title={subMenu.name}
                    description={`Gestion des ${subMenu.name.toLowerCase()}`}
                    columns={rawColumns as any}
                    initData={[]} />
            case 'type_domiciliation':
                return <ParameterView 
                    title={subMenu.name}
                    description={`Gestion des ${subMenu.name.toLowerCase()}`}
                    columns={rawColumns as any}
                    initData={[]} />
            case 'type_effet':
                return <ParameterView 
                    title={subMenu.name}
                    description={`Gestion des ${subMenu.name.toLowerCase()}`}
                    columns={rawColumns as any}
                    initData={[]} />
            case 'type_employeur':
                return <ParameterView 
                    title={subMenu.name}
                    description={`Gestion des ${subMenu.name.toLowerCase()}`}
                    columns={rawColumns as any}
                    initData={[]} />
            case 'type_frais':
                return <ParameterView 
                    title={subMenu.name}
                    description={`Gestion des ${subMenu.name.toLowerCase()}`}
                    columns={rawColumns as any}
                    initData={[]} />
            case 'type_garantie_reelle':
                return <ParameterView 
                    title={subMenu.name}
                    description={`Gestion des ${subMenu.name.toLowerCase()}`}
                    columns={rawColumns as any}
                    initData={[]} />
            case 'type_garantie_personnelle':
                return <ParameterView 
                    title={subMenu.name}
                    description={`Gestion des ${subMenu.name.toLowerCase()}`}
                    columns={rawColumns as any}
                    initData={[]} />
            case 'type_logement':
                return <ParameterView 
                    title={subMenu.name}
                    description={`Gestion des ${subMenu.name.toLowerCase()}`}
                    columns={rawColumns as any}
                    initData={[]} />
            case 'type_operation':
                return <ParameterView 
                    title={subMenu.name}
                    description={`Gestion des ${subMenu.name.toLowerCase()}`}
                    columns={rawColumns as any}
                    initData={[]} />
            case 'type_ovp':
                return <ParameterView 
                    title={subMenu.name}
                    description={`Gestion des ${subMenu.name.toLowerCase()}`}
                    columns={rawColumns as any}
                    initData={[]} />
            case 'type_piece':
                return <ParameterView 
                    title={subMenu.name}
                    description={`Gestion des ${subMenu.name.toLowerCase()}`}
                    columns={rawColumns as any}
                    initData={[]} />
            case 'type_regularisation':
                return <ParameterView 
                    title={subMenu.name}
                    description={`Gestion des ${subMenu.name.toLowerCase()}`}
                    columns={rawColumns as any}
                    initData={[]} />
            case 'type_saisie':
                return <ParameterView 
                    title={subMenu.name}
                    description={`Gestion des ${subMenu.name.toLowerCase()}`}
                    columns={rawColumns as any}
                    initData={[]} />
            
            default:
                return <ParameterView 
                    title={subMenu.name}
                    description={`Gestion des ${subMenu.name.toLowerCase()}`}
                    columns={rawColumns as any}
                />
        }
    }

    return (
        <div>
            {getParameterView()}
        </div>
    )
}
