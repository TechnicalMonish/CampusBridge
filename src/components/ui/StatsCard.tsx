
import React, { ReactNode } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  description, 
  icon,
  trend 
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center">
          {icon && (
            <div className="bg-lms-blue-light p-3 rounded-full mr-4">
              {React.cloneElement(icon as React.ReactElement, { 
                className: "h-6 w-6 text-lms-blue" 
              })}
            </div>
          )}
          <div>
            <div className="flex items-center">
              <h3 className="text-2xl font-semibold">{value}</h3>
              
              {trend && (
                <div className={`flex items-center ml-2 text-sm ${
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {trend.isPositive ? (
                    <ArrowUp className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDown className="h-3 w-3 mr-1" />
                  )}
                  {trend.value}%
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500">
              {title} {description && <span className="text-xs opacity-75">{description}</span>}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
