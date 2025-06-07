import { supabase } from "@/utils/superbase/client";
import { useMutation } from "@tanstack/react-query";

type SingleMessage = {
  role: "user" | "bot";
  parts: { text: string }[];
};
export interface CombinedMessage {
  user: SingleMessage;
  bot: SingleMessage;
}

interface MessageRow {
  id: string;
  chart_id: string;
  content: CombinedMessage;
  created_at: string;
}

interface SaveMessageRequest {
  content: CombinedMessage;
  chat_id: string;
}

const saveMessage = async ({
  content,
  chat_id,
}: SaveMessageRequest): Promise<MessageRow[]> => {
  const response = await supabase.from("messages").insert({ content, chat_id });

  if (!response) {
    throw new Error("Failed to generate chart");
  }

  return response?.data || [];
};

export const useMessageMutation = () => {
  return useMutation({
    mutationFn: saveMessage,
  });
};
