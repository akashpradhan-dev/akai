"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ClerkProvider } from "@clerk/nextjs";
// const PUBLISHABLE_KEY =
//   process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY! ??
//   "pk_test_cHJvdmVuLWZpbmNoLTIzLmNsZXJrLmFjY291bnRzLmRldiQ";

interface ProvidersProps {
  children: React.ReactNode;
}

const queryClient = new QueryClient();

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <SidebarProvider>{children}</SidebarProvider>
      </QueryClientProvider>
    </>
  );
};
