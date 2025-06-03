"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/utils/superbase/client";
import React, { useEffect, useState } from "react";

export interface History {
  created_at: string;
  id: string;
  user_id: string;
  title: string;
}

export const HistorySidebar = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [history, setHistory] = useState<History[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchHistory = async () => {
      const { data } = await supabase
        .from("history")
        .select("*")
        .eq("user_id", user?.id);
      setHistory(data ?? []);
    };

    if (user?.id) {
      setLoading(true);
      fetchHistory();
      setLoading(false);
    }
  }, [user?.id]);

  return (
    <>
      <AppSidebar history={history} loading={loading} />
      <>{children}</>
    </>
  );
};
