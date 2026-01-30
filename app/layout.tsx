import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { LoadingProvider } from "@/components/providers/loading-provider";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Shop!ManeF/x - Authentic Kirkland Minoxidil Ghana",
  description: "Original beard growth solutions with local support in Accra.",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {/* NO NAVBAR OR FOOTER HERE. 
              This allows the Admin to have its own layout 
              without the shop's navigation appearing.
          */}
          <LoadingProvider>
          {children}
          </LoadingProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}