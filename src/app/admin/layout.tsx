"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import pb from "@/lib/pocketbase";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        // Check if user is logged in
        const checkAuth = () => {
            if (pb.authStore.isValid && pb.authStore.model?.collectionName === '_superusers') {
                setIsValid(true);
                if (pathname === "/admin/login") {
                    router.push("/admin/dashboard");
                }
            } else {
                setIsValid(false);
                if (pathname !== "/admin/login") {
                    router.push("/admin/login");
                }
            }
        };

        checkAuth();

        // Listen to changes in the auth store
        return pb.authStore.onChange(() => {
            checkAuth();
        });
    }, [router, pathname]);

    const handleLogout = () => {
        pb.authStore.clear();
        router.push("/admin/login");
    };

    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    if (!isValid) {
        return null; // Or a loading spinner
    }

    return (
        <div className="flex min-h-screen flex-col">
            <header className="border-b bg-white">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <div className="flex items-center gap-6">
                        <h1 className="text-xl font-bold">봉황대 관리자</h1>
                        <nav className="flex gap-4">
                            <Link
                                href="/admin/dashboard"
                                className="text-sm font-medium hover:text-primary transition-colors"
                            >
                                대시보드
                            </Link>
                            <Link
                                href="/admin/notices"
                                className="text-sm font-medium hover:text-primary transition-colors"
                            >
                                공지사항 관리
                            </Link>
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">{pb.authStore.model?.email}</span>
                        <Button variant="outline" size="sm" onClick={handleLogout}>
                            로그아웃
                        </Button>
                    </div>
                </div>
            </header>
            <main className="flex-1 bg-gray-50/50 p-6">
                <div className="container mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
