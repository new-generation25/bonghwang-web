import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminDashboardPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-foreground">대시보드</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* 프로젝트 관리 카드 */}
                <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
                    <h3 className="mb-4 text-lg font-semibold text-card-foreground">프로젝트 관리</h3>
                    <p className="mb-4 text-sm text-muted-foreground">
                        프로젝트를 등록하고 이미지를 업로드합니다.
                    </p>
                    <Link href="/admin/projects">
                        <Button className="w-full">프로젝트 바로가기</Button>
                    </Link>
                </div>

                {/* 공지사항 관리 카드 */}
                <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
                    <h3 className="mb-4 text-lg font-semibold text-card-foreground">공지사항 관리</h3>
                    <p className="mb-4 text-sm text-muted-foreground">
                        공지사항을 등록, 수정, 삭제합니다.
                    </p>
                    <Link href="/admin/notices">
                        <Button className="w-full">공지사항 바로가기</Button>
                    </Link>
                </div>

                {/* Placeholder for other features */}
                <div className="rounded-lg border border-border bg-card p-6 shadow-sm opacity-50 cursor-not-allowed">
                    <h3 className="mb-4 text-lg font-semibold text-card-foreground">회원 관리 (준비중)</h3>
                    <p className="mb-4 text-sm text-muted-foreground">
                        조합원 정보를 관리합니다.
                    </p>
                    <Button variant="outline" disabled className="w-full">준비중</Button>
                </div>
            </div>
        </div>
    );
}
