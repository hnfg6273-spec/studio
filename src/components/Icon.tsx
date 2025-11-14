'use client';
import React from 'react';
import * as LucideIcons from 'lucide-react';

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

export default Icon;
