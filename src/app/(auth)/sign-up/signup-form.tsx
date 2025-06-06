"use client";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { useSignUpMutation } from "@/services/mutation/signUp";
import { Spinner } from "@/components/Spinner";

interface SignupProps {
  className?: string;
}

interface FormData {
  email: string;
  password: string;
  fullName: string;
}

export function Signup({ className, ...props }: SignupProps) {
  const router = useRouter();
  const { mutate, isPending } = useSignUpMutation();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    fullName: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }
    setError(null);

    mutate(
      {
        email: formData.email,
        password: formData.password,
        name: formData.fullName,
      },
      {
        onSuccess: () => {
          toast.success(
            "Verification email sent. Please confirm to activate your account.",
            {
              position: "top-right",
              richColors: true,
            }
          );
          router.replace("/login");
        },
        onError: (error) => {
          setError(error.message);
        },
      }
    );
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Signup</h1>
                <p className="text-muted-foreground text-balance">
                  Create an account to get started
                </p>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  name="fullName"
                  placeholder="John Doe"
                  onChange={handleInputChange}
                  value={formData?.fullName}
                  required
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="m@example.com"
                  onChange={handleInputChange}
                  value={formData?.email}
                  required
                />
              </div>

              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  name="password"
                  onChange={handleInputChange}
                  value={formData?.password}
                  placeholder="*********"
                />
              </div>
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <Button
                type="button"
                onClick={handleSubmit}
                className="w-full"
                disabled={isPending}
              >
                Signup
                {isPending && <Spinner className="h-4 w-4" />}
              </Button>
              <span className="text-center text-sm">
                Already have an account?
                <Link className="text-blue-400" href={"/login"}>
                  Login
                </Link>
              </span>
            </div>
          </form>
          <div className="bg-primary/50 relative hidden md:block">
            <div className="absolute inset-0 bg-[#000] opacity-90">
              <Image
                width={500}
                height={500}
                src="/signup.jpg"
                alt="Image"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
