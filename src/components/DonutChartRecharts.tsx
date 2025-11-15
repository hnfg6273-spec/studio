'use client';
import React, { useCallback } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip } from 'recharts';
import { DonutDataItem, Theme } from '@/lib/types';

interface DonutChartRechartsProps {
  data: DonutDataItem[];
  theme: Theme;
  isModal?: boolean;
}

const RADIAN = Math.PI / 180;

const DonutChartRecharts: React.FC<DonutChartRechartsProps> = ({ data, theme, isModal = false }) => {
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

export default DonutChartRecharts;

    