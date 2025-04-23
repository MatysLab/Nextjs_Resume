'use client';

import React, { useState } from 'react';
import { Plus, Eye, EyeOff, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '@/app/components/ui/dialog';
import { AssetCategory, AssetType } from './asset-category';
import { AssetValue } from './asset-value';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '@/app/firebase/config';
import { useToast } from '@/app/components/ui/use-toast';
import { useRouter } from 'next/navigation';

// Mock data for demo
export interface Asset {
  id: string;
  name: string;
  value: number;
  change?: number;
  type: AssetType;
  details?: string;
}

interface AssetGroup {
  type: AssetType;
  title: string;
  assets: Asset[];
}

const mockAssets: Asset[] = [
  { id: 'stock1', name: 'Apple Inc.', value: 10345.50, change: 2.5, type: 'stocks', details: '25 shares @ $413.82' },
  { id: 'stock2', name: 'Tesla', value: 5621.30, change: -1.2, type: 'stocks', details: '12 shares @ $468.44' },
  { id: 'stock3', name: 'Amazon', value: 8752.65, change: 0.8, type: 'stocks', details: '5 shares @ $1750.53' },
  { id: 'watch1', name: 'Rolex Submariner', value: 12500, change: 5.2, type: 'watches', details: 'Ref. 126610LN' },
  { id: 'watch2', name: 'Omega Speedmaster', value: 6300, change: 1.7, type: 'watches', details: 'Moonwatch Professional' },
  { id: 'bank1', name: 'Chase Savings', value: 15250.25, change: 0.1, type: 'bank', details: 'Savings account' },
  { id: 'bank2', name: 'Wells Fargo Checking', value: 3250.75, change: 0, type: 'bank', details: 'Checking account' },
  { id: 'crypto1', name: 'Bitcoin', value: 22150.80, change: -3.5, type: 'crypto', details: '0.42 BTC' },
  { id: 'crypto2', name: 'Ethereum', value: 7520.30, change: 4.2, type: 'crypto', details: '3.5 ETH' },
  { id: 'cash1', name: 'Home Safe', value: 2000, change: 0, type: 'cash', details: 'Emergency cash' },
  { id: 'collectible1', name: 'Baseball Cards', value: 4500, change: 12, type: 'collectibles', details: 'Vintage collection' }
];

export function PortfolioSection() {
  const [assets, setAssets] = useState<Asset[]>(mockAssets);
  const [hideValues, setHideValues] = useState(false);
  const [showAddAssetDialog, setShowAddAssetDialog] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isListingAsset, setIsListingAsset] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // Group assets by type
  const assetGroups: AssetGroup[] = Object.entries(
    assets.reduce((groups, asset) => {
      if (!groups[asset.type]) {
        groups[asset.type] = [];
      }
      groups[asset.type].push(asset);
      return groups;
    }, {} as Record<AssetType, Asset[]>)
  ).map(([type, assets]) => ({
    type: type as AssetType,
    title: type.charAt(0).toUpperCase() + type.slice(1),
    assets
  }));

  // Calculate totals
  const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);

  const handleAddAsset = (asset: Asset) => {
    setAssets(prev => [...prev, asset]);
    setShowAddAssetDialog(false);
  };

  // Quick sell an asset to marketplace
  const quickSellAsset = async () => {
    if (!selectedAsset) return;
    if (!auth.currentUser) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to list items.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsListingAsset(true);
      
      // Add document to Firestore marketplace collection
      await addDoc(collection(db, 'marketplace'), {
        name: selectedAsset.name,
        description: `${selectedAsset.name} - ${selectedAsset.details || 'No additional details'}`,
        price: selectedAsset.value,
        category: getMarketplaceCategory(selectedAsset.type),
        imageUrl: '', // In a real app, you'd use a default image based on the asset type
        sellerName: auth.currentUser.displayName || 'Anonymous',
        sellerAvatar: auth.currentUser.photoURL || '',
        sellerId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      });
      
      toast({
        title: "Item Listed",
        description: `${selectedAsset.name} has been successfully listed in the marketplace.`,
      });
      
      setSelectedAsset(null);
      
      // Direct user to boutique
      router.push('/boutique');
      
    } catch (error) {
      console.error("Error listing item:", error);
      toast({
        title: "Error",
        description: "Failed to list your item. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsListingAsset(false);
    }
  };

  // Map asset types to marketplace categories
  const getMarketplaceCategory = (type: AssetType): string => {
    switch (type) {
      case 'collectibles':
        return 'Collectible';
      case 'watches':
        return 'Antique';
      case 'stocks':
        return 'Stock';
      case 'crypto':
        return 'Crypto';
      default:
        return 'Other';
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg shadow-lg p-5">
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold">Asset Overview</h2>
            <AssetValue 
              value={totalValue} 
              size="lg" 
              className="mt-1" 
            />
          </div>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="flex items-center gap-1"
              onClick={() => setHideValues(!hideValues)}
            >
              {hideValues ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              {hideValues ? 'Show Values' : 'Hide Values'}
            </Button>
            <Dialog open={showAddAssetDialog} onOpenChange={setShowAddAssetDialog}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="flex items-center gap-1">
                  <Plus className="h-4 w-4" /> Add Asset
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Asset</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  {/* This would be a form in a real implementation */}
                  <p className="text-gray-400">Asset form would go here in a real implementation</p>
                  <Button
                    onClick={() => {
                      handleAddAsset({
                        id: `new-${Date.now()}`,
                        name: 'New Asset',
                        value: 1000,
                        type: 'other',
                      });
                    }}
                  >
                    Add Asset
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="mt-2 space-y-3">
          {assetGroups.map(group => (
            <AssetCategory 
              key={group.type} 
              title={group.title} 
              type={group.type}
              total={group.assets.reduce((sum, asset) => sum + asset.value, 0)}
              hideValues={hideValues}
              defaultOpen={group.type === 'stocks' || group.type === 'collectibles'}
            >
              <div className="space-y-3">
                {group.assets.map(asset => (
                  <div key={asset.id} className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{asset.name}</div>
                      {asset.details && <div className="text-xs text-gray-400">{asset.details}</div>}
                    </div>
                    <div className="flex items-center gap-2">
                      <AssetValue 
                        value={asset.value} 
                        change={asset.change} 
                        hideValues={hideValues}
                      />
                      
                      {/* Quick Sell button for collectibles */}
                      {(asset.type === 'collectibles' || asset.type === 'watches') && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-amber-500 border-amber-500/30 hover:bg-amber-500/10"
                          onClick={() => setSelectedAsset(asset)}
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          Quick Sell
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </AssetCategory>
          ))}
        </div>
      </div>

      {/* Quick Sell Dialog */}
      <Dialog 
        open={!!selectedAsset} 
        onOpenChange={(open) => !open && setSelectedAsset(null)}
      >
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Quick Sell to Boutique</DialogTitle>
            <DialogDescription className="text-gray-400">
              {selectedAsset?.name} will be listed for sale at market price (${selectedAsset?.value}).
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="bg-gray-800 p-4 rounded-md">
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Item:</span>
                <span className="font-medium">{selectedAsset?.name}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Market Price:</span>
                <span className="font-medium text-amber-500">${selectedAsset?.value.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Category:</span>
                <span className="font-medium">
                  {selectedAsset?.type ? selectedAsset.type.charAt(0).toUpperCase() + selectedAsset.type.slice(1) : ''}
                </span>
              </div>
            </div>
            
            <p className="text-sm text-gray-400 mt-3">
              By listing this item, it will be immediately available in the boutique marketplace for potential buyers to purchase.
            </p>
          </div>
          
          <DialogFooter>
            <Button 
              variant="ghost" 
              onClick={() => setSelectedAsset(null)}
              disabled={isListingAsset}
            >
              Cancel
            </Button>
            <Button 
              onClick={quickSellAsset}
              disabled={isListingAsset}
              className="bg-amber-600 hover:bg-amber-700"
            >
              {isListingAsset ? 'Listing...' : 'List on Boutique'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 