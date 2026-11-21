import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '@/shared/components/navigation/Navbar';
import { Footer } from '@/shared/components/navigation/Footer';

export interface PublicLayoutProps {
  activeSection?: string;
  children?: ReactNode;
}

/**
 * Shared public site shell (Navbar + page content + Footer).
 */
export function PublicLayout({ activeSection = 'home', children }: PublicLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-white text-ink">
      <Navbar activeSection={activeSection} />
      <div className="flex flex-1 flex-col">{children ?? <Outlet />}</div>
      <Footer />
    </div>
  );
}

export default PublicLayout;
