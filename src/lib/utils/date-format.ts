/**
 * Formate une date pour les inputs de type date (YYYY-MM-DD)
 * Gère différents formats de date possibles depuis l'API
 */
export function formatDateForInput(dateValue: string | null | undefined): string {
  if (!dateValue) return '';
  
  // Si c'est déjà au format YYYY-MM-DD, le retourner tel quel
  if (typeof dateValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
    return dateValue;
  }
  
  // Si c'est un timestamp ou une date ISO complète
  try {
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) {
      return '';
    }
    
    // Extraire l'année, le mois et le jour
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.warn('Erreur lors du formatage de la date:', dateValue, error);
    return '';
  }
}

/**
 * Formate un numéro de téléphone pour PhoneInput
 * Ajoute l'indicatif +225 si nécessaire pour la Côte d'Ivoire
 */
export function formatPhoneForInput(phoneValue: string | null | undefined): string {
  if (!phoneValue) return '';
  
  // Si c'est déjà au format international (+225...), le retourner tel quel
  if (phoneValue.startsWith('+')) {
    return phoneValue;
  }
  
  // Si c'est un numéro local, ajouter l'indicatif CI
  const cleanPhone = phoneValue.replace(/\s/g, '').replace(/^0+/, ''); // Supprimer les espaces et les zéros en début
  if (cleanPhone) {
    return `+225${cleanPhone}`;
  }
  
  return phoneValue;
}
