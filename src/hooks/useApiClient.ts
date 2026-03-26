import { useSession, signOut } from "next-auth/react"
import { useMemo, useRef } from "react"
import axios from "axios"

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

export function useApiClient() {
  const { data: session, status, update } = useSession({
    refetchInterval: 0, // Désactiver le rafraîchissement automatique
    refetchOnWindowFocus: false, // Ne pas rafraîchir lors du retour sur la fenêtre
  })
  
  // Utiliser useRef pour maintenir une référence stable du client
  const clientRef = useRef<ReturnType<typeof axios.create> | null>(null)
  
  const apiClient = useMemo(() => {
    // Créer le client seulement une fois
    if (!clientRef.current) {
      const client = axios.create({
        baseURL,
        timeout: 30000, // 30 secondes pour les requêtes lentes (Oracle, grandes listes)
        headers: {
          "Content-Type": "application/json",
        },
      })

      // Intercepteur pour les requêtes - récupère toujours la session la plus récente
      client.interceptors.request.use(
        async (config) => {
          // Récupérer la session à chaque requête pour avoir la version la plus récente
          try {
            const { getSession } = await import("next-auth/react");
            const currentSession = await getSession();
            const token = (currentSession as any)?.accessToken as string | undefined
            
            if (token) {
              config.headers.Authorization = `Bearer ${token}`
            } else {
              // Si pas de token et que la session est en cours de chargement
              if (status === 'loading') {
                console.warn('⚠️ Session en cours de chargement, token non disponible');
              }
            }
          } catch (error) {
            console.warn('⚠️ Erreur lors de la récupération de la session:', error);
          }
          return config
        },
        (error) => Promise.reject(error)
      )

      // Intercepteur pour les réponses
      client.interceptors.response.use(
        (response) => response,
        async (error) => {
          const originalRequest = error.config as any
          const statusCode = error.response?.status

          // Try refresh on 401 or 403 once
          if ((statusCode === 401 || statusCode === 403) && !originalRequest?._retry) {
            try {
              originalRequest._retry = true
              
              // Récupérer la session la plus récente pour le refresh token
              const { getSession } = await import("next-auth/react");
              let currentSession = await getSession();
              
              // Attendre un peu si la session n'est pas encore chargée
              if (!currentSession) {
                for (let i = 0; i < 3 && !currentSession; i++) {
                  await new Promise(resolve => setTimeout(resolve, 100));
                  currentSession = await getSession();
                }
              }
              
              const refreshToken = (currentSession as any)?.refreshToken as string | undefined
              if (!refreshToken) {
                throw new Error('Missing refresh token')
              }

              const res = await fetch(`${baseURL}/auth/refresh`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${refreshToken}` },
              })

              if (!res.ok) {
                throw new Error('Refresh failed')
              }
              const json = await res.json()
              const data = json?.data ?? json

              const newAccessToken: string | undefined = data?.token || data?.accessToken
              const newRefreshToken: string | undefined = data?.refreshToken
              const tokenType: string | undefined = data?.type || 'Bearer'
              const accessTokenExpiresAt: string | undefined = data?.expiresAt

              if (!newAccessToken) {
                throw new Error('No access token in refresh')
              }

              // Update next-auth session so future requests have new token
              try {
                await (update as any)({
                  accessToken: newAccessToken,
                  refreshToken: newRefreshToken ?? refreshToken,
                  tokenType,
                  accessTokenExpiresAt,
                })
              } catch (e) {
                console.warn('⚠️ Erreur lors de la mise à jour de la session:', e)
              }

              // Retry original request with new token immediately
              originalRequest.headers = originalRequest.headers || {}
              originalRequest.headers.Authorization = `${tokenType} ${newAccessToken}`
              return client(originalRequest)
            } catch (e) {
              // Refresh failed -> sign out
              // Ne pas rediriger si on est déjà sur la page de login pour éviter les boucles
              if (typeof window !== 'undefined') {
                const currentPath = window.location.pathname;
                if (currentPath !== '/login' && !currentPath.startsWith('/login')) {
                  try { 
                    // Utiliser handleSignOut qui nettoie complètement la session
                    const { handleSignOut } = await import("@/lib/auth-helpers");
                    await handleSignOut('/login');
                    // handleSignOut gère déjà la redirection
                  } catch {}
                }
              }
            }
          }

          return Promise.reject(error)
        }
      )

      clientRef.current = client
    }
    
    return clientRef.current
  }, [session, status, update])

  return apiClient
}
