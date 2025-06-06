import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export const Spinner = ({ className }: { className?: string }) => {
  return (
    <>
      <Loader2
        className={cn("animate-spin h-6 w-6 text-gray-500", className)}
      />
    </>
  );
};
