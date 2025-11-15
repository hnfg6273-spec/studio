'use client';
import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import Chart, { ChartConfiguration, ChartType, ChartData, ChartOptions } from 'chart.js/auto';
import { CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend } from 'chart.js';
import * as LucideIcons from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip } from 'recharts';

// Register Chart.js components
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend);

// All Types from src/lib/types.ts
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
  records: string;
  size: string;
  created: string;
  lastUpdate: string;
  owner: string;
  sensitivity: string;
  description: string;
  downloads: string;
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
  Month: { label: string; data: number[]; color: string }[];
  Week: { label: string; data: number[]; color: string }[];
  Day: { label: string; data: number[]; color: string }[];
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
  heroBg?: string;
  cardBg?: string;
  cardBorder?: string;
  sectionBg?: string;
  highlightText?: string;
  neutralBg?: string;
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

// All mock data from src/lib/mock-data.ts

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
  { id: 'ds_016', name: 'LinkedIn People Profiles', type: DatasetType.DATABASE, status: DatasetStatus.ACTIVE, trend: '+10%', records: '68.3K+', size: '10GB', created: '2023-10-01', lastUpdate: '2023-11-15', owner: 'Marketing', sensitivity: 'High', description: 'ID, Name, City, Country code, Position, About, Posts, Current company, and more.', downloads: '6.7K+' },
  { id: 'ds_017', name: 'Amazon Products', type: DatasetType.STATIC, status: DatasetStatus.ACTIVE, trend: '+15%', records: '21.3K+', size: '5GB', created: '2023-09-20', lastUpdate: '2023-11-14', owner: 'E-commerce', sensitivity: 'Medium', description: 'Title, Seller name, Brand, Description, Initial price, Currency, Reviews count, and more.', downloads: '3K+' },
  { id: 'ds_018', name: 'LinkedIn Company Information', type: DatasetType.DATABASE, status: DatasetStatus.ACTIVE, trend: '+8%', records: '20.1K+', size: '8GB', created: '2023-10-05', lastUpdate: '2023-11-13', owner: 'Sales', sensitivity: 'Medium', description: 'ID, Name, Country code, Locations, Followers, Employees in linkedin, About, Specialties, and more.', downloads: '2.4K+' },
  { id: 'ds_019', name: 'Instagram - Profiles', type: DatasetType.STREAM, status: DatasetStatus.ACTIVE, trend: '+20%', records: '12.6K+', size: '3GB', created: '2023-11-01', lastUpdate: '2023-11-16', owner: 'Social Media', sensitivity: 'Medium', description: 'Account, Fbid, ID, Followers, Posts count, Is business account, Is professional account, Is verified, and more.', downloads: '1.5K+' },
  { id: 'ds_020', name: 'Crunchbase Companies Information', type: DatasetType.DATABASE, status: DatasetStatus.ACTIVE, trend: '+12%', records: '10.3K+', size: '6GB', created: '2023-09-15', lastUpdate: '2023-11-10', owner: 'Business Dev', sensitivity: 'Medium', description: 'Name, URL, ID, Cb rank, Region, About, Industries, Operating status, and more.', downloads: '1.1K+' },
  { id: 'ds_021', name: 'LinkedIn Job Listings Information', type: DatasetType.STATIC, status: DatasetStatus.ACTIVE, trend: '+7%', records: '9.6K+', size: '4GB', created: '2023-10-20', lastUpdate: '2023-11-12', owner: 'HR', sensitivity: 'Medium', description: 'URL, job posting id, job title, Company name, Company id, Job location, Job summary, Job seniority level, and more.', downloads: '1.5K+' },
];

export const TRENDING_DATA_SERIES: TrendingChartSeries = {
  Month: [
    { label: 'Dataset A', data: [0.7, 0.6, 0.8, 0.75, 0.9, 0.85, 0.95, 0.8, 0.7, 0.75, 0.8, 0.9], color: '#3b82f6' },
    { label: 'Dataset B', data: [0.5, 0.55, 0.6, 0.65, 0.7, 0.6, 0.65, 0.75, 0.8, 0.7, 0.65, 0.7], color: '#ec4899' },
    { label: 'Dataset C', data: [0.3, 0.4, 0.35, 0.5, 0.45, 0.55, 0.5, 0.4, 0.3, 0.4, 0.5, 0.4], color: '#14b8a6' },
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
    Day: [110, 100, 120, 180, 250, 300, 280, 310, 350, 320, 280, 200],
  },
  [KpiKey.USERS]: {
    Month: [500, 520, 510, 550, 580, 620, 650, 680, 700, 710, 730, 750],
    Week: [680, 700, 710, 730, 750, 740, 720],
    Day: [300, 250, 280, 350, 450, 550, 600, 620, 650, 630, 580, 450],
  },
  [KpiKey.LATENCY]: {
    Month: [30, 28, 32, 30, 25, 22, 24, 28, 26, 30, 32, 28],
    Week: [32, 30, 28, 25, 28, 30, 29],
    Day: [20, 22, 25, 30, 35, 40, 38, 35, 32, 28, 25, 22],
  },
  [KpiKey.TRENDING]: TRENDING_DATA_SERIES,
};

