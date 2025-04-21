'use client'
import React, {useState} from 'react';
import {Search, Menu, X} from 'lucide-react';
import LoginButton from "./connection/LoginButton";
import RegisterButton from "./connection/RegisterButton"; // Added X icon for closing menu
import BoutiqueDropDown from "./BoutiqueDropDown";

interface NavBarProps {
    onNavLinkClick?: (sectionId: string) => void;
}

const NavBar: React.FC<NavBarProps> = ({onNavLinkClick}) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const handleNavLink = (sectionId: string) => {
        if (onNavLinkClick) {
            onNavLinkClick(sectionId);
        }
        setIsMobileMenuOpen(false);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchSubmit = () => {
        console.log('Search submitted:', searchTerm);
        // Implement actual search functionality here
    };

    return (
        <div className="relative">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center ml-6 gap-4">
                <button
                    onClick={() => handleNavLink('dashboard')}
                    className="text-gray-300 hover:text-white hover:bg-slate-800 px-4 py-2 rounded-2xl transition-colors duration-200 bg-transparent border-none"
                >
                    Dashboard
                </button>
                <button
                    onClick={() => handleNavLink('services')}
                    className="text-gray-300 hover:text-white hover:bg-slate-800 px-4 py-2 rounded-2xl transition-colors duration-200 bg-transparent border-none"
                >
                    Services
                </button>
                <button
                    onClick={() => handleNavLink('about')}
                    className="text-gray-300 hover:text-white hover:bg-slate-800 px-4 py-2 rounded-2xl transition-colors duration-200 bg-transparent border-none"
                >
                    About Us
                </button>
                <button
                    onClick={() => handleNavLink('support')}
                    className="text-gray-300 hover:text-white hover:bg-slate-800 px-4 py-2 rounded-2xl transition-colors duration-200 bg-transparent border-none"
                >
                    Support
                </button>
                <button
                    onClick={() => handleNavLink('projects')}
                    className="text-gray-300 hover:text-white hover:bg-slate-800 px-4 py-2 rounded-2xl transition-colors duration-200 bg-transparent border-none"
                >
                    Projects
                </button>
                <BoutiqueDropDown title="Boutique" onMenuItemClick={handleNavLink}/>
                {/* Search Bar */}
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
                        <Search className="h-5 w-5"/>
                    </button>
                    <div className="ml-4 flex flex-grow space-x-4 right-0">
                        <div className="flex flex-grow space-x-4">
                            <LoginButton/>
                            <RegisterButton/>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default NavBar;