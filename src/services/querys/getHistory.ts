import { supabase } from "@/utils/superbase/client";
import { useQuery } from "@tanstack/react-query";

interface HistoryRequest {
  userId: string;
}

export interface History {
  created_at: string;
  id: string;
  user_id: string;
  title: string;
}

const fetchHistory = async ({ userId }: HistoryRequest) => {
  const { data } = await supabase
    .from("history")
    .select("*")
    .eq("user_id", userId)
    .limit(10)
    .order("created_at", { ascending: false });

  return data;
};

export const useGetHistory = ({ userId }: HistoryRequest) => {
  return useQuery({
    queryKey: ["history"],
    queryFn: () => fetchHistory({ userId }),
    enabled: !!userId, // Only run the query if userId is provided
  });
};
