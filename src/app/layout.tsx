import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";


export const metadata: Metadata = {
  title: "Chat-app",
  description: "Chat-app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
       <AppProvider>
        {children}
       </AppProvider>
      </body>
    </html>
  );
}
