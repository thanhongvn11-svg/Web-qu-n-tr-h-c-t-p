import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'blue' | 'green' | 'amber' | 'rose' | 'purple' | 'white';
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'blue',
  trend,
  onClick,
}) => {
  const variantStyles: Record<
    string,
    { bg: string; text: string; title: string; iconBg: string; border?: string }
  > = {
    blue: {
      bg: 'bg-[#1677FF]',
      text: 'text-white',
      title: 'text-blue-100',
      iconBg: 'bg-white/20 text-white',
    },
    green: {
      bg: 'bg-[#10B981]',
      text: 'text-white',
      title: 'text-emerald-100',
      iconBg: 'bg-white/20 text-white',
    },
    amber: {
      bg: 'bg-[#F59E0B]',
      text: 'text-white',
      title: 'text-amber-100',
      iconBg: 'bg-white/20 text-white',
    },
    rose: {
      bg: 'bg-[#EF4444]',
      text: 'text-white',
      title: 'text-rose-100',
      iconBg: 'bg-white/20 text-white',
    },
    purple: {
      bg: 'bg-[#7C5CFC]',
      text: 'text-white',
      title: 'text-purple-100',
      iconBg: 'bg-white/20 text-white',
    },
    white: {
      bg: 'bg-white',
      text: 'text-[#172B4D]',
      title: 'text-[#6B7A90]',
      iconBg: 'bg-blue-50 text-[#1677FF]',
      border: 'border border-[#E3ECF8]',
    },
  };

  const style = variantStyles[variant];

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-2xl shadow-xs transition-all duration-200 ${style.bg} ${
        style.text
      } ${style.border || ''} ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-md' : ''
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-xl ${style.iconBg} flex items-center justify-center`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-2xl font-black tracking-tight leading-none">{value}</div>
          <div className={`text-xs font-medium mt-1 truncate ${style.title}`}>{title}</div>
        </div>
      </div>
      {(subtitle || trend) && (
        <div className="mt-2.5 pt-2 border-t border-white/20 flex items-center justify-between text-xs">
          {subtitle && <span className="opacity-90">{subtitle}</span>}
          {trend && (
            <span
              className={`font-semibold flex items-center gap-1 ${
                variant === 'white'
                  ? trend.isPositive
                    ? 'text-emerald-600'
                    : 'text-rose-600'
                  : 'text-white'
              }`}
            >
              {trend.value}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
