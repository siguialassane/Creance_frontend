import axios from "axios";

// Configuration de base pour Axios
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

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

// Intercepteur pour les réponses
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Gérer les erreurs globalement
    if (error.response?.status === 401) {
      // Laisser NextAuth gérer la déconnexion
      try {
        if (typeof window !== 'undefined') {
          const { signOut } = await import("next-auth/react");
          await signOut({ callbackUrl: "/login" });
        }
      } catch (err) {
        console.warn('Failed to sign out:', err);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
