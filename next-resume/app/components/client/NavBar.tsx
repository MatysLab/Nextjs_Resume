'use client'
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import Image from 'next/image';
import { auth } from '@/app/lib/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import LoginButton from "@/app/auth/components/LoginButton";
import RegisterButton from "@/app/auth/components/RegisterButton";
import BoutiqueDropDown from "./BoutiqueDropDown";

interface NavBarProps {
    onNavLinkClick?: (sectionId: string) => void;
}

const NavBar: React.FC<NavBarProps> = ({ onNavLinkClick }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });
        return () => unsubscribe();
    }, []);

    const handleNavLink = (sectionId: string) => {
        if (onNavLinkClick) {
            onNavLinkClick(sectionId);
        }
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchSubmit = () => {
        console.log('Search submitted:', searchTerm);
        // Implement actual search functionality here
    };

    const navLinks = [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'services', label: 'Services' },
        { id: 'about', label: 'About Us' },
        { id: 'support', label: 'Support' },
        { id: 'projects', label: 'Projects' },
    ];

    return (
        <div className="relative">
            <nav className="hidden md:flex items-center ml-6 gap-4">
                {navLinks.map((link) => (
                    <button
                        key={link.id}
                        onClick={() => handleNavLink(link.id)}
                        className="text-gray-300 hover:text-white hover:bg-slate-800 px-4 py-2 rounded-2xl transition-colors duration-200 bg-transparent border-none"
                    >
                        {link.label}
                    </button>
                ))}
                
                <BoutiqueDropDown title="Boutique" onMenuItemClick={handleNavLink} />
                
                <div className="flex items-center">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-48 sm:w-64 md:w-auto bg-slate-800 text-white border-slate-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 rounded-2xl p-2"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSearchSubmit();
                            }
                        }}
                    />
                    <button
                        onClick={handleSearchSubmit}
                        aria-label="Search"
                        className="text-gray-300 hover:text-white bg-transparent border-none p-2"
                    >
                        <Search className="h-5 w-5" />
                    </button>
                    
                    <div className="ml-4 flex flex-grow space-x-4 right-0">
                        <div className="flex flex-grow space-x-4">
                            {!user ? (
                                <>
                                    <LoginButton />
                                    <RegisterButton />
                                </>
                            ) : (<section/>)}
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default NavBar;