export const DONUT_DATA: DonutDataItem[] = [
  { name: 'Stream', value: 4, color: '#3b82f6' },
  { name: 'Database', value: 4, color: '#ec4899' },
  { name: 'File', value: 2, color: '#14b8a6' },
  { name: 'Log', value: 3, color: '#f97316' },
  { name: 'Static', value: 2, color: '#a855f7' },
];

export const NAV_ITEMS: NavItem[] = [
  { name: 'Dashboard', icon: 'LayoutDashboard', page: Page.DASHBOARD },
  { name: 'Datasets', icon: 'Database', page: Page.DATASETS },
  { name: 'Analytics', icon: 'BarChart3', page: Page.ANALYTICS },
  { name: 'Settings', icon: 'Settings', page: Page.SETTINGS },
];

export const THEMES: Themes = {
  [ThemeKey.OCEAN]: {
    app: 'bg-gradient-to-br from-[#14253F] via-[#126C86] to-[#2198AC]',
    text: 'text-zinc-100',
    sidebar: 'bg-gradient-to-b from-[#14253F] to-[#126C86]',
    sidebarBorder: 'border-zinc-800',
    sidebarActive: 'bg-gradient-to-br from-[#126C86] to-[#2198AC] text-white',
    sidebarHover: 'hover:bg-[#126C86]/50',
    topbar: 'bg-[#14253F]/50 backdrop-blur-sm',
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
    heroBg: 'bg-gradient-to-b from-[#0A1934] to-[#14253F]',
    cardBg: 'bg-gradient-to-br from-[#1A3459] to-[#0A1934]',
    cardBorder: 'border-[#2A497A]',
    sectionBg: 'bg-gradient-to-t from-[#0A1934] to-[#14253F]',
    highlightText: 'text-teal-400',
    neutralBg: 'bg-[#0F2D4A]',
  },
  [ThemeKey.DAY]: {
    app: 'bg-gradient-to-br from-blue-100 via-white to-blue-50',
    text: 'text-zinc-900',
    sidebar: 'bg-gradient-to-b from-white to-zinc-50',
    sidebarBorder: 'border-zinc-200',
    sidebarActive: 'bg-gradient-to-br from-blue-600 to-blue-500 text-white',
    sidebarHover: 'hover:bg-zinc-200/50',
    topbar: 'bg-white/50 backdrop-blur-sm',
    topbarBorder: 'border-zinc-200',
    title: 'text-zinc-900',
    searchBg: 'bg-white',
    searchBorder: 'border-zinc-300',
    table: 'bg-white border-zinc-200',
    tableCell: 'text-zinc-800',
    tableCellSubtle: 'text-zinc-500',
    kpiCard: 'bg-white/80 border-zinc-200/80',
    kpiCardValue: 'text-zinc-900',
    chartBg: 'bg-white',
    chartTitle: 'text-zinc-900',
    modal: 'bg-white',
    heroBg: 'bg-gradient-to-b from-blue-600 to-blue-500',
    cardBg: 'bg-white/80',
    cardBorder: 'border-zinc-200/80',
    sectionBg: 'bg-gradient-to-b from-blue-50 to-white',
    highlightText: 'text-blue-700',
    neutralBg: 'bg-white',
  },
  [ThemeKey.SUNSET]: {
    app: 'bg-gradient-to-br from-purple-900 via-red-700 to-orange-500',
    text: 'text-zinc-100',
    sidebar: 'bg-gradient-to-b from-purple-900 to-red-900',
    sidebarBorder: 'border-purple-700/50',
    sidebarActive: 'bg-gradient-to-br from-purple-600 to-red-600 text-white',
    sidebarHover: 'hover:bg-purple-700/50',
    topbar: 'bg-purple-900/50 backdrop-blur-sm',
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
    heroBg: 'bg-gradient-to-b from-purple-950 to-red-900',
    cardBg: 'bg-gradient-to-br from-red-950 to-purple-950',
    cardBorder: 'border-red-800',
    sectionBg: 'bg-gradient-to-t from-purple-900 to-red-900',
    highlightText: 'text-orange-300',
    neutralBg: 'bg-[#2a1a3b]',
  },
  [ThemeKey.FOREST]: {
    app: 'bg-gradient-to-br from-green-900 via-teal-800 to-gray-900',
    text: 'text-zinc-100',
    sidebar: 'bg-gradient-to-b from-green-900 to-teal-900',
    sidebarBorder: 'border-teal-700/50',
    sidebarActive: 'bg-gradient-to-br from-green-600 to-teal-500 text-white',
    sidebarHover: 'hover:bg-green-700/50',
    topbar: 'bg-green-900/50 backdrop-blur-sm',
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
    heroBg: 'bg-gradient-to-b from-green-950 to-teal-900',
    cardBg: 'bg-gradient-to-br from-teal-950 to-green-950',
    cardBorder: 'border-teal-800',
    sectionBg: 'bg-gradient-to-t from-green-900 to-teal-900',
    highlightText: 'text-green-300',
    neutralBg: 'bg-[#0d2a21]',
  },
  [ThemeKey.GRADIENT_DARK]: {
    app: 'bg-gradient-to-br from-gray-900 via-purple-900 to-black',
    text: 'text-zinc-100',
    sidebar: 'bg-gray-900',
    sidebarBorder: 'border-purple-800/50',
    sidebarActive: 'bg-gradient-to-br from-purple-700 to-purple-800 text-white',
    sidebarHover: 'hover:bg-purple-900/50',
    topbar: 'bg-gray-900/50 backdrop-blur-sm',
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
    cardBg: 'bg-gradient-to-br from-[#1a1a2e] to-gray-900',
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
    topbar: 'bg-zinc-900/50 backdrop-blur-sm',
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

// All utils from src/lib/utils.ts
export function getIcon(type: DatasetType): string {
  const icons: { [key in DatasetType]: string } = {
    [DatasetType.STREAM]: 'Server',
    [DatasetType.DATABASE]: 'Database',
    [DatasetType.FILE]: 'FileText',
    [DatasetType.LOG]: 'HardDrive',
    [DatasetType.STATIC]: 'Cloud',
  };
  return icons[type] || 'FileText';
}

export function getStatusClass(status: DatasetStatus): string {
  const map: { [key in DatasetStatus]: string } = {
    [DatasetStatus.ACTIVE]: 'bg-green-500',
    [DatasetStatus.PAUSED]: 'bg-yellow-500',
    [DatasetStatus.ARCHIVED]: 'bg-zinc-500',
    [DatasetStatus.ERROR]: 'bg-red-500',
  };
  return map[status] || 'bg-gray-500';
}

export function formatDate(dateStr: string): string {
  if (dateStr === 'Live') return 'Live';
  const d = new Date(dateStr);
  return d.toLocaleDateString();
}

export function parseMetric(val: string): number {
  if (typeof val !== 'string' || val === 'N/A') return 0;
  const num = parseFloat(val);
  if (val.endsWith('TB')) return num * 1024 * 1024;
  if (val.endsWith('GB')) return num * 1024;
  if (val.endsWith('MB')) return num;
  if (val.endsWith('M')) return num * 1000000;
  if (val.endsWith('K')) return num * 1000;
  return num;
}


// All components from src/components/*.tsx

// components/Icon.tsx
const Icon: React.FC<{ name: string; className?: string; style?: React.CSSProperties; }> = ({ name, className, style }) => {
  const LucideIcon = (LucideIcons as any)[name];

  if (!LucideIcon) {
    console.warn(`Icon "${name}" not found in lucide-react.`);
    return null;
  }

  return <LucideIcon className={className} style={style} />;
};

// components/KpiCard.tsx
const KpiCard: React.FC<{ data: KpiDataItem; isActive: boolean; onClick: () => void; theme: Theme; isTrendingCard?: boolean; }> = ({
  data,
  isActive,
  onClick,
  theme,
  isTrendingCard = false,
}) => {
  const trendIcon = data.changeType === 'positive' ? 'TrendingUp' : 'TrendingDown';
  const trendColorClass = data.changeType === 'positive' ? 'text-green-500' : 'text-red-500';
  const isDarkTheme = theme.text !== 'text-zinc-900';

  const getBorderColor = () => {
    if (!isDarkTheme) {
      return isActive ? 'border-blue-500' : 'border-zinc-200';
    }
    if (!isActive) return 'border-zinc-800';
    if (data.title === 'Total Requests') return 'border-cyan-400';
    if (data.title === 'Trending Datasets') return 'border-purple-500';
    if (data.title === 'Avg. Response') return 'border-teal-400';
    if (data.title === 'Concurrent Users') return 'border-orange-400';
    return 'border-blue-500/70';
  };

  const kpiCardBg = isDarkTheme ? 'bg-zinc-900/50' : 'bg-white';
  const titleColor = isDarkTheme ? 'text-zinc-400' : 'text-zinc-500';
  const valueColor = isDarkTheme ? 'text-white' : 'text-zinc-900';
  const subTextColor = isDarkTheme ? 'text-zinc-400' : 'text-zinc-500';

  return (
    <div
      onClick={onClick}
      className={`relative p-6 rounded-2xl cursor-pointer transition-all duration-300 ease-in-out ${kpiCardBg} border ${getBorderColor()} ${
        isActive && isDarkTheme ? 'shadow-lg' : 'shadow-md hover:-translate-y-0.5'
      } ${isActive && !isDarkTheme ? 'ring-2 ring-blue-500' : ''} overflow-hidden`}
    >
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ background: `linear-gradient(to right, ${data.color}30, ${data.color}90, ${data.color}30)` }}
      />
      <div className="flex items-start justify-between">
        <span className={`text-sm font-medium ${titleColor}`}>{data.title}</span>
        <div className="p-1.5 rounded-full" style={{ backgroundColor: `${data.color}20` }}>
          <Icon name={data.icon} className="w-5 h-5" style={{ color: data.color }} />
        </div>
      </div>
      <div className="mt-4">
        <h2 className={`text-4xl font-bold ${valueColor}`}>{data.value}</h2>
      </div>
      <div className="flex items-center text-xs mt-4 space-x-1">
        <div className={`flex items-center space-x-1 ${trendColorClass}`}>
          <Icon name={trendIcon} className="w-3.5 h-3.5" />
          <span>{data.change}</span>
        </div>
        <span className={subTextColor}>{isTrendingCard ? 'of all datasets' : 'vs last month'}</span>
      </div>
    </div>
  );
};

