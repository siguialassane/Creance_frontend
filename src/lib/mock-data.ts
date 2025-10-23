// Données de test pour les formulaires débiteur
// Ces données sont utilisées pour peupler les listes déroulantes

export const mockCategoriesDebiteur = [
  { id: "cat001", libelle: "Client particulier" },
  { id: "cat002", libelle: "Client entreprise" },
  { id: "cat003", libelle: "Client VIP" },
  { id: "cat004", libelle: "Client à risque" },
  { id: "cat005", libelle: "Client standard" }
];

export const mockQuartiers = [
  { id: "qua001", libelle: "Cocody" },
  { id: "qua002", libelle: "Plateau" },
  { id: "qua003", libelle: "Marcory" },
  { id: "qua004", libelle: "Treichville" },
  { id: "qua005", libelle: "Yopougon" },
  { id: "qua006", libelle: "Abobo" },
  { id: "qua007", libelle: "Adjamé" },
  { id: "qua008", libelle: "Koumassi" }
];

export const mockNationalites = [
  { id: "nat001", libelle: "Ivoirienne" },
  { id: "nat002", libelle: "Française" },
  { id: "nat003", libelle: "Burkinabé" },
  { id: "nat004", libelle: "Malienne" },
  { id: "nat005", libelle: "Sénégalaise" },
  { id: "nat006", libelle: "Béninoise" },
  { id: "nat007", libelle: "Togolaise" },
  { id: "nat008", libelle: "Ghanéenne" }
];

export const mockFonctions = [
  { id: "fon001", libelle: "Directeur Général" },
  { id: "fon002", libelle: "Directeur Financier" },
  { id: "fon003", libelle: "Chef de service" },
  { id: "fon004", libelle: "Responsable" },
  { id: "fon005", libelle: "Employé" },
  { id: "fon006", libelle: "Cadre" },
  { id: "fon007", libelle: "Agent de maîtrise" },
  { id: "fon008", libelle: "Technicien" }
];

export const mockProfessions = [
  { id: "prof001", libelle: "Ingénieur" },
  { id: "prof002", libelle: "Médecin" },
  { id: "prof003", libelle: "Avocat" },
  { id: "prof004", libelle: "Enseignant" },
  { id: "prof005", libelle: "Comptable" },
  { id: "prof006", libelle: "Commerçant" },
  { id: "prof007", libelle: "Agriculteur" },
  { id: "prof008", libelle: "Entrepreneur" },
  { id: "prof009", libelle: "Banquier" },
  { id: "prof010", libelle: "Fonctionnaire" }
];

export const mockEntites = [
  { id: "ent001", libelle: "Ministère de l'Économie" },
  { id: "ent002", libelle: "CHU de Treichville" },
  { id: "ent003", libelle: "Orange Côte d'Ivoire" },
  { id: "ent004", libelle: "MTN CI" },
  { id: "ent005", libelle: "PETROCI" },
  { id: "ent006", libelle: "CIE" },
  { id: "ent007", libelle: "SODECI" },
  { id: "ent008", libelle: "Air Côte d'Ivoire" }
];

export const mockStatutsSalarie = [
  { id: "sta001", libelle: "CDI" },
  { id: "sta002", libelle: "CDD" },
  { id: "sta003", libelle: "Stage" },
  { id: "sta004", libelle: "Intérim" },
  { id: "sta005", libelle: "Freelance" },
  { id: "sta006", libelle: "Apprenti" }
];

export const mockTypesDomicil = [
  { id: "typ001", libelle: "Compte courant" },
  { id: "typ002", libelle: "Compte épargne" },
  { id: "typ003", libelle: "Compte professionnel" },
  { id: "typ004", libelle: "Compte d'entreprise" }
];

export const mockBanques = [
  { id: "ban001", libelle: "SGBCI" },
  { id: "ban002", libelle: "Ecobank" },
  { id: "ban003", libelle: "BICICI" },
  { id: "ban004", libelle: "UBA" },
  { id: "ban005", libelle: "BNI" },
  { id: "ban006", libelle: "BACI" },
  { id: "ban007", libelle: "BOA" },
  { id: "ban008", libelle: "Coris Bank" }
];

