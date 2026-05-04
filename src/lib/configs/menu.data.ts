const Recovery = "/assets/recovery.svg";
const Settings = "/assets/settings-enable.svg";
const Account = "/assets/account.svg";
const Operation = "/assets/operation.svg";
const Creance = "/assets/creance.svg";
const FollowClient = "/assets/suiv-client.svg";
import { MenuItem, SubMenuItem } from "../types/menu";

interface MenuSubMenuConfig {
  name: string;
  path?: string;
  customPath?: boolean;
  columns?: SubMenuItem['columns'];
  headers?: SubMenuItem['headers'];
  nameColumn?: string;
  nameHeader?: string;
  subMenu?: MenuSubMenuConfig[];
}

interface MenuConfig {
  name: string;
  path?: string;
  icon?: MenuItem['icon'];
  subMenu?: MenuSubMenuConfig[];
  columns?: SubMenuItem['columns'];
}

// Menu exactement identique à l'original
const menuItemsData: MenuConfig[] = [
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
        path: "parametre_generaux",
        customPath: true,
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
        customPath: true, // Marqueur pour indiquer que le chemin est personnalisé
      },
      {
        name: "Creance",
        path: "",
      },
      // {
      //   name:"Creation de  Frais",
      //   path: "creation_de_frais",
      // },
      // {
      //   name:"Visite de terrain",
      //   path: "visite_de_terrain",
      // },
      // {
      //   name:"Autre frais",
      //   path: "autre_frais",
      // },
      // {
      //   name:"Gestion amiable",
      //   path: "gestion_amiable",
      // },
    ]
  },

  {
    name: "Extrait de compte",
    path: "/extrait_de_compte",
    icon: Account,
    subMenu: [
      {
        name: "Créance",
        path: "",
        customPath: true,
      },
    ],
  },

  {
    name: "Suivie Clientèle",
    path: "/suivie_clientel",
    icon: FollowClient,
    subMenu: [
      {
        name: "OVP",
        path: "ovp",
        customPath: true,
        subMenu: [
          {
            name: "Consultation",
            path: "consultation",
            customPath: true,
          },
          {
            name: "Création",
            path: "creation",
            customPath: true,
          },
          {
            name: "Modification",
            path: "modification",
            customPath: true,
          },
          {
            name: "Génération mensuelle des OVP",
            path: "generation_mensuelle",
            customPath: true,
          },
        ],
      },
    ],
  },

  {
    name: "Gestion des paiements",
    icon: Operation,
    subMenu: [
      {
        name: "Paiements des creances",
        path: "/paiements_des_creances",
        customPath: true, // Path complet pour le sous-menu
      },
      {
        name: "Paiement contrat de bail",
        path: "/paiement_contrat_bail",
        customPath: true, // Path complet pour le sous-menu
      },
      {
        name: "Paiement des frais",
        path: "/paiement_des_frais",
        customPath: true, // Path complet pour le sous-menu
      },
    ]
  },

  // {
  //   name: "Suivi Clientèle",
  //   path: "/followClient",
  //   icon: FollowClient,
  //   subMenu: [
  //     {
  //       name: "Paiemt. de Creance",
  //       subMenu: [
  //         {
  //           id: 1,
  //           name: 'Paiement X',
  //           path: '/paiementX',
  //         },
  //       ]
  //     },
  //     {
  //       name: "Paiemt. de Facture",
  //     },
  //     {
  //       name: "Paiemt. de cheque de Creances",
  //     },
  //     {
  //       name: "Paiemt. de cheque de Factures",
  //     },
  //     {
  //       name:'Paiement par virement non reçu(CGRAE,OVP,PGT,CNPS) ',
  //     },    
  //   ],
  // },
  // {
  //   name: "Suivi Récouv.",
  //   path: "/recovery",
  //   icon: Recovery,
  //   subMenu: [
  //     { name: "Enregistrement" },
  //     { name: "Mise à jour" },
  //     { name: "Consultation" },
  //   ],
  // },
  // {
  //   name: "Contentieux",
  //   path: "/contentieux",
  //   icon: Contentieux,
  //   subMenu: [
  //     { name: "Enregistrement" },
  //     { name: "Mise à jour" },
  //     { name: "Consultation" },
  //     { name: "Suivi des Actes de Recouvrement" },
  //   ],
  // },
  // {
  //   name: "Patrimoine",
  //   path: "/patrimoine",
  //   icon: Patrimoine,
  //   subMenu: [
  //     { name: "Enregistrement" },
  //     { name: "Mise à jour" },
  //     { name: "Consultation" },
  //   ],
  // },
  // {
  //   name: "Opérations Div",
  //   path: "/operations",
  //   icon: Operation,
  //   subMenu: [
  //     { name: "Enregistrement" },
  //     { name: "Mise à jour" },
  //     { name: "Consultation" },
  //     { name: "Budget" },
  //     { name: "Remboursement des Créanciers" },
  //     { name: "Gestion de Carnet" },
  //     { name: "Tableau de Bord-Direction ACCC" },
  //     { name: "Gestion des Stocks" },
  //   ],
  // },
  
  // {
  //   name: "Etats",
  //   path: "/etats",
  //   icon: Archivre,
  //   subMenu: [
  //     { name: "Etude créance" },
  //     { name: "Suivi Clientèle" },
  //     { name: "Suivi Recouvrement" },
  //     { name: "Contentieux" },
  //     { name: "Patrimoine" },
  //     { name: "Autres" },
  //   ],
  // },
  // {
  //   name: "Gestion des utilisateurs",
  //   path: "/action",
  //   icon: Account,    
  //   subMenu: [
  //     {
  //       name: "Connexion",
  //     },
  //     {
  //       name: "Déconnexion",
  //     },
  //     {
  //       name: "Comptabilité",
  //     },
  //     {
  //       name: "Utilisateur",
  //     },
  //     {
  //       name: "Habilitations",
  //     },
  //     {
  //       name: "Modifier mot de passe",
  //     },
  //     {
  //       name: "Initialisation du mot de passe",
  //     },
  //     {
  //       name: "Quitter",
  //     },
  //   ],
  // },
  // {
  //   name: "Aide",
  //   icon: Help,
  //   path: "/aide",
  //   subMenu: [{ name: "Apropos" }, { name: "Manuel" }, { name: "Aide Oracle" }],
  // },
];

