const Recovery = "/assets/recovery.svg";
const Settings = "/assets/settings-enable.svg";
const FollowClient = "/assets/suiv-client.svg";
const Patrimoine = "/assets/patrimoine.svg";
const Account = "/assets/account.svg";
const Operation = "/assets/operation.svg";
const Archivre = "/assets/archive.svg";
const Contentieux = "/assets/contentieux.svg";
const Creance = "/assets/creance.svg";
const Help = "/assets/help.svg";
import { MenuItem, SubMenuItem } from "../types/menu";

// Menu exactement identique à l'original
const menuItemsData = [
  {
    name: "Tableau de bord",
    path: "/overview",
    icon: Recovery,
  },

  {
    name: "Paramètres",
    icon: Settings,
    path: "/settings",
    subMenu: [
      {
        name: "Agence de banque",
        columns: [
          {
            key: 'code',
            label: 'Code',
            sortable: true,
          },
          {
            key: 'libelle',
            label: 'Libellé',
            sortable: true,
          },
        ],
      },
      {
        name: "Banque",
        columns: [
          {
            key: 'code',
            label: 'Code',
            sortable: true,
          },
          {
            key: 'libelle',
            label: 'Libellé',
            sortable: true,
          },
        ],
      },
      {
        name: "Catégorie de débiteur",
        
      },
      {
        name: "Civilité",
      },
      {
        name: "Classe",
      },
      {
        name: "Compte d'operation",
      },
      {
        name: "Entité",
      },
      {
        name: "Etape",
      },
      {
        name: "Exercice",
      },
      {
        name: "Fonction",
      },
      {
        name: "Groupe Créance",
      },
      {
        name: "Journal",
      },
      {
        name: "Message",
      },
      {
        name: "Mode d'Acquisition",
      },
      {
        name: "Mode de Paiement",
      },
      {
        name: "Nationalité",
      },
      {
        name: "Objet créance",
      },
      {
        name: "Opération",
      },
      {
        name: "Périodicité",
      },
      {
        name: "Paramètre Généraux",
      },
      {
        name: "Poste Comptable",
      },
      {
        name: "Profession",
      },
      {
        name: "Quartier",
      },
      {
        name: "Statut Créance",
      },
      {
        name: "Statut Salarié",
      },
      {
        name: "Type d'Acte",
      },
      {
        name: "Type d'Auxiliaire",
      },
      {
        name: "Type d'Echéancier",
      },
      {
        name: "Type de Charge",
      },
      {
        name: "Type de Compte",
      },
      {
        name: "Type de Contrat",
      },
      {
        name: "Type Débiteur",
      },
      {
        name: "Type de Domiciliation",
      },
      {
        name: "Type Effet",
      },
      {
        name: "Type Employeur",
      },
      {
        name: "Type de Frais",
      },
      {
        name: "Type Garantie Réelle",
      },
      {
        name: "Type Garantie Personnelle",
      },
      {
        name: "Type Logement",
      },
      {
        name: "Type Opération",
      },
      {
        name: "Type OVP",
      },
      {
        name: "Type Pièce",
      },
      {
        name: "Type Régularisation",
      },
      {
        name: "Type Saisie",
      },
      {
        name: "Ville",
      },
      {
        name: "Zone",
      },
    ],
    columns: [
      {
        key: 'code',
        label: 'Code',
        sortable: true,
      },
      {
        key: 'libelle',
        label: 'Libellé',
        sortable: true,
      },
    ],
  },
  {
    name: "Etude de Creance",
    path: "/etude_creance",
    icon: Creance,   
    subMenu: [
      {
        name: "Debiteur",
        path: "debiteur",
      },
      {
        name: "Creance",
        path: "creance",
      },
      {
        name:"Creation de  Frais",
        path: "creation_de_frais",
      },
      {
        name:"Visite de terrain",
        path: "visite_de_terrain",
      },
      {
        name:"Autre frais",
        path: "autre_frais",
      },
      {
        name:"Gestion amiable",
        path: "gestion_amiable",
      },
    ]
  },
  {
    name: "Suivi Clientèle",
    path: "/followClient",
    icon: FollowClient,
    subMenu: [
      {
        name: "Paiemt. de Creance",
        subMenu: [
          {
            id: 1,
            name: 'Paiement X',
            path: '/paiementX',
          },
        ]
      },
      {
        name: "Paiemt. de Facture",
      },
      {
        name: "Paiemt. de cheque de Creances",
      },
      {
        name: "Paiemt. de cheque de Factures",
      },
      {
        name:'Paiement par virement non reçu(CGRAE,OVP,PGT,CNPS) ',
      },    
    ],
  },
  {
    name: "Suivi Récouv.",
    path: "/recovery",
    icon: Recovery,
    subMenu: [
      { name: "Enregistrement" },
      { name: "Mise à jour" },
      { name: "Consultation" },
    ],
  },
  {
    name: "Contentieux",
    path: "/contentieux",
    icon: Contentieux,
    subMenu: [
      { name: "Enregistrement" },
      { name: "Mise à jour" },
      { name: "Consultation" },
      { name: "Suivi des Actes de Recouvrement" },
    ],
  },
  {
    name: "Patrimoine",
    path: "/patrimoine",
    icon: Patrimoine,
    subMenu: [
      { name: "Enregistrement" },
      { name: "Mise à jour" },
      { name: "Consultation" },
    ],
  },
  {
    name: "Opérations Div",
    path: "/operations",
    icon: Operation,
    subMenu: [
      { name: "Enregistrement" },
      { name: "Mise à jour" },
      { name: "Consultation" },
      { name: "Budget" },
      { name: "Remboursement des Créanciers" },
      { name: "Gestion de Carnet" },
      { name: "Tableau de Bord-Direction ACCC" },
      { name: "Gestion des Stocks" },
    ],
  },
  
  {
    name: "Etats",
    path: "/etats",
    icon: Archivre,
    subMenu: [
      { name: "Etude créance" },
      { name: "Suivi Clientèle" },
      { name: "Suivi Recouvrement" },
      { name: "Contentieux" },
      { name: "Patrimoine" },
      { name: "Autres" },
    ],
  },
  {
    name: "Gestion des utilisateurs",
    path: "/action",
    icon: Account,    
    subMenu: [
      {
        name: "Connexion",
      },
      {
        name: "Déconnexion",
      },
      {
        name: "Comptabilité",
      },
      {
        name: "Utilisateur",
      },
      {
        name: "Habilitations",
      },
      {
        name: "Modifier mot de passe",
      },
      {
        name: "Initialisation du mot de passe",
      },
      {
        name: "Quitter",
      },
    ],
  },
  {
    name: "Aide",
    icon: Help,
    path: "/aide",
    subMenu: [{ name: "Apropos" }, { name: "Manuel" }, { name: "Aide Oracle" }],
  },
];

