'use client';
import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import Chart, { ChartConfiguration, ChartType, ChartData, ChartOptions } from 'chart.js/auto';
import { CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend } from 'chart.js';
import * as LucideIcons from 'lucide-react';
// Re-import Tooltip from recharts with an alias for use in recharts components
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip } from 'recharts';

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
  GRADIENT_DARK = 'gradient_dark',
  FULL_DARK = 'full_dark',
}

export interface Dataset {
  id: string;
  name: string;
  type: DatasetType;
  status: DatasetStatus;
  trend: string;
  records: string; // Used for views count now
  size: string;
  created: string;
  lastUpdate: string;
  owner: string;
  sensitivity: string;
  description: string; // New field for card description
  downloads: string; // New field for card downloads
}

export interface KpiDataItem {
  title: string;
  value: string | number;
  change: string;
  changeType: 'positive' | 'negative';
  icon: string;
  color: string;
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
  // New theme properties for the dataset page layout
  heroBg?: string;
  cardBg?: string;
  cardBorder?: string;
  sectionBg?: string;
  highlightText?: string;
  neutralBg?: string; // For sections that need a subtle background
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
  { id: 'ds_002', name: 'Product Catalog (Staging)', type: DatasetType.DATABASE, status: DatasetStatus.ACTIVE, trend: '+5.2%', records: '1.2K', size: '150MB', created: '2023-02-01', lastUpdate: '2023-11-10', owner: 'Data Ops', sensitivity: 'Medium', description: 'Product IDs, SKUs, pricing, images, and inventory data.', downloads: '120+' },
  { id: 'ds_003', name: 'Quarterly Sales Projections', type: DatasetType.FILE, status: DatasetStatus.ACTIVE, trend: '-2.4%', records: '850', size: '25MB', created: '2023-03-20', lastUpdate: '2023-11-01', owner: 'Finance Team', sensitivity: 'High', description: 'Revenue forecasts, regional sales targets, and market analysis.', downloads: '85+' },
  { id: 'ds_004', name: 'API Gateway Logs (Jan)', type: DatasetType.LOG, status: DatasetStatus.ARCHIVED, trend: '0.0%', records: '150M', size: '25.6TB', created: '2023-01-31', lastUpdate: '2023-02-01', owner: 'DevOps', sensitivity: 'Medium', description: 'API call details, response times, error rates, and user agents.', downloads: '15M+' },
  { id: 'ds_005', name: 'Customer Support Tickets', type: DatasetType.DATABASE, status: DatasetStatus.ACTIVE, trend: '+18.3%', records: '45.2K', size: '2.2GB', created: '2022-11-10', lastUpdate: '2023-11-11', owner: 'Support Team', sensitivity: 'High', description: 'Ticket ID, customer name, issue description, status, and resolution.', downloads: '4.5K+' },
  { id: 'ds_006', name: 'Marketing Campaign ROI', type: DatasetType.STATIC, status: DatasetStatus.ACTIVE, trend: '+8.1%', records: '5.6K', size: '110MB', created: '2023-04-05', lastUpdate: '2023-10-28', owner: 'Marketing', sensitivity: 'Medium', description: 'Campaign ID, spend, impressions, clicks, conversions, and revenue.', downloads: '560+' },
  { id: 'ds_007', name: 'IoT Sensor Data (Factory A)', type: DatasetType.STREAM, status: DatasetStatus.PAUSED, trend: 'N/A', records: 'N/A', size: 'N/A', created: '2023-05-15', lastUpdate: '2023-11-05', owner: 'Ops', sensitivity: 'Low', description: 'Temperature, pressure, humidity readings from factory sensors.', downloads: 'N/A' },
  { id: 'ds_008', name: 'Employee Directory', type: DatasetType.DATABASE, status: DatasetStatus.ACTIVE, trend: '+1.0%', records: '1.8K', size: '90MB', created: '2022-01-01', lastUpdate: '2023-11-11', owner: 'HR', sensitivity: 'High', description: 'Employee ID, name, department, title, contact information, and start date.', downloads: '180+' },
  { id: 'ds_009', name: 'Web Analytics (Main Site)', type: DatasetType.STREAM, status: DatasetStatus.ERROR, trend: '-5.5%', records: '800K', size: '500GB', created: '2023-06-01', lastUpdate: '2023-11-12', owner: 'Marketing', sensitivity: 'Medium', description: 'Page views, unique visitors, bounce rate, session duration, and referral sources.', downloads: '80K+' },
  { id: 'ds_010', name: 'Financial Transactions Q3', type: DatasetType.STATIC, status: DatasetStatus.ACTIVE, trend: '+3.2%', records: '1.1M', size: '1.5GB', created: '2023-10-01', lastUpdate: '2023-11-01', owner: 'Finance Team', sensitivity: 'Confidential', description: 'Transaction ID, amount, date, payment method, and product details.', downloads: '110K+' },
  { id: 'ds_012', name: 'Internal Audit Logs (Q1)', type: DatasetType.LOG, status: DatasetStatus.ACTIVE, trend: '+0.5%', records: '200M', size: '30.0TB', created: '2023-01-01', lastUpdate: '2023-03-31', owner: 'Security', sensitivity: 'High', description: 'User actions, system events, access attempts, and security incidents.', downloads: '20M+' },
  { id: 'ds_013', name: 'Customer Feedback Survey', type: DatasetType.FILE, status: DatasetStatus.ACTIVE, trend: '+7.8%', records: '1.5K', size: '35MB', created: '2023-09-01', lastUpdate: '2023-11-10', owner: 'Customer Success', sensitivity: 'Medium', description: 'Survey responses, customer sentiment, product suggestions, and satisfaction scores.', downloads: '150+' },
  { id: 'ds_014', name: 'Supply Chain Data', type: DatasetType.DATABASE, status: DatasetStatus.ACTIVE, trend: '+4.1%', records: '50K', size: '3.5GB', created: '2023-08-10', lastUpdate: '2023-11-09', owner: 'Operations', sensitivity: 'High', description: 'Supplier information, inventory levels, shipment tracking, and logistics data.', downloads: '5K+' },
  { id: 'ds_015', name: 'Website Performance Logs', type: DatasetType.LOG, status: DatasetStatus.ACTIVE, trend: '+9.2%', records: '10M', size: '700GB', created: '2023-04-15', lastUpdate: 'Live', owner: 'DevOps', sensitivity: 'Low', description: 'Page load times, server response, network requests, and error logs.', downloads: '1M+' },
  { id: 'ds_011', name: 'User Engagement Metrics', type: DatasetType.STREAM, status: DatasetStatus.ACTIVE, trend: '+15.0%', records: '3.1M', size: '1.8TB', created: '2023-07-20', lastUpdate: 'Live', owner: 'Product Team', sensitivity: 'Medium', description: 'User sessions, clicks, page views, conversion funnels, and feature usage.', downloads: '310K+' },
  { id: 'ds_001', name: 'Real-time User Activity', type: DatasetType.STREAM, status: DatasetStatus.ACTIVE, trend: '+12.5%', records: '2.5M', size: '1.2TB', created: '2023-01-15', lastUpdate: 'Live', owner: 'Alex Moran', sensitivity: 'High', description: 'Live user actions, navigation paths, and interactive events.', downloads: '250K+' },
  // Added more specific dataset examples to match screenshot content if possible
  { id: 'ds_016', name: 'LinkedIn People Profiles', type: DatasetType.DATABASE, status: DatasetStatus.ACTIVE, trend: '+10%', records: '68.3K+', size: '10GB', created: '2023-10-01', lastUpdate: '2023-11-15', owner: 'Marketing', sensitivity: 'High', description: 'ID, Name, City, Country code, Position, About, Posts, Current company, and more.', downloads: '6.7K+' },
  { id: 'ds_017', name: 'Amazon Products', type: DatasetType.STATIC, status: DatasetStatus.ACTIVE, trend: '+15%', records: '21.3K+', size: '5GB', created: '2023-09-20', lastUpdate: '2023-11-14', owner: 'E-commerce', sensitivity: 'Medium', description: 'Title, Seller name, Brand, Description, Initial price, Currency, Reviews count, and more.', downloads: '3K+' },
  { id: 'ds_018', name: 'LinkedIn Company Information', type: DatasetType.DATABASE, status: DatasetStatus.ACTIVE, trend: '+8%', records: '20.1K+', size: '8GB', created: '2023-10-05', lastUpdate: '2023-11-13', owner: 'Sales', sensitivity: 'Medium', description: 'ID, Name, Country code, Locations, Followers, Employees in linkedin, About, Specialties, and more.', downloads: '2.4K+' },
  { id: 'ds_019', name: 'Instagram - Profiles', type: DatasetType.STREAM, status: DatasetStatus.ACTIVE, trend: '+20%', records: '12.6K+', size: '3GB', created: '2023-11-01', lastUpdate: '2023-11-16', owner: 'Social Media', sensitivity: 'Medium', description: 'Account, Fbid, ID, Followers, Posts count, Is business account, Is professional account, Is verified, and more.', downloads: '1.5K+' },
  { id: 'ds_020', name: 'Crunchbase Companies Information', type: DatasetType.DATABASE, status: DatasetStatus.ACTIVE, trend: '+12%', records: '10.3K+', size: '6GB', created: '2023-09-15', lastUpdate: '2023-11-10', owner: 'Business Dev', sensitivity: 'Medium', description: 'Name, URL, ID, Cb rank, Region, About, Industries, Operating status, and more.', downloads: '1.1K+' },
  { id: 'ds_021', name: 'LinkedIn Job Listings Information', type: DatasetType.STATIC, status: DatasetStatus.ACTIVE, trend: '+7%', records: '9.6K+', size: '4GB', created: '2023-10-20', lastUpdate: '2023-11-12', owner: 'HR', sensitivity: 'Medium', description: 'URL, job posting id, job title, Company name, Company id, Job location, Job summary, Job seniority level, and more.', downloads: '1.5K+' },
];

