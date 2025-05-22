"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export const Header = () => {
  const { user, logout, loading } = useAuth();
  const [name, setName] = React.useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [loading, user, router]);

  return (
    <header className="flex items-center justify-between">
      <Link href="/" className="flex items-center font-bold gap-2">
        <Image
          src="/logo2.jpg"
          alt=""
          className="w-8 h-8 rounded-full"
          width={100}
          height={100}
        />
        <span>AKAI</span>
      </Link>
      <div className="user">
        {name && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
                <AvatarFallback>
                  {name?.slice(0, 2)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-2 w-56 cursor-pointer">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>

              <DropdownMenuItem>Name: {user?.name}</DropdownMenuItem>
              <DropdownMenuItem>Email: {user?.email}</DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem>
                <Button
                  onClick={() => {
                    logout();
                    router.replace("/login");
                    setName(null);
                  }}
                  className="w-full"
                >
                  Logout
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};
