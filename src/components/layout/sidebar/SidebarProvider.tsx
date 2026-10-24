import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';

import { SidebarContext, type SidebarContextValue } from './SidebarContext';

const STORAGE_KEY = 'internshub_sidebar_collapsed';
// Matches Tailwind's `lg` breakpoint: the sidebar is docked from here up, a drawer below it.
const DESKTOP_QUERY = '(min-width: 1024px)';
const SHORTCUT_KEY = 'b';

function readStoredCollapsed(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

function storeCollapsed(value: boolean): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, value ? '1' : '0');
  } catch {
    // Storage can be blocked (private mode); the state still works for this visit.
  }
}

function isDesktopViewport(): boolean {
  return typeof window !== 'undefined' && window.matchMedia(DESKTOP_QUERY).matches;
}

type SidebarProviderProps = { children: ReactNode };

export function SidebarProvider({ children }: SidebarProviderProps) {
  const [isCollapsed, setCollapsedState] = useState(readStoredCollapsed);
  const [isMobileOpen, setMobileOpen] = useState(false);

  const setCollapsed = useCallback((value: boolean) => {
    setCollapsedState(value);
    storeCollapsed(value);
  }, []);

  const toggleSidebar = useCallback(() => {
    if (isDesktopViewport()) {
      setCollapsedState((current) => {
        storeCollapsed(!current);
        return !current;
      });
    } else {
      setMobileOpen((current) => !current);
    }
  }, []);

  // Ctrl/Cmd + B toggles the sidebar, as in shadcn/ui.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === SHORTCUT_KEY && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebar]);

  // Leaving the mobile range closes the drawer so it does not reappear later.
  useEffect(() => {
    const query = window.matchMedia(DESKTOP_QUERY);
    const handleChange = (event: MediaQueryListEvent) => {
      if (event.matches) setMobileOpen(false);
    };
    query.addEventListener('change', handleChange);
    return () => query.removeEventListener('change', handleChange);
  }, []);

  const value = useMemo<SidebarContextValue>(
    () => ({ isCollapsed, setCollapsed, isMobileOpen, setMobileOpen, toggleSidebar }),
    [isCollapsed, setCollapsed, isMobileOpen, toggleSidebar],
  );

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}
