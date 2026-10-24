import type { ReactNode } from 'react';
import { Dialog } from 'radix-ui';
import { useTranslation } from 'react-i18next';
import { Link, NavLink } from 'react-router-dom';
import { X } from 'lucide-react';

import logoCap from '@/assets/dashboard/sb-logo-cap.svg';
import collapsedWaves from '@/assets/dashboard/sb-collapsed-waves.svg';
import waveBeige from '@/assets/dashboard/sb-wave-beige.svg';
import waveOrange from '@/assets/dashboard/sb-wave-orange.svg';
import wavePurple from '@/assets/dashboard/sb-wave-purple.svg';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/cn';

import { useSidebar } from './SidebarContext';
import { SIDEBAR_NAV_ITEMS, type SidebarNavItem } from './sidebarNav';

// Shared dashboard sidebar. Expanded state follows the Figma component "Sidebar" (256px,
// e.g. in "internship plan 3 and 11", 31:32570); the icon-only state follows the collapsed
// sidebar "Frame 10" (118px, 30:1415). Below lg it becomes a drawer (Radix Dialog).
// `footer` is an optional slot rendered above the waves (e.g. the project page's
// "Required Courses Progress" card); it is hidden while collapsed.
//
// Both states render the same elements: only sizes, paddings and opacity change, on the
// same curve and duration as the <aside> width, so the panel and the page beside it move
// together instead of the panel content snapping to the new state on the first frame.

type SidebarProps = { footer?: ReactNode };

const SIDEBAR_MOTION = 'duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none';
const ACTIVE_ITEM = 'bg-linear-to-r from-[#3a0353] to-[#804a8a] font-semibold text-white shadow-sm rtl:bg-linear-to-l';
// Item states adapted from the employer sidebar: dimmed text that brightens on hover, a soft
// hover fill, and a short accent bar beside the active item.
const IDLE_ITEM = 'font-medium text-[#ede6f3]/80 hover:bg-white/[0.07] hover:text-white';
const UNAVAILABLE_ITEM = 'cursor-default font-medium text-[#ede6f3]/45';
const FOCUS_RING = 'outline-none focus-visible:ring-2 focus-visible:ring-white/70';

function ActiveIndicator({ isActive }: { isActive: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'absolute -start-2 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-full bg-[#c592fb] transition-opacity',
        SIDEBAR_MOTION,
        isActive ? 'opacity-100' : 'opacity-0',
      )}
    />
  );
}

function NavItem({ item, isCollapsed, onNavigate }: { item: SidebarNavItem; isCollapsed: boolean; onNavigate?: () => void }) {
  const { t } = useTranslation();
  const label = t(item.labelKey);
  const shape = cn(
    'relative flex items-center rounded-lg transition-[width,height,padding,gap,background-color,color]',
    SIDEBAR_MOTION,
    // Collapsed: 32px icon centred in a 44px square; expanded: 17px icon + label, full width.
    isCollapsed ? 'h-11 w-11 gap-0 ps-1.5' : 'h-10 w-full gap-3 ps-3 pe-2',
  );
  const renderContent = (isActive: boolean) => (
    <>
      <ActiveIndicator isActive={isActive} />
      <img
        src={item.icon}
        alt=""
        aria-hidden="true"
        className={cn(
          'shrink-0 object-contain transition-[width,height,opacity]',
          SIDEBAR_MOTION,
          isCollapsed ? 'size-8' : 'size-[17px]',
          !item.to && 'opacity-50',
        )}
      />
      <span
        className={cn(
          'truncate text-sm leading-none transition-[opacity,max-width]',
          SIDEBAR_MOTION,
          isCollapsed ? 'max-w-0 opacity-0' : 'max-w-[180px] opacity-100',
        )}
      >
        {label}
      </span>
    </>
  );

  if (!item.to) {
    // No screen behind this section yet: shown as in Figma, dimmed and not navigable.
    return (
      <li>
        <span aria-disabled="true" title={isCollapsed ? label : undefined} className={cn(shape, UNAVAILABLE_ITEM)}>
          {renderContent(false)}
        </span>
      </li>
    );
  }

  return (
    <li>
      <NavLink
        to={item.to}
        end={item.end}
        onClick={onNavigate}
        title={isCollapsed ? label : undefined}
        className={({ isActive }) => cn(shape, FOCUS_RING, isActive ? ACTIVE_ITEM : IDLE_ITEM)}
      >
        {({ isActive }) => renderContent(isActive)}
      </NavLink>
    </li>
  );
}

// Theme waves (Figma "Theme Wave — Beige/Purple/Orange"); the two sets cross-fade.
function SidebarWaves({ isCollapsed }: { isCollapsed: boolean }) {
  const fade = cn('pointer-events-none absolute transition-opacity', SIDEBAR_MOTION);
  return (
    <>
      <img
        src={collapsedWaves}
        alt=""
        aria-hidden="true"
        className={cn(fade, '-bottom-[66px] -start-[83px] h-[209px] w-[289px] max-w-none rtl:-scale-x-100', isCollapsed ? 'opacity-100' : 'opacity-0')}
      />
      <div aria-hidden="true" className={cn(fade, 'inset-x-0 bottom-0 h-[263px] rtl:-scale-x-100', isCollapsed ? 'opacity-0' : 'opacity-100')}>
        <img src={waveBeige} alt="" className="absolute bottom-0 start-0 h-[263px] w-[256px] max-w-none" />
        <img src={wavePurple} alt="" className="absolute bottom-0 start-0 h-[224px] w-[256px] max-w-none" />
        <img src={waveOrange} alt="" className="absolute bottom-0 start-0 h-[125px] w-[256px] max-w-none" />
      </div>
    </>
  );
}

