"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { Prompts } from "./Prompts";
import { Spinner } from "@/components/Spinner";

interface InputAreaProps {
  onSend: (text: string) => void;
  onClear: () => void;
  isPending: boolean;
}

export const InputArea = ({ onSend, onClear, isPending }: InputAreaProps) => {
  const [value, setValue] = useState("");
  const [prompt, setPrompt] = useState("");

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
        <Prompts onChange={setPrompt} value={prompt} />
        <Button
          className="w-full md:flex-1 disabled:cursor-not-allowed"
          variant="default"
          onClick={() => {
            onSend(`${prompt} ${value}`.trim());
            setValue("");
          }}
          disabled={true}
        >
          Generate {isPending && <Spinner />}
        </Button>
        <Button
          className="w-full flex md:w-16 disabled:cursor-not-allowed"
          variant="outline"
          onClick={() => {
            onClear();
          }}
          disabled={isPending}
        >
          New
        </Button>
      </div>
    </div>
  );
};
