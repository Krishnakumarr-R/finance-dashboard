import type { Metadata } from "next";
import "./globals.css";
import { DarkModeWrapper } from "@/components/DarkModeWrapper";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Finance — Personal Finance Dashboard",
  description: "A clean, interactive personal finance dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", inter.variable)}>
      <body>
        <DarkModeWrapper>{children}</DarkModeWrapper>
      </body>
    </html>
  );
}
