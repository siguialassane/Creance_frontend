"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const CreanceRedirectPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Rediriger vers la nouvelle structure organisée
    router.replace("/etude_creance/creance/views");
  }, [router]);

  return null;
};

export default CreanceRedirectPage;