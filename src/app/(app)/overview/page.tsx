"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/hooks/useApiClient";
import { useSessionWrapper } from "@/hooks/useSessionWrapper";
import { DashboardService, DashboardData, DashboardFilters } from "@/services/dashboard.service";
import { DashboardSkeleton } from "@/components/ui/dashboard-skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  TrendingUp, 
  TrendingDown, 
  Target,
  AlertTriangle, 
  FileText, 
  Users, 
  Calendar,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Shield,
  Building2,
  User,
  X,
  Info,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface KPICardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: string;
  variant?: "default" | "success" | "warning" | "danger";
  description?: string;
}

function KPICard({ title, value, subtitle, icon, trend, variant = "default", description }: KPICardProps) {
  const variantStyles = {
    default: "border-slate-200 bg-white",
    success: "border-green-200 bg-green-50",
    warning: "border-orange-200 bg-orange-50",
    danger: "border-red-200 bg-red-50",
  };

  const iconStyles = {
    default: "text-slate-600",
    success: "text-green-600",
    warning: "text-orange-600",
    danger: "text-red-600",
  };

  return (
    <Card className={`${variantStyles[variant]} border shadow-sm hover:shadow-md transition-shadow`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
          {description && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Info className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-sm">{description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <div className={`${iconStyles[variant]}`}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-slate-900 mb-1">{value}</div>
        {subtitle && (
          <p className="text-xs text-slate-500 flex items-center gap-1">
            {trend && (
              <>
                {trend.startsWith("+") ? (
                  <TrendingUp className="h-3 w-3 text-green-600" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600" />
                )}
              </>
            )}
            {subtitle}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

interface StatusDistributionProps {
  data: DashboardData["repartitionStatut"];
}

function StatusDistribution({ data }: StatusDistributionProps) {
  const getStatusColor = (statutCode: string) => {
    switch (statutCode) {
      case "E":
        return "bg-blue-500";
      case "R":
        return "bg-green-500";
      case "C":
        return "bg-purple-500";
      case "A":
        return "bg-yellow-500";
      case "S":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg font-semibold">Répartition par statut</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <Info className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-sm">
                  Répartition des créances selon leur statut de recouvrement. Chaque barre représente le pourcentage et le montant total des créances dans un statut donné. Les statuts disponibles sont : En cours (E), Réglé (R), Contentieux (C), Amiable (A), et Suspendu (S).
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
              </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item) => (
            <div key={item.statutCode} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">{item.statut}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600">{item.pourcentage}</span>
                  <span className="text-xs text-slate-500">({item.nombre} créances)</span>
          </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full ${getStatusColor(item.statutCode)} transition-all duration-300`}
                  style={{ width: `${item.pourcentageNumerique}%` }}
                />
              </div>
              <div className="text-xs text-slate-500">{item.montant}</div>
            </div>
          ))}
            </div>
      </CardContent>
    </Card>
  );
}

interface TopDebiteursProps {
  data: DashboardData["topDebiteurs"];
}

function TopDebiteurs({ data }: TopDebiteursProps) {
  const router = useRouter();

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg font-semibold">Top 10 Débiteurs</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <Info className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-sm">
                  Classement des 10 débiteurs ayant le plus grand encours (montant total des créances non réglées). Le tableau affiche le rang, le nom, le type (Physique ou Moral), l'encours total et le nombre de créances. Cliquez sur une ligne pour voir les détails du débiteur.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">#</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Nom</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Type</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600">Encours</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-slate-600">Créances</th>
              </tr>
            </thead>
            <tbody>
              {data.map((debiteur) => (
                <tr
                  key={debiteur.debCode}
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => router.push(`/etude_creance/debiteur/views/voir?id=${debiteur.debCode}`)}
                >
                  <td className="py-3 px-4 text-sm font-medium text-slate-700">
                    #{debiteur.rang}
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-900 font-medium">{debiteur.nom}</td>
                  <td className="py-3 px-4">
                    {debiteur.type === "M" ? (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        <Building2 className="h-3 w-3 mr-1" />
                        Moral
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        <User className="h-3 w-3 mr-1" />
                        Physique
                      </Badge>
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm font-semibold text-slate-900 text-right">
                    {debiteur.encours}
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600 text-center">
                    {debiteur.nombreCreances}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
      </CardContent>
    </Card>
  );
}

interface AlertsSectionProps {
  alertes: DashboardData["alertes"];
}

function AlertsSection({ alertes }: AlertsSectionProps) {
  const alerts = [];

  if (alertes.echeances7Jours.ready && alertes.echeances7Jours.nombre > 0) {
    alerts.push({
      type: "warning",
      icon: Calendar,
      message: "Échéances à 7 jours",
      count: alertes.echeances7Jours.nombre,
      ready: true,
    });
  }

  if (alertes.dossiersInactifs.ready && alertes.dossiersInactifs.nombre > 0) {
    alerts.push({
      type: "danger",
      icon: AlertTriangle,
      message: "Dossiers inactifs (>30j)",
      count: alertes.dossiersInactifs.nombre,
      ready: true,
    });
  }

  if (alertes.promessesRetard.ready && alertes.promessesRetard.nombre > 0) {
    alerts.push({
      type: "info",
      icon: Clock,
      message: "Promesses en retard",
      count: alertes.promessesRetard.nombre,
      ready: true,
    });
  }

  if (alerts.length === 0) {
    return (
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg font-semibold">Alertes & Actions</CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <Info className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-sm">
                    Cette section affiche les alertes nécessitant une attention immédiate : échéances à venir (7 jours), dossiers inactifs depuis plus de 30 jours, et promesses de paiement en retard. Aucune alerte n'est active actuellement.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-slate-500">
            <Shield className="h-12 w-12 mx-auto mb-2 text-slate-300" />
            <p className="text-sm">Aucune alerte active</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg font-semibold">Alertes & Actions</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <Info className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-sm">
                  Cette section affiche les alertes nécessitant une attention immédiate : échéances à venir (7 jours), dossiers inactifs depuis plus de 30 jours, et promesses de paiement en retard. Cliquez sur une alerte pour voir les détails.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.map((alert, index) => {
            const Icon = alert.icon;
            const alertStyles = {
              warning: "bg-orange-50 border-orange-200 text-orange-800",
              danger: "bg-red-50 border-red-200 text-red-800",
              info: "bg-blue-50 border-blue-200 text-blue-800",
            };

            return (
              <div
                key={index}
                className={`flex items-center justify-between p-4 rounded-lg border ${alertStyles[alert.type as keyof typeof alertStyles]}`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{alert.message}</span>
              </div>
                <Badge
                  variant="secondary"
                  className={`${
                    alert.type === "warning"
                      ? "bg-orange-200 text-orange-900"
                      : alert.type === "danger"
                      ? "bg-red-200 text-red-900"
                      : "bg-blue-200 text-blue-900"
                  }`}
                >
                  {alert.count}
                </Badge>
              </div>
            );
          })}
            </div>
      </CardContent>
    </Card>
  );
}

interface MonthlyChartProps {
  data: DashboardData["encaissementsMensuels"];
}

function MonthlyChart({ data }: MonthlyChartProps) {
  const maxMontant = Math.max(...data.map((d) => d.montant), 1);

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg font-semibold">Encaissements mensuels</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <Info className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-sm">
                  Graphique représentant l'évolution des encaissements sur les 12 derniers mois. Chaque barre correspond au montant total encaissé dans un mois donné. Survolez une barre pour voir le détail. Les données sont basées sur les paiements enregistrés dans le système.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        {data.some((d) => d.ready) ? (
          <div className="space-y-4">
            <div className="flex items-end justify-between gap-2 h-64">
              {data.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col justify-end h-full">
                    <div
                      className={`w-full rounded-t transition-all duration-300 ${
                        item.ready ? "bg-gradient-to-t from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500" : "bg-gray-200"
                      }`}
                      style={{
                        height: item.ready ? `${(item.montant / maxMontant) * 100}%` : "10%",
                      }}
                      title={`${item.mois}: ${item.montant.toLocaleString()} FCFA`}
                    />
                  </div>
                  <span className="text-xs text-slate-600 font-medium">{item.mois}</span>
                </div>
              ))}
            </div>
            <div className="text-xs text-slate-500 text-center">
              Total: {data.reduce((sum, d) => sum + d.montant, 0).toLocaleString()} FCFA
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500">
            <Activity className="h-12 w-12 mx-auto mb-2 text-slate-300" />
            <p className="text-sm">Données en attente</p>
        </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();
  const router = useRouter();
  const [filters, setFilters] = React.useState<DashboardFilters>({});
  const [selectedMonth, setSelectedMonth] = React.useState<string>("");
  const [selectedYear, setSelectedYear] = React.useState<string>("");

  const isSessionReady = status === 'authenticated' && !!(session as any)?.accessToken;

  // Générer la liste des années (de 2020 à l'année actuelle + 1)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2019 + 1 }, (_, i) => 
    (2020 + i).toString()
  ).reverse(); // Années récentes en premier

  const {
    data: dashboardResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["dashboard", filters],
    queryFn: () => DashboardService.getDashboard(apiClient, filters),
    enabled: isSessionReady,
    retry: 1,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  const dashboardData = dashboardResponse?.data;

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const month = e.target.value;
    setSelectedMonth(month);
    if (month) {
      setFilters({ mois: month });
      setSelectedYear("");
    } else {
      setFilters({});
    }
  };

  const handleYearChange = (value: string) => {
    setSelectedYear(value);
    if (value && value !== "all") {
      setFilters({ annee: value });
      setSelectedMonth("");
    } else {
      setFilters({});
      setSelectedYear("");
    }
  };

  const handleResetFilters = () => {
    setSelectedMonth("");
    setSelectedYear("");
    setFilters({});
  };

  if (isLoading) {
    return (
      <div className="w-full h-full overflow-y-auto bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen p-6">
        <DashboardSkeleton />
              </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="w-full h-full overflow-y-auto bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen p-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 mx-auto mb-2 text-red-500" />
              <p className="text-red-700 font-medium">Erreur lors du chargement du dashboard</p>
              <Button onClick={() => refetch()} className="mt-4" variant="outline">
                Réessayer
              </Button>
            </div>
          </CardContent>
        </Card>
                  </div>
    );
  }

  return (
    <div className="w-full h-full overflow-y-auto bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <div className="px-6 py-8 max-w-full pb-20">
        {/* Header avec titre et filtres */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Tableau de bord</h1>
            <p className="text-slate-600 text-lg">Vue d'ensemble de l'activité de recouvrement</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              type="month"
              className="h-11 bg-white border-[#28A325] focus:border-[#28A325] focus:ring-[#28A325]/50"
              value={selectedMonth}
              onChange={handleMonthChange}
              placeholder="Sélectionner un mois"
            />
            <Select value={selectedYear || "all"} onValueChange={handleYearChange}>
              <SelectTrigger className="h-11 bg-white border-[#28A325] focus:border-[#28A325] focus:ring-[#28A325]/50 w-40">
                <SelectValue placeholder="Sélectionner une année" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les années</SelectItem>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {(selectedMonth || selectedYear) && (
              <Button
                onClick={handleResetFilters}
                variant="outline"
                className="h-11 border-orange-500 text-orange-700 hover:bg-orange-50"
              >
                <X className="h-4 w-4 mr-2" />
                Réinitialiser
              </Button>
            )}
          </div>
        </div>

        {/* KPIs Principaux */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {dashboardData.tauxRecouvrement.ready && (
            <KPICard
              title="Taux de recouvrement"
              value={dashboardData.tauxRecouvrement.taux}
              subtitle="période courante"
              icon={<Target className="h-5 w-5" />}
              variant="success"
              description="Pourcentage des montants récupérés par rapport au total dû. Calculé comme suit : (Total payé / Total dû) × 100. Un taux élevé indique une bonne efficacité du recouvrement."
            />
          )}

          {dashboardData.encoursRisque.ready && (
            <KPICard
              title="Encours à risque (>90j)"
              value={dashboardData.encoursRisque.montant}
              subtitle={`${dashboardData.encoursRisque.pourcentage} du total (${dashboardData.encoursRisque.nombre} créances)`}
              icon={<AlertTriangle className="h-5 w-5" />}
              variant="danger"
              description="Montant total des créances dont l'échéance est dépassée de plus de 90 jours. Ces créances nécessitent une attention particulière et peuvent nécessiter des actions de recouvrement renforcées ou un passage en contentieux."
            />
          )}

          {dashboardData.dossiersContentieux.ready && (
            <KPICard
              title="Dossiers contentieux"
              value={dashboardData.dossiersContentieux.nombre.toString()}
              subtitle={dashboardData.dossiersContentieux.variation + " vs N-30"}
              icon={<FileText className="h-5 w-5" />}
              variant="warning"
              description="Nombre de créances en statut 'Contentieux', c'est-à-dire pour lesquelles une procédure judiciaire a été engagée. La variation affichée compare le nombre actuel avec celui d'il y a 30 jours."
            />
          )}

          {dashboardData.statistiquesAvancees.ready && (
            <KPICard
              title="Délai moyen de recouvrement"
              value={dashboardData.statistiquesAvancees.delaiMoyenRecouvrement}
              subtitle="moyenne générale"
              icon={<Clock className="h-5 w-5" />}
              variant="default"
              description="Temps moyen entre la date de création d'une créance et sa date de règlement complet. Ce délai permet d'évaluer l'efficacité du processus de recouvrement et d'identifier les points d'amélioration."
            />
          )}
          </div>
          
        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <MonthlyChart data={dashboardData.encaissementsMensuels} />
          <StatusDistribution data={dashboardData.repartitionStatut} />
        </div>

        {/* Top Débiteurs */}
        <div className="mb-8">
          <TopDebiteurs data={dashboardData.topDebiteurs} />
        </div>

        {/* Alertes */}
        <div className="mb-8">
          <AlertsSection alertes={dashboardData.alertes} />
        </div>
      </div>
    </div>
  );
}
