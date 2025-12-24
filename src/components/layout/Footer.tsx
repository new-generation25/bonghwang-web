export function Footer() {
    return (
        <footer className="py-12 bg-background text-foreground border-t border-border">
            <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-sm font-medium">
                    © 2025 Bonghwangdae Cooperative. All rights reserved.
                </div>
                <div className="flex gap-4 text-sm text-muted-foreground">
                    <a href="https://www.instagram.com/gimhae.dmo/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Instagram</a>
                    <a href="https://blog.naver.com/bonghwang-dae" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Blog</a>
                    <a href="mailto:contact@bonghwangdae.com" className="hover:text-foreground transition-colors">Email</a>
                </div>
            </div>
        </footer>
    );
}
