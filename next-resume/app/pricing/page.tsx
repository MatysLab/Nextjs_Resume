'use client';

import React from 'react';
import { AppLayout } from '@/app/components/ui/app-layout';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

// Feature checking component
const FeatureCheck = ({ available }: { available: boolean }) => {
  return available ? (
    <Check className="h-4 w-4 text-amber-500" />
  ) : (
    <X className="h-4 w-4 text-gray-500" />
  );
};

export default function PricingPage() {
  return (
    <AppLayout currentPage="pricing">
      <div className="container mx-auto px-8 py-12 max-w-6xl">
        {/* Reviews bar */}
        <div className="flex items-center justify-center mb-6 space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg 
              key={star} 
              className="w-5 h-5 text-amber-500" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="text-white font-medium ml-2">4.9/5</span>
          <span className="text-gray-400 mx-2">•</span>
          <span className="text-gray-400">3,532 reviews</span>
        </div>
        
        {/* Page title */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Unlock the full
            <span className="bg-gradient-to-r from-amber-500 to-amber-300 bg-clip-text text-transparent block">
              Finary experience
            </span>
          </h1>
          <p className="text-gray-400 text-lg">
            Join 1,597 Finary members who subscribed this week
          </p>
        </motion.div>
        
        {/* Pricing tiers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Free tier */}
          <motion.div 
            className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="text-gray-400 uppercase text-xs tracking-wider mb-2">Free</div>
                <div className="text-4xl font-bold text-white">$0</div>
                <div className="text-gray-400 mt-1">Free</div>
              </div>
              
              <div className="text-sm text-gray-400 mb-6">
                For investors who are just getting started on their investment journey.
              </div>
              
              <Button variant="outline" className="w-full text-white">
                Continue
              </Button>
            </div>
            
            <div className="p-6 border-t border-gray-800 space-y-3">
              <div className="flex items-center">
                <FeatureCheck available={true} />
                <span className="ml-3 text-gray-300">Link 2 Accounts</span>
              </div>
              <div className="flex items-center">
                <FeatureCheck available={false} />
                <span className="ml-3 text-gray-500">VIP Support</span>
              </div>
              <div className="flex items-center">
                <FeatureCheck available={false} />
                <span className="ml-3 text-gray-500">Fee scanner</span>
              </div>
              <div className="flex items-center">
                <FeatureCheck available={false} />
                <span className="ml-3 text-gray-500">Expense scanner</span>
              </div>
              <div className="flex items-center">
                <FeatureCheck available={false} />
                <span className="ml-3 text-gray-500">Passive income Tracker</span>
              </div>
              <div className="flex items-center">
                <FeatureCheck available={false} />
                <span className="ml-3 text-gray-500">Budgeting</span>
              </div>
              <div className="flex items-center">
                <FeatureCheck available={false} />
                <span className="ml-3 text-gray-500">Family mode</span>
              </div>
              <div className="flex items-center">
                <FeatureCheck available={false} />
                <span className="ml-3 text-gray-500">Reduced Fees on Invest</span>
              </div>
            </div>
          </motion.div>
          
          {/* Lite tier */}
          <motion.div 
            className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="text-gray-400 uppercase text-xs tracking-wider mb-2">Lite</div>
                <div className="text-4xl font-bold text-white">$1.05<span className="text-lg font-normal">/week</span></div>
                <div className="text-gray-400 mt-1">$54.99/year</div>
              </div>
              
              <div className="text-sm text-gray-400 mb-6">
                Built for investors who want to track their Accounts automatically.
              </div>
              
              <Button variant="outline" className="w-full text-white">
                Continue
              </Button>
            </div>
            
            <div className="p-6 border-t border-gray-800 space-y-3">
              <div className="flex items-center">
                <FeatureCheck available={true} />
                <span className="ml-3 text-gray-300">Link unlimited Accounts</span>
              </div>
              <div className="flex items-center">
                <FeatureCheck available={true} />
                <span className="ml-3 text-gray-300">VIP Support</span>
              </div>
              <div className="flex items-center">
                <FeatureCheck available={false} />
                <span className="ml-3 text-gray-500">Fee scanner</span>
              </div>
              <div className="flex items-center">
                <FeatureCheck available={false} />
                <span className="ml-3 text-gray-500">Expense scanner</span>
              </div>
              <div className="flex items-center">
                <FeatureCheck available={false} />
                <span className="ml-3 text-gray-500">Passive income Tracker</span>
              </div>
              <div className="flex items-center">
                <FeatureCheck available={false} />
                <span className="ml-3 text-gray-500">Budgeting</span>
              </div>
              <div className="flex items-center">
                <FeatureCheck available={false} />
                <span className="ml-3 text-gray-500">Family mode</span>
              </div>
              <div className="flex items-center">
                <FeatureCheck available={false} />
                <span className="ml-3 text-gray-500">Reduced Fees on Invest</span>
              </div>
            </div>
          </motion.div>
          
          {/* Plus tier */}
          <motion.div 
            className="bg-gradient-to-br from-amber-900/40 to-gray-900 rounded-xl border border-amber-700/50 overflow-hidden relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div className="absolute top-0 right-0 left-0 bg-amber-500 text-black text-xs font-medium text-center py-1">
              MOST POPULAR
            </div>
            
            <div className="p-6 pt-10">
              <div className="text-center mb-6">
                <div className="text-amber-500 uppercase text-xs tracking-wider mb-2">Plus</div>
                <div className="text-4xl font-bold text-white">$2.88<span className="text-lg font-normal">/week</span></div>
                <div className="text-gray-400 mt-1">$149.99/year</div>
              </div>
              
              <div className="text-sm text-gray-400 mb-6">
                Designed for investors who want to track and supercharge their net worth.
              </div>
              
              <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                Continue
              </Button>
            </div>
            
            <div className="p-6 border-t border-amber-900/50 space-y-3">
              <div className="flex items-center">
                <FeatureCheck available={true} />
                <span className="ml-3 text-gray-300">Link unlimited Accounts</span>
              </div>
              <div className="flex items-center">
                <FeatureCheck available={true} />
                <span className="ml-3 text-gray-300">VIP Support</span>
              </div>
              <div className="flex items-center">
                <FeatureCheck available={true} />
                <span className="ml-3 text-gray-300">Fee scanner</span>
              </div>
              <div className="flex items-center">
                <FeatureCheck available={true} />
                <span className="ml-3 text-gray-300">Expense scanner</span>
              </div>
              <div className="flex items-center">
                <FeatureCheck available={true} />
                <span className="ml-3 text-gray-300">Passive income Tracker</span>
              </div>
              <div className="flex items-center">
                <FeatureCheck available={true} />
                <span className="ml-3 text-gray-300">Budgeting</span>
              </div>
              <div className="flex items-center">
                <FeatureCheck available={true} />
                <span className="ml-3 text-gray-300">Family mode</span>
              </div>
              <div className="flex items-center">
                <FeatureCheck available={false} />
                <span className="ml-3 text-gray-500">Reduced Fees on Invest</span>
              </div>
            </div>
          </motion.div>
          
          {/* Pro tier */}
          <motion.div 
            className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="text-gray-400 uppercase text-xs tracking-wider mb-2">Pro</div>
                <div className="text-4xl font-bold text-white">$6.73<span className="text-lg font-normal">/week</span></div>
                <div className="text-gray-400 mt-1">$349.99/year</div>
              </div>
              
              <div className="text-sm text-gray-400 mb-6">
                For savvy investors looking to manage both professional & personal assets.
              </div>
              
              <Button variant="outline" className="w-full text-white">
                Continue
              </Button>
            </div>
            
            <div className="p-6 border-t border-gray-800 space-y-3">
              <div className="flex items-center">
                <FeatureCheck available={true} />
                <span className="ml-3 text-gray-300">Link unlimited Accounts</span>
              </div>
              <div className="flex items-center">
                <FeatureCheck available={true} />
                <span className="ml-3 text-gray-300">VIP Support</span>
              </div>
              <div className="flex items-center">
                <FeatureCheck available={true} />
                <span className="ml-3 text-gray-300">Fee scanner</span>
              </div>
              <div className="flex items-center">
                <FeatureCheck available={true} />
                <span className="ml-3 text-gray-300">Expense scanner</span>
              </div>
              <div className="flex items-center">
                <FeatureCheck available={true} />
                <span className="ml-3 text-gray-300">Passive income Tracker</span>
              </div>
              <div className="flex items-center">
                <FeatureCheck available={true} />
                <span className="ml-3 text-gray-300">Budgeting</span>
              </div>
              <div className="flex items-center">
                <FeatureCheck available={true} />
                <span className="ml-3 text-gray-300">Family mode</span>
              </div>
              <div className="flex items-center">
                <FeatureCheck available={true} />
                <span className="ml-3 text-gray-300">Reduced Fees on Invest</span>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Testimonial */}
        <motion.div 
          className="bg-gray-900/50 rounded-xl p-8 border border-gray-800 text-center max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <svg className="w-6 h-6 text-amber-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
          </svg>
          <p className="text-gray-300 text-lg mb-4">
            "I've tried many portfolio trackers, but Finary's interface and features are by far the best. It's made managing my assets so much easier."
          </p>
          <div className="font-medium text-white">Sarah M.</div>
          <div className="text-sm text-gray-400">Plus Member • 2 years</div>
        </motion.div>
      </div>
    </AppLayout>
  );
} 