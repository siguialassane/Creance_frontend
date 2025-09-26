"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const DebiteurRedirectPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Rediriger vers la nouvelle structure organisée
    router.replace("/etude_creance/debiteur/views");
  }, [router]);

  return null;
};

export default DebiteurRedirectPage;