"use client";

import { Providers } from "@/lib/providers";
import { SessionProvider } from "next-auth/react";
import MainLayout from "@/components/layout/main-layout";
import { TokenRefresher } from "@/components/auth/token-refresher";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider
      refetchInterval={0} // Désactiver le rafraîchissement automatique de la session
      refetchOnWindowFocus={false} // Ne pas rafraîchir lors du retour sur la fenêtre
    >
      <Providers>
        <TokenRefresher />
        <MainLayout>
          {children}
        </MainLayout>
      </Providers>
    </SessionProvider>
  );
}
