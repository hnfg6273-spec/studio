"use client";

import * as React from 'react';
import KPICard from '@/components/app/KPICard';
import MainChart from '@/components/app/MainChart';
import CategoryDonutChart from '@/components/app/CategoryDonutChart';
import { Zap, TrendingUp, Activity, Users } from 'lucide-react';
import type { mockDatasets } from '@/lib/mock-data';

type DashboardViewProps = {
    allDatasets: typeof mockDatasets;
    toggleDatasetStatus: (id: string, newStatus: string) => void;
    searchTerm: string;
};

export default function DashboardView({ allDatasets, toggleDatasetStatus, searchTerm }: DashboardViewProps) {
    const [activeKpi, setActiveKpi] = React.useState('requests');
    const trendingCount = React.useMemo(() => allDatasets.filter(ds => ds.status === 'Active').length, [allDatasets]);

    const kpiData = React.useMemo(() => ({
        requests: {
            title: "Total Requests",
            value: "2.5M",
            change: "+12.5%",
            changeType: "positive",
            icon: Zap,
            gradient: "bg-gradient-to-r from-cyan-400 to-blue-500",
            iconBgLight: "bg-cyan-500/10",
            iconColor: "text-cyan-400",
            activeRing: "ring-cyan-500/70",
            activeShadow: "shadow-[0_0_15px_rgba(6,182,212,0.3)]"
        },
        trending: {
            title: "Trending Datasets",
            value: trendingCount.toString(),
            change: `${((trendingCount / allDatasets.length) * 100).toFixed(0)}% of all datasets`,
            changeType: "positive",
            icon: TrendingUp,
            gradient: "bg-gradient-to-r from-purple-400 to-pink-500",
            iconBgLight: "bg-purple-500/10",
            iconColor: "text-purple-400",
            activeRing: "ring-purple-500/70",
            activeShadow: "shadow-[0_0_15px_rgba(168,85,247,0.3)]"
        },
        latency: {
            title: "Avg. Response",
            value: "24ms",
            change: "-2.4%",
            changeType: "negative",
            icon: Activity,
            gradient: "bg-gradient-to-r from-teal-400 to-emerald-500",
            iconBgLight: "bg-teal-500/10",
            iconColor: "text-teal-400",
            activeRing: "ring-teal-500/70",
            activeShadow: "shadow-[0_0_15px_rgba(20,184,166,0.3)]"
        },
        users: {
            title: "Concurrent Users",
            value: "842",
            change: "+4.3%",
            changeType: "positive",
            icon: Users,
            gradient: "bg-gradient-to-r from-orange-400 to-amber-500",
            iconBgLight: "bg-orange-500/10",
            iconColor: "text-orange-400",
            activeRing: "ring-orange-500/70",
            activeShadow: "shadow-[0_0_15px_rgba(249,115,22,0.3)]"
        }
    }), [trendingCount, allDatasets.length]);

    const activeChartColor = React.useMemo(() => {
        const colorMap: { [key: string]: string } = {
            'text-cyan-400': '#22d3ee',
            'text-purple-400': '#c084fc',
            'text-teal-400': '#2dd4bf',
            'text-orange-400': '#fb923c'
        };
        const activeKpiData = kpiData[activeKpi as keyof typeof kpiData];
        const activeColorKey = activeKpiData?.iconColor;
        return activeColorKey ? colorMap[activeColorKey] : '#3b82f6';
    }, [activeKpi, kpiData]);

    return (
        <div className="p-8 space-y-8">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.entries(kpiData).map(([key, data]) => (
                    <KPICard
                        key={key}
                        cardKey={key}
                        {...data}
                        onSelect={setActiveKpi}
                        isActive={activeKpi === key}
                    />
                ))}
            </div>

            {/* MAIN CONTENT GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Main Chart */}
                <div className="lg:col-span-2">
                    <MainChart
                        kpiKey={activeKpi}
                        chartColor={activeChartColor}
                    />
                </div>

                {/* Right Column: Donut Chart */}
                <div className="lg:col-span-1">
                    <CategoryDonutChart />
                </div>
            </div>
        </div>
    );
}
