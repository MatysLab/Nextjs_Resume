'use client';

import { motion } from 'framer-motion';
import RegisterForm from '../components/RegisterForm';

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
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
