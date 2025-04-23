'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog";
import { 
  Building2, LayoutDashboard, Gem, Plus, Store, Share2, Eye, EyeOff, 
  BarChart3, TrendingUp, AreaChart, LineChart, Gift, BarChart4, Home, 
  SquareUserRound, Boxes, Settings, Wallet, BadgeDollarSign, CircleDollarSign,
  Grid, List
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { auth } from '@/app/firebase/config';
import { AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import Link from 'next/link';
import { AppLayout } from '@/app/components/ui/app-layout';
import { Drawer, DrawerGroup } from '@/app/components/ui/drawer';
import { PortfolioSection } from '@/app/components/portfolio/portfolio-section';
import { GalleryView, sampleMarketplaceItems } from '@/app/components/marketplace/gallery-view';

// Import data
import { 
  assetWorthData, 
  projectGainData, 
  topGainersData, 
  topLosersData, 
  slowIncreaseData, 
  collectiblesData 
} from '@/app/data/dashboardData';

// Import components
import WorthBlock from '@/app/components/dashboard/WorthBlock';
import GainBlock from '@/app/components/dashboard/GainBlock';
import TopMoversBlock from '@/app/components/dashboard/TopMoversBlock';
import CollectiblesBlock from '@/app/components/dashboard/CollectiblesBlock';
import MarketplacePage from '@/app/components/marketplace/MarketplacePage';

// Helper function to combine classnames
const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [activePeriod, setActivePeriod] = useState('7D');
  const [categoryFilter, setCategoryFilter] = useState('All categories');
  const [isSSR, setIsSSR] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hideValues, setHideValues] = useState(false);
  const [sections, setSections] = useState<string[]>(['worth', 'performance', 'portfolio', 'movers', 'marketplace']);
  const [isAddSectionDialogOpen, setIsAddSectionDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const router = useRouter();

  // Check auth state on component mount
  useEffect(() => {
    setIsSSR(false);
    
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        router.push('/credentials');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  // Format date
  const getCurrentDate = () => {
    const date = new Date();
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Add a section to the dashboard
  const addSection = (sectionType: string) => {
    setSections(prev => [...prev, sectionType]);
    setIsAddSectionDialogOpen(false);
  };

  // Remove a section from the dashboard
  const removeSection = (sectionType: string) => {
    setSections(prev => prev.filter(type => type !== sectionType));
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 text-white">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-white"></div>
      </div>
    );
  }

  const periods = [
    { id: '1D', label: '1D' },
    { id: '7D', label: '7D' },
    { id: '1M', label: '1M' },
    { id: 'YTD', label: 'YTD' },
    { id: '1Y', label: '1Y' },
    { id: 'ALL', label: 'ALL' },
  ];

  const renderSection = (sectionType: string) => {
    switch(sectionType) {
      case 'worth':
        return (
          <Drawer 
            key={sectionType}
            title={
              <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-amber-500" />
                <span>Asset Worth</span>
              </div>
            }
            initiallyOpen={true}
          >
            <div>
              <div className="text-sm text-gray-500">{getCurrentDate()}</div>
              <div className={`text-3xl font-bold ${hideValues ? 'text-transparent bg-gray-700 rounded' : ''}`} style={{ visibility: hideValues ? 'hidden' : 'visible' }}>
                {!hideValues ? '$19,929' : '******'}
              </div>
              
              <div className="h-[150px] mt-4 flex items-end">
                {/* Simplified chart representation */}
                <div className="w-full h-[80%] relative overflow-hidden rounded">
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-500/5 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-amber-500/30"></div>
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-[60%]"
                    style={{
                      background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(245,158,11,0.1) 100%)",
                      clipPath: "polygon(0 100%, 5% 80%, 10% 85%, 15% 70%, 20% 75%, 25% 60%, 30% 65%, 35% 55%, 40% 70%, 45% 60%, 50% 50%, 55% 55%, 60% 45%, 65% 60%, 70% 50%, 75% 70%, 80% 60%, 85% 65%, 90% 55%, 95% 60%, 100% 40%, 100% 100%)"
                    }}
                  ></div>
                  <div
                    className="absolute bottom-0 left-0 right-0 border-t-2 border-amber-500"
                    style={{
                      height: "1px",
                      clipPath: "polygon(0 0, 5% 20%, 10% 15%, 15% 30%, 20% 25%, 25% 40%, 30% 35%, 35% 45%, 40% 30%, 45% 40%, 50% 50%, 55% 45%, 60% 55%, 65% 40%, 70% 50%, 75% 30%, 80% 40%, 85% 35%, 90% 45%, 95% 40%, 100% 60%)"
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </Drawer>
        );
      case 'performance':
        return (
          <Drawer 
            key={sectionType}
            title={
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-amber-500" />
                <span>Project Gain</span>
              </div>
            }
            initiallyOpen={true}
          >
            <div className="flex flex-col items-start">
              <div className="mb-1 text-gray-400 text-sm">7 days P&L</div>
              <div className="flex items-center mb-3">
                <div className={`text-2xl font-bold text-red-500 mr-2 ${hideValues ? 'text-transparent bg-gray-700 rounded' : ''}`} style={{ visibility: hideValues ? 'hidden' : 'visible' }}>
                  {!hideValues ? '-$96' : '****'}
                </div>
                <div className="text-red-500 text-sm">-0.48%</div>
              </div>
              <div className="text-xs text-gray-400 max-w-xs">
                Unrealized capital gain is the variation in your performance over
                the selected period. This amount does not include realized capital
                gains.
              </div>
              <Button variant="link" className="text-amber-400 text-xs mt-4 p-0 h-auto">
                See how it works
              </Button>
            </div>
          </Drawer>
        );
      case 'portfolio':
        return (
          <Drawer 
            key={sectionType}
            title={
              <div className="flex items-center gap-2">
                <CircleDollarSign className="h-5 w-5 text-amber-500" />
                <span>Portfolio</span>
              </div>
            }
            initiallyOpen={true}
          >
            <PortfolioSection />
          </Drawer>
        );
      case 'movers':
        return (
          <Drawer 
            key={sectionType}
            title={
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-amber-500" />
                <span>My Movers</span>
              </div>
            }
            initiallyOpen={true}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {/* Mover Card */}
              <div className="bg-[#181818] border border-gray-800 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center text-blue-300">D</div>
                  <div className="font-medium">Disnat</div>
                  <div className="text-xs text-gray-500 ml-auto">#1</div>
                </div>
                <div className={`text-2xl font-bold ${hideValues ? 'text-transparent bg-gray-700 rounded' : ''}`} style={{ visibility: hideValues ? 'hidden' : 'visible' }}>
                  {!hideValues ? '$1,365' : '******'}
                </div>
                <div className="flex items-center text-red-500 text-sm mt-1">
                  <span>{hideValues ? '****' : '-$96'}</span>
                  <span className="ml-1">-6.99%</span>
                </div>
                <div className="h-10 mt-2 relative">
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-[1px]"
                    style={{
                      background: "linear-gradient(90deg, transparent 0%, red 100%)"
                    }}
                  ></div>
                </div>
              </div>
              
              {/* Additional movers would be added here */}
            </div>
          </Drawer>
        );
      case 'marketplace':
        return (
          <Drawer 
            key={sectionType}
            title={
              <div className="flex items-center gap-2">
                <Store className="h-5 w-5 text-amber-500" />
                <span>Marketplace</span>
              </div>
            }
            initiallyOpen={true}
          >
            <div className="mb-4 flex justify-between">
              <h3 className="text-lg font-medium">Featured Items</h3>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(viewMode === 'grid' ? 'bg-gray-800' : 'bg-transparent')}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(viewMode === 'list' ? 'bg-gray-800' : 'bg-transparent')}
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <GalleryView
              items={sampleMarketplaceItems.slice(0, 4)}
              onItemClick={(item) => console.log('Item clicked:', item)}
            />
            <div className="mt-4 text-center">
              <Button variant="outline" className="text-amber-400 border-amber-500/50">
                View All Marketplace Items
              </Button>
            </div>
          </Drawer>
        );
      default:
        return null;
    }
  };

  // Main render
  return (
    <AppLayout currentPage="dashboard">
      <div className="p-6">
        {/* Dashboard header section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
            <p className="text-gray-400">{getCurrentDate()}</p>
          </div>
          
          <div className="flex mt-4 md:mt-0 space-x-2">
            <div className="bg-gray-900 rounded-lg p-1 flex space-x-1">
              {periods.map((period) => (
                <button
                  key={period.id}
                  className={cn(
                    "px-3 py-1 text-sm font-medium rounded-md transition-colors",
                    activePeriod === period.id 
                      ? "bg-amber-600 text-white" 
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  )}
                  onClick={() => setActivePeriod(period.id)}
                >
                  {period.label}
                </button>
              ))}
            </div>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => setHideValues(!hideValues)}
              title={hideValues ? "Show values" : "Hide values"}
            >
              {hideValues ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        
        {/* Dashboard content */}
        <div className="mb-6">
          {sections.map(sectionType => renderSection(sectionType))}
        </div>
        
        {/* Add Section button */}
        <div className="mt-6">
          <Dialog open={isAddSectionDialogOpen} onOpenChange={setIsAddSectionDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Add Section
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-800 text-white">
              <DialogHeader>
                <DialogTitle>Add Section to Dashboard</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Select a section to add to your dashboard
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
                <button
                  className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-800 hover:border-amber-500 transition-colors"
                  onClick={() => addSection('worth')}
                >
                  <Wallet className="h-10 w-10 text-amber-500 mb-2" />
                  <span className="font-medium">Asset Worth</span>
                </button>
                <button
                  className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-800 hover:border-amber-500 transition-colors"
                  onClick={() => addSection('performance')}
                >
                  <TrendingUp className="h-10 w-10 text-amber-500 mb-2" />
                  <span className="font-medium">Project Gain</span>
                </button>
                <button
                  className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-800 hover:border-amber-500 transition-colors"
                  onClick={() => addSection('portfolio')}
                >
                  <CircleDollarSign className="h-10 w-10 text-amber-500 mb-2" />
                  <span className="font-medium">Portfolio</span>
                </button>
                <button
                  className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-800 hover:border-amber-500 transition-colors"
                  onClick={() => addSection('movers')}
                >
                  <BarChart3 className="h-10 w-10 text-amber-500 mb-2" />
                  <span className="font-medium">Movers</span>
                </button>
                <button
                  className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-800 hover:border-amber-500 transition-colors"
                  onClick={() => addSection('marketplace')}
                >
                  <Store className="h-10 w-10 text-amber-500 mb-2" />
                  <span className="font-medium">Marketplace</span>
                </button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </AppLayout>
  );
} 