'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Gem, ArrowUpRight, ArrowDownRight } from 'lucide-react';

// Reuse the same CustomTooltip from WorthBlock or import it from a shared file
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

interface GainBlockProps {
  data: Array<{
    name: string;
    gain: number;
    investment: number;
  }>;
  gainChange?: number; // Percentage change for gain
  investmentChange?: number; // Percentage change for investment
  className?: string;
  title?: string;
  description?: string;
}

export default function GainBlock({ 
  data, 
  gainChange = 15, 
  investmentChange = -5,
  className = '',
  title = "Project Gain Over Time",
  description = "Track your project gains and investments"
}: GainBlockProps) {
  return (
    <Card className={`bg-gray-900 border-gray-800 shadow-lg ${className} h-full`}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
          <Gem className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription className="text-gray-400">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis dataKey="name" tick={{ fill: '#9ca3af' }} />
            <YAxis tick={{ fill: '#9ca3af' }} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="gain" stroke="#82ca9d" strokeWidth={2} name="Gain" />
            <Line type="monotone" dataKey="investment" stroke="#ffc658" strokeWidth={2} name="Investment" />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center gap-1">
            <ArrowUpRight className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium text-green-500">Gain: +{gainChange}%</span>
          </div>
          <div className="flex items-center gap-1">
            {investmentChange >= 0 ? (
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            ) : (
              <ArrowDownRight className="h-4 w-4 text-red-500" />
            )}
            <span className={`text-sm font-medium ${investmentChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              Investment: {investmentChange >= 0 ? '+' : ''}{investmentChange}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 