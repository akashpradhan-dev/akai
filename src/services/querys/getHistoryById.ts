import { supabase } from "@/utils/superbase/client";
import { useQuery } from "@tanstack/react-query";

interface HistoryRequest {
  chatId: string;
}

export interface History {
  created_at: string;
  id: string;
  user_id: string;
  title: string;
}

const fetchHistory = async ({ chatId }: HistoryRequest) => {
  const { data } = await supabase
    .from("history")
    .select("*")
    .eq("id", chatId)
    .single();

  return data;
};

export const useGetHistoryById = ({ chatId }: HistoryRequest) => {
  return useQuery({
    queryKey: ["history", chatId],
    queryFn: () => fetchHistory({ chatId }),
    enabled: !!chatId, // Only run the query if userId is provided
  });
};
