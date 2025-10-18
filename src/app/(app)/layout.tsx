"use client";

import { Providers } from "@/lib/providers";
import { SessionProvider } from "next-auth/react";
import MainLayout from "@/components/layout/main-layout";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <Providers>
        <MainLayout>
          {children}
        </MainLayout>
      </Providers>
    </SessionProvider>
  );
}
