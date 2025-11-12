"use client";

import * as React from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Filter, ChevronDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getIcon, getStatusClass } from '@/lib/helpers';
import type { mockDatasets } from '@/lib/mock-data';

type DatasetsPageProps = {
    datasets: typeof mockDatasets;
    toggleDatasetStatus: (id: string, newStatus: string) => void;
    searchTerm: string;
};

type SortConfig = {
    key: string;
    asc: boolean;
};

export default function DatasetsPage({ datasets, toggleDatasetStatus, searchTerm }: DatasetsPageProps) {
    const [filter, setFilter] = React.useState('All');
    const [sort, setSort] = React.useState<SortConfig>({ key: 'lastUpdate', asc: false });

    const sortedAndFilteredDatasets = React.useMemo(() => {
        const filtered = datasets.filter(ds => {
            const matchesFilter = filter === 'All' || ds.status === filter;
            const matchesSearch = ds.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (ds.type && ds.type.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (ds.owner && ds.owner.toLowerCase().includes(searchTerm.toLowerCase()));
            return matchesFilter && matchesSearch;
        });

        return [...filtered].sort((a, b) => {
            let valA = a[sort.key as keyof typeof a];
            let valB = b[sort.key as keyof typeof b];

            if (sort.key === 'lastUpdate' || sort.key === 'created') {
                if (valA === 'Live') return sort.asc ? 1 : -1;
                if (valB === 'Live') return sort.asc ? -1 : 1;
                if (!valA) return sort.asc ? 1 : -1;
                if (!valB) return sort.asc ? -1 : 1;
                valA = new Date(valA as string);
                valB = new Date(valB as string);
            } else if (sort.key === 'size' || sort.key === 'records') {
                const parseMetric = (val: string) => {
                    if (typeof val !== 'string' || val === 'N/A') return 0;
                    const num = parseFloat(val);
                    if (val.endsWith('TB')) return num * 1024 * 1024;
                    if (val.endsWith('GB')) return num * 1024;
                    if (val.endsWith('MB')) return num;
                    if (val.endsWith('M')) return num * 1000000;
                    if (val.endsWith('K')) return num * 1000;
                    return num;
                };
                valA = parseMetric(valA as string);
                valB = parseMetric(valB as string);
            }

            if (typeof valA === 'string' && typeof valB === 'string') {
                valA = valA.toLowerCase();
                valB = valB.toLowerCase();
            } else if (valA == null || valA === 'N/A') {
                return 1;
            } else if (valB == null || valB === 'N/A') {
                return -1;
            }

            if (valA < valB) return sort.asc ? -1 : 1;
            if (valA > valB) return sort.asc ? 1 : -1;
            return 0;
        });
    }, [datasets, filter, sort, searchTerm]);

    const handleSort = (key: string) => {
        if (sort.key === key) {
            setSort({ key, asc: !sort.asc });
        } else {
            setSort({ key, asc: false });
        }
    };

    const headers = [
        { key: 'name', name: 'Name', align: 'left' },
        { key: 'status', name: 'Status', align: 'left' },
        { key: 'type', name: 'Type', align: 'left' },
        { key: 'records', name: 'Records', align: 'right' },
        { key: 'size', name: 'Size', align: 'right' },
        { key: 'lastUpdate', name: 'Last Update', align: 'left' },
        { key: 'owner', name: 'Owner', align: 'left' },
    ];

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-white">Datasets</h2>
                <div className="flex items-center space-x-4">
                    <Menu as="div" className="relative">
                        <Menu.Button className="flex items-center space-x-2 text-sm font-medium text-zinc-300 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 hover:bg-zinc-700 transition-colors">
                            <Filter className="w-4 h-4" />
                            <span>Filter: {filter}</span>
                            <ChevronDown className="w-4 h-4" />
                        </Menu.Button>
                        <Transition as={React.Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
                            <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-zinc-900 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                                <div className="p-1">
                                    {['All', 'Active', 'Paused', 'Archived', 'Error'].map((status) => (
                                        <Menu.Item key={status}>
                                            {({ active }) => (
                                                <button onClick={() => setFilter(status)} className={cn('group flex rounded-md items-center w-full px-2 py-2 text-sm', (active || filter === status) ? 'bg-zinc-800 text-white' : 'text-zinc-300')}>
                                                    {status}
                                                </button>
                                            )}
                                        </Menu.Item>
                                    ))}
                                </div>
                            </Menu.Items>
                        </Transition>
                    </Menu>
                    <button className="text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg px-4 py-2 transition-colors shadow-sm">
                        Add New Dataset
                    </button>
                </div>
            </div>

            <div className="rounded-2xl shadow-sm bg-gradient-to-b from-card/90 to-card overflow-hidden border border-border">
                <table className="min-w-full divide-y divide-border">
                    <thead className="bg-card/50">
                        <tr>
                            {headers.map((header) => (
                                <th key={header.key} scope="col" className={cn("px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer transition-colors hover:bg-accent/30", `text-${header.align}`)} onClick={() => handleSort(header.key)}>
                                    <div className={cn("flex items-center space-x-1", `justify-${header.align === 'right' ? 'end' : 'start'}`)}>
                                        <span>{header.name}</span>
                                        {sort.key === header.key && (sort.asc ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />)}
                                    </div>
                                </th>
                            ))}
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {sortedAndFilteredDatasets.map((dataset) => (
                            <tr key={dataset.id} className="hover:bg-accent/20 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center space-x-3">{getIcon(dataset.type)}<span className="text-sm font-medium text-white">{dataset.name}</span></div></td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Menu as="div" className="relative">
                                        <Menu.Button className={cn("flex items-center space-x-2 px-3 py-1 text-xs font-medium text-white rounded-full cursor-pointer", getStatusClass(dataset.status))}>
                                            <span>{dataset.status}</span>
                                            <ChevronDown className="w-3 h-3" />
                                        </Menu.Button>
                                        <Transition as={React.Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
                                            <Menu.Items className="absolute left-0 mt-2 w-40 origin-top-left bg-zinc-900 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                                                <div className="p-1">
                                                    {['Active', 'Paused', 'Error'].map(newStatus => (
                                                        <Menu.Item key={newStatus}>
                                                            {({ active }) => (
                                                                <button onClick={() => toggleDatasetStatus(dataset.id, newStatus)} disabled={dataset.status === newStatus || dataset.status === 'Archived'} className={cn('group flex rounded-md items-center w-full px-2 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed', active ? 'bg-zinc-800 text-white' : 'text-zinc-300')}>
                                                                    {newStatus}
                                                                </button>
                                                            )}
                                                        </Menu.Item>
                                                    ))}
                                                </div>
                                            </Menu.Items>
                                        </Transition>
                                    </Menu>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400">{dataset.type}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-white text-right">{dataset.records}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-white text-right">{dataset.size}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400">{dataset.lastUpdate}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400">{dataset.owner}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button className="text-primary hover:text-primary/80 transition-colors">Details</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
