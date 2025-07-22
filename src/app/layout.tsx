import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Artemis - Creative Writing Assistant",
  description: "AI-powered creative writing assistant for story development, character creation, and plot brainstorming",
  keywords: "creative writing, AI assistant, story development, character creation, plot brainstorming, writing help",
  authors: [{ name: "Artemis Team" }],
  creator: "Artemis",
  publisher: "Artemis",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" }
    ],
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Artemis - Creative Writing Assistant",
    description: "AI-powered creative writing assistant for story development, character creation, and plot brainstorming",
    url: "https://artemis-ai.vercel.app",
    siteName: "Artemis",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Artemis - Creative Writing Assistant",
    description: "AI-powered creative writing assistant for story development, character creation, and plot brainstorming",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased min-h-screen bg-background text-foreground`}>
        <div className="flex flex-col min-h-screen">
          <main className="flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
