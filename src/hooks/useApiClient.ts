import { useSession, signOut } from "next-auth/react"
import { useMemo, useRef } from "react"
import axios from "axios"

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081/api"

export function useApiClient() {
  const { data: session, status, update } = useSession()
  
  // Utiliser useRef pour maintenir une référence stable du client
  const clientRef = useRef<ReturnType<typeof axios.create> | null>(null)
  
  const apiClient = useMemo(() => {
    // Créer le client seulement une fois
    if (!clientRef.current) {
      const client = axios.create({
        baseURL,
        timeout: 10000,
        headers: {
          "Content-Type": "application/json",
        },
      })

      // Intercepteur pour les requêtes
      client.interceptors.request.use(
        (config) => {
          // Ajouter le token d'authentification
          const token = (session as any)?.accessToken as string | undefined
          
          if (token) {
            config.headers.Authorization = `Bearer ${token}`
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
              const refreshToken = (session as any)?.refreshToken as string | undefined
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
              try { await signOut({ callbackUrl: '/login' } as any) } catch {}
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
