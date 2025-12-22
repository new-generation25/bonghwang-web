'use client';

import { useState, useEffect } from 'react';
import { ProjectFilter } from '@/components/projects/ProjectFilter';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { motion, AnimatePresence } from 'framer-motion';
import pb from '@/lib/pocketbase';
import { RecordModel } from 'pocketbase';

const categories = ['DMO', 'Festival', 'Education', 'Space'];

export default function ProjectsPage() {
    const [activeCategory, setActiveCategory] = useState('All');
    const [projects, setProjects] = useState<RecordModel[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true);
            try {
                const result = await pb.collection('projects').getList(1, 50, {
                    sort: '-year',
                    requestKey: null, // Disable auto-cancellation for React Strict Mode
                });
                setProjects(result.items);
            } catch (error) {
                console.error("Failed to fetch projects:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const filteredProjects = activeCategory === 'All'
        ? projects
        : projects.filter(p => p.category === activeCategory);

    return (
        <div className="pt-32 pb-24 px-6 md:px-12 min-h-screen">
            <div className="container mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">Our Works</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        We create value through connecting people, spaces, and time.
                    </p>
                </div>

                <ProjectFilter
                    categories={categories}
                    activeCategory={activeCategory}
                    onSelect={setActiveCategory}
                />

                {loading ? (
                    <div className="text-center py-24 text-muted-foreground">Loading projects...</div>
                ) : (
                    <motion.div layout className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                        <AnimatePresence>
                            {filteredProjects.map((project) => (
                                <ProjectCard key={project.id} project={{
                                    id: project.id,
                                    title: project.title,
                                    category: project.category,
                                    year: project.year,
                                    // Use getUrl to generate full URL for the thumbnail
                                    thumbnail: project.thumbnail ? pb.files.getUrl(project, project.thumbnail) : undefined
                                }} />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
