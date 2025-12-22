"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import pb from "@/lib/pocketbase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

export default function NewNoticePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        is_pinned: false,
        date: new Date().toISOString().split("T")[0],
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await pb.collection("notices").create(formData);
            router.push("/admin/notices");
        } catch (error) {
            console.error("Error creating notice:", error);
            alert("공지사항 등록에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold">새 공지사항 등록</h1>
                <p className="text-muted-foreground mt-2">
                    새로운 공지사항을 등록합니다.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg border shadow-sm">
                <div className="space-y-2">
                    <Label htmlFor="title">제목</Label>
                    <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                        placeholder="공지사항 제목을 입력하세요"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="is_pinned"
                        checked={formData.is_pinned}
                        onChange={(e) => setFormData({ ...formData, is_pinned: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label htmlFor="is_pinned" className="cursor-pointer">상단 고정 (필독)</Label>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="date">날짜</Label>
                    <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label>내용</Label>
                    <RichTextEditor
                        content={formData.content}
                        onChange={(content) => setFormData({ ...formData, content })}
                        placeholder="공지사항 내용을 입력하세요..."
                    />
                </div>

                <div className="flex gap-4 pt-4">
                    <Button type="button" variant="ghost" onClick={() => router.back()}>
                        취소
                    </Button>
                    <Button type="submit" variant="outline" disabled={loading}>
                        {loading ? "등록 중..." : "등록하기"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
