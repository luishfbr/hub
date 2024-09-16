import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const poppins = localFont({
  src: "./fonts/Poppins-Regular.woff",
  variable: "--font-poppins",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Hub de Sistemas",
  description: "Generated by create next app and Tauri",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
