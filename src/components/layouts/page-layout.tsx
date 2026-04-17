import { Header } from './header/header';
import { Footer } from './footer';
import { BrandStrip } from '@/components/blocks';
import { ContactFab } from '@/components/patterns/contact-fab';

interface PageLayoutProps {
  children: React.ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Ir al contenido
      </a>
      <div className="global-noise" aria-hidden="true" />
      <Header />
      <main id="main-content" className="relative z-base flex-1">
        {children}
      </main>
      <BrandStrip />
      <Footer />
      <ContactFab />
    </>
  );
}
