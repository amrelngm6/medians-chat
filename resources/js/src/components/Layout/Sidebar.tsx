import { Link, usePage } from '@inertiajs/react';
import * as Icons from 'lucide-react';
import { clsx } from 'clsx';
import { useAuthStore } from '../../store/auth.store';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { settingsApi, Setting } from '@/api/settings.api';

interface MenuItem {
  label: string;
  items: Array<{ to: string; label: string; icon: any; adminOrReseller?: boolean }>;
}

interface SidebarProps {
  isOpen?: boolean;
  isCollapsed?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = false, isCollapsed = false, onClose }: SidebarProps) {
  const user = useAuthStore((s) => s.user);
  const initials =
    ((user?.first_name?.[0] ?? '') + (user?.last_name?.[0] ?? '')).toUpperCase() ||
    user?.email?.[0]?.toUpperCase() ||
    '?';
  const { url } = usePage();

  const [fetchError, setFetchError] = useState<string | null>(null);
  const [navSections, setNavSections] = useState<MenuItem[]>([]);
  const [menuSettings, setMenuSettings] = useState<Setting[]>([]);

  useEffect(() => {
    settingsApi
      .group('general')
      .then((res) => {
        setMenuSettings(res.data.data);
      })

    settingsApi
      .adminMenu()
      .then((res) => {
        const { data } = res.data;
        // Map the PHP response shape to MenuItem[]
        // PHP: { "Section Label": { icon: string, items: [{ title, url, icon }] } }
        // Component: { label: string, items: [{ to, label, icon: LucideComponent }] }
        const mapped = Object.entries(data).map(([sectionLabel, section]) => ({
          label: sectionLabel,
          items: section.items.map((item) => ({
            to: item.url,
            label: item.title.replace(/_/g, ' '),
            icon: (Icons as Record<string, any>)[item.icon] ?? Icons.Circle,
          })),
        }));


        setNavSections(mapped);
      })
      .catch(() => setFetchError('Failed to load settings. Please refresh.'))
    // .finally(() => setFetchError(null));   // ⚠️ this clears the error even on failure — see note below
  }, []);

  const isActive = (to: string) => {
    return url.startsWith(to) || url === to
  };


  // Flyout for collapsed sidebar sections is portaled to <body> so it isn't clipped by nav's scroll container.
  const hideTimeout = useRef<number | null>(null);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [flyoutPos, setFlyoutPos] = useState<{ top: number; left: number } | null>(null);

  const openFlyout = (label: string, target: HTMLElement) => {
    if (hideTimeout.current) {
      window.clearTimeout(hideTimeout.current);
      hideTimeout.current = null;
    }
    const rect = target.getBoundingClientRect();
    setFlyoutPos({ top: rect.top, left: rect.right + 12 });
    setHoveredSection(label);
  };

  const scheduleCloseFlyout = () => {
    hideTimeout.current = window.setTimeout(() => {
      setHoveredSection(null);
      setFlyoutPos(null);
    }, 150);
  };

  const cancelCloseFlyout = () => {
    if (hideTimeout.current) {
      window.clearTimeout(hideTimeout.current);
      hideTimeout.current = null;
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[9998] bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-[9999] flex flex-col',
          isCollapsed ? 'w-72 lg:w-20' : 'w-64',
          'bg-white dark:bg-gray-900',
          'border-r border-gray-200 dark:border-gray-700',
          'transition-transform duration-300 ease-in-out',
          // Desktop: always visible; Mobile: slide based on isOpen
          'lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo / Brand */}
        <div className={clsx(
          'flex items-center justify-between h-16 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-black/10 to-black/10 dark:from-gray-800 dark:to-gray-800 flex-shrink-0',
          isCollapsed ? 'px-5 lg:justify-center lg:px-0' : 'px-6'
        )}>
          <div className={clsx('flex items-center gap-3 overflow-hidden', isCollapsed && 'lg:justify-center')}>
            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-black/80 to-black shadow-md shadow-black/20 dark:shadow-black/30">
              <Icons.Zap size={18} className="text-white" />
            </div>
            <div className={clsx('overflow-hidden', isCollapsed && 'lg:hidden')}>
              <h1 className="text-sm font-bold text-gray-900 dark:text-white truncate leading-tight">
                {menuSettings.find(s => s.key === 'general.app_name')?.value}
              </h1>
              <p className="text-xs text-black dark:text-white font-medium">
                Admin Portal
              </p>
            </div>
          </div>

          {/* Mobile close button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-white dark:hover:bg-gray-700 transition-colors text-gray-500 dark:text-gray-400"
            onClick={onClose}
            aria-label="Close menu"
          >
            <Icons.X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-x-visible overflow-y-auto py-4 px-3 bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-900 dark:to-gray-900">
          {fetchError && (
            <p className="text-xs text-red-500 dark:text-red-400 px-3 py-2 mb-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
              {fetchError}
            </p>
          )}

          {navSections.map((section) => {
            const visibleItems = section.items.filter(() => true);
            if (visibleItems.length === 0) return null;

            const SectionIcon = section.items[0]?.icon;

            return (
              <div key={section.label} className="group/section relative mb-2">
                <p className={clsx(
                  'px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500',
                  isCollapsed && 'lg:hidden'
                )}>
                  {section.label}
                </p>
                <div className={clsx('space-y-0.5', isCollapsed && 'lg:space-y-0')}>
                  {isCollapsed ? (
                    <div
                      className="relative"
                      onMouseEnter={(e) => openFlyout(section.label, e.currentTarget)}
                      onMouseLeave={scheduleCloseFlyout}
                    >
                      <button
                        type="button"
                        aria-label={section.label}
                        className="group flex w-full items-center justify-center rounded-xl p-2.5 text-gray-700 transition-all duration-200 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                      >
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition-colors group-hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:group-hover:bg-gray-700">
                          <SectionIcon size={16} />
                        </div>
                      </button>

                      {hoveredSection === section.label && flyoutPos && createPortal(
                        <div
                          className="fixed z-[10000] w-56 rounded-xl border border-gray-200 bg-white p-2 shadow-xl animate-in fade-in slide-in-from-left-1 duration-100 dark:border-gray-700 dark:bg-gray-800"
                          style={{ top: flyoutPos.top, left: flyoutPos.left }}
                          onMouseEnter={cancelCloseFlyout}
                          onMouseLeave={scheduleCloseFlyout}
                        >
                          <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                            {section.label}
                          </p>
                          {visibleItems.map(({ to, label, icon: Icon }) => {
                            const active = isActive(to);
                            return (
                              <Link
                                key={to}
                                href={to}
                                className={clsx(
                                  'group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                                  active
                                    ? 'bg-black text-white'
                                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                                )}
                                onClick={() => {
                                  setHoveredSection(null);
                                  setFlyoutPos(null);
                                  onClose?.();
                                }}
                              >
                                <Icon size={15} className="mr-3 flex-shrink-0" />
                                {label}
                              </Link>
                            );
                          })}
                        </div>,
                        document.body
                      )}
                    </div>
                  ) : visibleItems.map(({ to, label, icon: Icon }) => {
                    const active = isActive(to);
                    return (
                      <Link
                        key={to}
                        href={to}
                        className={clsx(
                          'group flex items-center p-1 text-sm font-medium rounded-xl transition-all duration-200',
                          active
                            ? 'bg-black text-white shadow-md shadow-black/200 dark:shadow-black/30'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        )}
                        onClick={onClose}
                      >
                        <div
                          className={clsx(
                            'flex items-center justify-center w-8 h-8 rounded-lg mr-3 flex-shrink-0 transition-colors',
                            active
                              ? 'bg-white/20 text-white'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-700'
                          )}
                        >
                          <Icon size={16} />
                        </div>
                        {label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className={clsx(
          'border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex-shrink-0 space-y-0.5',
          isCollapsed ? 'p-4 lg:px-3' : 'p-4'
        )}>
          {/* Logout */}
          <a
            href="/logout"
            title={isCollapsed ? 'Logout' : undefined}
            className={clsx(
              'group flex items-center p-1 text-sm font-medium rounded-xl transition-all duration-200 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20',
              isCollapsed && 'lg:justify-center lg:px-0'
            )}
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg mr-3 flex-shrink-0 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 group-hover:bg-red-100 dark:group-hover:bg-red-900/30 transition-colors">
              <Icons.LogOut size={16} />
            </div>
            <span className={clsx(isCollapsed && 'lg:hidden')}>Logout</span>
          </a>

          {/* User info strip */}
          <div className={clsx(
            'flex items-center gap-3 mt-3 p-1 rounded-xl bg-gray-50 dark:bg-gray-800',
            isCollapsed && 'lg:justify-center lg:px-0'
          )}>
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-black/60 to-black flex items-center justify-center text-white text-xs font-bold">
              {initials}
            </div>
            <div className={clsx('overflow-hidden flex-1 min-w-0', isCollapsed && 'lg:hidden')}>
              <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 capitalize truncate">
                {user?.status}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}