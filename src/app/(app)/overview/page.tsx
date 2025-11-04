"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  AlertTriangle, 
  FileText, 
  Users, 
  Calendar,
  Download,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Target,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowUp
} from "lucide-react"

// Données simulées pour les graphiques et KPIs
// Utiliser des valeurs fixes pour éviter les problèmes d'hydratation
const montants = [450, 520, 380, 610, 490, 580, 420, 550, 670, 440, 600, 530]
// Mémoïser les noms de mois pour éviter les problèmes d'hydratation
const moisNames = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.']
const encaissements = Array.from({ length: 12 }).map((_, i) => ({
  mois: moisNames[i] || 'janv.',
  montant: montants[i] || 500,
}))

const statutsCreances = [
  { label: "Échu 0–30j", value: 25, color: "bg-blue-500" },
  { label: "Échu 31–60j", value: 18, color: "bg-yellow-500" },
  { label: "Échu 61–90j", value: 12, color: "bg-orange-500" },
  { label: "> 90j", value: 20, color: "bg-red-500" },
  { label: "Contentieux", value: 10, color: "bg-purple-500" },
  { label: "Réglé", value: 15, color: "bg-green-500" },
]

const alertes = [
  { type: "warning", message: "Promesses en retard", count: 42, icon: Clock },
  { type: "info", message: "Échéances à 7 jours", count: 128, icon: Calendar },
  { type: "error", message: "Dossiers inactifs (&gt;30j)", count: 67, icon: AlertTriangle },
]

const topDebiteurs = [
  { rank: 1, name: "Société Alpha", montant: 12.5, variation: "+5.2%" },
  { rank: 2, name: "Holding Beta", montant: 9.7, variation: "-2.1%" },
  { rank: 3, name: "Entreprise Gamma", montant: 7.9, variation: "+8.3%" },
  { rank: 4, name: "Particulier Z", montant: 6.2, variation: "+1.7%" },
]


