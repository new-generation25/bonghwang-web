'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import pb from '@/lib/pocketbase';
import { RecordModel } from 'pocketbase';

const categories = ['DMO', 'Festival', 'Education', 'Space'];

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [project, setProject] = useState<RecordModel | null>(null);
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [images, setImages] = useState<FileList | null>(null);
    const [projectId, setProjectId] = useState<string>('');
    const [showImageManager, setShowImageManager] = useState(false);
    const [managedImages, setManagedImages] = useState<string[]>([]);
    
    const [formData, setFormData] = useState({
        title: '',
        category: 'DMO',
        year: new Date().getFullYear(),
        client: '',
        description: '',
    });

    useEffect(() => {
        params.then(({ id }) => {
            setProjectId(id);
            fetchProject(id);
        });
    }, [params]);

    const fetchProject = async (id: string) => {
        try {
            const record = await pb.collection('projects').getOne(id);
            setProject(record);
            setFormData({
                title: record.title || '',
                category: record.category || 'DMO',
                year: record.year || new Date().getFullYear(),
                client: record.client || '',
                description: record.description || '',
            });
            // 이미지 목록 초기화
            if (record.images && Array.isArray(record.images)) {
                setManagedImages(record.images);
            }
        } catch (error) {
            console.error('Failed to fetch project:', error);
            alert('프로젝트를 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const hasNewFiles = !!(thumbnail || (images && images.length > 0));

            if (hasNewFiles) {
                // 파일이 있는 경우: FormData 사용
                console.log('📤 파일 업로드 시작...');
                
                // 파일 검증
                if (thumbnail) {
                    const thumbnailSizeInMB = (thumbnail.size / 1024 / 1024).toFixed(2);
                    console.log(`📎 썸네일: ${thumbnail.name} - ${thumbnailSizeInMB}MB (타입: ${thumbnail.type})`);
                    
                    if (!thumbnail.type.startsWith('image/')) {
                        throw new Error(`썸네일이 이미지 파일이 아닙니다: ${thumbnail.type}`);
                    }
                    // PocketBase 기본 최대 파일 크기: 5MB
                    if (thumbnail.size > 5 * 1024 * 1024) {
                        throw new Error(`⚠️ 썸네일 크기가 너무 큽니다!\n파일: ${thumbnail.name}\n크기: ${thumbnailSizeInMB}MB\n\n📌 PocketBase 최대 파일 크기: 5MB\n\n해결 방법:\n1. 이미지를 압축하여 5MB 이하로 줄이세요\n2. 또는 PocketBase 설정에서 최대 파일 크기를 늘리세요`);
                    }
                }
                
                if (images && images.length > 0) {
                    console.log('📎 갤러리 이미지:', images.length, '개');
                    for (let i = 0; i < images.length; i++) {
                        const sizeInMB = (images[i].size / 1024 / 1024).toFixed(2);
                        console.log(`  ${i + 1}. ${images[i].name}: ${sizeInMB}MB (타입: ${images[i].type})`);
                        
                        if (!images[i].type.startsWith('image/')) {
                            throw new Error(`이미지 ${i + 1}이(가) 이미지 파일이 아닙니다: ${images[i].type}`);
                        }
                        // PocketBase 기본 최대 파일 크기: 5MB
                        if (images[i].size > 5 * 1024 * 1024) {
                            throw new Error(`⚠️ 이미지 ${i + 1} 크기가 너무 큽니다!\n파일: ${images[i].name}\n크기: ${sizeInMB}MB\n\n📌 PocketBase 최대 파일 크기: 5MB\n\n해결 방법:\n1. 이미지를 압축하여 5MB 이하로 줄이세요\n2. 또는 PocketBase 설정에서 최대 파일 크기를 늘리세요`);
                        }
                    }
                }

                const data = new FormData();
                data.append('title', formData.title);
                data.append('category', formData.category);
                data.append('year', formData.year.toString());
                data.append('client', formData.client);
                data.append('description', formData.description);

                // 썸네일 처리: 새 파일이 있으면 추가, 없으면 기존 파일명을 유지
                if (thumbnail) {
                    data.append('thumbnail', thumbnail);
                    console.log('✅ 새 썸네일 추가됨');
                } else if (project?.thumbnail) {
                    // 기존 썸네일 유지 (파일명을 문자열로 추가)
                    data.append('thumbnail', project.thumbnail);
                    console.log('✅ 기존 썸네일 유지:', project.thumbnail);
                }

                // 갤러리 이미지 처리
                if (images && images.length > 0) {
                    console.log('⚠️ 경고: 새 이미지를 업로드하면 기존 갤러리가 교체됩니다');
                    for (let i = 0; i < images.length; i++) {
                        data.append('images', images[i]);
                    }
                    console.log('✅ 갤러리 이미지', images.length, '개 추가됨');
                }

                console.log('🚀 PocketBase 업데이트 시작...');
                console.log('   - Project ID:', projectId);
                console.log('   - 썸네일:', !!thumbnail);
                console.log('   - 갤러리:', images?.length || 0);
                
                await pb.collection('projects').update(projectId, data);
                console.log('✅ 업데이트 성공!');
            } else {
                // 파일이 없는 경우: 일반 객체 사용
                console.log('📝 텍스트만 업데이트 (파일 없음)');
                const updateData = {
                    title: formData.title,
                    category: formData.category,
                    year: parseInt(formData.year.toString()),
                    client: formData.client,
                    description: formData.description,
                };

                await pb.collection('projects').update(projectId, updateData);
                console.log('✅ 업데이트 성공!');
            }

            alert('프로젝트가 수정되었습니다.');
            router.push('/admin/projects');
        } catch (error: unknown) {
            console.error('❌ 업데이트 실패:', error);
            
            // ClientResponseError 상세 정보 출력
            if (error && typeof error === 'object') {
                console.error('오류 상세:', {
                    name: 'name' in error ? error.name : 'unknown',
                    message: 'message' in error ? error.message : 'unknown',
                    status: 'status' in error ? error.status : 'unknown',
                    data: 'data' in error ? error.data : {},
                    isAbort: 'isAbort' in error ? error.isAbort : false,
                });
            }
            
            if (error instanceof Error) {
                // 사용자 정의 에러 메시지 (파일 크기 등)
                alert(error.message);
            } else {
                const errorMessage = JSON.stringify(error);
                alert(`프로젝트 수정에 실패했습니다.\n\n오류: ${errorMessage}\n\n브라우저 콘솔(F12)에서 더 자세한 정보를 확인하세요.`);
            }
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteImage = async (field: 'thumbnail' | 'images', index?: number) => {
        if (!project) return;
        
        const confirmMsg = field === 'thumbnail' 
            ? '썸네일을 삭제하시겠습니까?' 
            : `갤러리 이미지 ${(index || 0) + 1}번을 삭제하시겠습니까?`;
        
        if (!confirm(confirmMsg)) return;

        try {
            let updateData: Record<string, unknown> = {};
            
            if (field === 'thumbnail') {
                updateData.thumbnail = null;
            } else if (field === 'images' && typeof index === 'number') {
                const currentImages = [...(project.images || [])];
                currentImages.splice(index, 1);
                updateData.images = currentImages;
            }

            await pb.collection('projects').update(projectId, updateData);
            alert('이미지가 삭제되었습니다.');
            fetchProject(projectId);
        } catch (error) {
            console.error('Failed to delete image:', error);
            alert('이미지 삭제에 실패했습니다.');
        }
    };

    // 이미지 순서 변경 함수 (Function to change image order)
    const moveImageUp = (index: number) => {
        if (index === 0) return;
        const newImages = [...managedImages];
        [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
        setManagedImages(newImages);
    };

    const moveImageDown = (index: number) => {
        if (index === managedImages.length - 1) return;
        const newImages = [...managedImages];
        [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
        setManagedImages(newImages);
    };

    const saveImageOrder = async () => {
        try {
            await pb.collection('projects').update(projectId, {
                images: managedImages,
            });
            alert('이미지 순서가 저장되었습니다.');
            fetchProject(projectId);
            setShowImageManager(false);
        } catch (error) {
            console.error('Failed to save image order:', error);
            alert('이미지 순서 저장에 실패했습니다.');
        }
    };

    const openImageManager = () => {
        if (project?.images && Array.isArray(project.images)) {
            setManagedImages([...project.images]);
        }
        setShowImageManager(true);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>로딩 중...</p>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>프로젝트를 찾을 수 없습니다.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">프로젝트 수정</h1>
                <Link href="/admin/projects">
                    <Button variant="outline">목록으로</Button>
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border bg-white p-6 shadow-sm">
                <div className="space-y-2">
                    <Label htmlFor="title">프로젝트 제목 *</Label>
                    <Input
                        id="title"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="예: 김해 DMO X 봉황대협동조합"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="category">카테고리 *</Label>
                        <select
                            id="category"
                            required
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="year">연도 *</Label>
                        <Input
                            id="year"
                            type="number"
                            required
                            value={formData.year}
                            onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                            min="2000"
                            max="2100"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="client">클라이언트 *</Label>
                        <Input
                            id="client"
                            required
                            value={formData.client}
                            onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                            placeholder="예: 김해시"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>현재 썸네일 이미지</Label>
                    {project.thumbnail ? (
                        <div className="flex items-center gap-4">
                            <img
                                src={pb.files.getURL(project, project.thumbnail)}
                                alt="Thumbnail"
                                className="w-32 h-32 object-cover rounded-lg border"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteImage('thumbnail')}
                                className="text-red-600"
                            >
                                썸네일 삭제
                            </Button>
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">썸네일 이미지가 없습니다.</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="thumbnail">썸네일 이미지 변경</Label>
                    <div className="relative">
                        <Input
                            id="thumbnail"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
                            className="file:mr-4 file:py-2.5 file:px-6 file:rounded-md file:border-0 file:text-sm file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer file:shadow-sm cursor-pointer"
                        />
                    </div>
                    {thumbnail && (
                        <p className="text-sm text-blue-600 font-medium">
                            ✓ 선택됨: {thumbnail.name}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label>현재 갤러리 이미지</Label>
                    {project.images && project.images.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {project.images.map((image: string, index: number) => (
                                <div key={index} className="relative">
                                    <img
                                        src={pb.files.getURL(project, image)}
                                        alt={`Gallery ${index + 1}`}
                                        className="w-full h-32 object-cover rounded-lg border"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDeleteImage('images', index)}
                                        className="absolute top-2 right-2 text-red-600 bg-white"
                                    >
                                        삭제
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <Label>갤러리 이미지 관리 (최대 10장)</Label>
                    <p className="text-sm text-orange-600 font-medium bg-orange-50 p-2 rounded border border-orange-200">
                        ⚠️ 주의: 새 이미지를 업로드하면 기존 갤러리 이미지가 모두 삭제됩니다. 기존 이미지를 유지하려면 "📁 파일관리" 버튼을 사용하세요.
                    </p>
                    <div className="flex gap-3">
                        <div className="flex-1">
                            <div className="relative">
                                <Input
                                    id="images"
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => setImages(e.target.files)}
                                    className="file:mr-4 file:py-2.5 file:px-6 file:rounded-md file:border-0 file:text-sm file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer file:shadow-sm cursor-pointer"
                                />
                            </div>
                            {images && images.length > 0 && (
                                <p className="text-sm text-blue-600 font-medium mt-2">
                                    ✓ 선택됨: {images.length}개의 새 이미지 (기존 이미지는 삭제됨)
                                </p>
                            )}
                        </div>
                        <Button
                            type="button"
                            onClick={openImageManager}
                            variant="outline"
                            size="lg"
                            className="!border-2 !border-green-600 !text-green-700 hover:!bg-green-50 !font-bold px-8 whitespace-nowrap"
                        >
                            📁 파일관리
                        </Button>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">프로젝트 설명 *</Label>
                    <Textarea
                        id="description"
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="프로젝트에 대한 설명을 HTML 형식으로 입력하세요..."
                        rows={20}
                        className="font-mono text-sm"
                    />
                    <p className="text-sm text-muted-foreground">
                        HTML 코드를 직접 입력할 수 있습니다. 스타일을 포함할 수 있습니다.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <Button 
                        type="submit" 
                        disabled={saving}
                        size="lg"
                        style={{ backgroundColor: '#2563eb', color: 'white' }}
                        className="hover:!bg-blue-700 !font-bold px-10 shadow-lg !text-white"
                    >
                        {saving ? '💾 저장 중...' : '💾 변경사항 저장'}
                    </Button>
                    <Link href="/admin/projects">
                        <Button type="button" variant="outline" size="lg" className="!text-gray-700 !font-medium px-8">
                            취소
                        </Button>
                    </Link>
                </div>
            </form>

            {/* 파일 관리 모달 (File Manager Modal) */}
            {showImageManager && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold">갤러리 이미지 순서 관리</h2>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowImageManager(false)}
                            >
                                닫기
                            </Button>
                        </div>

                        {managedImages.length === 0 ? (
                            <p className="text-center text-muted-foreground py-8">갤러리 이미지가 없습니다.</p>
                        ) : (
                            <div className="space-y-4">
                                {managedImages.map((image, index) => (
                                    <div key={index} className="flex items-center gap-4 p-4 border rounded-lg bg-gray-50">
                                        <div className="text-lg font-semibold text-gray-600 w-8">
                                            {index + 1}
                                        </div>
                                        <img
                                            src={pb.files.getURL(project!, image)}
                                            alt={`Gallery ${index + 1}`}
                                            className="w-32 h-20 object-cover rounded"
                                        />
                                        <div className="flex-1 text-sm text-gray-600 truncate">
                                            {image}
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                onClick={() => moveImageUp(index)}
                                                disabled={index === 0}
                                                className="!border-blue-600 !text-blue-600 hover:!bg-blue-50"
                                            >
                                                ↑ 위로
                                            </Button>
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                onClick={() => moveImageDown(index)}
                                                disabled={index === managedImages.length - 1}
                                                className="!border-blue-600 !text-blue-600 hover:!bg-blue-50"
                                            >
                                                ↓ 아래로
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowImageManager(false)}
                                className="!text-gray-600"
                            >
                                취소
                            </Button>
                            <Button
                                type="button"
                                onClick={saveImageOrder}
                                className="bg-green-600 hover:bg-green-700 !text-white font-semibold px-6"
                            >
                                순서 저장
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

