"use client";

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import Chart, { ChartConfiguration, ChartType, ChartData, ChartOptions } from 'chart.js/auto';
import { CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend } from 'chart.js';
import * as LucideIcons from 'lucide-react';
// Fix: Add Tooltip to the recharts import
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Register Chart.js components
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend);

// types.ts
export enum Page {
  DASHBOARD = 'dashboard',
  DATASETS = 'datasets',
  ANALYTICS = 'analytics',
  SETTINGS = 'settings',
}

export enum DatasetType {
  STREAM = 'Stream',
  DATABASE = 'Database',
  FILE = 'File',
  LOG = 'Log',
  STATIC = 'Static',
}

export enum DatasetStatus {
  ACTIVE = 'Active',
  PAUSED = 'Paused',
  ARCHIVED = 'Archived',
  ERROR = 'Error',
}

export enum KpiKey {
  REQUESTS = 'requests',
  TRENDING = 'trending',
  LATENCY = 'latency',
  USERS = 'users',
}

export enum TimeRange {
  DAY = 'Day',
  WEEK = 'Week',
  MONTH = 'Month',
}

export enum ThemeKey {
  OCEAN = 'ocean',
  DAY = 'day',
  SUNSET = 'sunset',
  FOREST = 'forest',
}

export interface Dataset {
  id: string;
  name: string;
  type: DatasetType;
  status: DatasetStatus;
  trend: string;
  records: string;
  size: string;
  created: string;
  lastUpdate: string;
  owner: string;
  sensitivity: string;
}

export interface Instructor {
  id: string;
  name: string;
  avatar: string;
  degree: string;
  classes: number;
  expertise: string;
}

export interface KpiDataItem {
  title: string;
  value: string | number;
  change: string;
  changeType: 'positive' | 'negative';
  icon: string;
  color: string;
  gradient: string;
}

export interface BaseChartSeries {
  Month: number[];
  Week: number[];
  Day: number[];
}

export interface TrendingChartSeries {
  Month: { label: string; data: number[]; color: string; }[];
  Week: { label: string; data: number[]; color: string; }[];
  Day: { label: string; data: number[]; color: string; }[];
}

export type ChartDataType = {
  [KpiKey.REQUESTS]?: BaseChartSeries;
  [KpiKey.USERS]?: BaseChartSeries;
  [KpiKey.LATENCY]?: BaseChartSeries;
  [KpiKey.TRENDING]?: TrendingChartSeries;
};

export interface DonutDataItem {
  name: string;
  value: number;
  color: string;
}

export interface Theme {
  app: string;
  text: string;
  sidebar: string;
  sidebarBorder: string;
  sidebarActive: string;
  sidebarHover: string;
  topbar: string;
  topbarBorder: string;
  title: string;
  searchBg: string;
  searchBorder: string;
  table: string;
  tableCell: string;
  tableCellSubtle: string;
  kpiCard: string;
  kpiCardValue: string;
  chartBg: string;
  chartTitle: string;
  modal: string;
}

export type Themes = {
  [key in ThemeKey]: Theme;
};

export interface NavItem {
  name: string;
  icon: string;
  page: Page;
}

export interface SortState {
  key: keyof Dataset;
  asc: boolean;
}

// constants.ts
export const MOCK_DATASETS: Dataset[] = [
  { id: 'ds_002', name: 'Product Catalog (Staging)', type: DatasetType.DATABASE, status: DatasetStatus.ACTIVE, trend: '+5.2%', records: '1.2K', size: '150MB', created: '2023-02-01', lastUpdate: '2023-11-10', owner: 'Data Ops', sensitivity: 'Medium' },
  { id: 'ds_003', name: 'Quarterly Sales Projections', type: DatasetType.FILE, status: DatasetStatus.ACTIVE, trend: '-2.4%', records: '850', size: '25MB', created: '2023-03-20', lastUpdate: '2023-11-01', owner: 'Finance Team', sensitivity: 'High' },
  { id: 'ds_004', name: 'API Gateway Logs (Jan)', type: DatasetType.LOG, status: DatasetStatus.ARCHIVED, trend: '0.0%', records: '150M', size: '25.6TB', created: '2023-01-31', lastUpdate: '2023-02-01', owner: 'DevOps', sensitivity: 'Medium' },
  { id: 'ds_005', name: 'Customer Support Tickets', type: DatasetType.DATABASE, status: DatasetStatus.ACTIVE, trend: '+18.3%', records: '45.2K', size: '2.2GB', created: '2022-11-10', lastUpdate: '2023-11-11', owner: 'Support Team', sensitivity: 'High' },
  { id: 'ds_006', name: 'Marketing Campaign ROI', type: DatasetType.STATIC, status: DatasetStatus.ACTIVE, trend: '+8.1%', records: '5.6K', size: '110MB', created: '2023-04-05', lastUpdate: '2023-10-28', owner: 'Marketing', sensitivity: 'Medium' },
  { id: 'ds_007', name: 'IoT Sensor Data (Factory A)', type: DatasetType.STREAM, status: DatasetStatus.PAUSED, trend: 'N/A', records: 'N/A', size: 'N/A', created: '2023-05-15', lastUpdate: '2023-11-05', owner: 'Ops', sensitivity: 'Low' },
  { id: 'ds_008', name: 'Employee Directory', type: DatasetType.DATABASE, status: DatasetStatus.ACTIVE, trend: '+1.0%', records: '1.8K', size: '90MB', created: '2022-01-01', lastUpdate: '2023-11-11', owner: 'HR', sensitivity: 'High' },
  { id: 'ds_009', name: 'Web Analytics (Main Site)', type: DatasetType.STREAM, status: DatasetStatus.ERROR, trend: '-5.5%', records: '800K', size: '500GB', created: '2023-06-01', lastUpdate: '2023-11-12', owner: 'Marketing', sensitivity: 'Medium' },
  { id: 'ds_010', name: 'Financial Transactions Q3', type: DatasetType.STATIC, status: DatasetStatus.ACTIVE, trend: '+3.2%', records: '1.1M', size: '1.5GB', created: '2023-10-01', lastUpdate: '2023-11-01', owner: 'Finance Team', sensitivity: 'Confidential' },
  { id: 'ds_012', name: 'Internal Audit Logs (Q1)', type: DatasetType.LOG, status: DatasetStatus.ACTIVE, trend: '+0.5%', records: '200M', size: '30.0TB', created: '2023-01-01', lastUpdate: '2023-03-31', owner: 'Security', sensitivity: 'High' },
  { id: 'ds_013', name: 'Customer Feedback Survey', type: DatasetType.FILE, status: DatasetStatus.ACTIVE, trend: '+7.8%', records: '1.5K', size: '35MB', created: '2023-09-01', lastUpdate: '2023-11-10', owner: 'Customer Success', sensitivity: 'Medium' },
  { id: 'ds_014', name: 'Supply Chain Data', type: DatasetType.DATABASE, status: DatasetStatus.ACTIVE, trend: '+4.1%', records: '50K', size: '3.5GB', created: '2023-08-10', lastUpdate: '2023-11-09', owner: 'Operations', sensitivity: 'High' },
  // Reordered 'Live' datasets to match screenshot for "New Datasets"
  { id: 'ds_015', name: 'Website Performance Logs', type: DatasetType.LOG, status: DatasetStatus.ACTIVE, trend: '+9.2%', records: '10M', size: '700GB', created: '2023-04-15', lastUpdate: 'Live', owner: 'DevOps', sensitivity: 'Low' },
  { id: 'ds_011', name: 'User Engagement Metrics', type: DatasetType.STREAM, status: DatasetStatus.ACTIVE, trend: '+15.0%', records: '3.1M', size: '1.8TB', created: '2023-07-20', lastUpdate: 'Live', owner: 'Product Team', sensitivity: 'Medium' },
  { id: 'ds_001', name: 'Real-time User Activity', type: DatasetType.STREAM, status: DatasetStatus.ACTIVE, trend: '+12.5%', records: '2.5M', size: '1.2TB', created: '2023-01-15', lastUpdate: 'Live', owner: 'Alex Moran', sensitivity: 'High' },
];