// components/ChartRenderer.tsx
const ChartRenderer: React.FC<{ chartType: ChartType; data: ChartData; options: ChartOptions; id: string; }> = ({ chartType, data, options, id }) => {
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
const RADIAN = Math.PI / 180;
const DonutChartRecharts: React.FC<{ data: DonutDataItem[]; theme: Theme; isModal?: boolean; }> = ({ data, theme, isModal = false }) => {
  const pieInnerRadius = isModal ? 70 : 60;
  const pieOuterRadius = isModal ? 110 : 90;
  const isDark = theme.text !== 'text-zinc-900';
  const textColor = isDark ? '#d4d4d8' : '#3f3f46';
  const mutedTextColor = isDark ? '#a1a1aa' : '#71717a';

  const renderCustomizedLabel = useCallback((props: any) => {
    const { cx, cy, midAngle, outerRadius, percent, index } = props;
    const entry = data[index]; 
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 20) * cos;
    const my = cy + (outerRadius + 20) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';
    const percentValue = (percent * 100).toFixed(0);

    return (
      <g>
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={mutedTextColor} fill="none" />
        <circle cx={sx} cy={sy} r={2} fill={mutedTextColor} stroke="none" />
        
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill={entry.color} fontWeight="bold" fontSize={isModal ? 14 : 12}>
          {entry.name}
        </text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill={textColor} fontSize={isModal ? 14 : 12}>
          {`Count: ${entry.value}`}
        </text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={36} textAnchor={textAnchor} fill={mutedTextColor} fontSize={isModal ? 12 : 10}>
          {`(${percentValue}%)`}
        </text>
      </g>
    );
  }, [data, isModal, textColor, mutedTextColor]);

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
        {isModal && <RechartsTooltip />}
      </PieChart>
    </ResponsiveContainer>
  );
};


