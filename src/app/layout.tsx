import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Inter, Outfit } from "next/font/google";
import Script from "next/script";
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
  metadataBase: new URL('https://www.brightpatheduvora.com'),
  title: {
    default: "BrightPath Eduvora | 1:1 Online Tuition & Expert Mentors for KG-12",
    template: "%s | BrightPath Eduvora"
  },
  description: "BrightPath Eduvora provides personalized 1:1 online tuition for KG to 12th grade students. Certified expert tutors for CBSE, ICSE, State & IGCSE boards.",
  keywords: [
    "Online Tuition", 
    "BrightPath Eduvora", 
    "1:1 Online Tuition", 
    "Online Tutor", 
    "Expert Tutor", 
    "KG to 12th Grade Tuition", 
    "CBSE Tuition", 
    "ICSE Tuition", 
    "Kerala State Board Tuition", 
    "Personalized Learning", 
    "Online Coaching Academy"
  ],
  authors: [{ name: "BrightPath Eduvora" }],
  creator: "BrightPath Eduvora",
  publisher: "BrightPath Eduvora",
  alternates: {
    canonical: 'https://www.brightpatheduvora.com',
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "BrightPath Eduvora | 1:1 Online Tuition & Expert Mentors",
    description: "Personalized 1:1 online tuition for KG to 12th grade students. Expert tutors, flexible scheduling, and custom study plans.",
    url: "https://www.brightpatheduvora.com",
    siteName: "BrightPath Eduvora",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/bn2.png",
        width: 1200,
        height: 630,
        alt: "BrightPath Eduvora Online Tuition",
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BrightPath Eduvora | 1:1 Online Tuition Academy',
    description: 'Personalized 1:1 online tuition for KG to 12th grade students with expert mentors.',
    creator: '@brightpathedu',
    images: ['/bn2.png'],
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
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <head>
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${outfit.variable} antialiased selection:bg-primary/10 selection:text-primary`}
      >
        {children}
      </body>
    </html>
  );
}
