"use client"

/**
 * Composant désactivé - Le rafraîchissement automatique des tokens est désactivé
 * Le token sera rafraîchi uniquement lors d'une erreur 401 (via l'intercepteur dans api.ts et useApiClient.ts)
 * Cela évite les rafraîchissements inutiles et réduit la charge serveur
 */
export function TokenRefresher() {
  // Ce composant ne fait plus rien - le rafraîchissement est géré uniquement par les intercepteurs
  return null
}
