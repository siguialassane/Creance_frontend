import { useSession } from "next-auth/react";

export function useSessionWrapper() {
  const { data: session, status } = useSession({
    refetchInterval: 0, // Désactiver le rafraîchissement automatique
    refetchOnWindowFocus: false, // Ne pas rafraîchir lors du retour sur la fenêtre
  });
  
  return {
    data: session,
    status,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    isUnauthenticated: status === "unauthenticated",
  };
}







