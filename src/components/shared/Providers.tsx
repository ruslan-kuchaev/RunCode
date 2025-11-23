"use client";

import { SessionProvider } from "next-auth/react";
import { FixedMenu } from "../main/header/FixedMenu/FixedMenu";
import { AuthModal } from "@/components/features/auth";

export const Providers: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <SessionProvider>
      <FixedMenu />
      {children}
      <AuthModal />
    </SessionProvider>
  );
};
