"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import pb from "@/lib/pocketbase";

export default function AdminPage() {
    const router = useRouter();

    useEffect(() => {
        // 로그인 여부 확인
        if (pb.authStore.isValid) {
            // 로그인 되어 있으면 대시보드로
            router.replace("/admin/dashboard");
        } else {
            // 로그인 안 되어 있으면 로그인 페이지로
            router.replace("/admin/login");
        }
    }, [router]);

    return (
        <div className="flex min-h-screen items-center justify-center">
            <p>리다이렉트 중...</p>
        </div>
    );
}

