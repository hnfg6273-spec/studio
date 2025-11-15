'use client';
import React from 'react';
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { DatasetType } from './types';
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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