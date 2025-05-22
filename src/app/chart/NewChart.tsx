"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";

interface NewChartProps {
  onSend: (text: string) => void;
  onClear: () => void;
  isPending: boolean;
}

export const NewChart = ({ onSend, onClear, isPending }: NewChartProps) => {
  const [value, setValue] = useState("");
  return (
    <div className="flex w-full p-3 cursor-text flex-col items-center justify-center rounded-lg bg-clip-padding contain-inline-size  shadow-sm sm:shadow-lg dark:shadow-none! dark:bg-[#303030]">
      <Textarea
        placeholder="Type your message here."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <div className="flex gap-2 w-full items-center justify-center ">
        <Button
          className="mt-4 w-full flex-1"
          variant="default"
          onClick={() => {
            onSend(value);
            setValue("");
          }}
          disabled={isPending}
        >
          {isPending ? (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8.009,8.009,0,0,1,12,20Z"
              />
            </svg>
          ) : (
            <span className="text-sm font-medium">Generate Chart </span>
          )}
        </Button>
        <Button
          className="mt-4"
          variant="outline"
          onClick={() => {
            onClear();
          }}
          disabled={isPending}
        >
          clear
        </Button>
      </div>
    </div>
  );
};
