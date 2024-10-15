"use client";

import { UserButton } from "@clerk/nextjs";
import { Authenticated, Unauthenticated } from "convex/react";
import Link from "next/link";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex flex-col">
      <div className="container flex items-center justify-between p-4">
        <Link
          href="/"
          className="font-secondary text-xl font-medium text-slate-700"
        >
          tech<span className="text-gradient-brand"> quiz</span>
        </Link>
        <Authenticated>
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-lg">
              dashboard
            </Link>
            <UserButton />
          </div>
        </Authenticated>
        <Unauthenticated>
          <div className="drop-shadow-md transition duration-75 ease-in hover:translate-y-[3px]">
            <Link
              href="/sign-in"
              className="button hover:shadow-none active:brightness-90"
            >
              sign in
            </Link>
          </div>
        </Unauthenticated>
      </div>
      <main className="relative flex">{children}</main>
    </div>
  );
}