export const TRENDING_DATA_SERIES: TrendingChartSeries = {
  Month: [
    { label: 'Dataset A', data: [0.7, 0.6, 0.8, 0.75, 0.9, 0.85, 0.95, 0.8, 0.7, 0.75, 0.8, 0.9], color: '#3b82f6' }, // blue-500
    { label: 'Dataset B', data: [0.5, 0.55, 0.6, 0.65, 0.7, 0.6, 0.65, 0.75, 0.8, 0.7, 0.65, 0.7], color: '#ec4899' }, // pink-500
    { label: 'Dataset C', data: [0.3, 0.4, 0.35, 0.5, 0.45, 0.55, 0.5, 0.4, 0.3, 0.4, 0.5, 0.4], color: '#14b8a6' }, // teal-500
  ],
  Week: [
    { label: 'Dataset A', data: [0.8, 0.75, 0.85, 0.9, 0.8, 0.7, 0.9], color: '#3b82f6' },
    { label: 'Dataset B', data: [0.6, 0.65, 0.7, 0.75, 0.7, 0.6, 0.7], color: '#ec4899' },
    { label: 'Dataset C', data: [0.4, 0.45, 0.5, 0.4, 0.3, 0.35, 0.4], color: '#14b8a6' },
  ],
  Day: [
    { label: 'Dataset A', data: [0.7, 0.75, 0.8, 0.85, 0.9, 0.88, 0.92, 0.85, 0.8, 0.75, 0.7, 0.65], color: '#3b82f6' },
    { label: 'Dataset B', data: [0.5, 0.55, 0.6, 0.62, 0.65, 0.6, 0.58, 0.63, 0.6, 0.55, 0.5, 0.48], color: '#ec4899' },
    { label: 'Dataset C', data: [0.3, 0.32, 0.35, 0.38, 0.4, 0.37, 0.39, 0.35, 0.3, 0.28, 0.25, 0.2], color: '#14b8a6' },
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
  { name: 'File', value: 2, color: '#14b8a6' }, // teal-500 (ds_003, ds_013)
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
    modal: 'bg-zinc-900',
    // New properties for Datasets page
    heroBg: 'bg-[#0A1934]', // Deep blue background for hero section
    cardBg: 'bg-[#1A3459]', // Slightly lighter dark blue for dataset cards
    cardBorder: 'border-[#2A497A]', // Border for cards
    sectionBg: 'bg-[#0A1934]', // Main section background for datasets page
    neutralBg: 'bg-zinc-900', // For sections that need a subtle background
    highlightText: 'text-teal-400', // Highlight color for "AI & Big Data"
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
    modal: 'bg-white',
    // New properties for Datasets page
    heroBg: 'bg-blue-600',
    cardBg: 'bg-white',
    cardBorder: 'border-zinc-200',
    sectionBg: 'bg-zinc-100',
    neutralBg: 'bg-white',
    highlightText: 'text-blue-700',
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
    modal: 'bg-zinc-900',
    // New properties for Datasets page
    heroBg: 'bg-purple-950',
    cardBg: 'bg-red-950',
    cardBorder: 'border-red-800',
    sectionBg: 'bg-purple-900',
    neutralBg: 'bg-[#2a1a3b]',
    highlightText: 'text-orange-300',
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
    modal: 'bg-zinc-900',
    // New properties for Datasets page
    heroBg: 'bg-green-950',
    cardBg: 'bg-teal-950',
    cardBorder: 'border-teal-800',
    sectionBg: 'bg-green-900',
    neutralBg: 'bg-[#0d2a21]',
    highlightText: 'text-green-300',
  },
  [ThemeKey.GRADIENT_DARK]: {
    app: 'bg-gradient-to-br from-gray-900 via-purple-900 to-black',
    text: 'text-zinc-100',
    sidebar: 'bg-gray-900',
    sidebarBorder: 'border-purple-800/50',
    sidebarActive: 'bg-gradient-to-br from-purple-700 to-purple-800 text-white',
    sidebarHover: 'hover:bg-purple-900/50',
    topbar: 'bg-gray-900/50',
    topbarBorder: 'border-purple-800/50',
    title: 'text-white',
    searchBg: 'bg-gray-900/80',
    searchBorder: 'border-purple-700/50',
    table: 'bg-[#1a1a2e]/90 border-purple-800/50',
    tableCell: 'text-white',
    tableCellSubtle: 'text-zinc-400',
    kpiCard: 'bg-[#1a1a2e]/90 border-purple-800/50',
    kpiCardValue: 'text-white',
    chartBg: 'bg-[#1a1a2e]/90',
    chartTitle: 'text-white',
    modal: 'bg-zinc-900',
    heroBg: 'bg-gray-900',
    cardBg: 'bg-[#1a1a2e]',
    cardBorder: 'border-purple-800/50',
    sectionBg: 'bg-black',
    neutralBg: 'bg-gray-900',
    highlightText: 'text-purple-400',
  },
  [ThemeKey.FULL_DARK]: {
    app: 'bg-black',
    text: 'text-zinc-100',
    sidebar: 'bg-zinc-900',
    sidebarBorder: 'border-zinc-800',
    sidebarActive: 'bg-blue-600 text-white',
    sidebarHover: 'hover:bg-zinc-800',
    topbar: 'bg-zinc-900/50',
    topbarBorder: 'border-zinc-800',
    title: 'text-white',
    searchBg: 'bg-zinc-900',
    searchBorder: 'border-zinc-700',
    table: 'bg-zinc-900/90 border-zinc-800/50',
    tableCell: 'text-white',
    tableCellSubtle: 'text-zinc-400',
    kpiCard: 'bg-zinc-900/90 border-zinc-800/50',
    kpiCardValue: 'text-white',
    chartBg: 'bg-zinc-900/90',
    chartTitle: 'text-white',
    modal: 'bg-zinc-950',
    heroBg: 'bg-black',
    cardBg: 'bg-zinc-900',
    cardBorder: 'border-zinc-800',
    sectionBg: 'bg-black',
    neutralBg: 'bg-zinc-900',
    highlightText: 'text-blue-400',
  },
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
        isActive ? 'ring-2 ring-blue-500/70 shadow-[0_0_15px_rgba(6,182,212,0.3)]' : 'shadow-md hover:-translate-y-0.5'
      }`}
    >
      <div
        className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-blue-500"
        style={{ opacity: isActive ? 1 : 0.7 }}
      ></div>
      <div className="flex items-start justify-between pt-2">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-full bg-cyan-500/10">
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
          {!isTrendingCard && <span className="text-zinc-400">vs last month</span>}
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

  const outerRadialOffset = isModal ? 2 : 1; 
  const lineSegmentLength = isModal ? 2 : 1;
  const horizontalLineExtension = isModal ? 10 : 5;
  const labelBoxMargin = 8;
  const labelRectWidth = isModal ? 140 : 130;
  const labelRectHeight = isModal ? 70 : 65;
  const verticalStackingOffset = isModal ? 35 : 30;

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
            backgroundColor: theme.modal, 
            border: `1.5px solid #3f3f46`, 
            borderRadius: '8px',
            padding: '6px 8px',
            color: '#d4d4d8', 
            fontSize: isModal ? '14px' : '12px', 
            lineHeight: '1.3',
            textAlign: textAnchor === 'start' ? 'left' : 'right',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}>
            <div style={{ color: entry.color, fontWeight: 600 }}>{entry.name}</div>
            <div>Count: {entry.value}</div>
            <div>{percentValue}%</div>
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
        {/* Fix: Use the aliased RechartsTooltip component */}
        {isModal && <RechartsTooltip />}
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
  cycleTheme: () => void;
  theme: Theme;
  activePage: Page;
}

