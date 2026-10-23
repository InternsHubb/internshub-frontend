import { createContext, useContext } from 'react';

// Shared sidebar state, modelled on shadcn/ui's SidebarProvider: one desktop state
// (expanded / collapsed to icons) and a separate open flag for the mobile drawer.
export type SidebarContextValue = {
  isCollapsed: boolean;
  setCollapsed: (value: boolean) => void;
  isMobileOpen: boolean;
  setMobileOpen: (value: boolean) => void;
  // Collapses/expands on desktop, opens/closes the drawer below the lg breakpoint.
  toggleSidebar: () => void;
};

export const SidebarContext = createContext<SidebarContextValue | null>(null);

export function useSidebar(): SidebarContextValue {
  const value = useContext(SidebarContext);
  if (!value) {
    throw new Error('useSidebar must be used inside <SidebarProvider>');
  }
  return value;
}