const letters = new Map<string, string>([
  ["é", "e"],
  ["à", "a"],
  ["'", ""],
]);

function formatLabelToPath(subMenu: any) {
  let formattedPath = subMenu.name.trim().replaceAll(" ", "_").toLowerCase();
  for (let key of letters.keys()) {
    formattedPath = formattedPath.replaceAll(key, letters.get(key)!.valueOf());
  }
  return formattedPath;
}

export const menuItems: MenuItem[] = menuItemsData.map((menuItem, index) => ({
  id: index,
  path: menuItem.path,
  icon: menuItem.icon,
  name: menuItem.name,  
  subMenus: menuItem.subMenu?.map(
    (subMenu, subIndex): SubMenuItem => ({
      id: (index * 100) + subIndex, // ID unique pour chaque sous-menu
      name: subMenu.name,
      nameColumn: (subMenu as any).nameColumn,
      nameHeader: (subMenu as any).nameHeader,
      headers: (subMenu as any).headers,
      subMenuType: subMenu as any,      
      viewName: menuItem.path === "/settings" ? "parameter" : undefined,
      columns: (subMenu as any).columns,
      path: formatLabelToPath(subMenu), // Utiliser la fonction formatLabelToPath pour tous les sous-menus
      subMenus: (subMenu as any).subMenu
    })
  ),
}));
