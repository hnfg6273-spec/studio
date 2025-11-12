"use client";

import * as React from 'react';
import { LayoutDashboard, Database, BarChart3, Settings, HelpCircle, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


type SidebarProps = {
    activePage: string;
    setActivePage: (page: string) => void;
};

export default function Sidebar({ activePage, setActivePage }: SidebarProps) {
    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard, page: 'dashboard' },
        { name: 'Datasets', icon: Database, page: 'datasets' },
        { name: 'Analytics', icon: BarChart3, page: 'analytics' },
        { name: 'Settings', icon: Settings, page: 'settings' },
    ];

    return (
        <nav className="w-20 bg-[#14253F] flex flex-col items-center py-6 space-y-8 border-r border-zinc-800 shadow-lg z-20">
            {/* Logo */}
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#126C86] to-[#2198AC] flex items-center justify-center shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white" aria-hidden="true"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path><path d="m3.3 7 8.7 5 8.7-5"></path><path d="M12 22V12"></path></svg>
            </div>

            {/* Main Nav */}
            <div className="flex flex-col space-y-6">
                {navItems.map((item) => (
                    <button
                        key={item.name}
                        onClick={() => setActivePage(item.page)}
                        className={cn(
                            'p-3 rounded-xl transition-all duration-200 relative group',
                            activePage === item.page
                                ? 'bg-gradient-to-br from-primary to-accent text-white shadow-lg'
                                : 'text-zinc-400 hover:bg-accent'
                        )}
                        aria-label={item.name}
                    >
                        <item.icon className="w-6 h-6" />
                        <span className="absolute left-24 p-2 px-3 min-w-max rounded-md shadow-md text-white bg-zinc-900 text-xs font-bold transition-all duration-150 scale-0 origin-left group-hover:scale-100 z-50">
                            {item.name}
                        </span>
                    </button>
                ))}
            </div>

            {/* Footer Nav */}
            <div className="mt-auto flex flex-col items-center space-y-6">
                <button className="p-3 text-zinc-400 hover:bg-zinc-800 rounded-xl relative group" aria-label="Help">
                    <HelpCircle className="w-6 h-6" />
                    <span className="absolute left-24 p-2 px-3 min-w-max rounded-md shadow-md text-white bg-zinc-900 text-xs font-bold transition-all duration-150 scale-0 origin-left group-hover:scale-100 z-50">
                        Help
                    </span>
                </button>
                <button className="p-3 text-zinc-400 hover:bg-zinc-800 rounded-xl relative group" aria-label="Log Out">
                    <LogOut className="w-6 h-6" />
                    <span className="absolute left-24 p-2 px-3 min-w-max rounded-md shadow-md text-white bg-zinc-900 text-xs font-bold transition-all duration-150 scale-0 origin-left group-hover:scale-100 z-50">
                        Log Out
                    </span>
                </button>
                
                <Avatar className="w-12 h-12 border-2 border-zinc-950 shadow-lg">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <AvatarFallback className="bg-transparent text-white font-bold text-xl">AV</AvatarFallback>
                    </div>
                </Avatar>
            </div>
        </nav>
    );
}
