import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "🍒 春哥影视 - 全部免费看",
  description: "小众精品剧、海外热门剧、冷门宝藏剧资源聚合，每日更新，追剧不用四处找",
  keywords: "影视资源,网盘资源,免费剧集,百度网盘,夸克网盘,热播剧,经典剧,动漫",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
      <Script
        id="la-51"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html:
            '(function(){var s=document.createElement("script");s.charset="UTF-8";s.id="LA_COLLECT";s.src="//sdk.51.la/js-sdk-pro.min.js";s.onload=function(){LA.init({id:"3QooyNfWuPPBrKfy",ck:"3QooyNfWuPPBrKfy"})};document.head.appendChild(s);})();',
        }}
      />
    </html>
  );
}
