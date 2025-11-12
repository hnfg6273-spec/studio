"use client";
import * as React from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';
import { Menu, Transition } from '@headlessui/react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type TopBarProps = {
    onSearch: (term: string) => void;
    searchTerm: string;
};

export default function TopBar({ onSearch, searchTerm }: TopBarProps) {
    return (
        <header className="h-20 flex-shrink-0 flex items-center justify-between px-8 border-b border-zinc-800 bg-[#14253F]/50 backdrop-blur-sm z-10">
            {/* Left Side: Title & Search */}
            <div className="flex items-center space-x-6">
                <h1 className="text-2xl font-bold text-white capitalize">{searchTerm ? 'Search Results' : 'Dashboard'}</h1>
                <div className="relative">
                    <Search className="w-5 h-5 text-zinc-500 absolute top-1/2 left-3 -translate-y-1/2" />
                    <Input
                        type="text"
                        placeholder="Search datasets..."
                        value={searchTerm}
                        onChange={(e) => onSearch(e.target.value)}
                        className="pl-10 pr-4 py-2 w-72 bg-card/80 rounded-lg border-accent/50 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                </div>
            </div>

            {/* Right Side: Actions & User */}
            <div className="flex items-center space-x-5">
                <Button variant="ghost" size="icon" className="text-zinc-400 hover:bg-zinc-800 relative" aria-label="Notifications">
                    <Bell className="w-6 h-6" />
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-background"></span>
                </Button>

                <Menu as="div" className="relative">
                    <Menu.Button className="flex items-center space-x-3 group">
                         <Avatar className="w-10 h-10 ring-2 ring-offset-2 ring-offset-background ring-purple-500">
                             <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                 <AvatarFallback className="bg-transparent text-white font-bold text-sm">AV</AvatarFallback>
                            </div>
                        </Avatar>
                        <div className="text-left hidden sm:block">
                            <div className="text-sm font-semibold text-white">Alex Moran</div>
                            <div className="text-xs text-zinc-400">alex.moran@example.com</div>
                        </div>
                        <ChevronDown className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                    </Menu.Button>
                    <Transition
                        as={React.Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-zinc-900 divide-y divide-zinc-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                            <div className="p-1">
                                <Menu.Item>
                                    {({ active }) => (
                                        <button className={cn('group flex rounded-md items-center w-full px-2 py-2 text-sm', active ? 'bg-zinc-800 text-white' : 'text-zinc-300')}>
                                            My Profile
                                        </button>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                        <button className={cn('group flex rounded-md items-center w-full px-2 py-2 text-sm', active ? 'bg-zinc-800 text-white' : 'text-zinc-300')}>
                                            Settings
                                        </button>
                                    )}
                                </Menu.Item>
                            </div>
                            <div className="p-1">
                                <Menu.Item>
                                    {({ active }) => (
                                        <button className={cn('group flex rounded-md items-center w-full px-2 py-2 text-sm text-red-500', active ? 'bg-zinc-800' : '')}>
                                            Log Out
                                        </button>
                                    )}
                                </Menu.Item>
                            </div>
                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>
        </header>
    );
}
