'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import pb from '@/lib/pocketbase';

const categories = ['DMO', 'Festival', 'Education', 'Space'];

export default function NewProjectPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [images, setImages] = useState<FileList | null>(null);
    
    const [formData, setFormData] = useState({
        title: '',
        category: 'DMO',
        year: new Date().getFullYear(),
        client: '',
        description: '',
    });

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
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

            if (thumbnail) {
                data.append('thumbnail', thumbnail);
            }

            if (images) {
                for (let i = 0; i < images.length; i++) {
                    data.append('images', images[i]);
                }
            }

            await pb.collection('projects').create(data);
            alert('프로젝트가 등록되었습니다.');
            router.push('/admin/projects');
        } catch (error) {
            console.error('Failed to create project:', error);
            if (error instanceof Error) {
                alert(error.message);
            } else {
                alert('프로젝트 등록에 실패했습니다.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-foreground">새 프로젝트 등록</h1>
                <Link href="/admin/projects">
                    <Button variant="outline">목록으로</Button>
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-border bg-card p-6 shadow-sm">
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
                    <Label htmlFor="thumbnail">썸네일 이미지</Label>
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
                    <Label htmlFor="images">갤러리 이미지 (최대 10장)</Label>
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
                        <p className="text-sm text-blue-600 font-medium">
                            ✓ 선택됨: {images.length}개의 이미지
                        </p>
                    )}
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
                        disabled={loading}
                        size="lg"
                        style={{ backgroundColor: '#2563eb', color: 'white' }}
                        className="hover:!bg-blue-700 !font-bold px-10 shadow-lg !text-white"
                    >
                        {loading ? '📝 등록 중...' : '📝 프로젝트 등록'}
                    </Button>
                    <Link href="/admin/projects">
                        <Button type="button" variant="outline" size="lg" className="!text-foreground !font-medium px-8">
                            취소
                        </Button>
                    </Link>
                </div>
            </form>
        </div>
    );
}

