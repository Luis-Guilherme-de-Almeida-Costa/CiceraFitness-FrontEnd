import type { Metadata } from "next";
import { inter } from "@/app/ui/fonts";
import "@/app/ui/global.css";

export const metadata: Metadata = {
  title: "Cicera Fitness",
  description: "Loja online de roupas fitness",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className={`${inter.className} min-h-full flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