export function formatLabelToPath(subMenu: { name: string }) {
  return subMenu.name
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "")
    .replace(/\s+/g, "_")
    .toLowerCase();
}

function mapMenuSubMenus(subMenus: MenuSubMenuConfig[] | undefined, parentId: number): SubMenuItem[] | undefined {
  return subMenus?.map(
    (subMenu, subIndex): SubMenuItem => ({
      id: (parentId * 100) + subIndex,
      name: subMenu.name,
      nameColumn: subMenu.nameColumn,
      nameHeader: subMenu.nameHeader,
      headers: subMenu.headers,
      subMenuType: {
        ...subMenu,
        subMenu: mapMenuSubMenus(subMenu.subMenu, (parentId * 100) + subIndex),
      },
      viewName: undefined,
      columns: subMenu.columns,
      customPath: subMenu.customPath,
      path: subMenu.customPath
        ? (subMenu.path ?? formatLabelToPath(subMenu))
        : formatLabelToPath(subMenu),
      subMenus: mapMenuSubMenus(subMenu.subMenu, (parentId * 100) + subIndex),
    })
  )
}

export const menuItems: MenuItem[] = menuItemsData.map((menuItem, index) => ({
  id: index,
  path: menuItem.path || undefined,
  icon: menuItem.icon,
  name: menuItem.name,  
  subMenus: mapMenuSubMenus(menuItem.subMenu, index)?.map((subMenu) => ({
    ...subMenu,
    viewName: menuItem.path === "/settings" ? "parameter" : subMenu.viewName,
  })),
}));
