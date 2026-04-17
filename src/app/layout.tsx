import type { Metadata } from 'next';
import { AnalyticsProvider } from '@/lib/tracking/provider';
import { PageLayout } from '@/components/layouts/page-layout';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Yamaha Costa Rica — Motos, Cuadraciclos & Marino',
    template: '%s — Yamaha Costa Rica',
  },
  description:
    'Distribuidor autorizado Yamaha en Costa Rica. Motos, cuadraciclos, productos marinos. Cotizá en línea, financiamiento disponible.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://yamahacr.com'),
  openGraph: {
    type: 'website',
    locale: 'es_CR',
    siteName: 'Yamaha Costa Rica',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <head>
        <link
          rel="preload"
          href="https://cdn.jsdelivr.net/fontsource/fonts/geist:vf@latest/latin-wght-normal.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
@font-face {
  font-family: 'Geist';
  font-style: normal;
  font-display: swap;
  font-weight: 100 900;
  src: url('https://cdn.jsdelivr.net/fontsource/fonts/geist:vf@latest/latin-wght-normal.woff2') format('woff2-variations');
  unicode-range: U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;
}`,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col font-sans">
        <AnalyticsProvider>
          <PageLayout>{children}</PageLayout>
        </AnalyticsProvider>
      </body>
    </html>
  );
}
