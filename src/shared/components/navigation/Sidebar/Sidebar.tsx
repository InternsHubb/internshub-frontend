import { useId, useState, type ReactNode } from 'react';
import { Dialog } from 'radix-ui';
import { useTranslation } from 'react-i18next';
import { Link, NavLink, matchPath, useLocation } from 'react-router-dom';
import { ChevronDown, X } from 'lucide-react';

import logoCap from '@/assets/dashboard/sb-logo-cap.svg';
import collapsedWaves from '@/assets/dashboard/sb-collapsed-waves.svg';
import waveBeige from '@/assets/dashboard/sb-wave-beige.svg';
import waveOrange from '@/assets/dashboard/sb-wave-orange.svg';
import wavePurple from '@/assets/dashboard/sb-wave-purple.svg';
import { ROUTES } from '@/app/routes';
import { cn } from '@/shared/utils/cn';

import { useSidebar } from '@/shared/components/navigation/Sidebar/SidebarContext';
import { SIDEBAR_NAV_ITEMS, type SidebarNavItem, type SidebarSubItem } from '@/shared/components/navigation/Sidebar/sidebarNav';

function readInternshipPlanQuery(search: string): string | null {
  const plan = new URLSearchParams(search).get('plan');
  return plan === '3m' || plan === '6m' || plan === '12m' ? plan : null;
}

// Shared sidebar of the student dashboard and the student recruitment flow. Expanded state
// follows the Figma component "Sidebar" (256px, e.g. in "internship plan 3 and 11",
// 31:32570); the icon-only state follows the collapsed sidebar "Frame 10" (118px, 30:1415).
// Below lg it becomes a drawer (Radix Dialog). `items` defaults to SIDEBAR_NAV_ITEMS; an item
// with `children` (Recruitment) expands into a nested menu, as in the recruitment frames.
// `footer` is an optional slot rendered above the waves, set per layout or route: the
// internship "Required Courses Progress" card or the recruitment "Composite Score" card. It is
// hidden while collapsed.
//
// Both states render the same elements: only sizes, paddings and opacity change, on the
// same curve and duration as the <aside> width, so the panel and the page beside it move
// together instead of the panel content snapping to the new state on the first frame.

type SidebarProps = { footer?: ReactNode; items?: ReadonlyArray<SidebarNavItem> };

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
  const location = useLocation();
  // Keep the selected internship package when returning from its project preview.
  const activePlan = readInternshipPlanQuery(location.search);
  const internshipTarget =
    item.id === 'internship' && location.pathname.startsWith(ROUTES.dashboardInternship) && activePlan
      ? `${item.to}?plan=${activePlan}`
      : item.to;
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
        to={internshipTarget!}
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

// Row of a nested menu (Figma "Dashboard", "Eligibility", ... under Recruitment/Mentorship): 16px
// outline icon, 14px label and an optional count pill.
function NavSubItem({ item, onNavigate }: { item: SidebarSubItem; onNavigate?: () => void }) {
  const { t } = useTranslation();
  const location = useLocation();
  const Icon = item.icon;
  const label = t(item.labelKey);

  if (item.disabled || !item.to) {
    return (
      <li>
        <span
          aria-disabled="true"
          className="flex h-8 w-full items-center gap-2.5 rounded-lg ps-3 pe-2 text-sm font-medium text-[#ede6f3]/45 cursor-default select-none"
        >
          <Icon className="size-4 shrink-0 opacity-50" aria-hidden={true} />
          <span className="truncate leading-none">{label}</span>
          {item.badge && (
            <span className="ms-auto flex size-5 shrink-0 items-center justify-center rounded-full bg-white/10 text-[11px] font-semibold text-white/50">
              {item.badge}
            </span>
          )}
        </span>
      </li>
    );
  }

  const isHashItem = item.to.includes('#');
  const [targetPath, targetHash] = item.to.split('#');
  const isQueryItem = item.to.includes('?');
  const [pathWithoutQuery, searchPart] = item.to.split('?');
  const targetParams = new URLSearchParams(searchPart || '');

  return (
    <li>
      <NavLink
        to={item.to}
        end={item.end}
        onClick={() => {
          onNavigate?.();
          if (isHashItem && targetHash) {
            const el = document.getElementById(targetHash);
            if (el) {
              setTimeout(() => {
                el.scrollIntoView({ behavior: 'smooth' });
              }, 50);
            }
          }
        }}
        className={({ isActive }) => {
          let active = isActive;
          if (isHashItem) {
            active = location.pathname === targetPath && location.hash === `#${targetHash}`;
          } else if (isQueryItem) {
            const currentParams = new URLSearchParams(location.search);
            const isPathMatch = location.pathname === pathWithoutQuery;
            let matchesParams = isPathMatch;
            if (isPathMatch) {
              targetParams.forEach((val, key) => {
                if (currentParams.get(key) !== val) {
                  matchesParams = false;
                }
              });
              if (!currentParams.get('step') && targetParams.get('step') === 'technicalInterview') {
                matchesParams = true;
              }
            }
            active = matchesParams;
          }
          return cn(
            'flex h-8 w-full items-center gap-2.5 rounded-lg ps-3 pe-2 transition-colors',
            FOCUS_RING,
            active ? ACTIVE_ITEM : IDLE_ITEM,
          );
        }}
      >
        <Icon className="size-4 shrink-0" aria-hidden={true} />
        <span className="truncate text-sm leading-none">{label}</span>
        {item.badge && (
          <span className="ms-auto flex size-5 shrink-0 items-center justify-center rounded-full bg-white/15 text-[11px] font-semibold text-white">
            {item.badge}
          </span>
        )}
      </NavLink>
    </li>
  );
}

