"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import pb from "@/lib/pocketbase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

export default function EditNoticePage() {
    const router = useRouter();
    const params = useParams(); // params is a promise in recent Next.js versions, but useParams hook returns the params object directly? Wait, in Next 15+ params prop is a promise, but useParams() hook returns Params. Let's assume standard behavior or fix if needed. Next 15: useParams returns ReadonlyURLSearchParams. actually it returns `Params`.
    // Wait, Next.js 15 breaking changes: cookies(), headers(), params, searchParams are async in layouts/pages. But `useParams` hook is client side and returns the params immediately.

    const id = params?.id as string;

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        is_pinned: false,
        date: "",
    });

    useEffect(() => {
        const fetchNotice = async () => {
            try {
                const record = await pb.collection("notices").getOne(id, { requestKey: null });
                // PocketBase 날짜 형식: "2025-02-15 00:00:00.000Z" 또는 "2025-02-15T00:00:00.000Z"
                let dateValue = "";
                if (record.date) {
                    // 공백이나 'T'로 분리하여 날짜 부분만 추출
                    dateValue = record.date.split(/[T\s]/)[0];
                }
                setFormData({
                    title: record.title,
                    content: record.content || "",
                    is_pinned: record.is_pinned,
                    date: dateValue,
                });
            } catch (error) {
                console.error("Error fetching notice:", error);
                alert("공지사항을 불러올 수 없습니다.");
                router.push("/admin/notices");
            } finally {
                setFetching(false);
            }
        };

        if (id) {
            fetchNotice();
        }
    }, [id, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await pb.collection("notices").update(id, formData);
            router.push("/admin/notices");
        } catch (error) {
            console.error("Error updating notice:", error);
            alert("공지사항 수정에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div>로딩 중...</div>;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold">공지사항 수정</h1>
                <p className="text-muted-foreground mt-2">
                    공지사항 내용을 수정합니다.
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
                        {loading ? "수정 중..." : "수정하기"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
