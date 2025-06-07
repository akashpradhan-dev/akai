import { supabase } from "@/utils/superbase/client";
import { useQuery } from "@tanstack/react-query";

interface MessageRequest {
  chat_id: string;
}

export interface History {
  created_at: string;
  id: string;
  user_id: string;
  title: string;
}

const fetchHistory = async ({ chat_id }: MessageRequest) => {
  const { data, error } = await supabase
    .from("messages")
    .select("content")
    .eq("chat_id", chat_id)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const useMessageList = ({ chat_id }: MessageRequest) => {
  return useQuery({
    queryKey: ["messagelist", chat_id],
    queryFn: () => fetchHistory({ chat_id }),
    enabled: !!chat_id,
  });
};
