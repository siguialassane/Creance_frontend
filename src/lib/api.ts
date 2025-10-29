import axios, { AxiosInstance } from "axios";
import { PaginationParams, ApiResponse, buildQueryParams } from "@/types/pagination";

// Type pour l'API client
export type ApiClient = AxiosInstance;

// Configuration de base pour Axios
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081/api",
  timeout: 60000, // Augmenté à 60 secondes pour les requêtes Oracle lentes
  headers: {
    "Content-Type": "application/json",
  },
});

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
        const session = await getSession();
        const token = (session as any)?.accessToken as string | undefined;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
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

    // Gérer les erreurs 401 (session expirée)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Tenter de rafraîchir le token automatiquement
        if (typeof window !== 'undefined') {
          const { getSession } = await import("next-auth/react");
          const session = await getSession();
          const refreshToken = (session as any)?.refreshToken;

          if (refreshToken) {
            console.log('🔄 Tentative de rafraîchissement du token après 401...');

            const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081/api";
            const refreshRes = await axios.post(`${baseURL}/auth/refresh`, null, {
              headers: { Authorization: `Bearer ${refreshToken}` },
            });

            if (refreshRes.data?.data?.token) {
              const newAccessToken = refreshRes.data.data.token;
              console.log('✅ Token rafraîchi avec succès, nouvelle tentative de la requête...');

              // Note: La session sera mise à jour par TokenRefresher au prochain cycle
              // Pour l'instant, on utilise directement le nouveau token pour cette requête

              // Réessayer la requête originale avec le nouveau token
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
              return apiClient(originalRequest);
            }
          }
        }
      } catch (refreshError) {
        console.error('❌ Échec du rafraîchissement du token:', refreshError);
      }

      // Si le refresh échoue, rediriger vers login
      if (typeof window !== 'undefined') {
        console.warn('Session expirée et impossible à rafraîchir, redirection vers /login');
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
