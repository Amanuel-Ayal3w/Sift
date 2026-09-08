import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { ApolloWrapper } from "@/lib/apollo-wrapper";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sift — AI Lead Qualification",
  description:
    "An AI agent that qualifies inbound leads for your team — enriching, scoring, and drafting replies in real time.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <ApolloWrapper>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </ApolloWrapper>
      </body>
    </html>
  );
}
