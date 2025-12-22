'use client';

import { motion } from 'framer-motion';

export function Hero() {
    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black text-white">
            {/* Background Layer - Placeholder for Video/Image */}
            <div className="absolute inset-0 bg-neutral-900 opacity-80 z-0">
                {/* TODO: Add video or image here */}
                <div className="w-full h-full bg-[url('https://placehold.co/1920x1080/1a1a1a/FFF')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
            </div>

            <div className="relative z-10 text-center px-6">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex flex-wrap text-3xl md:text-5xl font-bold tracking-tighter mb-4"
                >
                    로컬의 시간을 잇다,
                    <br />
                    <span className="text-accent">봉황대협동조합</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                    className="text-xs md:text-base text-gray-300 font-normal tracking-wider mt-4"
                >
                    CONNECTING LOCAL TIME, BONGHWANGDAE COOPERATIVE
                </motion.p>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce"
            >
                <span className="text-xs text-gray-400 tracking-widest uppercase">Scroll Down</span>
            </motion.div>
        </section>
    );
}
