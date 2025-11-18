"use client"

import { useState, useEffect } from "react";
import { Search, Plus, Eye, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Types pour les créances
interface Creance {
  id: string;
  numeroCreance: string;
  objetCreance: string;
  groupeCreance: string;
  debiteurNom: string;
  debiteurPrenom: string;
  capitalInitial: number;
  montantARembourser: number;
  montantImpaye: number;
  totalSolde: number;
  statutCreance: string;
  dateCreation: string;
  periodicite: string;
  garantiePersonnelle: boolean;
  garantieReelle: boolean;
}

const EtudeCreancePage = () => {
  const [creances, setCreances] = useState<Creance[]>([]);
  const [filteredCreances, setFilteredCreances] = useState<Creance[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [groupeFilter, setGroupeFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Données de test
  const mockCreances: Creance[] = [
    {
      id: "1",
      numeroCreance: "CRE-2024-001",
      objetCreance: "Prêt immobilier",
      groupeCreance: "Prêts immobiliers",
      debiteurNom: "Koné",
      debiteurPrenom: "Amadou",
      capitalInitial: 5000000,
      montantARembourser: 6000000,
      montantImpaye: 2000000,
      totalSolde: 2200000,
      statutCreance: "En cours",
      dateCreation: "2024-01-15",
      periodicite: "Mensuelle",
      garantiePersonnelle: true,
      garantieReelle: false
    },
    {
      id: "2",
      numeroCreance: "CRE-2024-002",
      objetCreance: "Prêt véhicule",
      groupeCreance: "Prêts véhicules",
      debiteurNom: "Traoré",
      debiteurPrenom: "Fatou",
      capitalInitial: 2500000,
      montantARembourser: 3000000,
      montantImpaye: 1500000,
      totalSolde: 1650000,
      statutCreance: "En retard",
      dateCreation: "2024-02-20",
      periodicite: "Mensuelle",
      garantiePersonnelle: false,
      garantieReelle: true
    },
    {
      id: "3",
      numeroCreance: "CRE-2024-003",
      objetCreance: "Prêt consommation",
      groupeCreance: "Prêts consommation",
      debiteurNom: "Diabaté",
      debiteurPrenom: "Moussa",
      capitalInitial: 1000000,
      montantARembourser: 1200000,
      montantImpaye: 0,
      totalSolde: 0,
      statutCreance: "Remboursé",
      dateCreation: "2024-03-10",
      periodicite: "Mensuelle",
      garantiePersonnelle: true,
      garantieReelle: false
    }
  ];

  useEffect(() => {
    // Simulation du chargement des données
    setTimeout(() => {
      setCreances(mockCreances);
      setFilteredCreances(mockCreances);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // Filtrage des créances
    let filtered = creances;

    if (searchTerm) {
      filtered = filtered.filter(creance =>
        creance.numeroCreance.toLowerCase().includes(searchTerm.toLowerCase()) ||
        creance.objetCreance.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${creance.debiteurNom} ${creance.debiteurPrenom}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(creance => creance.statutCreance === statusFilter);
    }

    if (groupeFilter) {
      filtered = filtered.filter(creance => creance.groupeCreance === groupeFilter);
    }

    setFilteredCreances(filtered);
  }, [creances, searchTerm, statusFilter, groupeFilter]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "En cours": return "default";
      case "En retard": return "destructive";
      case "Remboursé": return "secondary";
      default: return "outline";
    }
  };

  const handleViewCreance = (creance: Creance) => {
    router.push(`/etude_creance/creance/views/voir?id=${creance.id}`);
  };

  const handleEditCreance = (creance: Creance) => {
    router.push(`/etude_creance/creance/edit?id=${creance.id}`);
  };

  const handleDeleteCreance = (creance: Creance) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la créance ${creance.numeroCreance} ?`)) {
      setCreances(creances.filter(c => c.id !== creance.id));
      toast.success(`La créance ${creance.numeroCreance} a été supprimée avec succès.`);
    }
  };

  const handleCreateCreance = () => {
    router.push("/etude_creance/creance/create");
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <div className="space-y-6">
        {/* En-tête avec bouton de création */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-black text-black mb-2">
              Gestion des Créances
            </h1>
            <p className="text-black">Programme de gestion des créances</p>
          </div>
          <Button
            onClick={handleCreateCreance}
            className="bg-[#28A325] hover:bg-[#047857] text-white"
            size="lg"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle créance
          </Button>
        </div>

        {/* Actions et filtres */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between w-full">
                <div className="flex gap-4 flex-1">
                  <div className="relative max-w-[400px]">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Rechercher par numéro, objet ou débiteur..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-gray-300 focus:border-[#28A325]"
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="max-w-[200px] border border-gray-300 rounded-md px-3 py-2 focus:border-[#28A325] focus:outline-none"
                  >
                    <option value="">Tous les statuts</option>
                    <option value="En cours">En cours</option>
                    <option value="En retard">En retard</option>
                    <option value="Remboursé">Remboursé</option>
                  </select>

                  <select
                    value={groupeFilter}
                    onChange={(e) => setGroupeFilter(e.target.value)}
                    className="max-w-[200px] border border-gray-300 rounded-md px-3 py-2 focus:border-[#28A325] focus:outline-none"
                  >
                    <option value="">Tous les groupes</option>
                    <option value="Prêts immobiliers">Prêts immobiliers</option>
                    <option value="Prêts véhicules">Prêts véhicules</option>
                    <option value="Prêts consommation">Prêts consommation</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-between w-full">
                <p className="text-sm text-gray-600">
                  {filteredCreances.length} créance(s) trouvée(s)
                </p>
                <p className="text-sm text-gray-600">
                  Total solde: {formatCurrency(filteredCreances.reduce((sum, c) => sum + c.totalSolde, 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tableau des créances */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[#1a202c]">Liste des créances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[#374151]">Numéro</TableHead>
                    <TableHead className="text-[#374151]">Objet</TableHead>
                    <TableHead className="text-[#374151]">Débiteur</TableHead>
                    <TableHead className="text-[#374151]">Capital initial</TableHead>
                    <TableHead className="text-[#374151]">Montant impayé</TableHead>
                    <TableHead className="text-[#374151]">Total solde</TableHead>
                    <TableHead className="text-[#374151]">Statut</TableHead>
                    <TableHead className="text-[#374151]">Date création</TableHead>
                    <TableHead className="text-[#374151]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8">
                        <p className="text-gray-500">Chargement des créances...</p>
                      </TableCell>
                    </TableRow>
                  ) : filteredCreances.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8">
                        <p className="text-gray-500">Aucune créance trouvée</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCreances.map((creance) => (
                      <TableRow key={creance.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{creance.numeroCreance}</TableCell>
                        <TableCell>{creance.objetCreance}</TableCell>
                        <TableCell>{creance.debiteurNom} {creance.debiteurPrenom}</TableCell>
                        <TableCell>{formatCurrency(creance.capitalInitial)}</TableCell>
                        <TableCell>{formatCurrency(creance.montantImpaye)}</TableCell>
                        <TableCell className={`font-bold ${creance.totalSolde > 0 ? 'text-red-500' : 'text-green-500'}`}>
                          {formatCurrency(creance.totalSolde)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(creance.statutCreance)}>
                            {creance.statutCreance}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(creance.dateCreation).toLocaleDateString('fr-FR')}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewCreance(creance)}
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="h-4 w-4 text-blue-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditCreance(creance)}
                              className="h-8 w-8 p-0"
                            >
                              <Pencil className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteCreance(creance)}
                              className="h-8 w-8 p-0"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EtudeCreancePage;
