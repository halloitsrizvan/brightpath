import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Inter, Outfit } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  metadataBase: new URL('https://brightpatheduvora.com'),
  title: {
    default: "BrightPath Eduvora | 1:1 Online Tuition Academy KG-12",
    template: "%s | BrightPath Eduvora"
  },
  description: "Learn Right. Grow Bright. High-quality 1:1 personalized online tuition for KG to 12th grade. Global standards, trusted tutors, and expert mentorship for academic excellence.",
  keywords: ["Online Tuition", "BrightPath Eduvora", "1:1 Mentorship", "KG-12 Tuition", "CBSE Tuition", "International Online Academy", "Personalized Learning"],
  authors: [{ name: "BrightPath Academy" }],
  creator: "BrightPath Eduvora",
  publisher: "BrightPath Eduvora",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "BrightPath Eduvora | Online Tuition Academy",
    description: "Personalized 1:1 mentorship and online coaching for KG-12 students worldwide.",
    url: "https://brightpatheduvora.com",
    siteName: "BrightPath Eduvora",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BrightPath Eduvora | 1:1 Online Tuition',
    description: 'Learn Right. Grow Bright. Personalized 1:1 mentorship for KG-12 students.',
    creator: '@brightpathedu',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/icon.png?v=2', type: 'image/png' },
      { url: '/favicon.ico?v=2', type: 'image/x-icon' }
    ],
    apple: [
      { url: '/icon.png?v=2', type: 'image/png' }
    ]
  }
};

export const viewport: Viewport = {
  themeColor: "#45308D",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${outfit.variable} antialiased selection:bg-primary/10 selection:text-primary`}
      >
        {children}
      </body>
    </html>
  );
}
