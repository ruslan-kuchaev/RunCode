"use client";

import { SessionProvider } from "next-auth/react";
import { FixedMenu } from "../main/header/FixedMenu/FixedMenu";

export const Providers: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <>
      <FixedMenu />
      <SessionProvider>{children}</SessionProvider>
    </>
  );
};
