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
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-lg p-3 shadow-lg bg-zinc-900 border border-zinc-700">
                <p className="label text-sm font-bold mb-2 text-zinc-100">{label}</p>
                {payload.map((p: any, index: number) => (
                    <div key={index} style={{ color: p.color }} className="text-sm font-medium">
                        {`${p.name}: ${p.value.toLocaleString()}`}
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

export default function MainChart({ kpiKey, chartColor }: MainChartProps) {
    const [isFullScreen, setIsFullScreen] = React.useState(false);
    const activeChartColor = chartColor || '#3b82f6';

    const timeRange = 'Month';

    const activeData = React.useMemo(() => {
        const dataSet = chartData[kpiKey as keyof typeof chartData];
        if (!dataSet) return [];

        const dataForTimeRange = dataSet[timeRange];
        if (!dataForTimeRange) return [];

        if (kpiKey === 'trending') {
            return dataForTimeRange.map((d: any) => ({
                name: d.name,
                trending: d.crypto + d.shipping + d.userData,
                crypto: d.crypto,
            }));
        }
        
        return dataForTimeRange.map((d: any) => ({ name: d.name, [kpiKey]: d[kpiKey] }));
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
                
                {kpiKey === 'trending' && <Legend verticalAlign="top" align="right" height={36} />}

                {kpiKey === 'trending' ? (
                    <>
                        <Line
                            type="monotone"
                            dataKey="trending"
                            name="Total Trending"
                            stroke={activeChartColor}
                            strokeWidth={2.5}
                            dot={false}
                            activeDot={{ r: 6, fill: activeChartColor, stroke: 'none' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="crypto"
                            name="Crypto"
                            stroke="#82ca9d"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 6, stroke: 'none' }}
                        />
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
