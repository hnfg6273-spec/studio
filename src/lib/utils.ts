import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { DatasetType, DatasetStatus } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
