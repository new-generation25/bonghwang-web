import { Button } from '@/components/ui/button';
import Link from 'next/link';
import pb from '@/lib/pocketbase';
import ProjectGallery from '@/components/ProjectGallery';

// Force dynamic rendering as we are fetching data based on ID
export const dynamic = 'force-dynamic';

async function getProject(id: string) {
    try {
        const record = await pb.collection('projects').getOne(id);
        return record;
    } catch (e) {
        console.error("Failed to fetch project:", e);
        return null;
    }
}

export default async function ProjectDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const project = await getProject(id);

    if (!project) {
        return (
            <div className="pt-32 pb-24 px-6 md:px-12 min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
                <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
                <Link href="/projects">
                    <Button variant="link">Back to Projects</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-24 px-6 md:px-12 min-h-screen bg-background text-foreground">
            <div className="container mx-auto max-w-4xl">
                <Link href="/projects">
                    <Button variant="link" className="pl-0 mb-8 text-muted-foreground hover:text-foreground">
                        &larr; Back to Projects
                    </Button>
                </Link>

                <header className="mb-16">
                    <div className="flex items-center gap-4 text-sm font-medium text-accent mb-4">
                        <span>{project.category}</span>
                        <span>•</span>
                        <span>{project.year}</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-8">{project.title}</h1>
                </header>

                <article className="prose dark:prose-invert max-w-none mb-16">
                    <div dangerouslySetInnerHTML={{ __html: project.description }} />
                </article>

                <section>
                    <ProjectGallery
                        images={project.images || []}
                        projectId={project.id}
                        projectTitle={project.title}
                    />
                </section>
            </div>
        </div>
    );
}
