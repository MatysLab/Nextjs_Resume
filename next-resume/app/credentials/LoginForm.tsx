'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { FaGoogle } from 'react-icons/fa';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth, googleProvider } from '@/app/firebase/config';
import { useRouter } from "next/navigation";
import { signInWithPopup } from 'firebase/auth';

const LoginForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await signInWithEmailAndPassword(formData.email, formData.password);
            if (res?.user) {
                router.push('/dashboard');
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            if (result.user) {
                router.push('/dashboard');
            }
        } catch (error) {
            console.error('Google login error:', error);
        }
    };

    const providers = [
        { 
            name: 'Google', 
            icon: <FaGoogle className="text-red-500" />, 
            bg: 'white/10', 
            hoverBg: 'white/20',
            onClick: handleGoogleLogin
        },
    ];

    return (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <motion.input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
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

            <div className="text-right text-sm text-blue-400 cursor-pointer hover:underline w-fit self-end transition-colors duration-200">
                Forgot password?
            </div>

            <motion.button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 transition rounded-md py-2 text-white font-semibold cursor-pointer shadow-md hover:shadow-lg hover:scale-105 duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                Log In
            </motion.button>

            <div className="flex items-center my-6">
                <hr className="flex-grow border-gray-700" />
                <span className="mx-2 text-gray-400 text-sm">or</span>
                <hr className="flex-grow border-gray-700" />
            </div>

            {providers.map((provider) => (
                <motion.button
                    key={provider.name}
                    type="button"
                    onClick={provider.onClick}
                    className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 transition-colors text-white rounded-md py-2 w-full font-medium border border-gray-700 shadow-md hover:shadow-lg hover:scale-102 duration-300 cursor-pointer"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <span className="w-5 h-5 flex items-center justify-center">
                        {provider.icon}
                    </span>
                    Sign in with {provider.name}
                </motion.button>
            ))}
        </form>
    );
};

export default LoginForm; 