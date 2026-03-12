import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSiteSettings } from "@/lib/site-settings";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#081120",
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
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",
    },
    manifest: "/manifest.webmanifest",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  return (
    <html lang="tr">
      <body>
        <Header siteName={settings.name} />
        <main className="container">{children}</main>
        <Footer
          siteName={settings.name}
          description={settings.organizationDescription}
          socialProfiles={settings.socialProfiles}
        />
      </body>
    </html>
  );
}
