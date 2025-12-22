"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import pb from "@/lib/pocketbase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            await pb.admins.authWithPassword(email, password);
            router.push("/admin/dashboard");
        } catch (err) {
            console.error(err);
            setError("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md space-y-8 rounded-lg border bg-white p-8 shadow-sm">
                <div className="text-center">
                    <h2 className="text-2xl font-bold tracking-tight">관리자 로그인</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        관리자 계정으로 로그인하세요.
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="email">이메일</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="admin@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">비밀번호</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && (
                        <div className="rounded bg-red-50 p-3 text-sm text-red-500">
                            {error}
                        </div>
                    )}

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "로그인 중..." : "로그인"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
