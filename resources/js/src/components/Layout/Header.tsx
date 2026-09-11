import { Link } from '@inertiajs/react';
import { LogOut, User, Menu } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface HeaderProps {
  onMenuToggle?: () => void;
  onDesktopToggle?: () => void;
  pageTitle?: string;
  pageSubtitle?: string;
}

export function Header({ onMenuToggle, onDesktopToggle, pageTitle = 'Admin Portal', pageSubtitle = 'Welcome to your dashboard' }: HeaderProps) {
  const { user, logout } = useAuth();
  return (
    <header className="sticky top-0 z-[999] bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200 flex-shrink-0">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">

        {/* Left side */}
        <div className="flex items-center gap-4">
          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300"
            onClick={onMenuToggle}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          {/* Desktop hamburger (toggles sidebar if you want collapsible) */}
          <button
            className="hidden lg:flex p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400"
            onClick={onDesktopToggle}
            aria-label="Toggle menu"
          >
            <Menu size={20} />
          </button>

          {/* Page title — desktop */}
          <div className="hidden lg:block">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white leading-tight">
              {pageTitle}
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">{pageSubtitle}</p>
          </div>

          {/* Page title — mobile (shorter) */}
          <div className="lg:hidden">
            <h1 className="text-base font-semibold text-gray-900 dark:text-white">
              {pageTitle}
            </h1>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Language switcher */}


          {/* Divider */}
          <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 hidden lg:block" />

          {/* Website link */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            Website
          </a>

          {/* User */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-black/60 to-black flex items-center justify-center">
              <User size={12} className="text-white" />
            </div>
            <Link
              href='/admin/users'
              className='group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors'
              onClick={() => {
              }}
            >
              {user?.first_name}
            </Link>
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            className="flex items-center gap-1.5 p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            aria-label="Logout"
          >
            <LogOut size={18} />
            <span className="hidden lg:block text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}