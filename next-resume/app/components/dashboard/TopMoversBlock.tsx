'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { TrendingUp, TrendingDown, Clock } from 'lucide-react';

interface MoverItem {
  name: string;
  value: number;
}

interface TopMoversListProps {
  title: string;
  data: MoverItem[];
  valueKey: string;
  colorClass: string;
  icon?: React.ReactNode;
}

const TopMoversList = ({ title, data, valueKey, colorClass, icon }: TopMoversListProps) => {
  return (
    <Card className="bg-gray-900 border-gray-800 shadow-lg h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {data.map((item, index) => (
            <li key={index} className="flex justify-between items-center text-gray-300">
              <span>{item.name}</span>
              <span className={colorClass}>
                {item.value.toFixed(2)}%
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

interface TopMoversBlockProps {
  gainers: MoverItem[];
  losers: MoverItem[];
  slow: MoverItem[];
  className?: string;
}

export default function TopMoversBlock({ 
  gainers, 
  losers, 
  slow,
  className = ''
}: TopMoversBlockProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${className}`}>
      <TopMoversList
        title="Top Gainers"
        data={gainers}
        valueKey="value"
        colorClass="text-green-500"
        icon={<TrendingUp className="h-4 w-4 text-green-400" />}
      />
      <TopMoversList
        title="Top Losers"
        data={losers}
        valueKey="value"
        colorClass="text-red-500"
        icon={<TrendingDown className="h-4 w-4 text-red-400" />}
      />
      <TopMoversList
        title="Slowest Increase"
        data={slow}
        valueKey="value"
        colorClass="text-yellow-500"
        icon={<Clock className="h-4 w-4 text-yellow-400" />}
      />
    </div>
  );
} 