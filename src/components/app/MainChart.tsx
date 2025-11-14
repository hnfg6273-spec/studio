"use client";

import * as React from 'react';
import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { Maximize2 } from 'lucide-react';
import { chartData } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import ChartModal from '@/components/app/ChartModal';

type MainChartProps = {
    kpiKey: string;
    chartColor: string;
    timeRange: string;
    setTimeRange: (range: string) => void;
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-lg p-3 shadow-lg bg-zinc-900 border border-zinc-700">
                <p className="label text-sm font-bold mb-2 text-zinc-100">{label}</p>
                {payload.map((p: any, index: number) => (
                    <div key={index} style={{ color: p.stroke }} className="text-sm font-medium">
                        {`${p.name}: ${p.value.toLocaleString()}`}
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

export default function MainChart({ kpiKey, chartColor, timeRange, setTimeRange }: MainChartProps) {
    const [isFullScreen, setIsFullScreen] = React.useState(false);
    const activeChartColor = chartColor || '#3b82f6';

    const activeData = React.useMemo(() => {
        const dataSet = chartData[kpiKey as keyof typeof chartData];
        if (!dataSet) return [];

        const dataForTimeRange = dataSet[timeRange as keyof typeof dataSet];
        if (!dataForTimeRange) return [];

        if (kpiKey === 'trending') {
            return (dataForTimeRange as any[]).map((d: any) => ({
                name: d.name,
                trending: d.crypto + d.shipping + d.userData,
                crypto: d.crypto,
            }));
        }
        
        return (dataForTimeRange as any[]).map((d: any) => ({ name: d.name, [kpiKey]: d[kpiKey] }));
    }, [kpiKey, timeRange]);

    const kpiInfo = {
        requests: { title: "Total Requests", subtitle: "Total API requests over time." },
        trending: { title: "Top Dataset Trends", subtitle: "Performance of top trending datasets." },
        latency: { title: "Average Response", subtitle: "Average API response latency over time." },
        users: { title: "Concurrent Users", subtitle: "Number of concurrent users on the platform." }
    };

    const currentInfo = kpiInfo[kpiKey as keyof typeof kpiInfo] || { title: "Chart", subtitle: "Chart details" };
    
    const renderChart = (isModal = false) => (
        <ResponsiveContainer width="100%" height={isModal ? "90%" : 300}>
            <LineChart
                data={activeData}
                margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
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
                
                {kpiKey === 'trending' && <Legend verticalAlign="bottom" wrapperStyle={{paddingTop: 10}} />}

                <Line
                    type="monotone"
                    dataKey={kpiKey === 'trending' ? 'trending' : kpiKey}
                    name={currentInfo.title}
                    stroke={activeChartColor}
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 6, fill: activeChartColor, stroke: 'none' }}
                />
                {kpiKey === 'trending' && (
                    <Line
                        type="monotone"
                        dataKey="crypto"
                        name="Crypto"
                        stroke="#34d399" // A green color
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6, fill: '#34d399', stroke: 'none' }}
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
                        <div className="bg-zinc-800/50 p-1 rounded-lg flex items-center space-x-1">
                            {['Day', 'Week', 'Month'].map(range => (
                                <button
                                    key={range}
                                    onClick={() => setTimeRange(range)}
                                    className={cn(
                                        "py-1 px-3 rounded-md text-xs font-semibold transition-all",
                                        timeRange === range
                                            ? 'bg-zinc-700 text-white shadow'
                                            : 'text-zinc-400 hover:bg-zinc-700/50'
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
            </div>
            <ChartModal isOpen={isFullScreen} onClose={() => setIsFullScreen(false)} title={currentInfo.title}>
                {renderChart(true)}
            </ChartModal>
        </>
    );
}
