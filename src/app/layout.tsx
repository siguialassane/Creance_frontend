import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Appli-Trésor",
  description: "Application de gestion de créances contentieuses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className="antialiased"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}