// components/Modal.tsx
const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  chartType: 'line' | 'pie';
  kpi?: KpiKey;
  timeRange?: TimeRange;
  theme: Theme;
}> = ({ isOpen, onClose, title, chartType, kpi, timeRange, theme }) => {
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

// components/Sidebar.tsx
const Sidebar: React.FC<{ activePage: Page; setActivePage: (page: Page) => void; theme: Theme; }> = ({ activePage, setActivePage, theme }) => {
  return (
    <nav
      className={`w-20 flex flex-col items-center py-6 space-y-8 border-r shadow-lg z-20 ${theme.sidebar} ${theme.sidebarBorder}`}
    >
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${theme.sidebarActive.replace(
          ' text-white',
          ''
        )}`}
      >
        <Icon name="Blocks" className="w-6 h-6 text-white" />
      </div>
      <div className="flex flex-col space-y-6">
        {NAV_ITEMS.map((item) => (
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
        <div
          className={`w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl shadow-lg border-2 ${theme.sidebar}`}
        >
          AV
        </div>
      </div>
    </nav>
  );
};

// components/Topbar.tsx
const Topbar: React.FC<{ cycleTheme: () => void; theme: Theme; activePage: Page; }> = ({ cycleTheme, theme, activePage }) => {
  return (
    <header
      className={`h-20 flex items-center justify-between px-8 border-b backdrop-blur-sm z-10 ${theme.topbar} ${theme.topbarBorder}`}
    >
      <div className="flex items-center space-x-6">
        <h1 className={`text-2xl font-bold ${theme.title}`}>
          {activePage === Page.DASHBOARD
            ? 'Dashboard'
            : activePage.charAt(0).toUpperCase() + activePage.slice(1)}
        </h1>
      </div>
      <div className="flex items-center space-x-5">
        <button
          onClick={cycleTheme}
          className="p-2 rounded-full text-zinc-400 hover:bg-zinc-800"
        >
          <Icon name="Palette" className="w-6 h-6" />
        </button>
        <button className="p-2 rounded-full text-zinc-400 hover:bg-zinc-800 relative">
          <Icon name="Bell" className="w-6 h-6" />
          <span
            className={`absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 ${theme.sidebarBorder}`}
          ></span>
        </button>
        <div className="flex items-center space-x-3">
          <div
            className={`w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-offset-2 ring-purple-500 ${theme.sidebar}`}
          >
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
const DashboardPage: React.FC<{
  datasets: Dataset[];
  activeKpi: KpiKey;
  setActiveKpi: (kpi: KpiKey) => void;
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
  theme: Theme;
  openChartModal: (chartType: 'line' | 'pie', title: string, kpi?: KpiKey) => void;
  setActivePage: (page: Page) => void;
}> = ({
  datasets,
  activeKpi,
  setActiveKpi,
  timeRange,
  setTimeRange,
  theme,
  openChartModal,
  setActivePage,
}) => {
  const [sortState, setSortState] = useState<SortState>({
    key: 'lastUpdate',
    asc: false,
  });
  const [dashboardSearchTerm, setDashboardSearchTerm] = useState('');

  const kpiData: Record<KpiKey, KpiDataItem> = {
    [KpiKey.REQUESTS]: { title: 'Total Requests', value: '2.5M', change: '+12.5%', changeType: 'positive', icon: 'Zap', color: '#22d3ee' },
    [KpiKey.TRENDING]: { title: 'Trending Datasets', value: '8', change: '+66.7%', changeType: 'positive', icon: 'TrendingUp', color: '#c084fc' },
    [KpiKey.LATENCY]: { title: 'Avg. Response', value: '24ms', change: '-2.4%', changeType: 'negative', icon: 'Activity', color: '#2dd4bf' },
    [KpiKey.USERS]: { title: 'Concurrent Users', value: '842', change: '+4.3%', changeType: 'positive', icon: 'Users', color: '#fb923c' }
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
    const isDark = theme.text !== 'text-zinc-900';
    const textColor = isDark ? '#a1a1aa' : '#52525b';

    let mainChartOptions: ChartOptions<'line'> = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          mode: 'index',
          intersect: false,
          backgroundColor: isDark ? '#18181b' : '#ffffff',
          titleColor: textColor,
          bodyColor: textColor,
          borderColor: isDark ? '#3f3f46' : '#e4e4e7',
          borderWidth: 1,
          padding: 12,
          boxPadding: 8,
        },
      },
      interaction: {
        mode: 'index',
        intersect: false,
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: textColor } },
        y: { grid: { display: false }, ticks: { color: textColor, callback: (v) => (v as number).toLocaleString() } }
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
          ...mainChartOptions.plugins,
          legend: {
            display: true,
            position: 'bottom',
            labels: { color: textColor }
          }
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: textColor } },
          y: {
            grid: { display: false },
            ticks: { color: textColor, stepSize: 0.1 },
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
        borderColor: activeKpi === KpiKey.REQUESTS ? '#22d3ee' : activeKpi === KpiKey.LATENCY ? '#2dd4bf' : '#fb923c',
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
  }, [activeKpi, timeRange, theme, getLabels, kpiTitle]);

  const trendingDatasets = useMemo(() => {
    return datasets
      .filter((ds) => ds.status === 'Active' && ds.trend.startsWith('+'))
      .sort((a, b) => parseFloat(b.trend) - parseFloat(a.trend))
      .slice(0, 7);
  }, [datasets]);

  const sortedDatasets = useMemo(() => {
    const filtered = dashboardSearchTerm
      ? datasets.filter((ds) =>
          ds.name.toLowerCase().includes(dashboardSearchTerm.toLowerCase())
        )
      : datasets;

    return [...filtered].sort((a, b) => {
      const aVal = a[sortState.key];
      const bVal = b[sortState.key];

      if (sortState.key === 'lastUpdate' || sortState.key === 'created') {
        const dateA = aVal === 'Live' ? new Date() : new Date(aVal);
        const dateB = bVal === 'Live' ? new Date() : new Date(bVal);
        return sortState.asc
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      }

      if (sortState.key === 'size' || sortState.key === 'records') {
        const numA = parseMetric(aVal as string);
        const numB = parseMetric(bVal as string);
        return sortState.asc ? numA - numB : numB - numA;
      }

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortState.asc
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return 0;
    });
  }, [datasets, sortState, dashboardSearchTerm]);

  const handleSort = (key: keyof Dataset) => {
    if (sortState.key === key) {
      setSortState({ key, asc: !sortState.asc });
    } else {
      setSortState({ key, asc: false });
    }
  };

  const getSortLabel = (key: keyof Dataset, label: string) => {
    if (sortState.key === key) {
      return `${label} ${sortState.asc ? '↑' : '↓'}`;
    }
    return label;
  };

  return (
    <div className={`flex-1 overflow-y-auto p-8 ${theme.app} ${theme.text}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Object.entries(kpiData).map(([key, d]) => (
          <KpiCard
            key={key}
            data={d}
            isActive={activeKpi === (key as KpiKey)}
            onClick={() => setActiveKpi(key as KpiKey)}
            theme={theme}
            isTrendingCard={key === KpiKey.TRENDING}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <div className={`rounded-2xl p-6 shadow-sm ${theme.chartBg}`}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className={`text-xl font-bold ${theme.chartTitle}`}>{kpiTitle[activeKpi]}</h3>
                <p className="text-sm text-zinc-400">{kpiDescription[activeKpi]}</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center p-1 rounded-lg bg-zinc-800">
                  {Object.values(TimeRange).map((range) => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={`py-1 px-3 rounded-md text-xs font-semibold transition-all ${
                        timeRange === range
                          ? 'bg-zinc-700 text-white'
                          : 'text-zinc-400 hover:bg-zinc-700/50'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => openChartModal('line', kpiTitle[activeKpi], activeKpi)}
                  className="p-2 rounded-lg text-zinc-400 hover:bg-zinc-800"
                >
                  <Icon name="Maximize2" className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="h-[300px]">
              <ChartRenderer
                id="mainChart"
                chartType="line"
                data={mainChartDataAndOptions.data}
                options={mainChartDataAndOptions.options}
              />
            </div>
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className={`rounded-2xl p-6 shadow-sm ${theme.chartBg}`}>
            <div className="flex justify-between items-start mb-6">
              <h3 className={`text-xl font-bold ${theme.chartTitle}`}>
                Datasets by Category
              </h3>
              <button
                onClick={() => openChartModal('pie', 'Datasets by Category')}
                className="p-2 rounded-lg text-zinc-400 hover:bg-zinc-800"
              >
                <Icon name="Maximize2" className="w-5 h-5" />
              </button>
            </div>
            <div className="h-[300px]">
              <DonutChartRecharts data={DONUT_DATA} theme={theme} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 h-full">
          <div
            className={`rounded-2xl p-6 shadow-sm border h-full ${theme.kpiCard} ${theme.cardBorder || 'border-zinc-800'}`}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-xl font-bold ${theme.title}`}>New Datasets</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y border-zinc-800">
                <thead className={`${theme.table}/50`}>
                  <tr>
                    {(['Name', 'Type', 'Status', 'Records', 'Size', 'Last Updated'] as const).map(
                      (header) => {
                        const headerKeyMap = {
                          'Name': 'name',
                          'Type': 'type',
                          'Status': 'status',
                          'Records': 'records',
                          'Size': 'size',
                          'Last Updated': 'lastUpdate'
                        } as const;
                        const key = headerKeyMap[header];
                        return (
                          <th
                            key={header}
                            onClick={() => handleSort(key)}
                            className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400 cursor-pointer"
                          >
                            {getSortLabel(key, header)}
                          </th>
                        );
                      }
                    )}
                  </tr>
                </thead>
                <tbody
                  className={`${theme.table.replace(
                    /border-\[#126C86\]\/50|border-zinc-200/,
                    ''
                  )} divide-y border-zinc-800`}
                >
                  {sortedDatasets.slice(0, 5).map((ds) => (
                    <tr key={ds.id} className="hover:bg-zinc-800/20 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <Icon name={getIcon(ds.type)} className="w-4 h-4 text-blue-400" />
                          <div>
                            <div className={`text-sm font-medium ${theme.tableCell}`}>
                              {ds.name}
                            </div>
                            <div className={`text-xs ${theme.tableCellSubtle}`}>
                              {ds.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td
                        className={`px-4 py-3 whitespace-nowrap text-sm ${theme.tableCellSubtle}`}
                      >
                        {ds.type}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 text-xs font-medium text-white rounded-full ${getStatusClass(
                            ds.status
                          )}`}
                        >
                          {ds.status}
                        </span>
                      </td>
                      <td
                        className={`px-4 py-3 whitespace-nowrap text-sm ${theme.tableCellSubtle}`}
                      >
                        {ds.records}
                      </td>
                      <td
                        className={`px-4 py-3 whitespace-nowrap text-sm ${theme.tableCellSubtle}`}
                      >
                        {ds.size}
                      </td>
                      <td
                        className={`px-4 py-3 whitespace-nowrap text-sm ${theme.tableCellSubtle}`}
                      >
                        {formatDate(ds.lastUpdate)}
                      </td>
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
        </div>
        <div className="lg:col-span-1 h-full">
          <div className={`rounded-2xl p-6 shadow-sm border h-full ${theme.kpiCard} ${theme.cardBorder || 'border-zinc-800'}`}>
            <h3 className={`text-xl font-bold mb-6 ${theme.title}`}>
              Trending Datasets
            </h3>
            <div className="space-y-4">
              {trendingDatasets.length > 0 ? (
                trendingDatasets.map((ds) => (
                  <div key={ds.id} className="flex items-center space-x-4">
                    <div className="p-2 rounded-full bg-blue-500/10 text-blue-400">
                      <Icon name={getIcon(ds.type)} className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className={`text-sm font-semibold ${theme.tableCell}`}>
                        {ds.name}
                      </div>
                      <div className={`text-xs ${theme.tableCellSubtle}`}>{ds.type}</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium text-green-500`}>
                        {ds.trend}
                      </div>
                      <div className={`text-xs ${theme.tableCellSubtle}`}>
                        {ds.status}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className={`text-sm ${theme.tableCellSubtle} text-center py-4`}>
                  No trending datasets found.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


// components/DatasetsPageContent.tsx
const HeroSection: React.FC<{ theme: Theme }> = ({ theme }) => {
  const isDark = theme.text !== 'text-zinc-900';
  const imageUrl = "https://i.postimg.cc/wMKCXy1V/Gemini-Generated-Image-vdgi6yvdgi6yvdgi-Photoroom-removebg-preview.png";

  return (
    <section className={`relative py-12 lg:py-20 px-4 sm:px-8 ${theme.heroBg || (isDark ? 'bg-slate-900' : 'bg-gray-100')} text-gray-100`}>
      <div className={`max-w-7xl mx-auto w-full ${isDark ? 'bg-slate-800/70' : 'bg-white'} backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-12 border ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
        
        <div className="lg:flex lg:space-x-12">
          {/* Left Content Area */}
          <div className="lg:w-1/2 mb-10 lg:mb-0">
            <h1 className={`text-3xl sm:text-5xl font-extrabold leading-tight tracking-tight mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Fresh Datasets, <br className="hidden sm:inline" />On Demand
            </h1>
            
            <p className={`text-lg sm:text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-10 max-w-lg`}>
              Access high-quality, structured datasets without the hassle of web scraping or getting blocked.
            </p>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"> 

              <button
                className="flex items-center justify-center px-8 py-3 text-lg font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition duration-200 shadow-lg shadow-blue-500/30"
              >
                <Icon name="Search" className="w-5 h-5 mr-2" />
                Buy dataset
              </button>
            </div>
          </div>

          {/* Right Image Area */}
          <div className="lg:w-1/2 h-64 md:h-96 relative flex items-center justify-center p-4">
            <img 
              data-ai-hint="data dashboard preview"
              src={imageUrl}
              alt="Data Dashboard Preview"
              className="w-full h-full object-contain rounded-xl transition duration-300"
              onError={(e) => { 
                e.currentTarget.onerror = null; 
                e.currentTarget.src="https://placehold.co/800x600/1E293B/C7D2FE?text=Image+Load+Error"; 
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const DatasetCard: React.FC<{ dataset: Dataset; theme: Theme; }> = ({ dataset, theme }) => {
    const isDark = theme.text !== 'text-zinc-900';
    const cardBg = theme.cardBg || (isDark ? 'bg-slate-800/60' : 'bg-white');
    const cardBorder = theme.cardBorder || (isDark ? 'border-slate-700/80' : 'border-gray-200/80');
    const textColor = isDark ? 'text-slate-100' : 'text-slate-800';
    const subtleTextColor = isDark ? 'text-slate-400' : 'text-slate-500';
  
    return (
      <div
        className={`relative rounded-2xl p-6 backdrop-blur-md shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${cardBg} border ${cardBorder}`}
      >
        <div className="flex items-start justify-between mb-4">
          <h3 className={`text-xl font-bold ${textColor}`}>{dataset.name}</h3>
          <div className={`p-2 rounded-lg ${isDark ? 'bg-slate-700/50' : 'bg-gray-100'}`}>
            <Icon name={getIcon(dataset.type)} className={`w-5 h-5 ${isDark ? 'text-cyan-400' : 'text-blue-600'}`} />
          </div>
        </div>
        <p className={`text-sm mb-6 h-10 ${subtleTextColor} text-ellipsis overflow-hidden`}>
          {dataset.description}
        </p>
  
        <div className="flex items-center justify-between mb-6 text-sm">
          <div className="flex items-center space-x-2">
            <Icon name="Database" className={`w-4 h-4 ${subtleTextColor}`} />
            <span className={subtleTextColor}>{dataset.records} records</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="DownloadCloud" className={`w-4 h-4 ${subtleTextColor}`} />
            <span className={subtleTextColor}>{dataset.downloads} downloads</span>
          </div>
        </div>
  
        <button className="w-full py-3 font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
          View Dataset
        </button>
      </div>
    );
  };
  

const DatasetTypeSelector: React.FC<{ theme: Theme; }> = ({ theme }) => {
    const [selectedDataset, setSelectedDataset] = useState('Structured data');

    const options = [
        { id: 'Structured data', title: 'Structured data', icon: LucideIcons.LayoutGrid, description: "Relational tables, spreadsheets, and CSV files." },
        { id: 'Images & Video', title: 'Images & Video', icon: LucideIcons.Image, description: "Photos, recorded videos, and live camera feeds." },
        { id: 'Language', title: 'Language', icon: LucideIcons.Globe, description: "Text documents, transcripts, and spoken audio." },
        { id: 'Time Series', title: 'Time Series', icon: LucideIcons.LineChart, description: "Sequential measurements like stock prices or sensor data." },
    ];

    const isDark = theme.text !== 'text-zinc-900';
    const headerColor = isDark ? 'text-zinc-100' : 'text-gray-800';
    const underlineColor = isDark ? 'bg-cyan-400' : 'bg-blue-500';

    const DatasetOption: React.FC<{ icon: React.ElementType, title: string, description: string, isSelected: boolean, onClick: () => void, theme: Theme }> = ({ icon: IconComponent, title, description, isSelected, onClick, theme }) => {
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
        </div>
    );
};

const DatasetsPageContent: React.FC<{
  datasets: Dataset[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  theme: Theme;
}> = ({
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
      
      <DatasetTypeSelector theme={theme} />

      <div className={`max-w-7xl mx-auto px-8 py-16 ${theme.neutralBg}`}>
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


// App.tsx
const App: React.FC = () => {
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
          borderColor: kpi === KpiKey.REQUESTS ? '#22d3ee' : kpi === KpiKey.LATENCY ? '#2dd4bf' : '#fb923c',
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
  }, [timeRange, getLabels, currentTheme]);

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
          <DatasetsPageContent
            datasets={datasets}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            theme={currentTheme}
          />
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
  }, [activePage, datasets, activeKpi, setActiveKpi, timeRange, setTimeRange, currentTheme, openChartModal, searchTerm, setSearchTerm, filter, setFilter, sort, handleDatasetSort, setActivePage]);

  return (
    <div className={`flex h-screen overflow-hidden font-sans ${currentTheme.app} ${currentTheme.text}`}>
      <Sidebar activePage={activePage} setActivePage={setActivePage} theme={currentTheme} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar
          activePage={activePage}
          cycleTheme={cycleTheme}
          theme={currentTheme}
        />
        <main className="flex-1 overflow-y-auto">
          {renderMainContent}
        </main>
      </div>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={modalTitle}
          chartType={modalChartType}
          chartData={modalChartData as ChartData | DonutDataItem[]}
          chartOptions={modalChartOptions as ChartOptions}
          theme={currentTheme}
        />
      )}
    </div>
  );
};

export default App;

    