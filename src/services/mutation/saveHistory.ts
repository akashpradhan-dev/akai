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
  const { data, error } = await supabase
    .from("history")
    .insert({ title, user_id: userId })
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
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
