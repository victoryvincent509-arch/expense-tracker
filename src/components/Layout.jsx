import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

const Layout = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Main Content */}
      <main className="flex-1 pb-20">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-lg mx-auto">
          <div className="flex justify-around items-center py-2">
            <Link
              to="/"
              className={`flex flex-col items-center py-2 px-4 transition-colors duration-200 ${isActive('/') ? 'text-accent' : 'text-gray-500'
                }`}
            >
              <svg
                className="w-6 h-6 mb-1"
                fill={isActive('/') ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className={`text-xs font-medium ${isActive('/') ? 'font-semibold' : ''}`}>Home</span>
            </Link>

            <Link
              to="/add"
              className={`flex flex-col items-center py-2 px-4 transition-colors duration-200 ${isActive('/add') ? 'text-accent' : 'text-gray-500'
                }`}
            >
              <svg
                className="w-6 h-6 mb-1"
                fill={isActive('/add') ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className={`text-xs font-medium ${isActive('/add') ? 'font-semibold' : ''}`}>Add</span>
            </Link>

            <Link
              to="/stats"
              className={`flex flex-col items-center py-2 px-4 transition-colors duration-200 ${isActive('/stats') ? 'text-accent' : 'text-gray-500'
                }`}
            >
              <svg
                className="w-6 h-6 mb-1"
                fill={isActive('/stats') ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className={`text-xs font-medium ${isActive('/stats') ? 'font-semibold' : ''}`}>Stats</span>
            </Link>

            <Link
              to="/settings"
              className={`flex flex-col items-center py-2 px-4 transition-colors duration-200 ${isActive('/settings') ? 'text-accent' : 'text-gray-500'
                }`}
            >
              <svg
                className="w-6 h-6 mb-1"
                fill={isActive('/settings') ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className={`text-xs font-medium ${isActive('/settings') ? 'font-semibold' : ''}`}>Settings</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Layout;