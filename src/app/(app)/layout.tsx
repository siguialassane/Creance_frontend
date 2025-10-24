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
    <SessionProvider>
      <Providers>
        <TokenRefresher />
        <MainLayout>
          {children}
        </MainLayout>
      </Providers>
    </SessionProvider>
  );
}
