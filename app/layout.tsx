import type React from "react"
import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { PWAStatus } from "@/components/pwa-status"
import { Analytics } from "@vercel/analytics/next"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
})

export const metadata: Metadata = {
  title: {
    default: "AskWajdi - Get Expert Software Engineering Help",
    template: "%s | AskWajdi"
  },
  description: "Connect with experienced software engineers and get expert help with your coding questions. Ask about programming languages, frameworks, debugging, architecture, and technical challenges.",
  keywords: [
    "software engineering",
    "programming help",
    "coding questions",
    "technical support",
    "developer assistance",
    "programming mentor",
    "code review",
    "debugging help",
    "software architecture",
    "web development",
    "mobile development",
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "Python",
    "Java",
    "programming advice"
  ],
  authors: [{ name: "Wajdi Ballout", url: "https://askwajdi.com" }],
  creator: "Wajdi Ballout",
  publisher: "AskWajdi",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://askwajdi.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "AskWajdi - Get Expert Software Engineering Help",
    description: "Connect with experienced software engineers and get expert help with your coding questions. Ask about programming languages, frameworks, debugging, and more.",
    url: "https://askwajdi.com",
    siteName: "AskWajdi",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/wajdi-profile.jpg",
        width: 1200,
        height: 630,
        alt: "AskWajdi - Software Engineering Help",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AskWajdi - Get Expert Software Engineering Help",
    description: "Connect with experienced software engineers and get expert help with your coding questions.",
    images: ["/images/wajdi-profile.jpg"],
    creator: "@wajdiballout",
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
  verification: {
    google: "google-site-verification-code", // Replace with actual verification code
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        
        {/* PWA Meta Tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="AskWajdi" />
        <meta name="msapplication-TileImage" content="/android-chrome-192x192.png" />
        <meta name="msapplication-config" content="none" />
        
        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "AskWajdi",
              "description": "Get expert software engineering help from experienced developers. Ask questions about programming, debugging, architecture, and technical challenges.",
              "url": "https://askwajdi.com",
              "author": {
                "@type": "Person",
                "name": "Wajdi Ballout",
                "url": "https://askwajdi.com"
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://askwajdi.com/?q={search_term_string}",
                "query-input": "required name=search_term_string"
              },
              "mainEntity": {
                "@type": "FAQPage",
                "description": "Platform for software engineers to ask questions and get expert help with coding challenges"
              }
            })
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        {children}
        <Analytics />
        <PWAStatus />
        <Toaster />
      </body>
    </html>
  )
}
