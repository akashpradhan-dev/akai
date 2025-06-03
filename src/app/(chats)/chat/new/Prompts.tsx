import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const prompts = [
  {
    value: "Optimize this code for performance and explain the changes",
    label: "Optimize for performance",
  },
  {
    value: "Refactor this function to follow clean code principles.",
    label: "Refactor for clean code",
  },
  {
    value: "Improve readability and maintainability of this code",
    label: "Improve readabily & maintainability",
  },
  {
    value: "Convert this JavaScript function to fully typed TypeScript.",
    label: "Convert to TypeScript",
  },
  {
    value:
      "Add comments and documentation to this code for better understanding.",
    label: "Add comments & documentation",
  },
  {
    value: "Identify and fix potential bugs in this code.",
    label: "Identify & fix bugs",
  },
];

interface PromptsProps {
  value?: string;
  onChange?: (value: string) => void;
}
export function Prompts({ value, onChange }: PromptsProps) {
  return (
    <>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full md:w-72">
          <SelectValue placeholder="Select a prompt" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Code Optimization & Clean-Up Prompts</SelectLabel>
            {prompts.map((prompt) => (
              <SelectItem key={prompt.value} value={prompt.value}>
                {prompt.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  );
}
