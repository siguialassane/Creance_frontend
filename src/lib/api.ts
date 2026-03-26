import axios, { AxiosInstance } from "axios";
import { PaginationParams, ApiResponse, buildQueryParams } from "@/types/pagination";

// Type pour l'API client
export type ApiClient = AxiosInstance;

// Configuration de base pour Axios
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
  timeout: 60000, // Augmenté à 60 secondes pour les requêtes Oracle lentes
  headers: {
    "Content-Type": "application/json",
  },
});

console.log("🌐 [Axios] Initialized with baseURL:", apiClient.defaults.baseURL);
console.log("   -> Env var NEXT_PUBLIC_API_URL:", process.env.NEXT_PUBLIC_API_URL);

// Fonction utilitaire pour les requêtes paginées
export async function fetchPaginatedData<T>(
  endpoint: string,
  params: PaginationParams = {}
): Promise<ApiResponse<T>> {
  const queryParams = buildQueryParams(params);
  const url = queryParams.toString() ? `${endpoint}?${queryParams.toString()}` : endpoint;


  const response = await apiClient.get<ApiResponse<T>>(url);
  return response.data;
}

// Intercepteur pour les requêtes
apiClient.interceptors.request.use(
  async (config) => {
    // Récupérer le token depuis NextAuth (plus sécurisé)
    try {
      if (typeof window !== 'undefined') {
        const { getSession } = await import("next-auth/react");
        // Attendre que la session soit chargée (retry jusqu'à 3 fois avec délai)
        let session = null;
        let attempts = 0;
        const maxAttempts = 3;

        while (!session && attempts < maxAttempts) {
          session = await getSession();
          if (!session && attempts < maxAttempts - 1) {
            // Attendre un peu avant de réessayer (session en cours de chargement)
            await new Promise(resolve => setTimeout(resolve, 100));
          }
          attempts++;
        }

        const token = (session as any)?.accessToken as string | undefined;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          console.warn('⚠️ Pas de token disponible dans la session');
        }
      }
    } catch (error) {
      // Silently fail en cas d'erreur
      console.warn('Failed to get auth token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour les réponses avec retry automatique sur 401
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Gérer les erreurs 401 (session expirée ou token manquant)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Tenter de rafraîchir le token automatiquement
        if (typeof window !== 'undefined') {
          const { getSession } = await import("next-auth/react");

          // Attendre que la session soit chargée
          let session = null;
          let attempts = 0;
          const maxAttempts = 5;

          while (!session && attempts < maxAttempts) {
            session = await getSession();
            if (!session && attempts < maxAttempts - 1) {
              await new Promise(resolve => setTimeout(resolve, 200));
            }
            attempts++;
          }

          const refreshToken = (session as any)?.refreshToken;

          if (refreshToken) {
            console.log('🔄 Tentative de rafraîchissement du token après 401...');

            const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
            const refreshRes = await axios.post(`${baseURL}/auth/refresh`, null, {
              headers: { Authorization: `Bearer ${refreshToken}` },
            });

            const data = refreshRes.data?.data ?? refreshRes.data;
            const newAccessToken = data?.token || data?.accessToken;
            const newRefreshToken = data?.refreshToken;
            const tokenType = data?.type || 'Bearer';
            const accessTokenExpiresAt = data?.expiresAt;

            if (newAccessToken) {
              console.log('✅ Token rafraîchi avec succès, mise à jour de la session...');

              // Mettre à jour la session NextAuth immédiatement
              // Note: update() n'est disponible que dans un composant React
              // Le TokenRefresher se chargera de mettre à jour la session au prochain cycle
              // Pour l'instant, on utilise directement le nouveau token pour cette requête
              console.log('✅ Session sera mise à jour par TokenRefresher au prochain cycle');

              // Réessayer la requête originale avec le nouveau token
              originalRequest.headers.Authorization = `${tokenType} ${newAccessToken}`;
              return apiClient(originalRequest);
            } else {
              console.error('❌ Pas de token dans la réponse de refresh');
            }
          } else {
            console.warn('⚠️ Pas de refresh token disponible dans la session');
          }
        }
      } catch (refreshError) {
        console.error('❌ Échec du rafraîchissement du token:', refreshError);
      }

      // Si le refresh échoue, rediriger vers login
      // Ne pas rediriger si on est déjà sur la page de login pour éviter les boucles
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        if (currentPath !== '/login' && !currentPath.startsWith('/login')) {
          console.warn('Session expirée et impossible à rafraîchir, redirection vers /login');

          // Déconnecter d'abord en utilisant la fonction helper qui nettoie tout
          try {
            const { handleSignOut } = await import("@/lib/auth-helpers");
            // Utiliser handleSignOut qui nettoie complètement la session et les cookies
            await handleSignOut('/login');
            // handleSignOut gère déjà la redirection, donc on ne fait rien d'autre
            return Promise.reject(error);
          } catch (signOutError) {
            console.error('Erreur lors de la déconnexion:', signOutError);
            // Fallback: redirection manuelle
            window.location.replace('/login?signout=true&t=' + Date.now());
          }
        }
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
