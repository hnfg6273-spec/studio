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
        {isModal && <RechartsTooltip />}
      </PieChart>
    </ResponsiveContainer>
  );
};

export default DonutChartRecharts;
