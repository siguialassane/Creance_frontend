"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const DebiteurRedirectPage = () => {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    // Attendre que la session soit chargée avant de rediriger
    if (status === "authenticated") {
      router.replace("/etude_creance/debiteur/views");
    } else if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [router, status]);

  // Afficher un loader pendant la vérification de la session
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-emerald-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return null;
};

export default DebiteurRedirectPage;