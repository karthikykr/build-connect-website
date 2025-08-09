import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon?: ReactNode;
  className?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export function StatCard({ 
  title, 
  value, 
  change, 
  icon, 
  className,
  trend = 'neutral'
}: StatCardProps) {
  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-success';
      case 'down':
        return 'text-error';
      default:
        return 'text-text-secondary';
    }
  };

  const getChangeColor = () => {
    if (!change) return '';
    return change.type === 'increase' ? 'text-success' : 'text-error';
  };

  return (
    <Card className={cn('p-6', className)}>
      <CardContent className="p-0">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-text-secondary mb-1">
              {title}
            </p>
            <p className="text-2xl font-bold text-text-primary">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            {change && (
              <p className={cn('text-sm mt-1', getChangeColor())}>
                {change.type === 'increase' ? '+' : '-'}{Math.abs(change.value)}%
                <span className="text-text-secondary ml-1">from last month</span>
              </p>
            )}
          </div>
          {icon && (
            <div className={cn('p-3 rounded-lg bg-primary/10', getTrendColor())}>
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