function SidebarPanel({ isCollapsed, footer, onNavigate }: { isCollapsed: boolean; footer?: ReactNode; onNavigate?: () => void }) {
  const { t } = useTranslation();

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-[36px] bg-[#3b0454]">
      <SidebarWaves isCollapsed={isCollapsed} />

      {/* Header: logo, linking to the dashboard home as in the employer sidebar. Collapsed,
          the 43px cap is centred in the rail: (118 - 43) / 2. */}
      <Link
        to={ROUTES.dashboard}
        onClick={onNavigate}
        className={cn(
          'relative flex items-center self-start rounded-lg transition-[margin,gap]',
          FOCUS_RING,
          SIDEBAR_MOTION,
          isCollapsed ? 'gap-0 ms-[37.5px] mt-[61px]' : 'gap-[5px] ms-5 mt-[26px]',
        )}
      >
        <img
          src={logoCap}
          alt=""
          aria-hidden="true"
          className={cn('shrink-0 transition-[width,height]', SIDEBAR_MOTION, isCollapsed ? 'h-[32.5px] w-[43px]' : 'h-[19.7px] w-[26.1px]')}
        />
        <span
          dir="ltr"
          className={cn(
            'overflow-hidden whitespace-nowrap text-[18.6px] font-bold leading-none text-white transition-[opacity,max-width]',
            SIDEBAR_MOTION,
            isCollapsed ? 'max-w-0 opacity-0' : 'max-w-[160px] opacity-100',
          )}
        >
          Interns HUB
        </span>
      </Link>

      {/* Content: navigation. Collapsed, the 44px items are centred: (118 - 44) / 2 = 37px. */}
      <nav
        aria-label={t('dashboard.sidebar.navLabel')}
        className={cn(
          'relative min-h-0 flex-1 overflow-y-auto overflow-x-hidden transition-[margin,padding]',
          SIDEBAR_MOTION,
          isCollapsed ? 'mt-[72px] px-[37px]' : 'mt-[39px] px-2',
        )}
      >
        <ul className={cn('flex flex-col transition-[gap]', SIDEBAR_MOTION, isCollapsed ? 'gap-6' : 'gap-1')}>
          {SIDEBAR_NAV_ITEMS.map((item) => (
            <NavItem key={item.id} item={item} isCollapsed={isCollapsed} onNavigate={onNavigate} />
          ))}
        </ul>
      </nav>

      {/* Footer slot: folds away (height + fade) while collapsed. Fixed width so the card does
          not reflow as the rail narrows; `inert` keeps it out of the tab order when hidden. */}
      {footer && (
        <div
          inert={isCollapsed}
          className={cn(
            'relative grid transition-[grid-template-rows,opacity]',
            SIDEBAR_MOTION,
            isCollapsed ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100',
          )}
        >
          <div className="min-h-0 overflow-hidden">
            <div className="w-[256px] max-w-[calc(100vw-24px)] p-4">{footer}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export function Sidebar({ footer }: SidebarProps) {
  const { t } = useTranslation();
  const { isCollapsed, isMobileOpen, setMobileOpen } = useSidebar();

  return (
    <>
      {/* Desktop: docked, collapsible to icons. */}
      <aside
        data-state={isCollapsed ? 'collapsed' : 'expanded'}
        className={cn(
          'sticky top-6 hidden h-[calc(100dvh-48px)] min-h-[560px] shrink-0 transition-[width] lg:block',
          SIDEBAR_MOTION,
          isCollapsed ? 'w-[118px]' : 'w-[256px]',
        )}
      >
        <SidebarPanel isCollapsed={isCollapsed} footer={footer} />
      </aside>

      {/* Mobile / tablet: drawer from the inline-start edge. */}
      <Dialog.Root open={isMobileOpen} onOpenChange={setMobileOpen}>
        <Dialog.Portal>
          {/* db-overlay / db-drawer (index.css): fade and slide on open and close. */}
          <Dialog.Overlay className="db-overlay fixed inset-0 z-50 bg-[#22023c]/40 backdrop-blur-[2px] lg:hidden" />
          <Dialog.Content className="db-drawer fixed inset-y-3 start-3 z-50 w-[256px] max-w-[calc(100vw-24px)] outline-none lg:hidden">
            <Dialog.Title className="sr-only">{t('dashboard.sidebar.navLabel')}</Dialog.Title>
            <Dialog.Description className="sr-only">{t('dashboard.sidebar.drawerDescription')}</Dialog.Description>
            <SidebarPanel isCollapsed={false} footer={footer} onNavigate={() => setMobileOpen(false)} />
            <Dialog.Close
              aria-label={t('dashboard.sidebar.close')}
              className="absolute end-3 top-3 flex size-9 items-center justify-center rounded-full text-white/80 outline-none hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/70"
            >
              <X className="size-5" aria-hidden="true" />
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

export default Sidebar;