// Item with a nested menu (Recruitment or Internship). Expanded, the row toggles the menu, which opens by
// itself on any page under the group's route and stays as the user leaves it while on those
// pages. In the icon-only rail there is no room for the menu, so the icon links to the group's
// first page instead.
function NavGroup({ item, isCollapsed, onNavigate }: { item: SidebarNavItem; isCollapsed: boolean; onNavigate?: () => void }) {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const menuId = useId();
  const isInGroup = item.to ? matchPath({ path: item.to, end: false }, pathname) !== null : false;
  const [isOpen, setOpen] = useState(isInGroup);
  // Entering the group from another page opens the menu (state adjusted during render).
  const [wasInGroup, setWasInGroup] = useState(isInGroup);
  if (isInGroup !== wasInGroup) {
    setWasInGroup(isInGroup);
    if (isInGroup) setOpen(true);
  }

  if (isCollapsed) {
    return <NavItem item={{ ...item, children: undefined }} isCollapsed onNavigate={onNavigate} />;
  }

  return (
    <li>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={() => setOpen((open) => !open)}
        className={cn(
          'relative flex h-10 w-full items-center gap-3 rounded-lg ps-3 pe-2 text-start transition-colors',
          FOCUS_RING,
          isInGroup ? (isOpen ? 'font-semibold text-white hover:bg-white/[0.07]' : ACTIVE_ITEM) : IDLE_ITEM,
        )}
      >
        <ActiveIndicator isActive={isInGroup} />
        <img src={item.icon} alt="" aria-hidden="true" className="size-[17px] shrink-0 object-contain" />
        <span className="truncate text-sm leading-none">{t(item.labelKey)}</span>
        <ChevronDown
          aria-hidden="true"
          className={cn('ms-auto size-4 shrink-0 opacity-70 transition-transform', SIDEBAR_MOTION, isOpen && 'rotate-180')}
        />
      </button>
      {/* Folds open/closed (height + fade); `inert` keeps hidden links out of the tab order. */}
      <div
        id={menuId}
        inert={!isOpen}
        className={cn(
          'grid transition-[grid-template-rows,opacity]',
          SIDEBAR_MOTION,
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        )}
      >
        <ul className="flex min-h-0 flex-col gap-0.5 overflow-hidden ps-4 pt-0.5">
          {item.children?.map((child) => (
            <NavSubItem key={child.id} item={child} onNavigate={onNavigate} />
          ))}
        </ul>
      </div>
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

type SidebarPanelProps = {
  isCollapsed: boolean;
  items: ReadonlyArray<SidebarNavItem>;
  footer?: ReactNode;
  onNavigate?: () => void;
};

function SidebarPanel({ isCollapsed, items, footer, onNavigate }: SidebarPanelProps) {
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
          'no-scrollbar relative min-h-0 flex-1 overflow-y-auto overflow-x-hidden transition-[margin,padding]',
          SIDEBAR_MOTION,
          isCollapsed ? 'mt-[72px] px-[37px]' : 'mt-[39px] px-2',
        )}
      >
        <ul className={cn('flex flex-col transition-[gap]', SIDEBAR_MOTION, isCollapsed ? 'gap-6' : 'gap-1')}>
          {items.map((item) =>
            item.children ? (
              <NavGroup key={item.id} item={item} isCollapsed={isCollapsed} onNavigate={onNavigate} />
            ) : (
              <NavItem key={item.id} item={item} isCollapsed={isCollapsed} onNavigate={onNavigate} />
            ),
          )}
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

export function Sidebar({ footer, items = SIDEBAR_NAV_ITEMS }: SidebarProps) {
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
        <SidebarPanel isCollapsed={isCollapsed} items={items} footer={footer} />
      </aside>

      {/* Mobile / tablet: drawer from the inline-start edge. */}
      <Dialog.Root open={isMobileOpen} onOpenChange={setMobileOpen}>
        <Dialog.Portal>
          {/* db-overlay / db-drawer (index.css): fade and slide on open and close. */}
          <Dialog.Overlay className="db-overlay fixed inset-0 z-50 bg-[#22023c]/40 backdrop-blur-[2px] lg:hidden" />
          <Dialog.Content className="db-drawer fixed inset-y-3 start-3 z-50 w-[256px] max-w-[calc(100vw-24px)] outline-none lg:hidden">
            <Dialog.Title className="sr-only">{t('dashboard.sidebar.navLabel')}</Dialog.Title>
            <Dialog.Description className="sr-only">{t('dashboard.sidebar.drawerDescription')}</Dialog.Description>
            <SidebarPanel isCollapsed={false} items={items} footer={footer} onNavigate={() => setMobileOpen(false)} />
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
