'use client';

import React, { useState } from 'react';
import { motion as m } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';  // Next.js App Router uses 'next/navigation'
import Link from 'next/link';
import Logo from '../../components/Logo';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';

const RegisterPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false,
        acceptNews: false,
        assetValue: '',
    });
    const [showTerms, setShowTerms] = useState(false);
    const [error, setError] = useState<string | null>(null);  // Error state for validation

    const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const router = useRouter();  // This will now be available in the client-side

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);  // Reset error state before validation

        // Check for password mismatch
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match!');
            return;
        }

        // Check if terms and conditions are accepted
        if (!formData.acceptTerms) {
            setError('You must agree to the Terms and Conditions.');
            return;
        }

        setLoading(true);
        try {
            const res = await createUserWithEmailAndPassword(formData.email, formData.password);

            if (res.user) {
                router.push('/credentials');
            }
        } catch (error) {
            console.error("Error creating user:", error.code, error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleTermsClick = () => {
        setShowTerms(true);
    };

    const handleCloseTerms = () => {
        setShowTerms(false);
    };

    return (
        <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="flex items-center justify-center h-screen bg-gradient-to-br from-black via-gray-900 to-black"
        >
            <div className="w-full flex justify-center p-4 fixed top-0 left-0 z-10">
                <Logo />
            </div>
            <div className="flex justify-center w-full">
                {/* Register Form */}
                <div className={`bg-black/80 backdrop-filter backdrop-blur-lg rounded-2xl p-8 sm:p-10 w-80 sm:w-96 lg:w-[25rem] shadow-2xl border border-gray-800 text-white transition-transform duration-500`}>
                    <h1 className="text-2xl sm:text-3xl font-semibold mb-4 text-white">
                        Create Your Account <br />
                        <span className="text-blue-400">on NuVault</span>
                    </h1>
                    <p className="text-sm text-gray-400 mb-6">
                        Join us to track, sell, and grow your collection.
                    </p>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {error && (
                            <div className="bg-red-600 p-4 mt-4 rounded-lg text-white text-sm">
                                <p>{error}</p>
                                {error === 'Passwords do not match!' && (
                                    <ul className="mt-2 list-disc pl-5 text-sm">
                                        <li>Ensure passwords match</li>
                                    </ul>
                                )}
                                {error === 'You must agree to the Terms and Conditions.' && (
                                    <ul className="mt-2 list-disc pl-5 text-xs">
                                        <li>Check the box to agree to the "Terms and Conditions" before proceeding.</li>
                                    </ul>
                                )}
                            </div>
                        )}
                        <m.input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            className="bg-gray-800 border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder:text-gray-400 transition-all duration-300"
                            whileFocus={{ scale: 1.02 }}
                            whileHover={{ borderColor: '#60a5fa' }}
                        />
                        <m.input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                            className="bg-gray-800 border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder:text-gray-400 transition-all duration-300"
                            whileFocus={{ scale: 1.02 }}
                            whileHover={{ borderColor: '#60a5fa' }}
                        />
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                className="bg-gray-800 border border-gray-700 rounded-md px-4 py-2 w-full pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder:text-gray-400 transition-all duration-300"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer hover:text-gray-300 transition-colors"
                                title={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="bg-gray-800 border border-gray-700 rounded-md px-4 py-2 w-full pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder:text-gray-400 transition-all duration-300"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer hover:text-gray-300 transition-colors"
                                title={showConfirmPassword ? 'Hide password' : 'Show password'}
                            >
                                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>

                        {/* Dropdown for Asset Value */}
                        <div className="relative">
                            <select
                                name="assetValue"
                                value={formData.assetValue}
                                onChange={handleChange}
                                className="bg-gray-800 border border-gray-700 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder:text-gray-400 transition-all duration-300"
                            >
                                <option value="" disabled>What's your total asset value</option>
                                <option value="under_100">Under $100</option>
                                <option value="500_1000">$500 - $1,000</option>
                                <option value="1000_5000">$1,000 - $5,000</option>
                                <option value="5000_10000">$5,000 - $10,000</option>
                                <option value="10000_100000">$10,000 - $100,000</option>
                                <option value="above_100000">Above $100,000</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                            <input
                                type="checkbox"
                                name="acceptTerms"
                                checked={formData.acceptTerms}
                                onChange={handleChange}
                                className="text-blue-400"
                            />
                            <label className="text-sm text-gray-400">
                                I agree to the <span onClick={handleTermsClick} className="text-blue-400 hover:underline cursor-pointer">Terms and Conditions</span>
                            </label>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                            <input
                                type="checkbox"
                                name="acceptNews"
                                checked={formData.acceptNews}
                                onChange={handleChange}
                                className="text-blue-400"
                            />
                            <label className="text-sm text-gray-400">I want to receive news and updates.</label>
                        </div>
                        <m.button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 transition rounded-md py-2 text-white font-semibold cursor-pointer shadow-md hover:shadow-lg hover:scale-102 duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {loading ? 'Registering...' : 'Register'}
                        </m.button>
                    </form>

                    <p className="text-sm text-center text-gray-400 mt-8">
                        Already have an account?{' '}
                        <Link href="/credentials" className="text-blue-400 hover:underline transition-colors duration-200">
                            Log in
                        </Link>
                    </p>
                </div>

                {/* Terms and Conditions Box */}
                {showTerms && (
                    <div className="bg-black/80 backdrop-filter backdrop-blur-lg rounded-2xl p-8 sm:p-10 w-120 sm:w-126 lg:w-[29rem] shadow-2xl border border-gray-800 text-white transition-transform duration-500 mt-4">
                        <h1 className="text-2xl sm:text-3xl font-semibold mb-4 text-white">Terms and Conditions</h1>
                        <p className="text-sm text-gray-400 mb-6">
                            {/* Your Terms and Conditions content here */}
                            This is where your full Terms and Conditions content will go. Replace this placeholder text with your actual document.
                        </p>
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={handleCloseTerms}
                                className="bg-blue-500 hover:bg-blue-600 transition py-2 px-4 rounded-md text-white"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </m.div>
    );
};

export default RegisterPage;