export const TRENDING_DATA_SERIES: TrendingChartSeries = {
  Month: [
    { label: 'Total', data: [0.7, 0.6, 0.8, 0.75, 0.9, 0.85, 0.95, 0.8, 0.7, 0.75, 0.8, 0.9], color: '#c084fc' }, // purple-400
    { label: 'Crypto', data: [0.3, 0.4, 0.35, 0.5, 0.45, 0.55, 0.5, 0.4, 0.3, 0.4, 0.5, 0.4], color: '#f97316' }, // orange-500
  ],
  Week: [
    { label: 'Total', data: [0.8, 0.75, 0.85, 0.9, 0.8, 0.7, 0.9], color: '#c084fc' },
    { label: 'Crypto', data: [0.4, 0.45, 0.5, 0.4, 0.3, 0.35, 0.4], color: '#f97316' },
  ],
  Day: [
    { label: 'Total', data: [0.7, 0.75, 0.8, 0.85, 0.9, 0.88, 0.92, 0.85, 0.8, 0.75, 0.7, 0.65], color: '#c084fc' },
    { label: 'Crypto', data: [0.3, 0.32, 0.35, 0.38, 0.4, 0.37, 0.39, 0.35, 0.3, 0.28, 0.25, 0.2], color: '#f97316' },
  ],
};

export const CHART_DATA: ChartDataType = {
  [KpiKey.REQUESTS]: {
    Month: [4000, 3000, 2000, 2780, 1890, 2390, 3490, 3000, 3500, 4100, 4300, 4500],
    Week: [820, 932, 901, 1120, 1290, 1250, 1100],
    Day: [110, 100, 120, 180, 250, 300, 280, 310, 350, 320, 280, 200]
  } as BaseChartSeries,
  [KpiKey.USERS]: {
    Month: [500, 520, 510, 550, 580, 620, 650, 680, 700, 710, 730, 750],
    Week: [680, 700, 710, 730, 750, 740, 720],
    Day: [300, 250, 280, 350, 450, 550, 600, 620, 650, 630, 580, 450]
  } as BaseChartSeries,
  [KpiKey.LATENCY]: {
    Month: [30, 28, 32, 30, 25, 22, 24, 28, 26, 30, 32, 28],
    Week: [32, 30, 28, 25, 28, 30, 29],
    Day: [20, 22, 25, 30, 35, 40, 38, 35, 32, 28, 25, 22]
  } as BaseChartSeries,
  [KpiKey.TRENDING]: TRENDING_DATA_SERIES,
};

export const DONUT_DATA: DonutDataItem[] = [
  { name: 'Stream', value: 4, color: '#3b82f6' }, // blue-500 (ds_001, ds_007, ds_009, ds_011)
  { name: 'Database', value: 4, color: '#ec4899' }, // pink-500 (ds_002, ds_005, ds_008, ds_014)
  { name: 'Log', value: 3, color: '#f97316' }, // orange-500 (ds_004, ds_012, ds_015)
  { name: 'Static', value: 2, color: '#a855f7' } // purple-500 (ds_006, ds_010)
];

export const NAV_ITEMS: NavItem[] = [
  { name: 'Dashboard', icon: 'LayoutDashboard', page: Page.DASHBOARD },
  { name: 'Datasets', icon: 'Database', page: Page.DATASETS },
  { name: 'Analytics', icon: 'BarChart3', page: Page.ANALYTICS },
  { name: 'Settings', icon: 'Settings', page: Page.SETTINGS }
];

