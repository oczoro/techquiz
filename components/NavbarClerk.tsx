"use client";

import { UserButton } from "@clerk/nextjs";
import { AuthLoading, Authenticated, Unauthenticated } from "convex/react";
import Link from "next/link";

const Skeleton = () => {
  return (
    <div className="flex animate-pulse items-center gap-6">
      <div className="h-4 w-20 rounded-sm bg-slate-300"></div>
      <div className="h-9 w-9 rounded-full bg-slate-300"></div>
    </div>
  );
};

const NavbarClerk = () => {
  return (
    <>
      <Authenticated>
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-lg">
            dashboard
          </Link>
          <UserButton />
        </div>
      </Authenticated>
      <Unauthenticated>
        <Link href="/sign-in" className="button">
          sign in
        </Link>
      </Unauthenticated>
      <AuthLoading>
        <Skeleton />
      </AuthLoading>
    </>
  );
};

export default NavbarClerk;
