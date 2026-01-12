"use client";

import { SessionProvider } from "next-auth/react";
import { FixedMenu } from "../main/header/FixedMenu/FixedMenu";
import {LoginModal} from "@/components/main/header/FixedMenu/login/LoginModal";

export const Providers: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <SessionProvider>
        <LoginModal/>
        <FixedMenu />
        {children}
            {/*keypress    authmodal*/}


    </SessionProvider>
  );
}
