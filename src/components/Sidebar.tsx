'use client';
import React from 'react';
import { NAV_ITEMS } from '@/lib/mock-data';
import { Page, Theme } from '@/lib/types';
import Icon from './Icon';

interface SidebarProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
  theme: Theme;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, theme }) => {
  return (
    <nav
      className={`w-20 flex flex-col items-center py-6 space-y-8 border-r shadow-lg z-20 ${theme.sidebar} ${theme.sidebarBorder}`}
    >
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${theme.sidebarActive.replace(
          ' text-white',
          ''
        )}`}
      >
        <Icon name="Blocks" className="w-6 h-6 text-white" />
      </div>
      <div className="flex flex-col space-y-6">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.page}
            onClick={() => setActivePage(item.page)}
            className={`p-3 rounded-xl transition-all duration-200 relative group ${
              activePage === item.page ? theme.sidebarActive : theme.sidebarHover
            }`}
          >
            <Icon name={item.icon} className="w-6 h-6 text-zinc-400" />
          </button>
        ))}
      </div>
      <div className="mt-auto flex flex-col space-y-6">
        <button className="p-3 rounded-xl relative group text-zinc-400">
          <Icon name="HelpCircle" className="w-6 h-6" />
        </button>
        <button className="p-3 rounded-xl relative group text-zinc-400">
          <Icon name="LogOut" className="w-6 h-6" />
        </button>
        <div
          className={`w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl shadow-lg border-2 ${theme.sidebar}`}
        >
          AV
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