const Topbar: React.FC<TopbarProps> = ({ cycleTheme, theme, activePage }) => {
  return (
    <header className={`h-20 flex items-center justify-between px-8 border-b backdrop-blur-sm z-10 ${theme.topbar} ${theme.topbarBorder}`}>
      <div className="flex items-center space-x-6">
        <h1 className={`text-2xl font-bold ${theme.title}`}>
          {activePage === Page.DASHBOARD ? 'Dashboard' : activePage.charAt(0).toUpperCase() + activePage.slice(1)}
        </h1>
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
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortState, setSortState] = useState<SortState>({ key: 'lastUpdate', asc: false });

  const sortedAndFilteredDatasets = useMemo(() => {
    let filtered = datasets;
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      filtered = datasets.filter(ds =>
        ds.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        ds.id.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }
  
    return [...filtered].sort((a, b) => {
      const aVal = a[sortState.key];
      const bVal = b[sortState.key];
  
      if (sortState.key === 'lastUpdate' || sortState.key === 'created') {
        const dateA = aVal === 'Live' ? new Date() : new Date(aVal);
        const dateB = bVal === 'Live' ? new Date() : new Date(bVal);
        return sortState.asc ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
      }
  
      if (sortState.key === 'size' || sortState.key === 'records') {
        const numA = parseMetric(aVal as string);
        const numB = parseMetric(bVal as string);
        return sortState.asc ? numA - numB : numB - numA;
      }
  
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortState.asc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
  
      return 0;
    });
  }, [datasets, searchTerm, sortState]);

  const trendingDatasets = useMemo(() => {
    return datasets
      .filter(ds => ds.status === DatasetStatus.ACTIVE && ds.trend.startsWith('+'))
      .sort((a, b) => parseFloat(b.trend) - parseFloat(a.trend))
      .slice(0, 7);
  }, [datasets]);

  return (
    <div className={`flex-1 overflow-y-auto p-8 ${theme.app} ${theme.text}`}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* New Datasets Table */}
        <div className="lg:col-span-2">
          <div className={`rounded-2xl p-6 shadow-sm h-full ${theme.kpiCard}`}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-xl font-bold text-white">New Datasets</h2>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <Icon name="Search" className="w-4 h-4 text-zinc-400 absolute top-1/2 left-3 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search Here"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-9 pr-3 py-2 rounded-lg text-sm bg-[#1F3A5A] border border-transparent focus:bg-[#2a4a6a] focus:border-blue-500 outline-none transition ${theme.text}`}
                  />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-blue-600 text-white hover:bg-blue-700 transition">
                  Sort By: Last Updated
                  <Icon name="ChevronDown" className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-zinc-700">
                    {['NAME', 'TYPE', 'STATUS', 'RECORDS', 'SIZE', 'LAST UPDATED'].map(header => (
                      <th key={header} className="p-3 text-xs font-semibold uppercase text-zinc-400">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedAndFilteredDatasets.slice(0, 5).map(ds => (
                    <tr key={ds.id} className="border-b border-zinc-800 hover:bg-zinc-800/20">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <Icon name={getIcon(ds.type)} className="w-5 h-5 text-zinc-400" />
                          <div>
                            <div className="font-semibold text-white">{ds.name}</div>
                            <div className="text-xs text-zinc-500">{ds.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-zinc-400">{ds.type}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${ds.status === DatasetStatus.ACTIVE ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                          {ds.status}
                        </span>
                      </td>
                      <td className="p-3 text-zinc-400">{ds.records}</td>
                      <td className="p-3 text-zinc-400">{ds.size}</td>
                      <td className="p-3 text-zinc-400">{formatDate(ds.lastUpdate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 text-center">
              <button 
                onClick={() => setActivePage(Page.DATASETS)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                View Full Datasets
              </button>
            </div>
          </div>
        </div>

        {/* Trending Datasets */}
        <div className="lg:col-span-1">
          <div className={`rounded-2xl p-6 shadow-sm h-full ${theme.kpiCard}`}>
            <h3 className={`text-xl font-bold mb-6 ${theme.title}`}>Trending Datasets</h3>
            <div className="space-y-4">
              {trendingDatasets.length > 0 ? (
                trendingDatasets.map(ds => (
                  <div key={ds.id} className="flex items-center space-x-4">
                    <div className="p-2 rounded-lg bg-zinc-800 text-zinc-400">
                      <Icon name={getIcon(ds.type)} className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className={`text-sm font-semibold ${theme.tableCell}`}>{ds.name}</div>
                      <div className={`text-xs ${theme.tableCellSubtle}`}>{ds.type}</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${ds.trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>{ds.trend}</div>
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


// NEW COMPONENTS FOR DATASETS PAGE

interface HeroSectionProps {
  theme: Theme;
}

const HeroSection: React.FC<HeroSectionProps> = ({ theme }) => {
  return (
    <section className={`relative py-20 lg:py-32 px-8 ${theme.heroBg} ${theme.text} overflow-hidden`}>
      <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row items-center lg:items-start justify-between">
        <div className="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0">
          <div className="flex items-center justify-center lg:justify-start space-x-4 mb-6">
            <div className="flex items-center text-sm">
              <img src="https://assets-global.website-files.com/653063fcd0c776097d40f28e/653229b139031c54e0c81d86_trustpilot.svg" alt="Trustpilot" className="h-4 mr-2" />
              <span className="font-semibold text-green-400">4.5</span>
            </div>
            <div className="flex items-center text-sm">
              <img src="https://assets-global.website-files.com/653063fcd0c776097d40f28e/653229b139031c54e0c81d88_capterra.svg" alt="Capterra" className="h-4 mr-2" />
              <span className="font-semibold text-yellow-400">4.7</span>
            </div>
          </div>
          <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
            Get fresh datasets from popular websites
          </h1>
          <p className="text-lg text-zinc-300 mb-10 max-w-lg mx-auto lg:mx-0">
            No more maintaining scrapers or bypassing blocks – just structured and validated data tailored to your business needs.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center lg:justify-start">
            <button className="flex items-center justify-center px-8 py-3 border-2 border-white text-white rounded-lg shadow-md hover:bg-white hover:text-blue-700 transition-colors">
              Contact sales <Icon name="ArrowRight" className="w-5 h-5 ml-2" />
            </button>
            <button className="flex items-center justify-center px-8 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors">
              <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 11.2C12 10.428 12.628 9.8 13.4 9.8H21.2C22.296 9.8 23.2 10.704 23.2 11.8V21.2C23.2 22.296 22.296 23.2 21.2 23.2H13.4C12.628 23.2 12 22.572 12 21.8V11.2ZM12 11.2C12 10.428 12.628 9.8 13.4 9.8H21.2C22.296 9.8 23.2 10.704 23.2 11.8V21.2C23.2 22.296 22.296 23.2 21.2 23.2H13.4C12.628 23.2 12 22.572 12 21.8V11.2ZM12 11.2C12 10.428 12.628 9.8 13.4 9.8H21.2C22.296 9.8 23.2 10.704 23.2 11.8V21.2C23.2 22.296 22.296 23.2 21.2 23.2H13.4C12.628 23.2 12 22.572 12 21.8V11.2ZM12 11.2C12 10.428 12.628 9.8 13.4 9.8H21.2C22.296 9.8 23.2 10.704 23.2 11.8V21.2C23.2 22.296 22.296 23.2 21.2 23.2H13.4C12.628 23.2 12 22.572 12 21.8V11.2ZM12 11.2C12 10.428 12.628 9.8 13.4 9.8H21.2C22.296 9.8 23.2 10.704 23.2 11.8V21.2C23.2 22.296 22.296 23.2 21.2 23.2H13.4C12.628 23.2 12 22.572 12 21.8V11.2ZM12 11.2C12 10.428 12.628 9.8 13.4 9.8H21.2C22.296 9.8 23.2 10.704 23.2 11.8V21.2C23.2 22.296 22.296 23.2 21.2 23.2H13.4C12.628 23.2 12 22.572 12 21.8V11.2Z" />
              <path d="M22.5 12.5C22.5 12.5 22.5 12.5 22.5 12.5L22.5 12.5L22.5 12.5ZM24 10C24 4.477 19.523 0 14 0H10C4.477 0 0 4.477 0 10V14C0 19.523 4.477 24 10 24H14C19.523 24 24 19.523 24 14V10ZM22.5 12.5C22.5 12.5 22.5 12.5 22.5 12.5L22.5 12.5L22.5 12.5Z" />
                <path d="M12.0001 10.0001C12.0001 10.0001 12.0001 10.0001 12.0001 10.0001L12.0001 10.0001L12.0001 10.0001ZM12.0001 10.0001C12.0001 10.0001 12.0001 10.0001 12.0001 10.0001L12.0001 10.0001L12.0001 10.0001Z" />
                <path d="M10.1501 12.2999L12.0001 10.0001L13.8501 12.2999L13.1501 12.8999L12.0001 11.4999L10.8501 12.8999L10.1501 12.2999ZM12.0001 10.0001C12.0001 10.0001 12.0001 10.0001 12.0001 10.0001L12.0001 10.0001L12.0001 10.0001Z" />
                <path d="M14.28 11.16C14.28 11.16 14.28 11.16 14.28 11.16C14.28 11.16 14.28 11.16 14.28 11.16ZM12.0001 10.0001C12.0001 10.0001 12.0001 10.0001 12.0001 10.0001L12.0001 10.0001L12.0001 10.0001Z" />
                <path d="M12 0C5.373 0 0 5.373 0 12C0 18.627 5.373 24 12 24C18.627 24 24 18.627 24 12C24 5.373 18.627 0 12 0ZM12 4.4C14.093 4.4 15.8 6.107 15.8 8.2C15.8 10.293 14.093 12 12 12C9.907 12 8.2 10.293 8.2 8.2C8.2 6.107 9.907 4.4 12 4.4ZM12 20.8C9.664 20.8 7.6 19.387 6.556 17.387C6.012 16.32 5.597 15.19 5.398 14H18.602C18.403 15.19 17.988 16.32 17.444 17.387C16.393 19.387 14.336 20.8 12 20.8Z" fill="#fff"/>
              </svg>
              Buy dataset
            </button>
          </div>
        </div>
        <div className="lg:w-1/2 flex justify-center lg:justify-end">
          {/* Placeholder for illustration */}
          <img data-ai-hint="data pipeline" src="https://storage.googleapis.com/aifire.appspot.com/images/data-pipeline.webp" alt="Data illustration" className="max-w-full h-auto w-[600px] object-contain" />
        </div>
      </div>
    </section>
  );
};

interface EndlessPossibilitiesSectionProps {
  theme: Theme;
}

const EndlessPossibilitiesSection: React.FC<EndlessPossibilitiesSectionProps> = ({ theme }) => {
  const featureCards = [
    {
      icon: <img src="https://storage.googleapis.com/aifire.appspot.com/images/icon-departments.webp" alt="Departments Icon" className="w-16 h-16 mb-4" />,
      title: "Departments",
      description: "Enhance operational efficiency and decision-making within various departments using specialized datasets.",
    },
    {
      icon: <img src="https://storage.googleapis.com/aifire.appspot.com/images/icon-industries.webp" alt="Industries Icon" className="w-16 h-16 mb-4" />,
      title: "Industries",
      description: "Tailored datasets providing deep insights into specific industry trends, market analysis, and competitive landscapes.",
    },
    {
      icon: <img src="https://storage.googleapis.com/aifire.appspot.com/images/icon-technology.webp" alt="Technology Icon" className="w-16 h-16 mb-4" />,
      title: "Technology & Innovation",
      description: "Leverage data for product development, AI model training, and advancing technological capabilities.",
    },
    {
      icon: <img src="https://storage.googleapis.com/aifire.appspot.com/images/icon-business.webp" alt="Business Icon" className="w-16 h-16 mb-4" />,
      title: "Business Growth",
      description: "Drive marketing strategies, improve customer understanding, and identify new market opportunities with rich business data.",
    },
  ];

  const textColorClass = theme.text === 'text-zinc-900' ? 'text-zinc-900' : 'text-zinc-100';
  const cardBgClass = theme.text === 'text-zinc-900' ? 'bg-white' : 'bg-[#1A3459] border-[#2A497A]';
  const descriptionTextColor = theme.text === 'text-zinc-900' ? 'text-zinc-600' : 'text-zinc-400';

  return (
    <section className={`py-20 px-8 ${theme.neutralBg || 'bg-white'} ${textColorClass}`}>
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold mb-4">
          Unlock Business Potential with <span className={theme.highlightText}>Powerful Datasets and AI Insights</span>
        </h2>
        <p className={`text-lg mb-12 ${descriptionTextColor}`}>
          Discover how comprehensive datasets fuel innovation, drive strategic decisions, and unlock new growth opportunities across various domains.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featureCards.map((card, index) => (
            <div key={index} className={`rounded-xl shadow-lg p-6 ${cardBgClass}`}>
              <div className="flex justify-center mb-4">
                {card.icon}
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${textColorClass}`}>{card.title}</h3>
              <p className={`text-sm ${descriptionTextColor}`}>{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


interface DatasetCardProps {
  dataset: Dataset;
  theme: Theme;
}

const DatasetCard: React.FC<DatasetCardProps> = ({ dataset, theme }) => {
  return (
    <div className={`rounded-xl p-6 shadow-lg ${theme.cardBg} ${theme.cardBorder ? `border ${theme.cardBorder}` : ''} ${theme.text}`}>
      <h3 className="text-xl font-bold mb-2">{dataset.name}</h3>
      <p className={`text-sm mb-4 ${theme.tableCellSubtle} truncate`}>{dataset.description}</p>
      <div className="flex items-center space-x-4 mb-6 text-zinc-400">
        <div className="flex items-center space-x-1">
          <Icon name="Eye" className="w-4 h-4" />
          <span>{dataset.records}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Icon name="Download" className="w-4 h-4" />
          <span>{dataset.downloads}</span>
        </div>
      </div>
      <button className="flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors">
        Buy Now <Icon name="ArrowRight" className="w-4 h-4 ml-2" />
      </button>
    </div>
  );
};


// components/DatasetsPageContent.tsx (renamed and refactored from renderDatasetsPage logic)
interface DatasetsPageContentProps {
  datasets: Dataset[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  theme: Theme;
}

const DatasetsPageContent: React.FC<DatasetsPageContentProps> = ({
  datasets,
  searchTerm,
  setSearchTerm,
  theme,
}) => {
  const filteredDatasets = useMemo(() => {
    if (!searchTerm) return datasets;
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return datasets.filter(ds =>
      ds.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      ds.description.toLowerCase().includes(lowerCaseSearchTerm) ||
      ds.owner.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [datasets, searchTerm]);

  return (
    <div className={`flex-1 overflow-y-auto ${theme.sectionBg} ${theme.text}`}>
      <HeroSection theme={theme} />
      <EndlessPossibilitiesSection theme={theme} />

      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="relative mb-8 max-w-2xl mx-auto">
          <Icon name="Search" className={`w-5 h-5 text-zinc-400 absolute top-1/2 left-3 -translate-y-1/2 ${theme.text === 'text-zinc-900' ? 'text-zinc-500' : 'text-zinc-400'}`} />
          <input
            type="text"
            placeholder="Search for a dataset"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${theme.searchBg} ${theme.searchBorder} ${theme.text === 'text-zinc-900' ? 'text-zinc-900 placeholder-zinc-500 border-zinc-300' : 'text-white placeholder-zinc-400 border-[#2A497A]'}`}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDatasets.length > 0 ? (
            filteredDatasets.map(ds => (
              <DatasetCard key={ds.id} dataset={ds} theme={theme} />
            ))
          ) : (
            <div className="lg:col-span-3 text-center py-10 text-zinc-400">No datasets found matching your search.</div>
          )}
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
  chartType: 'line' | 'pie';
  kpi?: KpiKey;
  timeRange?: TimeRange;
  theme: Theme;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, chartType, kpi, timeRange, theme }) => {
  if (!isOpen) return null;

  const getLabels = useCallback((range: TimeRange): string[] => {
    switch (range) {
      case TimeRange.MONTH: return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      case TimeRange.WEEK: return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      case TimeRange.DAY: return ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];
    }
  }, []);

  const modalChartDataAndOptions = useMemo(() => {
    let modalChartDatasets: ChartData<'line'>['datasets'] = [];
    let modalChartOptions: ChartOptions<'line'> = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          labels: { color: theme.text === 'text-zinc-900' ? '#52525b' : '#a1a1aa' }
        }
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: theme.text === 'text-zinc-900' ? '#52525b' : '#a1a1aa' } },
        y: { grid: { display: false }, ticks: { color: theme.text === 'text-zinc-900' ? '#52525b' : '#a1a1aa', callback: (v) => (v as number).toLocaleString() } }
      }
    };

    if (chartType === 'line' && kpi && timeRange) {
      if (kpi === KpiKey.TRENDING) {
        const trendingData = (CHART_DATA[KpiKey.TRENDING] as TrendingChartSeries | undefined)?.[timeRange];
        if (trendingData) {
          modalChartDatasets = trendingData.map(series => ({
            label: series.label,
            data: series.data,
            borderColor: series.color,
            backgroundColor: 'transparent',
            borderWidth: 2.5,
            pointRadius: 3,
            pointHoverRadius: 8,
            fill: false,
            tension: 0.2
          }));
        }
        modalChartOptions.scales = {
          x: { grid: { display: false }, ticks: { color: theme.text === 'text-zinc-900' ? '#52525b' : '#a1a1aa' } },
          y: {
            grid: { display: false },
            ticks: { color: theme.text === 'text-zinc-900' ? '#52525b' : '#a1a1aa', stepSize: 0.1 },
            beginAtZero: true,
            min: 0,
            max: 1,
          }
        };
      } else {
        const currentChartData = CHART_DATA[kpi] as BaseChartSeries | undefined;
        const dataForChart = currentChartData ? currentChartData[timeRange] : [];
        modalChartDatasets = [{
          label: title,
          data: dataForChart,
          borderColor: kpi === KpiKey.REQUESTS ? '#22d3ee' : kpi === KpiKey.LATENCY ? '#2dd4bf' : '#fb923c',
          backgroundColor: 'transparent',
          borderWidth: 2.5,
          pointRadius: 3,
          pointHoverRadius: 8,
          fill: false,
          tension: 0.2
        }];
      }
    }

    const labels = timeRange ? getLabels(timeRange).slice(0, (modalChartDatasets[0]?.data.length || 0)) : [];

    return {
      data: {
        labels: labels,
        datasets: modalChartDatasets
      },
      options: modalChartOptions
    };
  }, [chartType, kpi, timeRange, title, theme, getLabels]);

  const modalPieData = useMemo(() => {
    return {
      labels: DONUT_DATA.map(d => d.name),
      datasets: [{
        data: DONUT_DATA.map(d => d.value),
        backgroundColor: DONUT_DATA.map(d => d.color),
        borderWidth: 3,
        borderColor: theme.chartBg.split(' ')[0]
      }]
    };
  }, [theme]);

  const modalPieOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'right',
        labels: {
          color: theme.text === 'text-zinc-900' ? '#52525b' : '#a1a1aa'
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.raw}`
        }
      }
    },
    cutout: '50%',
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
          {chartType === 'line' && kpi && timeRange && (
            <ChartRenderer id="modalChartLine" chartType="line" data={modalChartDataAndOptions.data} options={modalChartDataAndOptions.options as ChartOptions<'line'>} />
          )}
          {chartType === 'pie' && (
             <DonutChartRecharts data={DONUT_DATA} theme={theme} isModal={true}/>
          )}
        </div>
      </div>
    </div>
  );
};


// App.tsx
const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>(Page.DASHBOARD);
  const [datasets, setDatasets] = useState<Dataset[]>(MOCK_DATASETS);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeKpi, setActiveKpi] = useState<KpiKey>(KpiKey.REQUESTS);
  const [timeRange, setTimeRange] = useState<TimeRange>(TimeRange.MONTH);
  const [activeTheme, setActiveTheme] = useState<ThemeKey>(ThemeKey.OCEAN);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalChartConfig, setModalChartConfig] = useState<{ chartType: 'line' | 'pie'; title: string; kpi?: KpiKey; } | null>(null);

  const theme = useMemo(() => THEMES[activeTheme], [activeTheme]);

  const cycleTheme = useCallback(() => {
    const keys = Object.keys(THEMES) as ThemeKey[];
    const idx = keys.indexOf(activeTheme);
    setActiveTheme(keys[(idx + 1) % keys.length]);
  }, [activeTheme]);

  const openChartModal = useCallback((chartType: 'line' | 'pie', title: string, kpi?: KpiKey) => {
    setModalChartConfig({ chartType, title, kpi });
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setModalChartConfig(null);
  }, []);

  const renderMainContent = useCallback(() => {
    switch (activePage) {
      case Page.DASHBOARD:
        return (
          <DashboardPage
            datasets={datasets}
            activeKpi={activeKpi}
            setActiveKpi={setActiveKpi}
            timeRange={timeRange}
            setTimeRange={setTimeRange}
            theme={theme}
            openChartModal={openChartModal}
            setActivePage={setActivePage}
          />
        );
      case Page.DATASETS:
        return (
          <DatasetsPageContent
            datasets={datasets}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            theme={theme}
          />
        );
      case Page.ANALYTICS:
      case Page.SETTINGS:
        return (
          <div className={`flex-1 overflow-y-auto p-8 ${theme.app} ${theme.text}`}>
            <div className={`text-3xl font-bold ${theme.title} p-8`}>
              {activePage.charAt(0).toUpperCase() + activePage.slice(1)} Page (Coming Soon)
            </div>
          </div>
        );
      default:
        return null;
    }
  }, [activePage, datasets, searchTerm, setSearchTerm, activeKpi, setActiveKpi, timeRange, setTimeRange, theme, openChartModal, setActivePage]);

  return (
    <div className={`flex h-screen overflow-hidden font-sans ${theme.app} ${theme.text}`}>
      <Sidebar activePage={activePage} setActivePage={setActivePage} theme={theme} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar cycleTheme={cycleTheme} theme={theme} activePage={activePage} />
        <main className="flex-1 overflow-y-auto">
          {renderMainContent()}
        </main>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalChartConfig?.title || ''}
        chartType={modalChartConfig?.chartType || 'line'}
        kpi={modalChartConfig?.kpi || KpiKey.REQUESTS}
        timeRange={timeRange}
        theme={theme}
      />
    </div>
  );
};

export default App;
