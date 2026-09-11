import type { ReactNode } from 'react';
import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface AppLayoutProps {
  children: ReactNode;
  pageTitle?: string;
  pageSubtitle?: string;
}

export function AppLayout({ children, pageTitle, pageSubtitle }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
      <Sidebar
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content — offset by sidebar width on large screens */}
      <div
        className={
          `flex flex-col flex-1 min-w-0 transition-[margin] duration-300 ease-in-out ${
            sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
          }`
        }
      >
        <Header
          onMenuToggle={() => setSidebarOpen((o) => !o)}
          onDesktopToggle={() => setSidebarCollapsed((collapsed) => !collapsed)}
          pageTitle={pageTitle}
          pageSubtitle={pageSubtitle}
        />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}