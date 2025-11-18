import { signOut as nextAuthSignOut } from "next-auth/react";

/**
 * Fonction utilitaire pour gérer la déconnexion de manière sécurisée
 * Nettoie complètement la session et force un hard refresh
 */
export async function handleSignOut(redirectUrl = "/login") {
  try {
    // Utiliser redirect: false pour contrôler manuellement la redirection
    await nextAuthSignOut({
      callbackUrl: redirectUrl,
      redirect: false
    });
    
    // Nettoyer le cache et le localStorage si nécessaire
    if (typeof window !== 'undefined') {
      // Ajouter un paramètre de query pour indiquer qu'on vient d'une déconnexion
      const separator = redirectUrl.includes('?') ? '&' : '?';
      const finalUrl = `${redirectUrl}${separator}signout=true&t=${Date.now()}`;
      
      // Supprimer tous les cookies liés à la session NextAuth
      const cookiesToDelete = [
        'next-auth.session-token',
        'next-auth.csrf-token',
        '__Secure-next-auth.session-token',
        '__Secure-next-auth.csrf-token',
      ];
      
      cookiesToDelete.forEach(cookieName => {
        // Supprimer pour le domaine actuel
        document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
        // Supprimer pour le domaine avec www
        document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;domain=${window.location.hostname};`;
        // Supprimer pour le domaine sans www
        document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;domain=.${window.location.hostname};`;
      });
      
      // Nettoyer le sessionStorage (on n'a plus besoin du flag car on utilise le query param)
      sessionStorage.clear();
      
      // Forcer un hard refresh vers la page de login
      // Utiliser window.location.replace pour éviter que l'utilisateur puisse revenir en arrière
      window.location.replace(finalUrl);
    }
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
    // Fallback: redirection manuelle avec hard refresh si NextAuth échoue
    if (typeof window !== 'undefined') {
      // Nettoyer les cookies manuellement
      const cookiesToDelete = [
        'next-auth.session-token',
        'next-auth.csrf-token',
        '__Secure-next-auth.session-token',
        '__Secure-next-auth.csrf-token',
      ];
      
      cookiesToDelete.forEach(cookieName => {
        document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
        document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;domain=${window.location.hostname};`;
        document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;domain=.${window.location.hostname};`;
      });
      
      sessionStorage.clear();
      
      // Ajouter un paramètre de query pour indiquer qu'on vient d'une déconnexion
      const separator = redirectUrl.includes('?') ? '&' : '?';
      const finalUrl = `${redirectUrl}${separator}signout=true&t=${Date.now()}`;
      
      // Forcer un hard refresh
      window.location.replace(finalUrl);
    }
  }
}

/**
 * Fonction utilitaire pour vérifier si l'utilisateur est authentifié
 */
export function isAuthenticated(session: any): boolean {
  return !!(session?.user && 'sessionId' in session.user && session.user.sessionId);
}
