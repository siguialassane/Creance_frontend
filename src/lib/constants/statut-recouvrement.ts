// Codes de statut de recouvrement (VARCHAR2(2) - maximum 2 caractères)
export const STATUT_RECOUVREMENT: Record<string, string> = {
  'C': 'EN COURS',
  'EN': 'EN COURS',
  'AC': 'AMIABLE CONTENTIEUX',
  'A': 'AMIABLE',
  'S': 'SOLDE',
  'SU': 'SUSPENDU',
  'SUSPENDU': 'SUSPENDU',
  'RE': 'RECOUVRE',
  'AB': 'ABANDONNE',
  'CO': 'CONTENTIEUX',
};

// Fonction pour obtenir le libellé d'un statut
export function getStatutRecouvrementLibelle(code: string): string {
  return STATUT_RECOUVREMENT[code] || code || 'Non défini';
}

// Fonction pour obtenir la couleur/variant d'un badge selon le statut
export function getStatutRecouvrementVariant(code: string): "default" | "secondary" | "destructive" | "outline" {
  switch (code) {
    case 'C':
    case 'EN':
      return 'default'; // Vert pour "EN COURS"
    case 'A':
      return 'default'; // Vert pour "AMIABLE"
    case 'AC':
      return 'destructive'; // Rouge pour "AMIABLE CONTENTIEUX"
    case 'S':
      return 'secondary'; // Gris pour "SOLDE"
    case 'RE':
      return 'secondary'; // Gris pour "RECOUVRE"
    case 'SU':
    case 'SUSPENDU':
      return 'outline'; // Orange pour "SUSPENDU"
    case 'AB':
      return 'destructive'; // Rouge pour "ABANDONNE"
    case 'CO':
      return 'destructive'; // Rouge pour "CONTENTIEUX"
    default:
      return 'outline';
  }
}
