import type { Metadata } from "next";
import { Bodoni_Moda, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const serif = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
});

const mono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Samuel Agyeman-Bio",
  description: "Samuel Agyeman-Bio directs, shoots and designs.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${serif.variable} ${mono.variable} antialiased`}>
      <body className="select-none bg-ink font-mono text-paper">{children}</body>
    </html>
  );
}
