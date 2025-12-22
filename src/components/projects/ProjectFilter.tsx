'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ProjectFilterProps {
    categories: string[];
    activeCategory: string;
    onSelect: (category: string) => void;
}

export function ProjectFilter({ categories, activeCategory, onSelect }: ProjectFilterProps) {
    return (
        <div className="flex flex-wrap gap-2 justify-center mb-12">
            <Button
                variant="ghost"
                onClick={() => onSelect('All')}
                className={cn(
                    "rounded-full px-6 transition-all",
                    activeCategory === 'All' ? "bg-foreground text-background hover:bg-foreground/90" : "text-muted-foreground hover:text-foreground"
                )}
            >
                All
            </Button>
            {categories.map((category) => (
                <Button
                    key={category}
                    variant="ghost"
                    onClick={() => onSelect(category)}
                    className={cn(
                        "rounded-full px-6 transition-all",
                        activeCategory === category ? "bg-foreground text-background hover:bg-foreground/90" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    {category}
                </Button>
            ))}
        </div>
    );
}
