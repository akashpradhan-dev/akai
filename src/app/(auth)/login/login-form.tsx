"use client";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { useLogInMutation } from "@/services/mutation/login";
import { Spinner } from "@/components/Spinner";

interface LoginFormProps {
  className?: string;
}

interface FormData {
  email: string;
  password: string;
}

export function LoginForm({ className, ...props }: LoginFormProps) {
  const { login } = useAuth();
  const { mutate, isPending, error: loginError, isError } = useLogInMutation();
  const router = useRouter();
  // const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
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
    try {
      if (!formData.email || !formData.password) {
        setError("Please fill in all fields");
        return;
      }
      setError(null);
      mutate(
        {
          email: formData.email,
          password: formData.password,
        },
        {
          onSuccess: (data) => {
            toast.success("Login successful", {
              position: "top-right",
              richColors: true,
            });

            const token = data.session?.access_token;

            const user = {
              email: data?.user?.email ?? "",
              name: data?.user?.user_metadata.name ?? "",
              id: data?.user?.id,
            };

            if (!token || !user.id) {
              setError("Login failed. Please try again.");
              return;
            }

            login({
              user,
              token,
            });

            router.replace("/chat/new");
          },
        }
      );
    } catch (error) {
      console.log("Error during login:", error);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Login</h1>
                <p className="text-muted-foreground text-balance">
                  Welcome back! Please login to continue.
                </p>
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
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  name="password"
                  onChange={handleInputChange}
                  value={formData?.password}
                  placeholder="********"
                />
              </div>
              {error && <div className="text-red-500 text-sm">{error}</div>}
              {isError && (
                <div className="text-red-500 text-sm">
                  {loginError?.message || "Login failed. Please try again."}
                </div>
              )}
              <Button
                type="button"
                onClick={handleSubmit}
                className="w-full"
                disabled={isPending}
              >
                Login
                {isPending && <Spinner className="h-4 w-4" />}
              </Button>

              <span className="text-center text-sm">
                Don&apos;t have an account?
                <Link className="text-blue-400" href={"/sign-up"}>
                  {" "}
                  Sign Up
                </Link>
              </span>
            </div>
          </form>
          <div className="bg-primary/50 relative hidden md:block">
            <div className="absolute inset-0 bg-[#000] opacity-90">
              <Image
                fill
                src="/ai-homepage.webp"
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
