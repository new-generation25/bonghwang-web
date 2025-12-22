"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import pb from "@/lib/pocketbase";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

// Define strict type for Notice
interface Notice {
    id: string;
    title: string;
    is_pinned: boolean;
    date: string;
    created: string;
}

export default function NoticesPage() {
    const [notices, setNotices] = useState<Notice[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchNotices = async () => {
        try {
            // getFullList 사용 (getList에서 브라우저 400 에러 발생 문제 우회)
            const items = await pb.collection("notices").getFullList({
                sort: "-date",
                requestKey: null, // React Strict Mode에서 자동 취소 방지
            });
            // Cast the items to Notice[] to match our interface
            setNotices(items as unknown as Notice[]);
        } catch (error) {
            console.error("Error fetching notices:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotices();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("정말 삭제하시겠습니까?")) return;

        try {
            await pb.collection("notices").delete(id);
            fetchNotices(); // Refresh list
        } catch (error) {
            console.error("Error deleting notice:", error);
            alert("삭제 중 오류가 발생했습니다.");
        }
    };

    if (loading) {
        return <div>로딩 중...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">공지사항 관리</h1>
                <Link href="/admin/notices/new">
                    <Button>새 공지사항 등록</Button>
                </Link>
            </div>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">상태</TableHead>
                            <TableHead>제목</TableHead>
                            <TableHead className="w-[150px]">날짜</TableHead>
                            <TableHead className="w-[150px]">관리</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {notices.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                    등록된 공지사항이 없습니다.
                                </TableCell>
                            </TableRow>
                        ) : (
                            notices.map((notice) => (
                                <TableRow key={notice.id}>
                                    <TableCell>
                                        {notice.is_pinned ? (
                                            <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                                                필독
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                                                일반
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell className="font-medium">{notice.title}</TableCell>
                                    <TableCell>
                                        {notice.date ? format(new Date(notice.date), "yyyy-MM-dd") : "-"}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Link href={`/admin/notices/${notice.id}`}>
                                                <Button variant="outline" size="sm">
                                                    수정
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(notice.id)}
                                            >
                                                삭제
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
