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
  const trendRotationClass = data.changeType === 'negative' ? 'rotate-180' : '';

  return (
    <div
      onClick={onClick}
      className={`relative p-4 rounded-2xl cursor-pointer transition-all overflow-hidden ${
        theme.kpiCard
      } ${
        isActive
          ? 'ring-2 ring-blue-500/70 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
          : 'shadow-md hover:-translate-y-0.5'
      }`}
    >
      <div
        className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-blue-500"
        style={{ opacity: isActive ? 1 : 0.7 }}
      ></div>
      <div className="flex items-start justify-between pt-2">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-full bg-cyan-500/10">
            <Icon
              name={data.icon}
              className="w-4 h-4 text-sm"
              style={{ color: data.color }}
            />
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

export default KpiCard;
