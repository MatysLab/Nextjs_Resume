'use client';

import React from 'react';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

export const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white p-3 rounded-md shadow-lg">
        <p className="text-sm font-medium">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-xs">
            {entry.name}: 
            <span className={
              entry.dataKey === 'gain' ? 'text-green-400' : 
              entry.dataKey === 'loss' ? 'text-red-400' : 
              entry.dataKey === 'investment' ? 'text-yellow-400' : 
              entry.dataKey === 'worth' ? 'text-blue-400' : 
              'text-gray-300'
            }>
              {' '}{entry.value}
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
}; 