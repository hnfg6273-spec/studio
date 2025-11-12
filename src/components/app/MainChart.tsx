"use client";

import * as React from 'react';
import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Maximize2 } from 'lucide-react';
import { chartData } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import ChartModal from '@/components/app/ChartModal';

type MainChartProps = {
    kpiKey: string;
    timeRange: 'Day' | 'Week' | 'Month';
    setTimeRange: (range: 'Day' | 'Week' | 'Month') => void;
    chartColor: string;
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-lg p-3 shadow-lg bg-zinc-900 border border-zinc-700">
                <p className="label text-sm font-bold mb-2 text-zinc-100">{label}</p>
                {payload.map((p: any) => (
                    <div key={p.name} style={{ color: p.color }} className="text-sm font-medium">
                        {`${p.name}: ${p.value.toLocaleString()}`}
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

export default function MainChart({ kpiKey, timeRange, setTimeRange, chartColor }: MainChartProps) {
    const [isFullScreen, setIsFullScreen] = React.useState(false);
    const activeChartColor = chartColor || '#3b82f6';

    const activeData = React.useMemo(() => {
        const dataSet = chartData[kpiKey as keyof typeof chartData];
        return dataSet ? dataSet[timeRange] : [];
    }, [kpiKey, timeRange]);

    const kpiInfo = {
        requests: { title: "Total Requests", subtitle: "Total API requests over time." },
        trending: { title: "Top Dataset Trends", subtitle: "Performance of top 3 trending datasets." },
        latency: { title: "Average Response", subtitle: "Average API response latency over time." },
        users: { title: "Concurrent Users", subtitle: "Number of concurrent users on the platform." }
    };

    const currentInfo = kpiInfo[kpiKey as keyof typeof kpiInfo] || { title: "Chart", subtitle: "Chart details" };

    const renderChart = (isModal = false) => (
        <ResponsiveContainer width="100%" height={isModal ? "90%" : 300}>
            <LineChart
                data={activeData}
                margin={{ top: 5, right: 20, left: -20, bottom: 0 }}
            >
                <XAxis
                    dataKey="name"
                    stroke='#52525b'
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke='#52525b'
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => typeof value === 'number' ? value.toLocaleString() : value}
                />
                <Tooltip content={<CustomTooltip />} />
                {kpiKey === 'trending' ? (
                    <>
                        <Line type="monotone" dataKey="crypto" name="Crypto Feeds" stroke="#3b82f6" strokeWidth={2.5} dot={false} activeDot={{ r: 6 }} />
                        <Line type="monotone" dataKey="shipping" name="Shipping Logs" stroke="#14b8a6" strokeWidth={2.5} dot={false} activeDot={{ r: 6 }} />
                        <Line type="monotone" dataKey="userData" name="User Data" stroke="#f472b6" strokeWidth={2.5} dot={false} activeDot={{ r: 6 }} />
                    </>
                ) : (
                    <Line
                        type="monotone"
                        dataKey={kpiKey}
                        name={currentInfo.title}
                        stroke={activeChartColor}
                        strokeWidth={2.5}
                        dot={false}
                        activeDot={{ r: 6, fill: activeChartColor, stroke: 'none' }}
                    />
                )}
            </LineChart>
        </ResponsiveContainer>
    );

    return (
        <>
            <div className="rounded-2xl p-6 shadow-sm bg-gradient-to-b from-card/90 to-card">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-white">{currentInfo.title}</h3>
                        <p className="text-sm text-muted-foreground">{currentInfo.subtitle}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="flex items-center p-1 bg-zinc-800 rounded-lg">
                            {(['Day', 'Week', 'Month'] as const).map((range) => (
                                <button
                                    key={range}
                                    onClick={() => setTimeRange(range)}
                                    className={cn(
                                        "py-1 px-3 rounded-md text-xs font-semibold transition-all",
                                        timeRange === range
                                            ? "bg-zinc-700 text-white shadow-sm"
                                            : "text-zinc-400 hover:bg-zinc-700/50"
                                    )}
                                >
                                    {range}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setIsFullScreen(true)}
                            className="p-2 rounded-lg text-zinc-400 hover:bg-zinc-800 transition-colors"
                            aria-label="Maximize chart"
                        >
                            <Maximize2 className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <div className="h-[300px]">
                    {renderChart(false)}
                </div>
                {kpiKey === 'trending' && (
                    <div className="flex justify-center space-x-6 pt-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            <span className="text-xs text-zinc-400">Crypto Feeds</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-teal-500"></div>
                            <span className="text-xs text-zinc-400">Shipping Logs</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-pink-400"></div>
                            <span className="text-xs text-zinc-400">User Data</span>
                        </div>
                    </div>
                )}
            </div>
            <ChartModal isOpen={isFullScreen} onClose={() => setIsFullScreen(false)} title={currentInfo.title}>
                {renderChart(true)}
            </ChartModal>
        </>
    );
}
