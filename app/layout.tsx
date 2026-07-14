import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const appName = "Я знаю Алину лучше всех";

export const metadata: Metadata = {
  title: appName,
  description: "Насколько хорошо ты знаешь Алину?",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
