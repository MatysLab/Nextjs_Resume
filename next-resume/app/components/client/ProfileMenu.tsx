'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/app/firebase/config';
import { motion, AnimatePresence } from 'framer-motion';

interface ProfileMenuProps {
    userEmail?: string;
    userDisplayName?: string;
    userPhoto?: string;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ userEmail, userDisplayName, userPhoto }) => {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const menuItems = [
        { name: 'Portfolio', href: '/portfolio' },
        { name: 'Settings', href: '/settings' },
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'Orders', href: '/orders' },
        { name: 'Get Help', href: '/help' },
        { name: 'Refer Friends & Rewards', href: '/refer' },
        { name: 'Linked Accounts', href: '/linked-accounts' },
        { name: 'Security', href: '/security' },
    ];

    const getInitials = (name: string = '') => {
        const parts = name.split(' ');
        return parts
            .map(part => part[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const getRandomGradient = () => {
        const gradients = [
            'from-blue-500 to-purple-600',
            'from-green-500 to-teal-600',
            'from-yellow-500 to-orange-600',
            'from-pink-500 to-red-600',
            'from-indigo-500 to-blue-600',
        ];
        return gradients[Math.floor(Math.random() * gradients.length)];
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push('/');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold focus:outline-none cursor-pointer"
            >
                {getInitials(userDisplayName)}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-72 bg-slate-900 rounded-lg shadow-xl border border-gray-700 py-2 z-50"
                    >
                        <div className="px-4 py-3 border-b border-gray-700">
                            <div className="flex items-center space-x-3">
                                <div className={`flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r ${getRandomGradient()} text-white font-semibold`}>
                                    {getInitials(userDisplayName)}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white">{userDisplayName || 'User'}</p>
                                    <p className="text-xs text-gray-400">{userEmail}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="py-1">
                            {menuItems.map((item) => (
                                <motion.a
                                    key={item.name}
                                    href={item.href}
                                    whileHover={{ scale: 1.02 }}
                                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-slate-800 hover:text-white"
                                >
                                    {item.name}
                                </motion.a>
                            ))}
                        </div>

                        <div className="border-t border-gray-700 py-1">
                            <motion.button
                                onClick={handleLogout}
                                whileHover={{ scale: 1.02 }}
                                className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-800 hover:text-red-300"
                            >
                                Sign out
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProfileMenu; 