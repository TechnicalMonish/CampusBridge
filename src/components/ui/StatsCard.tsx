
import React, { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  description,
  trend,
  className
}) => {
  return (
    <Card className={cn("p-6 card-hover", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          
          {trend && (
            <div className="flex items-center mt-1">
              <span className={cn(
                "text-xs font-medium",
                trend.isPositive ? "text-green-600" : "text-red-600"
              )}>
                {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
              </span>
              {description && (
                <span className="text-xs text-gray-500 ml-1">
                  {description}
                </span>
              )}
            </div>
          )}
          
          {!trend && description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
        
        {icon && (
          <div className="p-3 rounded-full bg-lms-blue-light text-lms-blue">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatsCard;
