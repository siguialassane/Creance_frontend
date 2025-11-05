"use client";

import * as React from "react";
import { Download, FileText, FileSpreadsheet, Settings, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface ExportButtonProps {
  /** Fonction d'export PDF */
  onExportPDF: (params: { search?: string; page?: number; size?: number }) => Promise<Blob>;
  /** Fonction d'export Excel */
  onExportExcel: (params: { search?: string; page?: number; size?: number }) => Promise<Blob>;
  /** Valeur de recherche actuelle (pour appliquer les filtres) */
  searchValue?: string;
  /** Nom du fichier par défaut (sans extension) */
  defaultFileName: string;
  /** Afficher les options avancées par défaut */
  showAdvancedOptions?: boolean;
}

export function ExportButton({
  onExportPDF,
  onExportExcel,
  searchValue,
  defaultFileName,
  showAdvancedOptions = false,
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = React.useState(false);
  const [showOptions, setShowOptions] = React.useState(false);
  const [exportSize, setExportSize] = React.useState<number>(10000); // Défaut pour Excel
  const [exportFormat, setExportFormat] = React.useState<"pdf" | "excel">("excel");

  /**
   * Télécharge un blob en tant que fichier
   */
  const downloadBlob = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  /**
   * Génère le nom de fichier avec horodatage
   */
  const generateFileName = (format: "pdf" | "excel"): string => {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
    const timeStr = now.toTimeString().slice(0, 5).replace(":", "");
    const extension = format === "pdf" ? "pdf" : "xlsx";
    return `${defaultFileName}_${dateStr}_${timeStr}.${extension}`;
  };

  /**
   * Exporte directement avec les paramètres par défaut (Excel)
   */
  const handleQuickExport = async () => {
    setIsExporting(true);
    try {
      const params = {
        search: searchValue || undefined,
        page: 0,
        size: 10000, // Par défaut Excel avec 10000 enregistrements
      };

      const blob = await onExportExcel(params);

      const filename = generateFileName("excel");
      downloadBlob(blob, filename);
      toast.success("Export Excel téléchargé avec succès");
    } catch (error: any) {
      console.error("Erreur lors de l'export:", error);
      toast.error(
        error.response?.status === 403
          ? "Vous n'avez pas les permissions pour exporter ces données"
          : error.response?.status === 401
          ? "Votre session a expiré. Veuillez vous reconnecter."
          : `Erreur lors de l'export: ${error.message || "Une erreur est survenue"}`
      );
    } finally {
      setIsExporting(false);
    }
  };

  /**
   * Exporte avec les paramètres personnalisés
   */
  const handleExportWithOptions = async () => {
    setIsExporting(true);
    try {
      const params = {
        search: searchValue || undefined,
        page: 0,
        size: exportSize,
      };

      const blob =
        exportFormat === "pdf"
          ? await onExportPDF(params)
          : await onExportExcel(params);

      const filename = generateFileName(exportFormat);
      downloadBlob(blob, filename);
      toast.success(`Export ${exportFormat.toUpperCase()} téléchargé avec succès`);
      setShowOptions(false);
    } catch (error: any) {
      console.error("Erreur lors de l'export:", error);
      toast.error(
        error.response?.status === 403
          ? "Vous n'avez pas les permissions pour exporter ces données"
          : error.response?.status === 401
          ? "Votre session a expiré. Veuillez vous reconnecter."
          : `Erreur lors de l'export: ${error.message || "Une erreur est survenue"}`
      );
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <TooltipProvider>
      <Popover open={showOptions} onOpenChange={setShowOptions}>
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleQuickExport}
                disabled={isExporting}
                variant="outline"
                className="border-orange-500 hover:bg-orange-50 text-orange-700 h-10 px-4 font-medium"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Export...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Exporter
                  </>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Exporter les données en Excel</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-orange-500 hover:bg-orange-50 text-orange-700 h-10 w-10"
                  disabled={isExporting}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Options d'export</p>
            </TooltipContent>
          </Tooltip>
        </div>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Options d'export</h4>
            <p className="text-xs text-gray-500">
              Configurez les paramètres d'export avant de télécharger
            </p>
          </div>

          <div className="space-y-3">
            {/* Format */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Format</Label>
              <div className="flex gap-2">
                <Button
                  variant={exportFormat === "pdf" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setExportFormat("pdf")}
                  className="flex-1"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  PDF
                </Button>
                <Button
                  variant={exportFormat === "excel" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setExportFormat("excel")}
                  className="flex-1"
                >
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Excel
                </Button>
              </div>
            </div>

            {/* Nombre d'enregistrements */}
            <div className="space-y-2">
              <Label htmlFor="export-size" className="text-sm font-medium">
                Nombre d'enregistrements
              </Label>
              <Input
                id="export-size"
                type="number"
                min={1}
                max={exportFormat === "pdf" ? 10000 : 50000}
                value={exportSize}
                onChange={(e) => setExportSize(parseInt(e.target.value) || 1000)}
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                {exportFormat === "pdf"
                  ? "Recommandé: 1000-2000 pour PDF"
                  : "Recommandé: jusqu'à 10000 pour Excel"}
              </p>
            </div>

            {/* Filtre de recherche */}
            {searchValue && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Filtre actif</Label>
                <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                  Recherche: "{searchValue}"
                </div>
                <p className="text-xs text-gray-500">
                  L'export inclura uniquement les résultats filtrés
                </p>
              </div>
            )}
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-2 pt-2">
              <Button
                onClick={handleExportWithOptions}
                disabled={isExporting}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
              >
              {isExporting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Export...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Exporter
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowOptions(false)}
              disabled={isExporting}
            >
              Annuler
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
    </TooltipProvider>
  );
}

