'use client';
import React, { useState, useMemo, useCallback } from 'react';
import {
  Dataset,
  KpiKey,
  TimeRange,
  Theme,
  KpiDataItem,
  Page,
  SortState,
  BaseChartSeries,
  TrendingChartSeries,
} from '@/lib/types';
import { CHART_DATA, DONUT_DATA } from '@/lib/mock-data';
import { getIcon, getStatusClass, formatDate, parseMetric } from '@/lib/utils';
import KpiCard from './KpiCard';
import ChartRenderer from './ChartRenderer';
import DonutChartRecharts from './DonutChartRecharts';
import Icon from './Icon';
import { ChartData, ChartOptions } from 'chart.js';

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
            className={`rounded-2xl p-6 shadow-sm border h-full ${theme.kpiCard} border-zinc-800`}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-xl font-bold ${theme.title}`}>New Datasets</h2>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Icon
                    name="Search"
                    className="w-4 h-4 text-zinc-400 absolute top-1/2 left-3 -translate-y-1/2"
                  />
                  <input
                    type="text"
                    placeholder="Search Here"
                    value={dashboardSearchTerm}
                    onChange={(e) => setDashboardSearchTerm(e.target.value)}
                    className={`pl-8 pr-4 py-2 w-48 rounded-lg border focus:outline-none focus:ring-1 focus:border-blue-500 ${theme.searchBg} ${theme.searchBorder} ${theme.text}`}
                  />
                </div>
                <div className="relative">
                  <button className="flex items-center space-x-2 text-sm font-medium rounded-lg px-4 py-2 transition-colors bg-blue-600 text-white hover:bg-blue-700">
                    <span>Sort By: Last Updated ↓</span>
                    <Icon name="ChevronDown" className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y border-zinc-800">
                <thead className={`${theme.table}/50`}>
                  <tr>
                    {['Name', 'Type', 'Status', 'Records', 'Size', 'Last Updated'].map(
                      (header) => (
                        <th
                          key={header}
                          className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400"
                        >
                          {header}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody
                  className={`${theme.table.replace(
                    'border-[#126C86]/50',
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
          <div className={`rounded-2xl p-6 shadow-sm border h-full ${theme.kpiCard}`}>
            <h3 className={`text-xl font-bold mb-6 ${theme.title}`}>
              Trending Datasets
            </h3>
            <div className="space-y-4">
              {trendingDatasets.length > 0 ? (
                trendingDatasets.map((ds) => (
                  <div key={ds.id} className="flex items-center space-x-4">
                    <div className="p-2 rounded-full bg-blue-50 text-blue-600">
                      <Icon name={getIcon(ds.type)} className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className={`text-sm font-semibold ${theme.tableCell}`}>
                        {ds.name}
                      </div>
                      <div className={`text-xs ${theme.tableCellSubtle}`}>{ds.type}</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium text-green-600`}>
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

export default DashboardPage;
