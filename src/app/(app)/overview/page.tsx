"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

// Simple fake datas for charts/cards (to be replaced with API later)
const encaissements = Array.from({ length: 12 }).map((_, i) => ({
  mois: new Date(2025, i, 1).toLocaleString('fr-FR', { month: 'short' }),
  montant: Math.round(300 + Math.random() * 700),
}))

export default function OverviewPage() {
  // KPIs calculés à partir des données mock
  const totalEncaisse = encaissements.reduce((s, x) => s + x.montant, 0)
  const variation = Math.round(((encaissements[11].montant - encaissements[10].montant) / encaissements[10].montant) * 100)

  return (
    <div className="min-h-screen bg-white">
      <div className="px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Tableau de bord</h1>
            <p className="text-gray-600">Vue d'ensemble de l'activité</p>
          </div>
          <div className="flex gap-2">
            <Input type="month" className="h-10" />
            <Button variant="outline">Exporter</Button>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="rounded-lg border p-4 bg-white shadow-sm">
            <div className="text-sm text-gray-500">Encaissements (12 mois)</div>
            <div className="text-2xl font-semibold">{totalEncaisse.toLocaleString('fr-FR')} k</div>
            <div className="text-xs text-emerald-700">{variation}% vs mois-1</div>
          </div>
          <div className="rounded-lg border p-4 bg-white shadow-sm">
            <div className="text-sm text-gray-500">Taux de recouvrement</div>
            <div className="text-2xl font-semibold">82,5%</div>
            <div className="text-xs text-gray-500">période courante</div>
          </div>
          <div className="rounded-lg border p-4 bg-white shadow-sm">
            <div className="text-sm text-gray-500">Encours à risque (&gt;90j)</div>
            <div className="text-2xl font-semibold text-red-600">54,3 M</div>
            <div className="text-xs text-gray-500">18% du total</div>
          </div>
          <div className="rounded-lg border p-4 bg-white shadow-sm">
            <div className="text-sm text-gray-500">Dossiers contentieux</div>
            <div className="text-2xl font-semibold">312</div>
            <div className="text-xs text-amber-600">+8% vs N-30</div>
          </div>
        </div>

        {/* Graph placeholders (ready for charts lib) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 rounded-lg border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900">Encaissements mensuels</h3>
              <span className="text-xs text-gray-500">12 derniers mois</span>
            </div>
            <div className="h-64 grid grid-cols-12 gap-2 items-end">
              {encaissements.map((e, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2">
                  <div className="w-4 bg-emerald-500 rounded" style={{ height: `${e.montant / 10}px` }} />
                  <span className="text-xs text-gray-500">{e.mois}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">Répartition par statut</h3>
            <div className="text-sm text-gray-500">Donut chart placeholder</div>
            <ul className="mt-3 space-y-1 text-sm">
              <li className="flex justify-between"><span>Échu 0–30j</span><span>25%</span></li>
              <li className="flex justify-between"><span>Échu 31–60j</span><span>18%</span></li>
              <li className="flex justify-between"><span>Échu 61–90j</span><span>12%</span></li>
              <li className="flex justify-between"><span>&gt; 90j</span><span>20%</span></li>
              <li className="flex justify-between"><span>Contentieux</span><span>10%</span></li>
              <li className="flex justify-between"><span>Réglé</span><span>15%</span></li>
            </ul>
          </div>
        </div>

        {/* Tables/sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900">Alertes & actions</h3>
              <Button variant="outline" size="sm">Voir tout</Button>
            </div>
            <ul className="text-sm space-y-2">
              <li>• Promesses en retard: 42</li>
              <li>• Échéances à 7 jours: 128</li>
              <li>• Dossiers inactifs (&gt;30j): 67</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900">Top débiteurs (encours)</h3>
              <Button variant="outline" size="sm">Exporter</Button>
            </div>
            <ul className="text-sm space-y-2">
              <li>#1 Société Alpha — 12,5 M</li>
              <li>#2 Holding Beta — 9,7 M</li>
              <li>#3 Entreprise Gamma — 7,9 M</li>
              <li>#4 Particulier Z — 6,2 M</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}


