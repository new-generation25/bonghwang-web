import { Button } from '@/components/ui/button';
import Link from 'next/link';
import pb from '@/lib/pocketbase';

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

export default async function ProjectDetail({ params }: { params: { id: string } }) {
    const project = await getProject(params.id);

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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-y border-border py-8">
                        <div>
                            <span className="block text-sm text-muted-foreground mb-1">Client</span>
                            <span className="font-medium">{project.client}</span>
                        </div>
                        {/* Role field is not in schema but requested in design. We can add it later or omit. */}
                        {/* <div>
                <span className="block text-sm text-muted-foreground mb-1">Role</span>
                <span className="font-medium">Planning, Design, Operation</span>
             </div> */}
                    </div>
                </header>

                <article className="prose dark:prose-invert max-w-none mb-16">
                    <div dangerouslySetInnerHTML={{ __html: project.description }} />
                </article>

                <section>
                    <h3 className="text-2xl font-bold mb-8">Gallery</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {project.images && project.images.map((image: string, index: number) => (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                key={index}
                                src={pb.files.getUrl(project, image)}
                                alt={`Gallery ${index + 1}`}
                                className="w-full h-auto rounded-lg object-cover aspect-video bg-secondary/20"
                            />
                        ))}
                        {(!project.images || project.images.length === 0) && (
                            <div className="col-span-full py-12 text-center text-muted-foreground bg-secondary/20 rounded-lg">
                                No images available
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}
