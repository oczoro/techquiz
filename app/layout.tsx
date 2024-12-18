import type { Metadata } from "next";
import {
  Roboto_Mono as SecondaryFont,
  Roboto_Flex as DefaultFont,
} from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "react-hot-toast";
import Providers from "@/providers/Providers";

const defaultFont = DefaultFont({
  subsets: ["latin"],
  weight: [
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900",
    "1000",
  ],
  variable: "--font-primary",
});

const secondaryFont = SecondaryFont({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  variable: "--font-secondary",
});

export const metadata: Metadata = {
  title: "TechQuiz",
  description:
    "Generate a custom quiz made of techinical questions using QuizAPI.io",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <html lang="en">
        <body
          className={cn(
            `antialiased ${secondaryFont.variable} ${defaultFont.variable}`,
            defaultFont.className,
          )}
        >
          <Toaster position="bottom-right" reverseOrder={false} />
          {children}
        </body>
      </html>
    </Providers>
  );
}
