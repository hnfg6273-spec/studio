'use client';
import React, { useEffect, useRef } from 'react';
import Chart, { ChartConfiguration, ChartType, ChartData, ChartOptions } from 'chart.js/auto';
import { CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend);

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

export default ChartRenderer;
