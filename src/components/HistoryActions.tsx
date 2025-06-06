"use client";
import React from "react";
import { DropdownMenuItem, DropdownMenuSeparator } from "./ui/dropdown-menu";
import { IconFolder, IconTrash } from "@tabler/icons-react";
import { History } from "@/services/querys/getHistory";
import { useDeleteHistoryMutation } from "@/services/mutation/deleteHistory";

interface HistoryActionsProps {
  history: History;
}

export const HistoryActions = ({ history }: HistoryActionsProps) => {
  const { mutate: deleteHistory } = useDeleteHistoryMutation();

  const handleDeleteHistory = async (id: string) => {
    deleteHistory({ userId: id });
  };
  return (
    <>
      <DropdownMenuItem>
        <IconFolder />
        <span>Open</span>
      </DropdownMenuItem>

      <DropdownMenuSeparator />
      <DropdownMenuItem variant="destructive">
        <IconTrash />
        <button onClick={() => handleDeleteHistory(history?.id)}>Delete</button>
      </DropdownMenuItem>
    </>
  );
};
