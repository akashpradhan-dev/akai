"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { Prompts } from "./Prompts";

interface InputAreaProps {
  onSend: (text: string) => void;
  onClear: () => void;
  isPending: boolean;
}

export const InputArea = ({ onSend, onClear, isPending }: InputAreaProps) => {
  const [value, setValue] = useState("");
  return (
    <div className="flex w-full cursor-text flex-col items-center justify-center rounded-lg bg-clip-padding contain-inline-size  shadow-sm sm:shadow-lg dark:shadow-none!">
      <textarea
        rows={3}
        placeholder="Type your message here."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full resize-none rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="flex gap-2 mt-4 w-full items-center justify-center flex-col md:flex-row">
        <Prompts />
        <Button
          className="w-full md:flex-1"
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
          className="w-full flex md:w-36"
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
