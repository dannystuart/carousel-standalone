import type { Metadata } from "next";
import { fraunces } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Carousel — Built with Claude Code",
  description: "A themed card carousel with Fantasy and Cosmos modes.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${fraunces.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
