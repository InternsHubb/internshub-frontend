import { useTranslation } from 'react-i18next';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';

import { cn } from '@/lib/cn';

import { useSidebar } from './SidebarContext';

// Toggle for the shared sidebar (shadcn/ui's SidebarTrigger). Figma has no toggle, so it
// reuses the round top-bar button style ("Bell" in "Top Nav").
export function SidebarTrigger({ className }: { className?: string }) {
  const { t } = useTranslation();
  const { isCollapsed, toggleSidebar } = useSidebar();
  const Icon = isCollapsed ? PanelLeftOpen : PanelLeftClose;

  return (
    <button
      type="button"
      onClick={toggleSidebar}
      aria-label={t('dashboard.sidebar.toggle')}
      title={t('dashboard.sidebar.toggleShortcut')}
      className={cn(
        'flex size-12 shrink-0 items-center justify-center rounded-full bg-[#f4f4f4] text-[#1f2937] shadow-[0_2px_10px_rgba(59,4,84,0.1)] outline-none transition-colors hover:bg-[#ece4f3] focus-visible:ring-2 focus-visible:ring-[#5a198f]',
        className,
      )}
    >
      <Icon className="size-[22px] rtl:-scale-x-100" aria-hidden="true" />
    </button>
  );
}

export default SidebarTrigger;
