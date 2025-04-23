'use client';

import React, { useState } from 'react';
import { 
  ChevronDown, ChevronRight, Briefcase, Watch, Landmark, 
  TrendingUp, DollarSign, Gift, Diamond 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Define asset types
export type AssetType = 
  | 'stocks' 
  | 'watches' 
  | 'bank' 
  | 'crypto' 
  | 'cash' 
  | 'collectibles' 
  | 'other';

// Icons for each asset type
const assetIcons: Record<AssetType, React.ReactNode> = {
  stocks: <TrendingUp className="h-4 w-4 text-green-400" />,
  watches: <Watch className="h-4 w-4 text-amber-400" />,
  bank: <Landmark className="h-4 w-4 text-blue-400" />,
  crypto: <Diamond className="h-4 w-4 text-purple-400" />,
  cash: <DollarSign className="h-4 w-4 text-emerald-400" />,
  collectibles: <Gift className="h-4 w-4 text-pink-400" />,
  other: <Briefcase className="h-4 w-4 text-gray-400" />
};

interface AssetCategoryProps {
  title: string;
  type: AssetType;
  total: number;
  children: React.ReactNode;
  hideValues?: boolean;
  defaultOpen?: boolean;
}

export function AssetCategory({
  title,
  type,
  total,
  children,
  hideValues = false,
  defaultOpen = false
}: AssetCategoryProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Format total value 
  const formatTotal = (value: number) => {
    if (hideValues) {
      return '*******';
    }

    if (value >= 1000000) {
      return '$' + (value / 1000000).toFixed(2) + 'M';
    } else if (value >= 1000) {
      return '$' + (value / 1000).toFixed(2) + 'K';
    }
    return '$' + value.toFixed(2);
  };

  return (
    <div className="border border-gray-800 rounded-lg mb-3 overflow-hidden bg-gray-900/50">
      <div 
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-800/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center space-x-2">
          {isOpen ? 
            <ChevronDown className="h-4 w-4 text-gray-400" /> : 
            <ChevronRight className="h-4 w-4 text-gray-400" />
          }
          <div className="flex items-center mr-2">
            {assetIcons[type]}
          </div>
          <h3 className="font-medium">{title}</h3>
        </div>
        <div className="text-gray-300 font-semibold">
          {formatTotal(total)}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden bg-gray-900/30"
          >
            <div className="p-3 border-t border-gray-800">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 