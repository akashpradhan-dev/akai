"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useGetHistory } from "@/services/querys/getHistory";

export const HistorySidebar = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const { data, error, isPending } = useGetHistory({ userId: user?.id || "" });

  return (
    <>
      <AppSidebar history={data} loading={isPending} error={error} />
      <>{children}</>
    </>
  );
};
