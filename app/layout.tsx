"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { usePathname } from "next/navigation";
import {
  Authentication,
  RedirectIfAuthenticated,
} from "@/components/auth/Authentication";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { trpc, trpcClient } from "@/trpc";

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

      {pathName === "/login" || pathName === "/register" ? (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
            <body className={inter.className}>
              <RedirectIfAuthenticated>{children}</RedirectIfAuthenticated>
            </body>
          </QueryClientProvider>
        </trpc.Provider>
      ) : (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
            <body className={inter.className}>
              <ReactQueryDevtools initialIsOpen={false} />
              <Authentication>{children}</Authentication>
            </body>
          </QueryClientProvider>
        </trpc.Provider>
      )}
    </html>
  );
}
