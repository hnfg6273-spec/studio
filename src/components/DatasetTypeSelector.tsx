'use client';

import React, { useState } from 'react';
import { LayoutGrid, Image, Globe, LineChart } from 'lucide-react';
import { Theme } from '@/lib/types';
import Icon from './Icon';

// DatasetOption Component (Local/Internal)
const DatasetOption = ({ icon: IconComponent, title, description, isSelected, onClick, theme }: { icon: React.ElementType, title: string, description: string, isSelected: boolean, onClick: () => void, theme: Theme }) => {
    const isDark = theme.text !== 'text-zinc-900';

    const baseClasses = "flex flex-col items-center justify-start text-center p-6 transition-all duration-300 cursor-pointer rounded-xl min-h-[160px]";
    const selectedClasses = isDark ? "border-2 border-cyan-400 bg-cyan-900/20 shadow-lg text-cyan-300" : "border-2 border-blue-500 bg-blue-50 shadow-lg text-blue-700";
    const unselectedClasses = isDark ? "border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 hover:border-cyan-500/50" : "border border-gray-200 bg-white hover:bg-gray-50 hover:border-blue-500/50";

    const titleColor = isSelected ? (isDark ? 'text-cyan-300' : 'text-blue-700') : (isDark ? 'text-zinc-200' : 'text-gray-800');
    const descriptionColor = isSelected ? (isDark ? 'text-cyan-400/80' : 'text-blue-600') : (isDark ? 'text-zinc-400' : 'text-gray-500');
    const iconColor = isSelected ? (isDark ? 'text-cyan-400' : 'text-blue-500') : (isDark ? 'text-zinc-400' : 'text-gray-400');

    return (
        <div
            className={`${baseClasses} ${isSelected ? selectedClasses : unselectedClasses}`}
            onClick={onClick}
            role="button"
            tabIndex={0}
            aria-pressed={isSelected}
        >
            <IconComponent className={`w-10 h-10 mb-3 transition-colors ${iconColor}`} />
            <span className={`text-lg font-semibold mb-1 ${titleColor}`}>{title}</span>
            <p className={`text-sm ${descriptionColor}`}>
                {description}
            </p>
        </div>
    );
};

interface DatasetTypeSelectorProps {
    theme: Theme;
}

const DatasetTypeSelector: React.FC<DatasetTypeSelectorProps> = ({ theme }) => {
    const [selectedDataset, setSelectedDataset] = useState('Structured data');

    const options = [
        {
            id: 'Structured data',
            title: 'Structured data',
            icon: LayoutGrid,
            description: "Relational tables, spreadsheets, and CSV files."
        },
        {
            id: 'Images & Video',
            title: 'Images & Video',
            icon: Image,
            description: "Photos, recorded videos, and live camera feeds."
        },
        {
            id: 'Language',
            title: 'Language',
            icon: Globe,
            description: "Text documents, transcripts, and spoken audio."
        },
        {
            id: 'Time Series',
            title: 'Time Series',
            icon: LineChart,
            description: "Sequential measurements like stock prices or sensor data."
        },
    ];

    const isDark = theme.text !== 'text-zinc-900';
    const headerColor = isDark ? 'text-zinc-100' : 'text-gray-800';
    const underlineColor = isDark ? 'bg-cyan-400' : 'bg-blue-500';
    const footerBg = isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-gray-50 border-gray-200';
    const footerTextColor = isDark ? 'text-zinc-400' : 'text-gray-600';
    const selectedTextColor = isDark ? 'text-cyan-300' : 'text-blue-600';

    return (
        <div className={`w-full max-w-7xl mx-auto py-16 px-8`}>
            <header className="mb-8">
                <h2 className={`text-3xl font-bold ${headerColor} relative inline-block pb-1`}>
                    Browse by Type
                    <span className={`absolute left-0 bottom-0 h-1 w-2/3 ${underlineColor} rounded-full`}></span>
                </h2>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {options.map((option) => (
                    <DatasetOption
                        key={option.id}
                        icon={option.icon}
                        title={option.title}
                        description={option.description}
                        isSelected={selectedDataset === option.id}
                        onClick={() => setSelectedDataset(option.id)}
                        theme={theme}
                    />
                ))}
            </div>
            
            <footer className={`mt-10 p-4 rounded-lg text-center border ${footerBg}`}>
                <p className={`text-sm ${footerTextColor}`}>
                    Currently Selected Dataset Type: <span className={`font-semibold ${selectedTextColor}`}>{selectedDataset}</span>
                </p>
            </footer>
        </div>
    );
};

export default DatasetTypeSelector;
