import { supabase } from "@/utils/superbase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { History } from "../querys/getHistory";

interface DeleteHistory {
  userId: string;
}

const deleteHistory = async ({ userId }: DeleteHistory): Promise<History[]> => {
  const { data, error } = await supabase
    .from("history")
    .delete()
    .eq("id", userId);

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
};

export const useDeleteHistoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteHistory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["history"] });
    },
  });
};
