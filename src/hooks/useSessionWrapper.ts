import { useSession } from "next-auth/react";

export function useSessionWrapper() {
  const { data: session, status } = useSession();
  
  return {
    data: session,
    status,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    isUnauthenticated: status === "unauthenticated",
  };
}

