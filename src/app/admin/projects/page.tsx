'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import pb from '@/lib/pocketbase';
import { RecordModel } from 'pocketbase';

export default function AdminProjectsPage() {
    const [projects, setProjects] = useState<RecordModel[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const records = await pb.collection('projects').getList(1, 50, {
                sort: '-year',
            });
            setProjects(records.items);
        } catch (error) {
            console.error('Failed to fetch projects:', error);
            alert('프로젝트 목록을 불러오는데 실패했습니다: ' + error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`"${title}" 프로젝트를 삭제하시겠습니까?`)) {
            return;
        }

        try {
            await pb.collection('projects').delete(id);
            alert('프로젝트가 삭제되었습니다.');
            fetchProjects();
        } catch (error) {
            console.error('Failed to delete project:', error);
            alert('삭제에 실패했습니다.');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>로딩 중...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">프로젝트 관리</h1>
                <Link href="/admin/projects/new">
                    <Button>새 프로젝트 등록</Button>
                </Link>
            </div>

            <div className="rounded-lg border bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="border-b bg-muted/50">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-medium">제목</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">카테고리</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">연도</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">클라이언트</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">이미지</th>
                                <th className="px-4 py-3 text-right text-sm font-medium">관리</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {projects.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                                        등록된 프로젝트가 없습니다.
                                    </td>
                                </tr>
                            ) : (
                                projects.map((project) => (
                                    <tr key={project.id} className="hover:bg-muted/50">
                                        <td className="px-4 py-3">
                                            <div className="font-medium">{project.title}</div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                                                {project.category}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm">{project.year}</td>
                                        <td className="px-4 py-3 text-sm">{project.client}</td>
                                        <td className="px-4 py-3 text-sm">
                                            {project.thumbnail && (
                                                <span className="text-green-600">썸네일 ✓</span>
                                            )}
                                            {project.images && project.images.length > 0 && (
                                                <span className="ml-2 text-blue-600">
                                                    갤러리 {project.images.length}장
                                                </span>
                                            )}
                                            {!project.thumbnail && (!project.images || project.images.length === 0) && (
                                                <span className="text-gray-400">없음</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/admin/projects/${project.id}`}>
                                                    <Button variant="outline" size="sm">
                                                        수정
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDelete(project.id, project.title)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    삭제
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

