import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import StoreProvider from "@/lib/StoreProvider";
import { WalletProvider } from "@/components/WalletProvider";
import { AutoConnectProvider } from "@/components/AutoConnectProvider";
import { Toaster } from "react-hot-toast";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Spacify",
  description: "a platform that’s reimagining the way we connect and interact in online communities",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable}  antialiased`}
      >
        <AutoConnectProvider>
          <WalletProvider>
            <Toaster
              position="top-center"
              reverseOrder={false}
            />
            <StoreProvider>
              {children}
            </StoreProvider>
          </WalletProvider>
        </AutoConnectProvider>
      </body>
    </html>
  );
}
