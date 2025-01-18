'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LineChart, Workflow, History, TrendingUp, Newspaper } from 'lucide-react';

export default function Navbar({ setCurrentPage }) {
  const pathname = usePathname();

  const navItems = [
    { path: '#dashboard', label: 'Dashboard', icon: LineChart },
    { path: '#strategy', label: 'Strategy', icon: Workflow },
    { path: '#backtesting', label: 'Backtesting', icon: History },
    { path: '#papertrading', label: 'Paper Trading', icon: TrendingUp },
    { path: '#news', label: 'News', icon: Newspaper },
  ];

  const handleScroll = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      const navbarHeight = 64; // height of navbar (h-16 = 64px)
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-black/95 border-b border-gray-800 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
              InsightX
            </span>
          </div>

          {/* Navigation Items */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  href={path}
                  onClick={(e) => handleScroll(e, path.replace('#', ''))}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300
                    ${
                      pathname === path
                        ? 'bg-gray-900 text-emerald-400 border border-gray-800 shadow-lg shadow-emerald-400/10'
                        : 'text-gray-300 hover:bg-gray-900/50 hover:text-emerald-400 hover:shadow-lg hover:shadow-emerald-400/10'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </Link>
              ))}

              {/* Sign in Button */}
              <button
                onClick={() => setCurrentPage('signin')}
                className="flex items-center space-x-2 px-6 py-2 rounded-xl transition-all duration-300 bg-gradient-to-r from-emerald-400 to-blue-500 text-white font-medium hover:from-emerald-500 hover:to-blue-600 hover:shadow-lg hover:shadow-emerald-400/20"
              >
                <span>Sign in</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}