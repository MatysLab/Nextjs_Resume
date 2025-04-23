'use client'
import React, { Suspense } from 'react';
import LoginForm from './LoginForm';
import Logo from '../components/client/Logo';
import { motion as m } from 'framer-motion';

const LoginPage = () => {
    return (
        <m.div initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               transition={{ duration: 1 }}
               className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-black via-gray-900 to-black"
        >
            <div className="w-full flex justify-center p-4 fixed top-0 left-0 z-10">
                <Logo />
            </div>
            <div className="bg-black/80 backdrop-filter backdrop-blur-lg rounded-2xl p-8 sm:p-10 w-80 sm:w-96 lg:w-[23rem] shadow-2xl border border-gray-800 text-white">
                <h1 className="text-2xl sm:text-3xl font-semibold mb-4 text-white">
                    Welcome Back <br />
                    <span className="text-blue-400">to NuVault</span>
                </h1>
                <p className="text-sm text-gray-400 mb-6">
                    Track, Sell, and grow your collection.
                </p>
                <Suspense fallback={<div>Loading...</div>}>
                    <LoginForm />
                </Suspense>
                <p className="text-sm text-center text-gray-400 mt-8">
                    Don't have an account?{' '}
                    <a
                        href="/auth/register"
                        className="text-blue-400 hover:underline transition-colors duration-200"
                    >
                        Create one
                    </a>
                </p>
            </div>
        </m.div>
    );
};

export default LoginPage; 