"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const DebiteurRedirectPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Rediriger directement vers les views sans vérification d'authentification
    router.replace("/etude_creance/debiteur/views");
  }, [router]);

  // Afficher un loader pendant la redirection
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin h-8 w-8 border-4 border-emerald-600 border-t-transparent rounded-full"></div>
    </div>
  );
};

export default DebiteurRedirectPage;