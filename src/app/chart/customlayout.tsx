import { Header } from "@/components/Header";
import React from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <section className="w-full flex flex-col items-center justify-center ">
        <div className="flex flex-col max-w-4xl items-center w-full">
          {children}
        </div>
      </section>
    </>
  );
}