export const THEMES: Themes = {
  [ThemeKey.OCEAN]: {
    app: 'bg-gradient-to-br from-[#14253F] via-[#126C86] to-[#2198AC]',
    text: 'text-zinc-100',
    sidebar: 'bg-[#14253F]',
    sidebarBorder: 'border-zinc-800',
    sidebarActive: 'bg-gradient-to-br from-[#126C86] to-[#2198AC] text-white',
    sidebarHover: 'hover:bg-[#126C86]',
    topbar: 'bg-[#14253F]/50',
    topbarBorder: 'border-zinc-800',
    title: 'text-white',
    searchBg: 'bg-[#14253F]/80',
    searchBorder: 'border-[#126C86]/50',
    table: 'bg-[#14253F]/90 border-[#126C86]/50',
    tableCell: 'text-white',
    tableCellSubtle: 'text-zinc-400',
    kpiCard: 'bg-[#14253F]/90 border-[#126C86]/50',
    kpiCardValue: 'text-white',
    chartBg: 'bg-[#14253F]/90',
    chartTitle: 'text-white',
    modal: 'bg-zinc-900'
  },
  [ThemeKey.DAY]: {
    app: 'bg-gradient-to-br from-white to-blue-50',
    text: 'text-zinc-900',
    sidebar: 'bg-zinc-100',
    sidebarBorder: 'border-zinc-200',
    sidebarActive: 'bg-gradient-to-br from-[#126C86] to-[#2198AC] text-white',
    sidebarHover: 'hover:bg-zinc-200',
    topbar: 'bg-zinc-100/50',
    topbarBorder: 'border-zinc-200',
    title: 'text-zinc-900',
    searchBg: 'bg-white',
    searchBorder: 'border-zinc-300',
    table: 'bg-white border-zinc-200',
    tableCell: 'text-zinc-900',
    tableCellSubtle: 'text-zinc-500',
    kpiCard: 'bg-white border-gray-200',
    kpiCardValue: 'text-zinc-900',
    chartBg: 'bg-white',
    chartTitle: 'text-zinc-900',
    modal: 'bg-white'
  },
  [ThemeKey.SUNSET]: {
    app: 'bg-gradient-to-br from-purple-900 via-red-700 to-orange-500',
    text: 'text-zinc-100',
    sidebar: 'bg-gradient-to-b from-purple-900 to-red-900',
    sidebarBorder: 'border-purple-700/50',
    sidebarActive: 'bg-gradient-to-br from-purple-600 to-red-600 text-white',
    sidebarHover: 'hover:bg-purple-700/50',
    topbar: 'bg-purple-900/50',
    topbarBorder: 'border-purple-700/50',
    title: 'text-white',
    searchBg: 'bg-purple-900/80',
    searchBorder: 'border-purple-700/50',
    table: 'bg-[#2a1a3b]/90 border-purple-700/50',
    tableCell: 'text-white',
    tableCellSubtle: 'text-zinc-400',
    kpiCard: 'bg-[#2a1a3b]/90 border-purple-700/50',
    kpiCardValue: 'text-white',
    chartBg: 'bg-[#2a1a3b]/90',
    chartTitle: 'text-white',
    modal: 'bg-zinc-900'
  },
  [ThemeKey.FOREST]: {
    app: 'bg-gradient-to-br from-green-900 via-teal-800 to-gray-900',
    text: 'text-zinc-100',
    sidebar: 'bg-gradient-to-b from-green-900 to-teal-900',
    sidebarBorder: 'border-teal-700/50',
    sidebarActive: 'bg-gradient-to-br from-green-600 to-teal-500 text-white',
    sidebarHover: 'hover:bg-green-700/50',
    topbar: 'bg-green-900/50',
    topbarBorder: 'border-teal-700/50',
    title: 'text-white',
    searchBg: 'bg-green-900/80',
    searchBorder: 'border-teal-700/50',
    table: 'bg-[#0d2a21]/90 border-teal-700/50',
    tableCell: 'text-white',
    tableCellSubtle: 'text-zinc-400',
    kpiCard: 'bg-[#0d2a21]/90 border-teal-700/50',
    kpiCardValue: 'text-white',
    chartBg: 'bg-[#0d2a21]/90',
    chartTitle: 'text-white',
    modal: 'bg-zinc-900'
  }
};

// utils.ts
function getIcon(type: DatasetType): string {
  const icons: { [key in DatasetType]: string } = {
    [DatasetType.STREAM]: 'Server',
    [DatasetType.DATABASE]: 'Database',
    [DatasetType.FILE]: 'FileText',
    [DatasetType.LOG]: 'HardDrive',
    [DatasetType.STATIC]: 'Cloud'
  };
  return icons[type] || 'FileText';
}

function getStatusClass(status: DatasetStatus): string {
  const map: { [key in DatasetStatus]: string } = {
    [DatasetStatus.ACTIVE]: 'bg-green-500',
    [DatasetStatus.PAUSED]: 'bg-yellow-500',
    [DatasetStatus.ARCHIVED]: 'bg-zinc-500',
    [DatasetStatus.ERROR]: 'bg-red-500'
  };
  return map[status] || 'bg-gray-500';
}

function formatDate(dateStr: string): string {
  if (dateStr === 'Live') return 'Live';
  const d = new Date(dateStr);
  return d.toLocaleDateString();
}

function parseMetric(val: string): number {
  if (typeof val !== 'string' || val === 'N/A') return 0;
  const num = parseFloat(val);
  if (val.endsWith('TB')) return num * 1024 * 1024;
  if (val.endsWith('GB')) return num * 1024;
  if (val.endsWith('MB')) return num;
  if (val.endsWith('M')) return num * 1000000;
  if (val.endsWith('K')) return num * 1000;
  return num;
}

// components/Icon.tsx
interface IconProps {
  name: string;
  className?: string;
  style?: React.CSSProperties;
}

const Icon: React.FC<IconProps> = ({ name, className, style }) => {
  const LucideIcon = (LucideIcons as any)[name];

  if (!LucideIcon) {
    console.warn(`Icon "${name}" not found in lucide-react.`);
    return null;
  }

  return <LucideIcon className={className} style={style} />;
};

// components/KpiCard.tsx
interface KpiCardProps {
  data: KpiDataItem;
  isActive: boolean;
  onClick: () => void;
  theme: Theme;
  isTrendingCard?: boolean;
}

const KpiCard: React.FC<KpiCardProps> = ({ data, isActive, onClick, theme, isTrendingCard = false }) => {
  const trendIcon = data.changeType === 'positive' ? 'TrendingUp' : 'TrendingDown';
  const trendColorClass = data.changeType === 'positive' ? 'text-green-500' : 'text-red-500';
  const trendRotationClass = data.changeType === 'negative' ? 'rotate-180' : '';

  return (
    <div
      onClick={onClick}
      className={`relative p-4 rounded-2xl cursor-pointer transition-all overflow-hidden ${theme.kpiCard} ${
        isActive ? 'ring-2 ring-purple-500/70 shadow-[0_0_15px_rgba(168,85,247,0.3)]' : 'shadow-md hover:-translate-y-0.5'
      }`}
    >
      <div
        className={`absolute top-0 left-0 right-0 h-1 ${data.gradient}`}
        style={{ opacity: isActive ? 1 : 0.7 }}
      ></div>
      <div className="flex items-start justify-between pt-2">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-full" style={{ backgroundColor: `${data.color}1A`}}>
            <Icon name={data.icon} className="w-4 h-4 text-sm" style={{ color: data.color }} />
          </div>
          <span className="text-sm font-medium text-zinc-400">{data.title}</span>
        </div>
      </div>
      <div className="mt-2">
        <h2 className={`text-2xl font-bold ${theme.kpiCardValue}`}>{data.value}</h2>
        <div className="flex items-center text-xs mt-1 space-x-1">
          <div className={`flex items-center space-x-1 ${trendColorClass}`}>
            <Icon name={trendIcon} className={`w-3.5 h-3.5 ${trendRotationClass}`} />
            <span>{data.change}</span>
          </div>
          <span className="text-zinc-400">vs last month</span>
        </div>
      </div>
    </div>
  );
};

// components/ChartRenderer.tsx
interface ChartRendererProps {
  chartType: ChartType;
  data: ChartData;
  options: ChartOptions;
  id: string;
}

const ChartRenderer: React.FC<ChartRendererProps> = ({ chartType, data, options, id }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        chartInstanceRef.current = new Chart(ctx, {
          type: chartType,
          data: data,
          options: options,
        });
      }
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [chartType, data, options]);

  return <canvas id={id} ref={chartRef}></canvas>;
};

// components/DonutChartRecharts.tsx
interface DonutChartRechartsProps {
  data: DonutDataItem[];
  theme: Theme;
  isModal?: boolean;
}

const RADIAN = Math.PI / 180;

