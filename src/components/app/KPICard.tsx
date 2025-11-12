"use client";

import * as React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LucideProps } from 'lucide-react';

type KPICardProps = {
    title: string;
    value: string;
    change: string;
    changeType: 'positive' | 'negative';
    icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
    onSelect: (key: string) => void;
    isActive: boolean;
    cardKey: string;
    gradient: string;
    iconBgLight: string;
    iconColor: string;
    activeRing: string;
    activeShadow: string;
};

export default function KPICard({
    title, value, change, changeType, icon: Icon, onSelect, isActive, cardKey,
    gradient, iconBgLight, iconColor, activeRing, activeShadow
}: KPICardProps) {
    const ChangeIcon = TrendingUp;
    const changeColor = changeType === 'positive' ? 'text-green-500' : 'text-red-500';
    const changeIconClass = changeType === 'positive' ? '' : 'rotate-180';

    return (
        <motion.div
            onClick={() => onSelect(cardKey)}
            className={cn(
                "relative p-4 rounded-2xl cursor-pointer transition-all overflow-hidden",
                "bg-card/90 border border-border",
                isActive
                    ? `ring-2 ${activeRing} ${activeShadow}`
                    : 'shadow-md hover:-translate-y-0.5'
            )}
            whileHover={{ translateY: -2 }}
            transition={{ type: "spring", stiffness: 300 }}
        >
            <div
                className={cn(`absolute top-0 left-0 right-0 h-1 ${gradient}`, isActive ? "opacity-100" : "opacity-70")}
            ></div>

            <div className="flex items-start justify-between pt-2">
                <span className="text-sm font-medium text-muted-foreground">{title}</span>
                <div className={cn("p-2 rounded-full", iconBgLight)}>
                    <Icon className={cn("w-4 h-4", iconColor)} />
                </div>
            </div>

            <div className="mt-2">
                <h2 className="text-2xl font-bold text-white">{value}</h2>
                <div className="flex items-center text-xs mt-1 space-x-1">
                    <div className={cn("flex items-center space-x-1", changeColor)}>
                        <ChangeIcon className={cn("w-3.5 h-3.5", changeIconClass)} />
                        <span>{change}</span>
                    </div>
                    <span className="text-muted-foreground">vs last month</span>
                </div>
            </div>
        </motion.div>
    );
}
