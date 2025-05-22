"use client";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import React from "react";

export const StartButton = () => {
  const { user } = useAuth();
  console.log("user", user);

  return (
    <Link
      href={user ? "/chart" : "/login"}
      className="mt-5 px-6 py-3 bg-[#217bfe] text-white text-sm rounded-full transition hover:bg-white hover:text-[#217bfe] border border-transparent hover:border-[#217bfe]"
    >
      Get Started
    </Link>
  );
};
