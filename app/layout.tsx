import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Exam Answers",
  description: "Quick search for exam tickets",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}