import { useSession, signOut } from "next-auth/react"
import { useCallback } from "react"
import axios from "axios"

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

export function useApiClient() {
  const { data: session, status, update } = useSession()

  const apiClient = useCallback(() => {
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
        console.log('🔑 Token dans useApiClient:', token ? 'Présent' : 'Absent')
        console.log('📋 Session complète:', session)
        console.log('🔄 Status de la session:', status)
        console.log('🌐 URL de la requête:', config.url)
        console.log('📤 Headers avant ajout:', config.headers)
        
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
          console.log('✅ Token ajouté aux headers:', `Bearer ${token.substring(0, 20)}...`)
          console.log('📤 Headers après ajout:', config.headers)
        } else {
          console.warn('❌ Aucun token trouvé dans la session')
          console.log('🔍 Détails de la session:', {
            hasSession: !!session,
            hasUser: !!(session as any)?.user,
            hasAccessToken: !!(session as any)?.accessToken,
            sessionKeys: session ? Object.keys(session) : 'No session',
            sessionStatus: status
          })
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

        // Try refresh on 403 once
        if (statusCode === 403 && !originalRequest?._retry) {
          try {
            originalRequest._retry = true
            const refreshToken = (session as any)?.refreshToken as string | undefined
            if (!refreshToken) throw new Error('Missing refresh token')

            const res = await fetch(`${baseURL}/auth/refresh`, {
              method: 'POST',
              headers: { Authorization: `Bearer ${refreshToken}` },
            })

            if (!res.ok) throw new Error('Refresh failed')
            const json = await res.json()
            const data = json?.data ?? json

            const newAccessToken: string | undefined = data?.token || data?.accessToken
            const newRefreshToken: string | undefined = data?.refreshToken
            const tokenType: string | undefined = data?.type || 'Bearer'
            const accessTokenExpiresAt: string | undefined = data?.expiresAt

            if (!newAccessToken) throw new Error('No access token in refresh')

            // Update next-auth session so future requests have new token
            try {
              await (update as any)({
                accessToken: newAccessToken,
                refreshToken: newRefreshToken ?? refreshToken,
                tokenType,
                accessTokenExpiresAt,
              })
            } catch {}

            // Retry original request with new token immediately
            originalRequest.headers = originalRequest.headers || {}
            originalRequest.headers.Authorization = `${tokenType} ${newAccessToken}`
            return client(originalRequest)
          } catch (e) {
            // Refresh failed -> sign out
            try { await signOut({ callbackUrl: '/login' } as any) } catch {}
          }
        }

        if (statusCode === 401) {
          console.log('🚨 Erreur 401 - Token invalide ou expiré')
          try { await signOut({ callbackUrl: '/login' } as any) } catch {}
        }
        return Promise.reject(error)
      }
    )

    return client
  }, [session, status])

  return apiClient()
}
