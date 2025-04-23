'use client';

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Banknote, ArrowUpRight } from 'lucide-react';

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: { active?: boolean, payload?: any[], label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white p-3 rounded-md shadow-lg">
        <p className="text-sm font-medium">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-xs">
            {entry.name}: <span className={entry.dataKey === 'gain' ? 'text-green-400' : entry.dataKey === 'investment' ? 'text-yellow-400' : 'text-blue-400'}>{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

interface WorthBlockProps {
  data: Array<{
    name: string;
    worth: number;
  }>;
  ytdChange?: number; // Year-to-date percentage change
  className?: string;
  title?: string;
  description?: string;
}

export default function WorthBlock({ 
  data, 
  ytdChange = 25, 
  className = '',
  title = "Your Worth in Assets",
  description = "Total value of your assets over time"
}: WorthBlockProps) {
  return (
    <Card className={`bg-gray-900 border-gray-800 shadow-lg ${className} h-full`}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
          <Banknote className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription className="text-gray-400">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorWorth" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis dataKey="name" tick={{ fill: '#9ca3af' }} />
            <YAxis tick={{ fill: '#9ca3af' }} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="worth" stroke="#8884d8" fillOpacity={1} fill="url(#colorWorth)" />
          </AreaChart>
        </ResponsiveContainer>
        <div className="mt-4 flex items-center gap-2">
          <ArrowUpRight className="h-4 w-4 text-green-500" />
          <span className="text-sm font-medium text-green-500">+{ytdChange}% (YTD)</span>
        </div>
      </CardContent>
    </Card>
  );
} 