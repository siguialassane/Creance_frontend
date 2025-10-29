"use client"

import { useEffect, useRef } from "react"
import { useSession } from "next-auth/react"

/**
 * Composant qui rafraîchit automatiquement le token avant son expiration
 * Évite les erreurs 401 en maintenant la session active
 */
export function TokenRefresher() {
  const { data: session, update } = useSession()
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const isRefreshingRef = useRef(false)

  useEffect(() => {
    const refreshToken = async () => {
      // Éviter les rafraîchissements multiples simultanés
      if (isRefreshingRef.current) {
        console.log('🔄 Rafraîchissement déjà en cours, skip...')
        return
      }

      try {
        isRefreshingRef.current = true
        const currentRefreshToken = (session as any)?.refreshToken

        if (!currentRefreshToken) {
          console.warn('⚠️ Pas de refresh token disponible')
          return
        }

        console.log('🔄 Rafraîchissement proactif du token...')
        const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081/api"

        const res = await fetch(`${baseURL}/auth/refresh`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${currentRefreshToken}` },
        })

        if (!res.ok) {
          console.error('🚨 Échec du rafraîchissement proactif:', res.status)
          return
        }

        const json = await res.json()
        const data = json?.data ?? json

        const newAccessToken = data?.token || data?.accessToken
        const newRefreshToken = data?.refreshToken
        const tokenType = data?.type || 'Bearer'
        const accessTokenExpiresAt = data?.expiresAt

        if (!newAccessToken) {
          console.error('🚨 Pas de nouveau token dans la réponse')
          return
        }

        console.log('✅ Token rafraîchi avec succès (proactif)')

        // Mettre à jour la session NextAuth
        await (update as any)({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken ?? currentRefreshToken,
          tokenType,
          accessTokenExpiresAt,
        })

      } catch (error) {
        console.error('🚨 Erreur lors du rafraîchissement proactif:', error)
      } finally {
        isRefreshingRef.current = false
      }
    }

    // Rafraîchir le token toutes les 4 minutes pour maintenir la session Oracle active
    // Le backend Oracle a un keepalive-interval de 5 minutes (300 secondes)
    // En rafraîchissant toutes les 4 minutes, on s'assure que la connexion reste active
    // ET on déclenche le keep-alive backend avant qu'Oracle ne ferme la connexion
    const REFRESH_INTERVAL = 4 * 60 * 1000 // 4 minutes en millisecondes

    // Démarrer le rafraîchissement périodique si on a une session
    if (session && (session as any)?.refreshToken) {
      console.log('🚀 Démarrage du rafraîchissement automatique du token (toutes les 4 minutes)')

      // Démarrer le rafraîchissement immédiatement puis toutes les 4 minutes
      refreshIntervalRef.current = setInterval(() => {
        refreshToken()
      }, REFRESH_INTERVAL)

      return () => {
        if (refreshIntervalRef.current) {
          clearInterval(refreshIntervalRef.current)
          refreshIntervalRef.current = null
        }
      }
    }
  }, [session, update])

  // Ce composant ne rend rien
  return null
}
