'use client';

import { motion } from 'framer-motion';
import RegisterForm from '../components/RegisterForm';
import Logo from '@/app/components/client/Logo';

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <div className="w-full flex justify-center p-4 fixed top-0 left-0 z-10">
                <Logo />
            </div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <RegisterForm />
            </motion.div>
        </div>
    );
}
