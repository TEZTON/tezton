"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { usePathname } from "next/navigation";
import {
  Authentication,
  RedirectIfAuthenticated,
} from "@/components/auth/Authentication";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathName = usePathname();
  const queryClient = new QueryClient();

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Tezton Dashboard" />
        <title>Tezton Dashboard</title>
      </head>
      <QueryClientProvider client={queryClient}>
        {pathName === "/login" || pathName === "/register" ? (
          <body className={inter.className}>
            <RedirectIfAuthenticated>{children}</RedirectIfAuthenticated>
          </body>
        ) : (
          <body className={inter.className}>
            <Authentication>{children}</Authentication>
          </body>
        )}
      </QueryClientProvider>
    </html>
  );
}
