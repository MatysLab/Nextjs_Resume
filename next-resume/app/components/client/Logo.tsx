// Logo.tsx
'use client'; // This directive makes sure that the component runs on the client-side

import { useRouter } from 'next/navigation'; // Correct import for client-side routing in Next.js 13+

const Logo = () => {
    const router = useRouter(); // Accessing the Next.js router

    const handleNavLinkClick = (page: string) => {
        if (page === 'home') {
            router.push('/'); // Navigates to the home page
        }
    };

    return (
        <div
            className="cursor-pointer flex items-center"
            onClick={() => handleNavLinkClick('home')}
        >
            <img src="/logo.png" alt="logo" className="w-auto h-7 mr-2 sm:mr-3" />
            <h1 className="font-mono w-fit select-none text-2xl font-bold" style={{ color: '#d1ad6d' }}>
                NUVAULT.
            </h1>
        </div>
    );
};

export default Logo;
