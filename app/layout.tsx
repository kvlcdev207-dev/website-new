import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthProvider from "@/components/AuthProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Kathmandu Valley Leo Club",
  description:
    "Students of the campus, serving our community. Leadership · Experience · Opportunity · Service.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans bg-white text-gray-900 antialiased`}
      >
        <AuthProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">
              <div className="page-transition">{children}</div>
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}