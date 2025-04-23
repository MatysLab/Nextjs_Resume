'use client'
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * DropdownMenu Component
 *
 * A customizable dropdown menu for navigation or displaying options.
 *
 * @param {object} props - The component's properties.
 * @param {string} props.title - The title/label of the dropdown button.
 * @param {function} props.onMenuItemClick - Callback function to handle menu item clicks.
 */
const BoutiqueDropdownMenu = ({ title, onMenuItemClick }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const largeBentoItems = [
        {
            name: 'Pokemon',
            imageUrl: 'https://collectablepowergrading.com/wp-content/uploads/2023/01/Screenshot-2022-12-11-163835.png',
            altText: 'Pokemon Cards',
        },
        {
            name: 'Watches',
            imageUrl: 'https://assaleh.ca/cdn/shop/files/T137.410.11.041.00.png?v=1707420848',
            altText: 'Luxury Watch',
        },
    ];

    const rightGridItems = [
        { name: 'Collectibles' },
        { name: 'TCG Cards' },
        { name: 'Cars' },
        { name: 'New Arrivals' },
        { name: 'Featured' },
        { name: 'Sale' },
        { name: 'Gift Cards' },
        { name: 'Accessories' },
        { name: 'Brands' },
        { name: 'Services' },
        { name: 'Blog' },
        { name: 'Contact' },
    ];

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLinkClick = (e, itemName) => {
        e.preventDefault();
        onMenuItemClick(itemName);
        setIsOpen(false);
    };

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <div>
                <button
                    type="button"
                    className="inline-flex justify-center w-full rounded-md border border-transparent text-gray-300 shadow-sm px-4 py-2 bg-transparent text-sm font-medium hover:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-offset-gray-100 focus:ring-amber-200 items-center transition-colors duration-150"
                    id="options-menu"
                    aria-haspopup="true"
                    aria-expanded={isOpen}
                    onClick={toggleDropdown}
                >
                    {title}
                    <ChevronDown
                        className={`-mr-1 ml-2 h-5 w-5 transition-transform duration-200 ${
                            isOpen ? 'transform rotate-180' : ''
                        }`}
                        aria-hidden="true"
                    />
                </button>
            </div>

            {isOpen && (
                <div
                    className={`origin-top absolute left-1/2 transform -translate-x-1/2 mt-6 w-[56rem] max-w-4xl rounded-lg shadow-2xl bg-slate-950 ring-1 ring-black ring-opacity-5 focus:outline-none z-10 transition ease-out duration-200 ${
                        isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                    } overflow-hidden`}
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="options-menu"
                >
                    <div className="flex h-full" role="none">
                        <div className="w-2/3 p-3 flex gap-3">
                            {largeBentoItems.map((item) => (
                                <a
                                    key={item.name}
                                    href="#"
                                    onClick={(e) => handleLinkClick(e, item.name)}
                                    className="block relative rounded-md overflow-hidden group shadow-md hover:shadow-xl transition-all duration-300 ease-in-out w-1/2 aspect-[4/3] hover:-translate-y-1"
                                    role="menuitem"
                                >
                                    <img
                                        src={item.imageUrl}
                                        alt={item.altText}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src =
                                                'https://placehold.co/400x300/cccccc/ffffff?text=Image+Not+Found';
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-opacity-30 group-hover:bg-opacity-10 transition-opacity duration-300 flex items-end justify-start p-3">
                    <span className="text-gray-300 text-lg font-semibold drop-shadow-md">
                      {item.name}
                    </span>
                                    </div>
                                </a>
                            ))}
                        </div>

                        <div className="w-1/3 p-3 border-l border-gray-800">
                            <div className="grid grid-cols-2 grid-rows-6 gap-x-4 gap-y-1 h-full">
                                {rightGridItems.map((item) => (
                                    <a
                                        key={item.name}
                                        href="#"
                                        onClick={(e) => handleLinkClick(e, item.name)}
                                        className="block px-2 py-1.5 rounded text-gray-200 text-sm hover:bg-blue-800 hover:text-white transition-colors duration-150 truncate"
                                        role="menuitem"
                                        title={item.name}
                                    >
                                        {item.name}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BoutiqueDropdownMenu;
