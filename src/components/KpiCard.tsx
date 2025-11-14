'use client';
import React from 'react';
import { KpiDataItem, Theme } from '@/lib/types';
import Icon from './Icon';

interface KpiCardProps {
  data: KpiDataItem;
  isActive: boolean;
  onClick: () => void;
  theme: Theme;
  isTrendingCard?: boolean;
}

const KpiCard: React.FC<KpiCardProps> = ({
  data,
  isActive,
  onClick,
  theme,
  isTrendingCard = false,
}) => {
  const trendIcon = data.changeType === 'positive' ? 'TrendingUp' : 'TrendingDown';
  const trendColorClass =
    data.changeType === 'positive' ? 'text-green-500' : 'text-red-500';

  const getBorderColor = () => {
    if (!isActive) return 'border-zinc-800';
    if (data.title === 'Total Requests') return 'border-cyan-400';
    if (data.title === 'Trending Datasets') return 'border-purple-500';
    if (data.title === 'Avg. Response') return 'border-teal-400';
    if (data.title === 'Concurrent Users') return 'border-orange-400';
    return 'border-blue-500/70';
  };

  return (
    <div
      onClick={onClick}
      className={`relative p-6 rounded-2xl cursor-pointer transition-all duration-300 ease-in-out bg-zinc-900/50 border ${getBorderColor()} ${
        isActive
          ? 'shadow-lg'
          : 'shadow-md hover:-translate-y-0.5'
      }`}
    >
      <div
        className={`absolute top-0 left-0 right-0 h-1 rounded-t-xl`}
        style={{
          background: isActive
            ? `radial-gradient(ellipse at top, ${data.color}20, transparent 70%)`
            : 'transparent',
        }}
      ></div>

      <div className="flex items-start justify-between">
        <span className="text-sm font-medium text-zinc-400">{data.title}</span>
        <Icon name={data.icon} className="w-5 h-5" style={{ color: data.color }} />
      </div>

      <div className="mt-4">
        <h2 className="text-4xl font-bold text-white">{data.value}</h2>
      </div>

      <div className="flex items-center text-xs mt-4 space-x-1">
        <div className={`flex items-center space-x-1 ${trendColorClass}`}>
          <Icon name={trendIcon} className="w-3.5 h-3.5" />
          <span>{data.change}</span>
        </div>
        <span className="text-zinc-400">{isTrendingCard ? 'of all datasets' : 'vs last month'}</span>
      </div>
    </div>
  );
};

export default KpiCard;
