import type { Metadata, Viewport } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Analytics from "@/components/Analytics";
import { getSiteSettings } from "@/lib/site-settings";

if (!process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && process.env.NODE_ENV === "production") {
  console.warn("NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION is not set in production.");
}

const sourceSans = Source_Sans_3({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  variable: "--font-serif",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f5efe4",
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    metadataBase: new URL(settings.url),
    title: settings.defaultTitle,
    description: settings.description,
    applicationName: settings.name,
    authors: [{ name: settings.name, url: settings.url }],
    creator: settings.name,
    publisher: settings.name,
    category: settings.category,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "website",
      url: settings.url,
      siteName: settings.name,
      locale: settings.locale,
      title: settings.defaultTitle,
      description: settings.description,
      images: [
        {
          url: settings.defaultSocialImageUrl || "/opengraph-image",
          width: 1200,
          height: 630,
          alt: settings.defaultSocialImageAlt || settings.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: settings.defaultTitle,
      description: settings.description,
      images: [settings.defaultSocialImageUrl || "/twitter-image"],
    },
    icons: {
      icon: [
        { url: "/favicon-v4.svg", type: "image/svg+xml" },
        { url: "/favicon-v4.ico", sizes: "any" },
      ],
      shortcut: "/favicon-v4.ico",
      apple: "/apple-touch-icon-v4.png",
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
    manifest: "/manifest.webmanifest",
    other: {
      "geo.region": "TR",
      "geo.placename": "Türkiye",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();
  const htmlLang = settings.locale.replace("_", "-");

  return (
    <html lang={htmlLang}>
      <body className={`${sourceSans.variable} ${fraunces.variable}`}>
        <a href="#main-content" className="skip-link">
          İçeriğe geç
        </a>
        <Header siteName={settings.name} />
        <main id="main-content" className="site-main" tabIndex={-1}>
          {children}
        </main>
        <Footer
          siteName={settings.name}
          description={settings.organizationDescription}
          socialProfiles={settings.socialProfiles}
        />
        <Analytics />
      </body>
    </html>
  );
}
