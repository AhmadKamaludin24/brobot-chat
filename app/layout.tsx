import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Separator } from "@/components/ui/separator";
import { BotMessageSquare, Plus } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Brobot chat",
  description: "ai chat asisistant with brobot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex `}
      >
        <div className="flex max-sm:hidden w-80 p-3 h-svh flex-col items-center border-r-2 border-r-gray-200 bg-white/90">
          <div className="flex w-full items-center p-3 gap-2">
            <BotMessageSquare />
            <h1 className="text-xl font-bold">Brobot Chat</h1>
          </div>
          <button className="w-full p-2 mt-5 flex items-center gap-2 border-r-[1px] rounded-2xl mb-3 bg-white"><Plus/><span>New Chat</span></button>
          <Separator />
        </div>
        {children}
      </body>
    </html>
  );
}