export default function OverviewPage() {
  // KPIs calculés à partir des données mock
  const totalEncaisse = encaissements.reduce((s, x) => s + x.montant, 0)
  const variation = Math.round(((encaissements[11].montant - encaissements[10].montant) / encaissements[10].montant) * 100)
  const maxMontant = Math.max(...encaissements.map(e => e.montant))

  // Fonction pour remonter en haut de page
  const scrollToTop = () => {
    const scrollContainer = document.querySelector('.w-full.h-full.overflow-y-auto')
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="w-full h-full overflow-y-auto" style={{ height: 'calc(100vh - 64px)' }}>
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 min-h-full">
        <div className="px-6 py-8 max-w-full pb-20">
        {/* Header avec titre et actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Tableau de bord</h1>
            <p className="text-slate-600 text-lg">Vue d'ensemble de l'activité de recouvrement</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input 
              type="month" 
              className="h-11 bg-white border-slate-200 focus:border-green-500 focus:ring-green-500" 
              defaultValue="2025-01"
            />
            <Button className="h-11 bg-green-600 hover:bg-green-700 text-white px-6">
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
          </div>
        </div>

        {/* Cartes KPI principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {/* Encaissements */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex items-center text-green-600">
                {variation >= 0 ? (
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 mr-1" />
                )}
                <span className="text-sm font-medium">{Math.abs(variation)}%</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-slate-600 font-medium">Encaissements (12 mois)</p>
              <p className="text-2xl font-bold text-slate-900">{totalEncaisse.toLocaleString('fr-FR')} k</p>
              <p className="text-xs text-slate-500">vs mois précédent</p>
            </div>
          </div>

          {/* Taux de recouvrement */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex items-center text-green-600">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">+2.1%</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-slate-600 font-medium">Taux de recouvrement</p>
              <p className="text-2xl font-bold text-slate-900">82,5%</p>
              <p className="text-xs text-slate-500">période courante</p>
            </div>
          </div>

          {/* Encours à risque */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex items-center text-red-600">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">+3.2%</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-slate-600 font-medium">Encours à risque (&gt;90j)</p>
              <p className="text-2xl font-bold text-red-600">54,3 M</p>
              <p className="text-xs text-slate-500">18% du total</p>
            </div>
          </div>

          {/* Dossiers contentieux */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-amber-100 rounded-lg">
                <FileText className="w-6 h-6 text-amber-600" />
              </div>
              <div className="flex items-center text-amber-600">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">+8%</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-slate-600 font-medium">Dossiers contentieux</p>
              <p className="text-2xl font-bold text-slate-900">312</p>
              <p className="text-xs text-slate-500">vs N-30</p>
            </div>
          </div>
        </div>

        {/* Graphiques et visualisations */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          {/* Graphique des encaissements */}
          <div className="xl:col-span-2 bg-white rounded-xl p-6 shadow-lg border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Encaissements mensuels</h3>
                <p className="text-sm text-slate-600">Évolution sur 12 derniers mois</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-slate-600">Encaissements</span>
              </div>
            </div>
            <div className="h-80 flex items-end justify-between gap-2">
              {encaissements.map((e, idx) => (
                <div key={idx} className="flex flex-col items-center gap-3 flex-1">
                  <div className="relative w-full">
                    <div 
                      className="w-full bg-gradient-to-t from-green-600 to-green-400 rounded-t-lg transition-all duration-500 hover:from-green-700 hover:to-green-500"
                      style={{ height: `${(e.montant / maxMontant) * 280}px` }}
                    />
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-medium text-slate-600">
                      {e.montant}k
                    </div>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">{e.mois}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Répartition par statut */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-900">Répartition par statut</h3>
              <p className="text-sm text-slate-600">Distribution des créances</p>
            </div>
            <div className="space-y-4">
              {statutsCreances.map((statut, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${statut.color}`}></div>
                    <span className="text-sm text-slate-700">{statut.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-slate-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${statut.color}`}
                        style={{ width: `${statut.value}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-slate-900 w-8">{statut.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alertes et Top débiteurs */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Alertes et actions */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Alertes & Actions</h3>
                <p className="text-sm text-slate-600">Points d'attention prioritaires</p>
              </div>
              <Button variant="outline" size="sm" className="text-green-600 border-green-200 hover:bg-green-50">
                <Eye className="w-4 h-4 mr-2" />
                Voir tout
              </Button>
            </div>
            <div className="space-y-4">
              {alertes.map((alerte, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className={`p-2 rounded-lg ${
                    alerte.type === 'warning' ? 'bg-amber-100' :
                    alerte.type === 'error' ? 'bg-red-100' : 'bg-blue-100'
                  }`}>
                    <alerte.icon className={`w-5 h-5 ${
                      alerte.type === 'warning' ? 'text-amber-600' :
                      alerte.type === 'error' ? 'text-red-600' : 'text-blue-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{alerte.message}</p>
                    <p className="text-sm text-slate-600">{alerte.count} dossiers concernés</p>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{alerte.count}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Top débiteurs */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Top Débiteurs</h3>
                <p className="text-sm text-slate-600">Encours par débiteur</p>
              </div>
              <Button variant="outline" size="sm" className="text-green-600 border-green-200 hover:bg-green-50">
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </Button>
            </div>
            <div className="space-y-4">
              {topDebiteurs.map((debiteur, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="flex items-center justify-center w-8 h-8 bg-green-100 text-green-600 font-bold text-sm rounded-full">
                    #{debiteur.rank}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{debiteur.name}</p>
                    <p className="text-sm text-slate-600">{debiteur.montant} M FCFA</p>
                  </div>
                  <div className={`flex items-center text-sm font-medium ${
                    debiteur.variation.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {debiteur.variation.startsWith('+') ? (
                      <ArrowUpRight className="w-4 h-4 mr-1" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 mr-1" />
                    )}
                    {debiteur.variation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section supplémentaire pour tester le scroll */}
        <div className="mt-12 grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Statistiques Avancées</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-sm text-slate-600">Taux de conversion</span>
                <span className="font-semibold text-green-600">78.5%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-sm text-slate-600">Délai moyen de recouvrement</span>
                <span className="font-semibold text-blue-600">45 jours</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-sm text-slate-600">Coût par dossier</span>
                <span className="font-semibold text-purple-600">2,500 FCFA</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Actions Récentes</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-slate-700">Nouveau paiement reçu - Société Alpha</span>
                <span className="text-xs text-slate-500 ml-auto">Il y a 2h</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-slate-700">Dossier contentieux créé - Holding Beta</span>
                <span className="text-xs text-slate-500 ml-auto">Il y a 4h</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span className="text-sm text-slate-700">Rappel envoyé - Entreprise Gamma</span>
                <span className="text-xs text-slate-500 ml-auto">Il y a 6h</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bouton de retour en haut */}
        <div className="fixed bottom-8 right-8 z-50">
          <Button
            onClick={scrollToTop}
            className="h-12 w-12 rounded-full bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            size="icon"
          >
            <ArrowUp className="w-5 h-5" />
          </Button>
        </div>
        </div>
      </div>
    </div>
  )
}


