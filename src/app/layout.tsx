import type { Metadata, Viewport } from "next";
import "./globals.css";
import { profile } from "@/data/profile";
import { verifyCvFileExists } from "@/lib/cvCheck";
import CursorGlow from "@/components/CursorGlow";

// Verify CV PDF existence during boot
verifyCvFileExists();

export const viewport: Viewport = {
  themeColor: "#05080A",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1
};

export const metadata: Metadata = {
  metadataBase: new URL("https://chethankumar.dev"),
  title: profile.title,
  description: profile.metaDescription,
  authors: [{ name: profile.displayName, url: profile.links.github }],
  keywords: [
    "Chethan Kumar",
    "Ethical Hacker",
    "Cybersecurity",
    "Red Team",
    "Vulnerability Assessment",
    "Cyber Range",
    "NO ENTRY",
    "Atria Institute of Technology",
    "Bengaluru"
  ],
  creator: profile.displayName,
  icons: {
    icon: "/icon.svg"
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://chethankumar.dev",
    siteName: "Chethan Kumar Portfolio",
    title: profile.title,
    description: profile.summary,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: profile.title
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: profile.title,
    description: profile.summary,
    creator: "@chethankumar",
    images: ["/opengraph-image"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.displayName,
    jobTitle: "Aspiring Ethical Hacker & Cybersecurity Learner",
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Atria Institute of Technology",
      department: "Computer Science and Design Engineering"
    },
    email: profile.email,
    url: "https://chethankumar.dev",
    sameAs: [
      profile.links.github,
      profile.links.linkedin,
      profile.links.youtube,
      profile.links.instagram
    ],
    knowsAbout: [
      "Ethical Hacking",
      "Offensive Security",
      "Vulnerability Assessment",
      "Cyber Range Development",
      "Network Reconnaissance",
      "OWASP Top 10",
      "Reverse Engineering"
    ]
  };

  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#05080A] text-[#D7FFE9] selection:bg-[#00FF9C]/20 selection:text-white relative min-h-screen overflow-x-hidden antialiased">
        {/* Subtle scanline overlay */}
        <div className="scanlines-overlay fixed inset-0 z-50 pointer-events-none opacity-40" />

        {/* Custom cursor glow (desktop only, non-touch, prefers-reduced-motion safe) */}
        <CursorGlow />

        {children}
      </body>
    </html>
  );
}
