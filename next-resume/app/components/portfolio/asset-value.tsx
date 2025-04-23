'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AssetValueProps {
  value: number;
  currency?: string;
  change?: number;
  hideValues?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function AssetValue({
  value,
  currency = '$',
  change,
  hideValues = false,
  size = 'md',
  className = ''
}: AssetValueProps) {
  // Format value based on size
  const formatValue = (val: number) => {
    if (val >= 1000000) {
      return (val / 1000000).toFixed(2) + 'M';
    } else if (val >= 1000) {
      return (val / 1000).toFixed(2) + 'K';
    }
    return val.toFixed(2);
  };

  const getFormattedValue = () => {
    if (hideValues) {
      // Create masked value with similar length
      const valueStr = value.toString();
      return '*'.repeat(Math.min(valueStr.length, 6));
    }
    return formatValue(value);
  };

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-xl',
    lg: 'text-3xl font-bold'
  };

  const changeColor = change && change > 0 ? 'text-green-500' : 'text-red-500';

  return (
    <div className={`flex items-center ${className}`}>
      <div className={`${sizeClasses[size]} font-semibold`}>
        {currency}{getFormattedValue()}
      </div>
      {change !== undefined && !hideValues && (
        <motion.div 
          className={`ml-2 ${changeColor} text-sm`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {change > 0 ? '+' : ''}{change.toFixed(2)}%
        </motion.div>
      )}
    </div>
  );
} 