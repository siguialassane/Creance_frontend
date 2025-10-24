import { signOut as nextAuthSignOut } from "next-auth/react";

/**
 * Fonction utilitaire pour gérer la déconnexion de manière sécurisée
 * Évite les erreurs CSRF en utilisant redirect: true
 */
export async function handleSignOut(redirectUrl = "/login") {
  try {
    // Utiliser redirect: true pour laisser NextAuth gérer toute la logique
    await nextAuthSignOut({
      callbackUrl: redirectUrl,
      redirect: true
    });
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
    // Fallback: redirection manuelle si NextAuth échoue
    if (typeof window !== 'undefined') {
      window.location.href = redirectUrl;
    }
  }
}

/**
 * Fonction utilitaire pour vérifier si l'utilisateur est authentifié
 */
export function isAuthenticated(session: any): boolean {
  return !!(session?.user && 'sessionId' in session.user && session.user.sessionId);
}