const DonutChartRecharts: React.FC<DonutChartRechartsProps> = ({ data, theme, isModal = false }) => {
  const pieInnerRadius = isModal ? 70 : 60;
  const pieOuterRadius = isModal ? 110 : 90;

  const outerRadialOffset = 5;
  const lineSegmentLength = 8;
  const horizontalLineExtension = 5;
  const labelBoxMargin = 8;
  const labelRectWidth = 120;
  const labelRectHeight = 60;
  const verticalStackingOffset = 28;

  const getVerticalStackOffset = useCallback((idx: number, total: number): number => {
    return (idx - (total - 1) / 2) * verticalStackingOffset;
  }, [verticalStackingOffset]);

  const renderCustomizedLabel = useCallback((props: any) => {
    const { cx, cy, midAngle, outerRadius, percent, index } = props;
    const entry = data[index]; 

    const angleInRad = -RADIAN * midAngle;
    const cos = Math.cos(angleInRad);
    const sin = Math.sin(angleInRad);

    const sx = cx + (outerRadius + outerRadialOffset) * cos;
    const sy = cy + (outerRadius + outerRadialOffset) * sin;

    const elbowX = cx + (outerRadius + outerRadialOffset + lineSegmentLength) * cos;
    const elbowY = cy + (outerRadius + outerRadialOffset + lineSegmentLength) * sin;

    let ex: number; 
    let textAnchor: 'start' | 'end';

    const isRightSide = cos >= 0;
    if (isRightSide) {
      ex = elbowX + horizontalLineExtension;
      textAnchor = 'start';
    } else {
      ex = elbowX - horizontalLineExtension;
      textAnchor = 'end';
    }

    const stackedYOffset = getVerticalStackOffset(index, data.length);
    const finalEy = elbowY + stackedYOffset;

    let labelX: number;
    if (textAnchor === 'start') {
      labelX = ex + labelBoxMargin;
    } else {
      labelX = ex - labelRectWidth - labelBoxMargin;
    }
    const labelY = finalEy - (labelRectHeight / 2);

    const percentValue = (percent * 100).toFixed(0);

    return (
      <g>
        <path d={`M${sx},${sy}L${elbowX},${elbowY}L${ex},${finalEy}`} stroke="#a1a1aa" fill="none" strokeWidth={1} />
        <foreignObject x={labelX} y={labelY} width={labelRectWidth} height={labelRectHeight} style={{ overflow: 'visible' }}>
          <div style={{
            background: 'transparent',
            border: 'none',
            color: '#d4d4d8', 
            fontSize: isModal ? '14px' : '12px', 
            lineHeight: '1.3',
            textAlign: textAnchor === 'start' ? 'left' : 'right',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }}>
            <div style={{ color: entry.color, fontWeight: 600 }}>{entry.name}</div>
            <div style={{ color: theme.text === 'text-zinc-900' ? '#52525b' : '#d4d4d8' }}>Count: {entry.value}</div>
            <div style={{ color: theme.text === 'text-zinc-900' ? '#52525b' : '#d4d4d8' }}>{percentValue}%</div>
          </div>
        </foreignObject>
      </g>
    );
  }, [data, theme, outerRadialOffset, lineSegmentLength, horizontalLineExtension, labelBoxMargin, labelRectWidth, labelRectHeight, getVerticalStackOffset, isModal]);


  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data as Array<Record<string, any>>}
          cx="50%"
          cy="50%"
          innerRadius={pieInnerRadius}
          outerRadius={pieOuterRadius}
          fill="#8884d8"
          dataKey="value"
          isAnimationActive={true}
          label={renderCustomizedLabel}
          labelLine={false}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        {isModal && <Tooltip />}
      </PieChart>
    </ResponsiveContainer>
  );
};


// components/Sidebar.tsx
interface SidebarProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
  theme: Theme;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, theme }) => {
  return (
    <nav className={`w-20 flex flex-col items-center py-6 space-y-8 border-r shadow-lg z-20 ${theme.sidebar} ${theme.sidebarBorder}`}>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${theme.sidebarActive.replace(' text-white', '')}`}>
        <Icon name="Blocks" className="w-6 h-6 text-white" />
      </div>
      <div className="flex flex-col space-y-6">
        {NAV_ITEMS.map(item => (
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
        <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl shadow-lg border-2 ${theme.sidebar}`}>
          AV
        </div>
      </div>
    </nav>
  );
};

// components/Topbar.tsx
interface TopbarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  cycleTheme: () => void;
  theme: Theme;
}

