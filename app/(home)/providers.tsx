"use client";
import { ReactNode, FC } from "react";
import { SessionProvider } from "next-auth/react";
import ThemeProviderWrapper from "../providers/theme-provider";

interface ProvidersProps {
  children: ReactNode;
}

const Providers: FC<ProvidersProps> = ({ children }) => {
  return (
    <SessionProvider>
      {/* 
        مطمئن شوید در داخل ThemeProviderWrapper از next-themes استفاده می‌کنید 
        و ویژگی‌هایی مثل disableTransitionOnChange را برای هماهنگی بهتر انیمیشن‌ها فعال کرده‌اید.
      */}
      <ThemeProviderWrapper>
        {children}
      </ThemeProviderWrapper>
    </SessionProvider>
  );
};

export default Providers;