// Codes de statut de recouvrement (VARCHAR2(2) - maximum 2 caractères)
export const STATUT_RECOUVREMENT: Record<string, string> = {
  'EN': 'EN COURS',
  'SU': 'SUSPENDU',
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
    case 'EN':
      return 'default'; // Vert pour "EN COURS"
    case 'RE':
      return 'secondary'; // Gris pour "RECOUVRE"
    case 'SU':
      return 'outline'; // Orange pour "SUSPENDU"
    case 'AB':
      return 'destructive'; // Rouge pour "ABANDONNE"
    case 'CO':
      return 'destructive'; // Rouge pour "CONTENTIEUX"
    default:
      return 'outline';
  }
}
