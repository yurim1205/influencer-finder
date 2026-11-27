import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthInitializer } from "@/components/AuthInitializer";
import { Toaster } from "react-hot-toast";

const SITE_URL= 'https://influencer-finder-eight.vercel.app';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),     // 사이트 기본 주소
  title: {
    default: 'Influencer Finder - 유튜브 인플루언서 채널 검색',
    template: '%s | Influencer Finder',
  },
  description:
    '키워드로 유튜브 채널을 검색하고 구독자 수와 평균 조회수를 비교해, 마케팅에 맞는 인플루언서를 찾고 관리해보세요.',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: SITE_URL,
    siteName: 'Influencer Finder',
    title: 'Influencer Finder - 유튜브 인플루언서 채널 검색',
    description: '키워드로 유튜브 채널을 검색하고, 마케팅에 맞는 인플루언서를 찾고 관리해보세요.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthInitializer />
        <Toaster position="top-center" />
        {children}
      </body>
    </html>
  );
}