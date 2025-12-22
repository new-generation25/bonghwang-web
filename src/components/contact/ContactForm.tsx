'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import pb from '@/lib/pocketbase';

export function ContactForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        affiliation: '',
        contact: '',
        message: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await pb.collection('inquiries').create(formData);
            alert('문의가 성공적으로 전송되었습니다.');
            setFormData({ name: '', affiliation: '', contact: '', message: '' });
        } catch (error) {
            console.error("Failed to send inquiry:", error);
            alert('문의 전송에 실패했습니다. 다시 시도해주세요.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="홍길동"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="affiliation">Affiliation</Label>
                    <Input
                        id="affiliation"
                        value={formData.affiliation}
                        onChange={handleChange}
                        placeholder="소속 (선택사항)"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="contact">Contact Info</Label>
                <Input
                    id="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    placeholder="이메일 또는 전화번호"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                    id="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="문의 내용을 입력해주세요."
                    className="min-h-[150px]"
                    required
                />
            </div>

            <Button type="submit" size="lg" className="w-full md:w-auto" disabled={isSubmitting}>
                {isSubmitting ? '전송 중...' : '메시지 보내기'}
            </Button>
        </form>
    );
}
