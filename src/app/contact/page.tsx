import { ContactForm } from '@/components/contact/ContactForm';

export default function ContactPage() {
    return (
        <div className="pt-32 pb-24 px-6 md:px-12 min-h-screen">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
                    <div>
                        <span className="text-accent text-sm font-bold tracking-widest uppercase mb-2 block">Get in Touch</span>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-8">Contact Us</h1>

                        <div className="space-y-8 mb-12">
                            <div>
                                <h3 className="text-lg font-bold mb-2">Location</h3>
                                <p className="text-muted-foreground whitespace-pre-line">
                                    경상남도 김해시 가락로
                                    봉황대길 123
                                </p>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold mb-2">Contact</h3>
                                <p className="text-muted-foreground">010-1234-5678</p>
                                <p className="text-muted-foreground">contact@bonghwangdae.com</p>
                            </div>
                        </div>

                        {/* Map Placeholder */}
                        <div className="w-full h-64 bg-secondary/50 rounded-lg flex items-center justify-center text-muted-foreground">
                            Map Placeholder (Kakao/Naver)
                        </div>
                    </div>

                    <div className="bg-card border border-border p-8 rounded-lg shadow-sm">
                        <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
                        <ContactForm />
                    </div>
                </div>
            </div>
        </div>
    );
}