export const mockAgencesBanque = [
  { id: "age001", libelle: "SGBCI Plateau" },
  { id: "age002", libelle: "SGBCI Cocody" },
  { id: "age003", libelle: "Ecobank Marcory" },
  { id: "age004", libelle: "Ecobank Deux-Plateaux" },
  { id: "age005", libelle: "BICICI Treichville" },
  { id: "age006", libelle: "UBA Abidjan" },
  { id: "age007", libelle: "BNI Yopougon" },
  { id: "age008", libelle: "BOA Adjamé" }
];

// Fonction utilitaire pour obtenir le libellé à partir d'un ID
export const getLibelleById = (data: Array<{ id: string; libelle: string }>, id: string): string => {
  if (!id || !Array.isArray(data)) return id || '';
  const item = data.find(d => d.id === id);
  return item?.libelle || id;
};

// Initialiser le localStorage avec les données de test si nécessaire
export const initializeMockData = () => {
  if (typeof window !== 'undefined') {
    // Vérifier si les données sont déjà présentes
    const storedDebiteurs = localStorage.getItem('debiteurs');
    
    if (!storedDebiteurs) {
      // Données de test initiales pour les débiteurs
      const mockDebiteurs = [
        {
          id: "1",
          codeDebiteur: "DEB-2024-001",
          categorieDebiteur: "cat001",
          typeDebiteur: "physique",
          email: "amadou.kone@example.com",
          adressePostale: "Cocody, Angré 8ème Tranche, Abidjan",
          nom: "Koné",
          prenom: "Amadou",
          civilite: "monsieur",
          dateNaissance: "1985-06-15",
          lieuNaissance: "Abidjan",
          nationalite: "nat001",
          quartier: "qua001",
          fonction: "fon001",
          profession: "prof010",
          employeur: "ent001",
          statutSalarie: "sta001",
          matricule: "MAT123456",
          sexe: "M",
          dateCreation: "2024-01-15",
          statut: "Actif"
        },
        {
          id: "2",
          codeDebiteur: "DEB-2024-002",
          categorieDebiteur: "cat001",
          typeDebiteur: "physique",
          email: "fatou.traore@example.com",
          adressePostale: "Plateau, Rue des Jardins, Abidjan",
          nom: "Traoré",
          prenom: "Fatou",
          civilite: "madame",
          dateNaissance: "1990-03-20",
          lieuNaissance: "Bamako",
          nationalite: "nat004",
          quartier: "qua002",
          fonction: "fon004",
          profession: "prof006",
          employeur: "ent003",
          statutSalarie: "sta001",
          sexe: "F",
          dateCreation: "2024-02-20",
          statut: "Actif"
        },
        {
          id: "3",
          codeDebiteur: "DEB-2024-003",
          categorieDebiteur: "cat002",
          typeDebiteur: "moral",
          email: "contact@societe-abc.com",
          adressePostale: "Yopougon, Zone Industrielle, Abidjan",
          raisonSociale: "Société ABC SARL",
          registreCommerce: "CI-ABJ-2024-A-12345",
          formeJuridique: "SARL",
          domaineActivite: "industrie",
          siegeSocial: "Yopougon, Zone Industrielle",
          nomGerant: "Koné Mamadou",
          dateCreation: "2024-03-10",
          statut: "Actif"
        },
        {
          id: "4",
          codeDebiteur: "DEB-2024-004",
          categorieDebiteur: "cat002",
          typeDebiteur: "moral",
          email: "info@commerce-dia.com",
          adressePostale: "Cocody, Boulevard de la République, Abidjan",
          raisonSociale: "Commerce Dia SARL",
          registreCommerce: "CI-ABJ-2024-B-67890",
          formeJuridique: "SARL",
          domaineActivite: "commerce",
          siegeSocial: "Cocody, Boulevard de la République",
          nomGerant: "Dia Aminata",
          dateCreation: "2024-04-05",
          statut: "Actif"
        }
      ];
      
      localStorage.setItem('debiteurs', JSON.stringify(mockDebiteurs));
    }
  }
};

