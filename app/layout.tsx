import type { Metadata } from "next";
import { Geist, Geist_Mono, Nanum_Myeongjo } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const nanumMyeongjo = Nanum_Myeongjo({
  weight: ['400', '700', '800'],
  subsets: ['latin'],
  variable: '--font-nanum-myeongjo',
});

export const metadata: Metadata = {
  title: "AI 뉴스 콘텐츠 자동화 플랫폼",
  description: "Google Gemini API를 활용한 AI 기반 뉴스 및 콘텐츠 자동화 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${nanumMyeongjo.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
