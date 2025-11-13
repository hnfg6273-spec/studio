"use client";
import * as React from 'react';
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer
} from 'recharts';
import { Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { donutData } from '@/lib/mock-data';
import ChartModal from '@/components/app/ChartModal';

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name, value }: any) => {
    const radius = outerRadius + 30; // Distance from chart
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const anchor = x > cx ? 'start' : 'end';

    const dataEntry = donutData.find(d => d.name === name);
    const color = dataEntry ? dataEntry.color : '#8884d8';

    return (
        <g>
            <path d={`M${cx + (outerRadius + 0) * Math.cos(-midAngle * RADIAN)},${cy + (outerRadius + 0) * Math.sin(-midAngle * RADIAN)}L${x},${y}`}
                stroke={"#4b5563"}
                fill="none"
                strokeWidth={1.5}
            />
            <foreignObject x={anchor === 'start' ? x + 5 : x - 105} y={y - 28} width={100} height={55} style={{ overflow: "visible" }}>
                <div
                    style={{
                        backgroundColor: "#18181b",
                        border: "1.5px solid #3f3f46",
                        borderRadius: "8px",
                        padding: "6px 8px",
                        color: "#d4d4d8",
                        fontSize: "12px",
                        lineHeight: "1.3",
                        textAlign: anchor === 'start' ? 'left' : 'right',
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                >
                    <div style={{ color: color, fontWeight: 600 }}>{name}</div>
                    <div>Count: {value}</div>
                    <div>{(percent * 100).toFixed(0)}%</div>
                </div>
            </foreignObject>
        </g>
    );
};

export default function CategoryDonutChart() {
    const [isFullScreen, setIsFullScreen] = React.useState(false);
    const [timeRange, setTimeRange] = React.useState('Week');

    const renderChart = (isModal = false) => (
        <ResponsiveContainer width="100%" height={isModal ? "90%" : 250}>
            <PieChart margin={{ top: 40, right: 60, bottom: 40, left: 60 }}>
                <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={isModal ? 120 : 60}
                    outerRadius={isModal ? 180 : 90}
                    fill="#8884d8"
                    dataKey="value"
                    labelLine={false}
                    label={(props) => renderCustomizedLabel({ ...props })}
                >
                    {donutData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke={'#18181b'} strokeWidth={3} />
                    ))}
                </Pie>
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#18181b',
                        borderColor: '#3f3f46',
                        borderRadius: '8px'
                    }}
                />
            </PieChart>
        </ResponsiveContainer>
    );

    return (
        <>
            <div className="rounded-2xl p-6 shadow-sm bg-gradient-to-b from-card/90 to-card h-full">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-white">Datasets by Category</h3>
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
                <div className="h-[250px]">
                    {renderChart(false)}
                </div>
            </div>
            <ChartModal isOpen={isFullScreen} onClose={() => setIsFullScreen(false)} title="Datasets by Category">
                {renderChart(true)}
            </ChartModal>
        </>
    );
}
