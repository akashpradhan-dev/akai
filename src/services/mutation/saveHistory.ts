import { supabase } from "@/utils/superbase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { History } from "../querys/getHistory";

interface SaveHistory {
  title: string;
  userId: string;
}

const saveHistory = async ({
  title,
  userId,
}: SaveHistory): Promise<History[]> => {
  const response = await supabase
    .from("history")
    .insert({ title, user_id: userId });

  if (!response) {
    throw new Error("Failed to generate chart");
  }

  return response?.data || [];
};

export const useHistoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveHistory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["history"] });
    },
  });
};
