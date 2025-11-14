'use client';
import React from 'react';
import { Page, Theme } from '@/lib/types';
import Icon from './Icon';

interface TopbarProps {
  cycleTheme: () => void;
  theme: Theme;
  activePage: Page;
}

const Topbar: React.FC<TopbarProps> = ({ cycleTheme, theme, activePage }) => {
  return (
    <header
      className={`h-20 flex items-center justify-between px-8 border-b backdrop-blur-sm z-10 ${theme.topbar} ${theme.topbarBorder}`}
    >
      <div className="flex items-center space-x-6">
        <h1 className={`text-2xl font-bold ${theme.title}`}>
          {activePage === Page.DASHBOARD
            ? 'Dashboard'
            : activePage.charAt(0).toUpperCase() + activePage.slice(1)}
        </h1>
      </div>
      <div className="flex items-center space-x-5">
        <button
          onClick={cycleTheme}
          className="p-2 rounded-full text-zinc-400 hover:bg-zinc-800"
        >
          <Icon name="Palette" className="w-6 h-6" />
        </button>
        <button className="p-2 rounded-full text-zinc-400 hover:bg-zinc-800 relative">
          <Icon name="Bell" className="w-6 h-6" />
          <span
            className={`absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 ${theme.sidebarBorder}`}
          ></span>
        </button>
        <div className="flex items-center space-x-3">
          <div
            className={`w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-offset-2 ring-purple-500 ${theme.sidebar}`}
          >
            AV
          </div>
          <div className="text-left hidden sm:block">
            <div className={`text-sm font-semibold ${theme.title}`}>Alex Moran</div>
            <div className="text-xs text-zinc-400">alex.moran@example.com</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