const Topbar: React.FC<TopbarProps> = ({ searchTerm, setSearchTerm, cycleTheme, theme }) => {
  return (
    <header className={`h-20 flex items-center justify-between px-8 border-b backdrop-blur-sm z-10 ${theme.topbar} ${theme.topbarBorder}`}>
      <div className="flex items-center space-x-6">
        <h1 className={`text-2xl font-bold ${theme.title}`}>Dashboard</h1>
        <div className="relative">
          <Icon name="Search" className="w-5 h-5 text-zinc-400 absolute top-1/2 left-3 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search datasets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`pl-10 pr-4 py-2 w-72 rounded-lg border focus:outline-none focus:ring-2 focus:border-transparent transition-all ${theme.searchBg} ${theme.searchBorder} focus:ring-blue-500`}
          />
        </div>
      </div>
      <div className="flex items-center space-x-5">
        <button onClick={cycleTheme} className="p-2 rounded-full text-zinc-400 hover:bg-zinc-800">
          <Icon name="Palette" className="w-6 h-6" />
        </button>
        <button className="p-2 rounded-full text-zinc-400 hover:bg-zinc-800 relative">
          <Icon name="Bell" className="w-6 h-6" />
          <span className={`absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 ${theme.sidebarBorder}`}></span>
        </button>
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-offset-2 ring-purple-500 ${theme.sidebar}`}>
            AV
          </div>
          <div className="text-left hidden sm:block">
            <div className={`text-sm font-semibold ${theme.title}`}>Alex Moran</div>
            <div className="text-xs text-zinc-400">alex.moran@example.com</div>
          </div>
        </div>
      </div>
    </header>
  );
};

// components/MiniDatasetTable.tsx
interface MiniDatasetTableProps {
  data: Dataset[];
  theme: Theme;
  title?: string;
  setActivePage: (page: Page) => void;
}

const MiniDatasetTable: React.FC<MiniDatasetTableProps> = ({
  data,
  theme,
  title = "New Datasets", 
  setActivePage,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sort, setSort] = useState<SortState>({ key: 'lastUpdate', asc: false });
  const itemsPerPage = 5;

  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);

  const processedData = useMemo(() => {
    const filtered = data.filter(item => {
      const term = searchTerm.toLowerCase();
      return (
        item.name.toLowerCase().includes(term) ||
        item.type.toLowerCase().includes(term)
      );
    });

    const sorted = [...filtered].sort((a, b) => {
      let valA: any = a[sort.key as keyof Dataset];
      let valB: any = b[sort.key as keyof Dataset];

      if (sort.key === 'lastUpdate' || sort.key === 'created') {
        if (valA === 'Live') return sort.asc ? 1 : -1;
        if (valB === 'Live') return sort.asc ? -1 : 1;
        if (!valA) return sort.asc ? 1 : -1;
        if (!valB) return sort.asc ? -1 : 1;
        valA = new Date(valA); valB = new Date(valB);
      } else if (sort.key === 'size' || sort.key === 'records') {
        valA = parseMetric(valA); valB = parseMetric(valB);
      } else if (typeof valA === 'string' && typeof valB === 'string') {
        valA = valA.toLowerCase(); valB = valB.toLowerCase();
      } else if (valA == null || valA === 'N/A') return 1;
      else if (valB == null || valB === 'N/A') return -1;

      if (valA < valB) return sort.asc ? -1 : 1;
      if (valA > valB) return sort.asc ? 1 : -1;
      return 0;
    });

    return sorted.slice(0, itemsPerPage);
  }, [data, searchTerm, sort]);

  const handleSort = useCallback((key: keyof Dataset) => {
    setSort(prevSort => ({
      key,
      asc: prevSort.key === key ? !prevSort.asc : false,
    }));
  }, []);

  const getSortLabel = useCallback((key: keyof Dataset) => {
    switch (key) {
      case 'id': return 'ID';
      case 'name': return 'Name';
      case 'type': return 'Type';
      case 'status': return 'Status';
      case 'records': return 'Records';
      case 'size': return 'Size';
      case 'lastUpdate': return 'Last Updated';
      default: return String(key);
    }
  }, []);

  const sortOptions: { key: keyof Dataset; label: string }[] = [
    { key: 'name', label: 'Name' },
    { key: 'type', label: 'Type' },
    { key: 'status', label: 'Status' },
    { key: 'records', label: 'Records' },
    { key: 'size', label: 'Size' },
    { key: 'lastUpdate', label: 'Last Updated' },
  ];

  return (
    <div className={`rounded-2xl p-6 shadow-sm border h-full ${theme.table} ${theme.sidebarBorder}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-xl font-bold ${theme.title}`}>{title}</h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Icon name="Search" className="w-4 h-4 text-zinc-400 absolute top-1/2 left-3 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Here"
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-8 pr-4 py-2 w-48 rounded-lg border focus:outline-none focus:ring-1 focus:border-blue-500 ${theme.searchBg} ${theme.searchBorder} ${theme.tableCell}`}
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
              className="flex items-center space-x-2 text-sm font-medium rounded-lg px-4 py-2 transition-colors bg-blue-600 text-white hover:bg-blue-700"
            >
              <span>Sort By{sort.key ? `: ${getSortLabel(sort.key)}${sort.asc ? ' ↑' : ' ↓'}` : ''}</span>
              <Icon name="ChevronDown" className="w-4 h-4" />
            </button>
            {isSortMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-lg shadow-lg bg-zinc-900 divide-y divide-zinc-800 z-10">
                {sortOptions.map(option => (
                  <button
                    key={option.key as string}
                    onClick={() => {
                      handleSort(option.key);
                      setIsSortMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
                  >
                    {option.label}
                    {sort.key === option.key && (sort.asc ? ' ↑' : ' ↓')}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className={`min-w-full divide-y ${theme.sidebarBorder}`}>
          <thead className={`${theme.chartBg.replace('/90', '/50')}`}>
            <tr>
              <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${theme.tableCellSubtle}`}>Name</th>
              <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${theme.tableCellSubtle}`}>Type</th>
              <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${theme.tableCellSubtle}`}>Status</th>
              <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${theme.tableCellSubtle}`}>Records</th>
              <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${theme.tableCellSubtle}`}>Size</th>
              <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${theme.tableCellSubtle}`}>Last Updated</th>
            </tr>
          </thead>
          <tbody className={`${theme.chartBg.replace('/90', '')} divide-y ${theme.sidebarBorder}`}>
            {processedData.map((item) => (
              <tr key={item.id} className="hover:bg-zinc-800/20 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <Icon name={getIcon(item.type)} className="w-4 h-4 text-blue-400" />
                    <div>
                      <div className={`text-sm font-medium ${theme.tableCell}`}>{item.name}</div>
                      <div className={`text-xs ${theme.tableCellSubtle}`}>{item.id}</div>
                    </div>
                  </div>
                </td>
                <td className={`px-4 py-3 whitespace-nowrap text-sm ${theme.tableCellSubtle}`}>{item.type}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`px-3 py-1 text-xs font-medium text-white rounded-full ${getStatusClass(item.status)}`}>{item.status}</span>
                </td>
                <td className={`px-4 py-3 whitespace-nowrap text-sm ${theme.tableCellSubtle}`}>{item.records}</td>
                <td className={`px-4 py-3 whitespace-nowrap text-sm ${theme.tableCellSubtle}`}>{item.size}</td>
                <td className={`px-4 py-3 whitespace-nowrap text-sm ${theme.tableCellSubtle}`}>{formatDate(item.lastUpdate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-start items-center mt-4">
        <button
          onClick={() => setActivePage(Page.DATASETS)}
          className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg px-4 py-2 transition-colors shadow-sm"
        >
          View Full Datasets
        </button>
      </div>
    </div>
  );
};


// components/DashboardPage.tsx
interface DashboardPageProps {
  datasets: Dataset[];
  activeKpi: KpiKey;
  setActiveKpi: (kpi: KpiKey) => void;
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
  theme: Theme;
  openChartModal: (chartType: 'line' | 'pie', title: string, kpi?: KpiKey) => void;
  setActivePage: (page: Page) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({
  datasets,
  activeKpi,
  setActiveKpi,
  timeRange,
  setTimeRange,
  theme,
  openChartModal,
  setActivePage,
}) => {

  const kpiData: Record<KpiKey, KpiDataItem> = {
    [KpiKey.REQUESTS]: { title: "Total Requests", value: "2.5M", change: "+12.5%", changeType: "positive", icon: "Zap", color: "#818cf8", gradient: "bg-gradient-to-r from-indigo-400 to-indigo-500" },
    [KpiKey.TRENDING]: { title: "Trending Datasets", value: "Explore", change: "+3 New", changeType: "positive", icon: "TrendingUp", color: "#fb923c", gradient: "bg-gradient-to-r from-orange-400 to-orange-500" },
    [KpiKey.LATENCY]: { title: "Avg. Response", value: "24ms", change: "-2.4%", changeType: "negative", icon: "Activity", color: "#f472b6", gradient: "bg-gradient-to-r from-pink-400 to-pink-500" },
    [KpiKey.USERS]: { title: "Concurrent Users", value: "842", change: "+4.3%", changeType: "positive", icon: "Users", color: "#60a5fa", gradient: "bg-gradient-to-r from-blue-400 to-blue-500" }
  };
  
  const kpiTitle: Record<KpiKey, string> = {
    [KpiKey.REQUESTS]: 'Total Requests',
    [KpiKey.TRENDING]: 'Top Dataset Trends',
    [KpiKey.LATENCY]: 'Average Response',
    [KpiKey.USERS]: 'Concurrent Users',
  };

  const kpiDescription: Record<KpiKey, string> = {
    [KpiKey.REQUESTS]: 'Total API requests over time.',
    [KpiKey.TRENDING]: 'Performance of top 3 trending datasets.',
    [KpiKey.LATENCY]: 'Average API response latency over time.',
    [KpiKey.USERS]: 'Number of concurrent users on the platform.',
  };


  const getLabels = useCallback((range: TimeRange): string[] => {
    switch (range) {
      case TimeRange.MONTH: return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      case TimeRange.WEEK: return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      case TimeRange.DAY: return ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];
    }
  }, []);

  const mainChartDataAndOptions = useMemo(() => {
    let mainChartDatasets: ChartData<'line'>['datasets'] = [];
    let mainChartOptions: ChartOptions<'line'> = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { color: theme.text === 'text-zinc-900' ? '#52525b' : '#a1a1aa' } },
        y: { grid: { display: false }, ticks: { color: theme.text === 'text-zinc-900' ? '#52525b' : '#a1a1aa', callback: (v) => (v as number).toLocaleString() } }
      }
    };

    if (activeKpi === KpiKey.TRENDING) {
      const trendingData = (CHART_DATA[KpiKey.TRENDING] as TrendingChartSeries | undefined)?.[timeRange];
      if (trendingData) {
        mainChartDatasets = trendingData.map(series => ({
          label: series.label,
          data: series.data,
          borderColor: series.color,
          backgroundColor: 'transparent',
          borderWidth: 2.5,
          pointRadius: 0,
          pointHoverRadius: 6,
          fill: false,
          tension: 0.2
        }));
      }
      mainChartOptions = {
        ...mainChartOptions,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: { color: theme.text === 'text-zinc-900' ? '#52525b' : '#a1a1aa' }
          }
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: theme.text === 'text-zinc-900' ? '#52525b' : '#a1a1aa' } },
          y: {
            grid: { display: false },
            ticks: { color: theme.text === 'text-zinc-900' ? '#52525b' : '#a1a1aa', stepSize: 0.1 },
            beginAtZero: true,
            min: 0,
            max: 1,
          }
        }
      };
    } else {
      const currentChartData = CHART_DATA[activeKpi] as BaseChartSeries | undefined;
      const dataForChart = currentChartData ? currentChartData[timeRange] : [];
      mainChartDatasets = [{
        label: kpiTitle[activeKpi],
        data: dataForChart,
        borderColor: kpiData[activeKpi].color,
        backgroundColor: 'transparent',
        borderWidth: 2.5,
        pointRadius: 0,
        pointHoverRadius: 6,
        fill: false,
        tension: 0.2
      }];
    }

    const labels = getLabels(timeRange).slice(0, (mainChartDatasets[0]?.data.length || 0));

    return {
      data: {
        labels: labels,
        datasets: mainChartDatasets
      },
      options: mainChartOptions
    };
  }, [activeKpi, timeRange, theme, getLabels, kpiData]);

  const trendingDatasets = useMemo(() => {
    return datasets
      .filter(ds => ds.status === DatasetStatus.ACTIVE && ds.trend.startsWith('+'))
      .slice(0, 7); 
  }, [datasets]);

  return (
    <div className={`flex-1 overflow-y-auto p-8 ${theme.app} ${theme.text}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Object.entries(kpiData).map(([key, d]) => (
          <KpiCard
            key={key}
            data={d}
            isActive={activeKpi === key as KpiKey}
            onClick={() => setActiveKpi(key as KpiKey)}
            theme={theme}
            isTrendingCard={key === KpiKey.TRENDING}
          />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <div className={`rounded-2xl p-6 shadow-sm ${theme.chartBg} h-[350px]`}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className={`text-xl font-bold ${theme.chartTitle}`}>{kpiTitle[activeKpi]}</h3>
                <p className="text-sm text-zinc-400">{kpiDescription[activeKpi]}</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center p-1 rounded-lg bg-zinc-800">
                  {Object.values(TimeRange).map(range => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={`py-1 px-3 rounded-md text-xs font-semibold transition-all ${
                        timeRange === range ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:bg-zinc-700/50'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
                <button onClick={() => openChartModal('line', kpiTitle[activeKpi], activeKpi)} className="p-2 rounded-lg text-zinc-400 hover:bg-zinc-800">
                  <Icon name="Maximize2" className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="h-[250px]">
              <ChartRenderer id="mainChart" chartType="line" data={mainChartDataAndOptions.data} options={mainChartDataAndOptions.options} />
            </div>
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className={`rounded-2xl p-6 shadow-sm ${theme.chartBg} h-[350px]`}>
            <div className="flex justify-between items-start mb-6">
              <h3 className={`text-xl font-bold ${theme.chartTitle}`}>Datasets by Category</h3>
              <button onClick={() => openChartModal('pie', 'Datasets by Category')} className="p-2 rounded-lg text-zinc-400 hover:bg-zinc-800">
                <Icon name="Maximize2" className="w-5 h-5" />
              </button>
            </div>
            <div className="h-[250px]">
              <DonutChartRecharts data={DONUT_DATA} theme={theme} />
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 h-full">
          <MiniDatasetTable
            data={datasets}
            theme={theme}
            setActivePage={setActivePage}
          />
        </div>
        <div className="lg:col-span-1 h-full">
          <div className={`rounded-2xl p-6 shadow-sm border h-full ${theme.kpiCard}`}>
            <h3 className={`text-xl font-bold mb-6 ${theme.title}`}>Trending Datasets</h3>
            <div className="space-y-4">
              {trendingDatasets.length > 0 ? (
                trendingDatasets.map(ds => (
                  <div key={ds.id} className="flex items-center space-x-4">
                    <div className="p-2 rounded-full bg-blue-50 text-blue-600">
                      <Icon name={getIcon(ds.type)} className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className={`text-sm font-semibold ${theme.tableCell}`}>{ds.name}</div>
                      <div className={`text-xs ${theme.tableCellSubtle}`}>{ds.type}</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium text-green-600`}>{ds.trend}</div>
                      <div className={`text-xs ${theme.tableCellSubtle}`}>{ds.status}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className={`text-sm ${theme.tableCellSubtle} text-center py-4`}>No trending datasets found.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// components/DatasetsPage.tsx
const DatasetsPage: React.FC = () => {
  const features = [
    {
      icon: (
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="18" y="26" width="4" height="8" fill="#FDBA74"/>
          <rect x="26" y="22" width="4" height="12" fill="#FDBA74"/>
          <rect x="34" y="18" width="4" height="16" fill="#FDBA74"/>
          <path d="M47 38L42 34L47 30" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M51 42L56 38L51 34" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M49 46L53 42" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M40.24,54.79l-4.41-4.41c-1.15-1.15-1.77-2.6-1.77-4.11V44.5c0-3.27,2.65-5.91,5.91-5.91h0c3.27,0,5.91,2.65,5.91,5.91v1.77c0,1.51-0.62,2.96-1.77,4.11l-4.41,4.41C40.42,54.97,40.33,54.88,40.24,54.79z" fill="#34D399"/>
          <path d="M12,52.09c0-2.91,2.36-5.27,5.27-5.27h7.47c2.91,0,5.27,2.36,5.27,5.27v0c0,2.91-2.36,5.27-5.27,5.27h-7.47C14.36,57.35,12,55,12,52.09z" fill="#3B82F6"/>
          <path d="M8,42.24c0-2.31,1.87-4.18,4.18-4.18h13.64c2.31,0,4.18,1.87,4.18,4.18v0c0,2.31-1.87,4.18-4.18,4.18H12.18C9.87,46.42,8,44.55,8,42.24z" fill="#60A5FA"/>
        </svg>
      ),
      title: 'Departments',
      description: 'Lorem ipsum dolor sit am adipisc elit, sed do eiusmod. Lorem ipsum dolor sit adipiscing elit.',
    },
    {
      icon: (
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18.5,54.09h27c1.65,0,3-1.35,3-3v-1.18c0-1.65-1.35-3-3-3h-27c-1.65,0-3,1.35-3,3v1.18C15.5,52.75,16.85,54.09,18.5,54.09z" fill="#FBBF24"/>
          <path d="M37.7,46.91l-14.86,0L20.4,26.5l4.87-14.86,14.86,0,2.44,14.86L37.7,46.91z" fill="#10B981"/>
          <path d="M29.5,41.91h-7l-1-6h9Z" fill="#34D399"/>
          <path d="M25.33,14.09l4.5,2.5,4.5-2.5-2-4.5h-5Z" fill="#10B981"/>
          <path d="M43,26.5l-3,9.5h-5.5l2-9.5,2-2.5Z" fill="#34D399"/>
        </svg>
      ),
      title: 'Industries',
      description: 'Lorem ipsum dolor sit am adipisc elit, sed do eiusmod. Lorem ipsum dolor sit adipiscing elit.',
    },
    {
      icon: (
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="14" y="14" width="16" height="16" rx="3" fill="#2DD4BF"/>
          <rect x="34" y="14" width="16" height="16" rx="3" fill="#2DD4BF"/>
          <rect x="14" y="34" width="16" height="16" rx="3" fill="#2DD4BF"/>
          <rect x="34" y="34" width="16" height="16" rx="3" fill="#2DD4BF"/>
          <circle cx="22" cy="22" r="4" fill="#3B82F6"/>
          <circle cx="42" cy="22" r="4" fill="#3B82F6"/>
          <circle cx="22" cy="42" r="4" fill="#3B82F6"/>
          <circle cx="42" cy="42" r="4" fill="#3B82F6"/>
          <path d="M26 22h12M26 42h12M22 26v12M42 26v12" stroke="#A7F3D0" strokeWidth="2"/>
        </svg>
      ),
      title: 'Technology',
      description: 'Lorem ipsum dolor sit am adipisc elit, sed do eiusmod. Lorem ipsum dolor sit adipiscing elit.',
    },
    {
      icon: (
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22,54h20v-4H22V54z M26,22h-4v-4c0-2.21,1.79-4,4-4h8c2.21,0,4,1.79,4,4v4h-4v-4h-8V22z" fill="#FBBF24"/>
          <path d="M40.5,50H23.5c-1.93,0-3.5-1.57-3.5-3.5V30h24v16.5C44,48.43,42.43,50,40.5,50z" fill="#A78BFA"/>
          <path d="M20,34h24v-4H20V34z" fill="#C4B5FD"/>
          <path d="M28,42H24c-1.1,0-2-0.9-2-2v-4h8v4C30,41.1,29.1,42,28,42z" fill="#818CF8"/>
          <path d="M40,42h-4c-1.1,0-2-0.9-2-2v-4h8v4C42,41.1,41.1,42,40,42z" fill="#818CF8"/>
        </svg>
      ),
      title: 'Business',
      description: 'Lorem ipsum dolor sit am adipisc elit, sed do eiusmod. Lorem ipsum dolor sit adipiscing elit.',
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Endless Possibilities With <span className="text-teal-500">AI & Big Data</span>
          <br />
          Computer Vision
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-12">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit dolore magna aliqua
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white dark:bg-gray-800/50 p-8 rounded-lg shadow-sm hover:shadow-lg transition-shadow">
              <div className="flex justify-center items-center mb-6 h-16">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


// components/Modal.tsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  chartType: ChartType;
  chartData: ChartData | DonutDataItem[]; // Allow for DonutDataItem[]
  chartOptions: ChartOptions;
  theme: Theme;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, chartType, chartData, chartOptions, theme }) => {
  if (!isOpen) return null;

  const modalChartOptions: ChartOptions = {
    ...chartOptions, // Start with existing options
    plugins: {
      ...(chartOptions.plugins || {}), // Ensure plugins is an object to spread into, in case it's undefined
      legend: { display: true, labels: { color: theme.text === 'text-zinc-900' ? '#52525b' : '#a1a1aa' } }, // Always show legend in modal for clarity
    },
    // Conditionally add the cutout property only if chartType is 'pie'
    ...(chartType === 'pie' && { cutout: '50%' }),
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className={`w-full max-w-6xl h-[80vh] rounded-2xl p-6 shadow-xl ${theme.modal}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={`text-xl font-bold ${theme.title}`}>{title}</h3>
          <button onClick={onClose} className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-100">
            <Icon name="Minimize2" className="w-5 h-5" />
          </button>
        </div>
        <div className="h-[90%]">
          {chartType === 'pie' ? (
            <DonutChartRecharts data={chartData as DonutDataItem[]} theme={theme} isModal={true} />
          ) : (
            <ChartRenderer id="modalChart" chartType={chartType} data={chartData as ChartData} options={modalChartOptions} />
          )}
        </div>
      </div>
    </div>
  );
};


// App.tsx
export default function App() {
  const [activePage, setActivePage] = useState<Page>(Page.DASHBOARD);
  const [datasets, setDatasets] = useState<Dataset[]>(MOCK_DATASETS);
  const [searchTerm, setSearchTerm] = useState<string>(''); 
  const [timeRange, setTimeRange] = useState<TimeRange>(TimeRange.MONTH);
  const [activeKpi, setActiveKpi] = useState<KpiKey>(KpiKey.REQUESTS);
  const [activeThemeKey, setActiveThemeKey] = useState<ThemeKey>(ThemeKey.OCEAN);
  const [filter, setFilter] = useState<Dataset['status'] | 'All'>('All');
  const [sort, setSort] = useState<SortState>({ key: 'lastUpdate', asc: false }); 

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>('');
  const [modalChartType, setModalChartType] = useState<ChartType>('line');
  const [modalChartData, setModalChartData] = useState<ChartData | DonutDataItem[] | {}>({}); 
  const [modalChartOptions, setModalChartOptions] = useState<ChartOptions | {}>({});

  const kpiData: Record<KpiKey, KpiDataItem> = {
    [KpiKey.REQUESTS]: { title: "Total Requests", value: "2.5M", change: "+12.5%", changeType: "positive", icon: "Zap", color: "#818cf8", gradient: "bg-gradient-to-r from-indigo-400 to-indigo-500" },
    [KpiKey.TRENDING]: { title: "Trending Datasets", value: "Explore", change: "+3 New", changeType: "positive", icon: "TrendingUp", color: "#fb923c", gradient: "bg-gradient-to-r from-orange-400 to-orange-500" },
    [KpiKey.LATENCY]: { title: "Avg. Response", value: "24ms", change: "-2.4%", changeType: "negative", icon: "Activity", color: "#f472b6", gradient: "bg-gradient-to-r from-pink-400 to-pink-500" },
    [KpiKey.USERS]: { title: "Concurrent Users", value: "842", change: "+4.3%", changeType: "positive", icon: "Users", color: "#60a5fa", gradient: "bg-gradient-to-r from-blue-400 to-blue-500" }
  };

  const currentTheme = THEMES[activeThemeKey];

  const cycleTheme = useCallback(() => {
    const keys = Object.values(ThemeKey);
    const idx = keys.indexOf(activeThemeKey);
    setActiveThemeKey(keys[(idx + 1) % keys.length]);
  }, [activeThemeKey]);

  const handleDatasetSort = useCallback((key: keyof Dataset) => {
    setSort(prevSort => ({
      key,
      asc: prevSort.key === key ? !prevSort.asc : false,
    }));
  }, []);

  const getLabels = useCallback((range: TimeRange): string[] => {
    switch (range) {
      case TimeRange.MONTH: return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      case TimeRange.WEEK: return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      case TimeRange.DAY: return ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];
    }
  }, []);

  const openChartModal = useCallback((chartType: ChartType, title: string, kpi?: KpiKey) => {
    setModalTitle(title);
    setModalChartType(chartType);

    if (chartType === 'line' && kpi) {
      let modalDatasets: ChartData<'line'>['datasets'] = [];
      let modalOptions: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { color: currentTheme.text === 'text-zinc-900' ? '#52525b' : '#a1a1aa' } },
          y: { grid: { display: false }, ticks: { color: currentTheme.text === 'text-zinc-900' ? '#52525b' : '#a1a1aa', callback: (v: any) => v.toLocaleString() } }
        }
      };

      if (kpi === KpiKey.TRENDING) {
        const trendingData = (CHART_DATA[KpiKey.TRENDING] as TrendingChartSeries | undefined)?.[timeRange];
        if (trendingData) {
          modalDatasets = trendingData.map(series => ({
            label: series.label,
            data: series.data,
            borderColor: series.color,
            backgroundColor: 'transparent',
            borderWidth: 2.5,
            pointRadius: 3, 
            pointHoverRadius: 6,
            fill: false,
            tension: 0.2
          }));
        }
        modalOptions = {
          ...modalOptions,
          plugins: {
            legend: {
              display: true,
              position: 'bottom', 
              labels: { color: currentTheme.text === 'text-zinc-900' ? '#52525b' : '#a1a1aa' }
            }
          },
          scales: {
            x: { grid: { display: false }, ticks: { color: currentTheme.text === 'text-zinc-900' ? '#52525b' : '#a1a1aa' } },
            y: {
              grid: { display: false },
              ticks: { color: currentTheme.text === 'text-zinc-900' ? '#52525b' : '#a1a1aa', stepSize: 0.1 },
              beginAtZero: true,
              min: 0,
              max: 1,
            }
          }
        };
      } else {
        const dataForChart = (CHART_DATA[kpi] as BaseChartSeries | undefined)?.[timeRange];
        modalDatasets = [{
          label: kpi === KpiKey.REQUESTS ? 'Requests' : kpi === KpiKey.LATENCY ? 'Latency (ms)' : 'Users',
          data: dataForChart || [],
          borderColor: kpiData[kpi].color,
          backgroundColor: 'transparent',
          borderWidth: 2.5,
          pointRadius: 3, 
            pointHoverRadius: 6,
          fill: false,
          tension: 0.2
        }];
      }

      setModalChartData({
        labels: getLabels(timeRange).slice(0, (modalDatasets[0]?.data.length || 0)),
        datasets: modalDatasets
      });
      setModalChartOptions(modalOptions);

    } else if (chartType === 'pie') {
      setModalChartData(DONUT_DATA); 
      setModalChartOptions({}); 
    }
    setIsModalOpen(true);
  }, [timeRange, getLabels, currentTheme, kpiData]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setModalChartData({});
    setModalChartOptions({});
  }, []);

  const renderMainContent = useMemo(() => {
    switch (activePage) {
      case Page.DASHBOARD:
        return (
          <DashboardPage
            datasets={datasets}
            activeKpi={activeKpi}
            setActiveKpi={setActiveKpi}
            timeRange={timeRange}
            setTimeRange={setTimeRange}
            theme={currentTheme}
            openChartModal={openChartModal}
            setActivePage={setActivePage}
          />
        );
      case Page.DATASETS:
        return (
          <DatasetsPage />
        );
      case Page.ANALYTICS:
      case Page.SETTINGS:
        return (
          <div className={`flex-1 overflow-y-auto p-8 ${currentTheme.app} ${currentTheme.text}`}>
            <div className="flex items-center justify-center h-full">
              <h2 className={`text-3xl font-bold ${currentTheme.title}`}>{activePage.charAt(0).toUpperCase() + activePage.slice(1)} Page (Coming Soon)</h2>
            </div>
          </div>
        );
      default:
        return null;
    }
  }, [activePage, datasets, activeKpi, timeRange, currentTheme, openChartModal, searchTerm, filter, sort, handleDatasetSort]);

  return (
    <div className={`flex flex-1 h-screen ${currentTheme.app} ${currentTheme.text}`}>
      <Sidebar activePage={activePage} setActivePage={setActivePage} theme={currentTheme} />
      <div className="flex-1 flex flex-col">
        <Topbar
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          cycleTheme={cycleTheme}
          theme={currentTheme}
        />
        {renderMainContent}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalTitle}
        chartType={modalChartType}
        chartData={modalChartData as ChartData | DonutDataItem[]}
        chartOptions={modalChartOptions as ChartOptions}
        theme={currentTheme}
      />
    </div>
  );
};
