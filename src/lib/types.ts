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
