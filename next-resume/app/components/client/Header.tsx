'use client'
import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import ProfileMenu from "./ProfileMenu";
import { auth } from "@/app/firebase/config";
import { User } from "firebase/auth";

const Header = () => {
    const [user, setUser] = useState<User | null>(null);
    const handleNavLinkClick = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
        });

        return () => unsubscribe();
    }, []);

    return (
        <header className="w-full h-19 bg-slate-950 cursor-default flex pl-4 sm:pl-6 md:pl-10 pr-4 sm:pr-6 md:pr-5 pt-2 sm:pt-0 md:pt-0 items-center border-b border-gray-500 sticky top-0 z-50">
            <div
                className="cursor-pointer flex items-center"
                onClick={() => handleNavLinkClick('home')}
            >
                <img src="/logo.png" alt="logo" className="w-auto h-7 mr-2 sm:mr-3 " />
                <h1 className="font-mono w-fit select-none text-2xl font-bold" style={{ color: '#d1ad6d' }}>
                    NUVAULT.
                </h1>
            </div>
            <div className="flex items-center h-full justify-center w-full">
                <NavBar onNavLinkClick={handleNavLinkClick}/>
            </div>
            <div className="flex items-center space-x-4">
                <h1 className="text-gray-300">EN</h1>
                {user && (
                    <ProfileMenu
                        userEmail={user.email || undefined}
                        userDisplayName={user.displayName || undefined}
                    />
                )}
            </div>
        </header>
    );
};

export default Header;
