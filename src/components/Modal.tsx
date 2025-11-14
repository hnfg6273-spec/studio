'use client';
import React, { useCallback, useMemo } from 'react';
import { ChartData, ChartOptions } from 'chart.js';
import { KpiKey, TimeRange, Theme, BaseChartSeries, TrendingChartSeries } from '@/lib/types';
import { CHART_DATA, DONUT_DATA } from '@/lib/mock-data';
import Icon from './Icon';
import ChartRenderer from './ChartRenderer';
import DonutChartRecharts from './DonutChartRecharts';

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

export default Modal;
