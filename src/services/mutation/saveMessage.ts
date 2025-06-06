import { supabase } from "@/utils/superbase/client";
import { useMutation } from "@tanstack/react-query";
import { History } from "../querys/getHistory";

interface SaveMessage {
  content: string;
  chart_id: string;
}

const saveMessage = async ({
  content,
  chart_id,
}: SaveMessage): Promise<History[]> => {
  const response = await supabase.from("message").insert({ content, chart_id });

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
