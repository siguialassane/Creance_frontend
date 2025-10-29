"use client"

import { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Text,
  VStack,
  HStack,
  Input,
  Select,
  Badge,
  IconButton,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon, ViewIcon } from "@chakra-ui/icons";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useApiClient } from "@/hooks/useApiClient";
import { DebiteurService } from "@/services/debiteur.service";

// Types pour les débiteurs
interface Debiteur {
  id: string;
  codeDebiteur: string;
  categorieDebiteur: string;
  typeDebiteur: string;
  email: string;
  adressePostale: string;
  
  // Personne physique
  nom?: string;
  prenom?: string;
  civilite?: string;
  nationalite?: string;
  quartier?: string;
  numeroCellulaire?: string;
  numeroTelephone?: string;
  profession?: string;
  fonction?: string;
  employeur?: string;
  statutSalarie?: string;
  
  // Personne morale
  raisonSociale?: string;
  registreCommerce?: string;
  formeJuridique?: string;
  domaineActivite?: string;
  siegeSocial?: string;
  nomGerant?: string;
  
  // Métadonnées
  dateCreation: string;
  statut: string;
}

const DebiteurPage = () => {
  const [debiteurs, setDebiteurs] = useState<Debiteur[]>([]);
  const [filteredDebiteurs, setFilteredDebiteurs] = useState<Debiteur[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categorieFilter, setCategorieFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const router = useRouter();
  const toast = useToast();
  const apiClient = useApiClient();

  // Charger les données depuis l'API backend
  useEffect(() => {
    if (hasLoaded) return; // Éviter les appels multiples
    
    let isMounted = true;
    
    const loadDebiteurs = async () => {
      if (!isMounted || hasLoaded) return;
      
      setLoading(true);
      setError(null);
      
      try {
        console.log('Chargement des débiteurs...');
        const response = await DebiteurService.getAll(apiClient);
        console.log('Réponse API:', response);

        if (response.status === "SUCCESS" && response.data) {
          // Extraire le contenu paginé
          const debiteursList = response.data.content || response.data;
          console.log('Liste des débiteurs extraite:', debiteursList);

          // Transformer les données de l'API pour correspondre à notre interface
          const transformedDebiteurs = Array.isArray(debiteursList) ? debiteursList.map((item: any) => ({
            id: item.DEB_CODE?.toString() || Math.random().toString(),
            codeDebiteur: item.DEB_CODE?.toString() || 'N/A',
            categorieDebiteur: item.CATEG_DEB_CODE || 'N/A',
            typeDebiteur: item.TYPDEB_CODE === 'P' ? 'Physique' : item.TYPDEB_CODE === 'M' ? 'Morale' : 'N/A',
            email: item.DEB_EMAIL || '',
            adressePostale: item.DEB_ADRPOST || '',

            // Personne physique - colonnes réelles d'Oracle
            nom: item.DEB_NOM || '',
            prenom: item.DEB_PREN || '',
            civilite: item.CIV_CODE || '',
            nationalite: item.NAT_CODE || '',
            quartier: item.QUART_CODE || '',
            numeroCellulaire: item.DEB_CEL || '',
            numeroTelephone: item.DEB_TELBUR || '',
            profession: item.PROFES_CODE || '',
            fonction: item.FONCT_CODE || '',
            employeur: item.EMP_CODE || '',
            statutSalarie: item.STATSAL_CODE || '',

            // Personne morale - colonnes réelles d'Oracle
            raisonSociale: item.DEB_RAIS_SOCIALE || 'N/A',
            registreCommerce: item.DEB_REGISTCOM || '',
            formeJuridique: item.DEB_FORM_JURID || '',
            domaineActivite: item.DEB_DOM_ACTIV || '',
            siegeSocial: item.DEB_SIEG_SOCIAL || '',
            nomGerant: item.DEB_NOM_GERANT || '',

            // Métadonnées
            dateCreation: item.DEB_DATE_CTL ? new Date(item.DEB_DATE_CTL).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            statut: 'Actif' // Par défaut actif
          })) : [];

          console.log('Débiteurs transformés:', transformedDebiteurs);
          
          if (isMounted) {
            setDebiteurs(transformedDebiteurs);
            setHasLoaded(true);
          }
        } else {
          throw new Error(response.message || 'Erreur lors du chargement des débiteurs');
        }
      } catch (error: any) {
        console.error('Erreur lors du chargement des débiteurs:', error);
        
        if (isMounted) {
          setError(error.message || 'Erreur lors du chargement des données');
          
          toast({
            title: "Erreur de chargement",
            description: "Impossible de charger la liste des débiteurs. Vérifiez votre connexion.",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "top",
          });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDebiteurs();
    
    return () => {
      isMounted = false;
    };
  }, [hasLoaded]); // Dépendance sur hasLoaded pour éviter les appels multiples

  useEffect(() => {
    // Filtrage des débiteurs
    let filtered = debiteurs;

    if (searchTerm) {
      filtered = filtered.filter(debiteur => {
        const searchLower = searchTerm.toLowerCase();
        return (
          debiteur.codeDebiteur.toLowerCase().includes(searchLower) ||
          (debiteur.nom && debiteur.nom.toLowerCase().includes(searchLower)) ||
          (debiteur.prenom && debiteur.prenom.toLowerCase().includes(searchLower)) ||
          (debiteur.raisonSociale && debiteur.raisonSociale.toLowerCase().includes(searchLower)) ||
          (debiteur.registreCommerce && debiteur.registreCommerce.toLowerCase().includes(searchLower)) ||
          (debiteur.nomGerant && debiteur.nomGerant.toLowerCase().includes(searchLower)) ||
          debiteur.email.toLowerCase().includes(searchLower) ||
          (debiteur.numeroCellulaire && debiteur.numeroCellulaire.includes(searchTerm))
        );
      });
    }

    if (categorieFilter) {
      filtered = filtered.filter(debiteur => debiteur.categorieDebiteur === categorieFilter);
    }

    if (typeFilter) {
      filtered = filtered.filter(debiteur => debiteur.typeDebiteur === typeFilter);
    }

    setFilteredDebiteurs(filtered);
  }, [debiteurs, searchTerm, categorieFilter, typeFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Actif": return "green";
      case "Inactif": return "red";
      case "Suspendu": return "orange";
      default: return "gray";
    }
  };

  const getDisplayName = (debiteur: Debiteur) => {
    if (debiteur.typeDebiteur === "Physique") {
      return `${debiteur.nom || ''} ${debiteur.prenom || ''}`.trim();
    } else {
      return debiteur.raisonSociale || 'Nom non disponible';
    }
  };

  const getDisplayInfo = (debiteur: Debiteur) => {
    if (debiteur.typeDebiteur === "Physique") {
      return `${debiteur.civilite || ''} - ${debiteur.profession || 'Profession non renseignée'}`;
    } else {
      return `${debiteur.formeJuridique || ''} - ${debiteur.domaineActivite || 'Domaine non renseigné'}`;
    }
  };

  const getTypeColor = (type: string) => {
    return type === "Physique" ? "blue" : "purple";
  };

  const handleViewDebiteur = (debiteur: Debiteur) => {
    // Utiliser codeDebiteur qui contient le vrai DEB_CODE
    router.push(`/etude_creance/debiteur/views/voir?id=${debiteur.codeDebiteur}`);
  };

  const handleEditDebiteur = (debiteur: Debiteur) => {
    // Utiliser codeDebiteur qui contient le vrai DEB_CODE, pas l'id qui pourrait être un numéro
    router.push(`/etude_creance/debiteur/edit?id=${debiteur.codeDebiteur}`);
  };

  const handleDeleteDebiteur = async (debiteur: Debiteur) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le débiteur ${debiteur.codeDebiteur} ?`)) {
      try {
        await DebiteurService.delete(apiClient, debiteur.codeDebiteur);
        
        // Mettre à jour la liste locale
        const updatedDebiteurs = debiteurs.filter(d => d.id !== debiteur.id);
        setDebiteurs(updatedDebiteurs);
        
        toast({
          title: "Débiteur supprimé avec succès !",
          description: `Le débiteur ${debiteur.codeDebiteur} a été supprimé avec succès.`,
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      } catch (error: any) {
        console.error('Erreur lors de la suppression:', error);
        toast({
          title: "Erreur de suppression",
          description: "Impossible de supprimer le débiteur. Vérifiez votre connexion.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      }
    }
  };

  const handleCreateDebiteur = () => {
    router.push("/etude_creance/debiteur/create");
  };

  // Configuration des colonnes pour DataTable - Colonnes essentielles uniquement
  const columns: ColumnDef<Debiteur>[] = [
    {
      accessorKey: "codeDebiteur",
      header: "Code",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("codeDebiteur")}</div>
      ),
    },
    {
      accessorKey: "typeDebiteur",
      header: "Type",
      cell: ({ row }) => (
        <Badge colorScheme={getTypeColor(row.getValue("typeDebiteur") as string)}>
          {row.getValue("typeDebiteur")}
        </Badge>
      ),
    },
    {
      accessorKey: "nom",
      header: "Nom / Raison sociale",
      cell: ({ row }) => (
        <div className="font-medium">{getDisplayName(row.original)}</div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "numeroCellulaire",
      header: "Téléphone",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("numeroCellulaire") || '-'}</div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const debiteur = row.original;
        return (
          <div className="flex items-center gap-2">
            <IconButton
              aria-label="Voir"
              icon={<ViewIcon />}
              size="sm"
              variant="ghost"
              colorScheme="blue"
              onClick={() => handleViewDebiteur(debiteur)}
            />
            <IconButton
              aria-label="Modifier"
              icon={<EditIcon />}
              size="sm"
              variant="ghost"
              colorScheme="green"
              onClick={() => handleEditDebiteur(debiteur)}
            />
            <IconButton
              aria-label="Supprimer"
              icon={<DeleteIcon />}
              size="sm"
              variant="ghost"
              colorScheme="red"
              onClick={() => handleDeleteDebiteur(debiteur)}
            />
          </div>
        );
      },
    },
  ];

  return (
    <div className="h-full flex flex-col bg-white">
      <DataTable
        title="Gestion des Débiteurs"
        description="Consultez et gérez tous vos débiteurs"
        columns={columns}
        data={filteredDebiteurs}
        searchKey="codeDebiteur"
        searchPlaceholder="Rechercher par code, nom, raison sociale, RC..."
        onAdd={handleCreateDebiteur}
        addButtonText="Nouveau débiteur"
        status={loading ? 'pending' : undefined}
        useServerPagination={false}
        isTableLoading={loading}
        sectionTitle="DÉBITEURS"
        listTitle="LISTE DES DÉBITEURS"
      />
    </div>
  );
};

export default DebiteurPage;
