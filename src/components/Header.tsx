"use client";
import Link from "next/link";
import React from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { SignOutButton, useUser } from "@clerk/nextjs";
import Image from "next/image";

export const Header = () => {
  const { isSignedIn, user, isLoaded } = useUser();

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
        <span>Ak AI</span>
      </Link>
      <div className="user">
        {isLoaded && isSignedIn && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
                <AvatarFallback>
                  {user?.firstName?.slice(0, 2)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-2 w-56 cursor-pointer">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem>
                <SignOutButton>
                  <button className="cursor-pointer">Sign out</button>
                </SignOutButton>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};
