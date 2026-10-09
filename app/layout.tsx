import type { Metadata } from "next";
import { Eczar } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

// Eczar is the default font for the whole app.
// It covers English (Latin) and Nepali (Devanagari) in one family.
const eczar = Eczar({
  subsets: ["latin", "devanagari"],
  weight: ["400", "500", "700", "800"],
  display: "swap",
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
        className={`${eczar.className} bg-white text-gray-900 antialiased`}
      >
        {/* Flex column keeps the footer at the bottom on short pages */}
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
