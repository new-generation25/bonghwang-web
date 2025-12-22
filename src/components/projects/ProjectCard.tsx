'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

interface Project {
    id: string;
    title: string;
    category: string;
    year: number;
    thumbnail?: string; // URL
}

interface ProjectCardProps {
    project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
    return (
        <Link href={`/projects/${project.id}`}>
            <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="group relative break-inside-avoid mb-6 overflow-hidden rounded-lg bg-secondary/20 cursor-pointer"
            >
                {/* Placeholder for Thumb */}
                <div className="aspect-[4/3] w-full bg-neutral-200 dark:bg-neutral-800 object-cover transition-transform duration-500 group-hover:scale-105 flex items-center justify-center text-muted-foreground">
                    {project.thumbnail ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-xs">No Image</span>
                    )}
                </div>

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <span className="text-accent text-xs font-bold tracking-widest uppercase mb-1">{project.category}</span>
                    <h3 className="text-white text-xl font-bold">{project.title}</h3>
                    <span className="text-gray-300 text-sm mt-1">{project.year}</span>
                </div>
            </motion.div>
        </Link>
    );
}
