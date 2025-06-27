import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "TipJar - Tips are what make us whole",
  description: "A website that can be used to fund your favourite creators to help them continue their projects.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[radial-gradient(#cdcbcb_1px,transparent_1px)] [background-size:16px_16px]`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
