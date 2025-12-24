"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import pb from '@/lib/pocketbase';

interface ProjectGalleryProps {
    images: string[];
    projectId: string;
    projectTitle: string;
}

export default function ProjectGallery({ images, projectId, projectTitle }: ProjectGalleryProps) {
    const [selectedImage, setSelectedImage] = useState<number | null>(null);

    // Ensure PocketBase uses the correct base URL from environment
    useEffect(() => {
        const envUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL;
        if (envUrl) {
            // 프로토콜이 없으면 https:// 추가
            const normalizedUrl = envUrl.startsWith('http://') || envUrl.startsWith('https://') 
                ? envUrl 
                : `https://${envUrl}`;
            pb.baseUrl = normalizedUrl;
        }
    }, []);

    // 키보드 이벤트 처리
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedImage === null) return;

            switch (e.key) {
                case 'Escape':
                    setSelectedImage(null);
                    break;
                case 'ArrowLeft':
                    if (selectedImage > 0) {
                        setSelectedImage(selectedImage - 1);
                    } else {
                        // 첫 이미지에서 왼쪽 키 → 닫기
                        setSelectedImage(null);
                    }
                    break;
                case 'ArrowRight':
                    if (selectedImage < images.length - 1) {
                        setSelectedImage(selectedImage + 1);
                    } else {
                        // 마지막 이미지에서 오른쪽 키 → 닫기
                        setSelectedImage(null);
                    }
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedImage, images.length]);

    // 모달이 열렸을 때 body 스크롤 방지
    useEffect(() => {
        if (selectedImage !== null) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [selectedImage]);

    if (!images || images.length === 0) {
        return (
            <div className="py-12 text-center text-muted-foreground bg-secondary/20 rounded-lg">
                No images available
            </div>
        );
    }

    const getImageUrl = (filename: string) => {
        return pb.files.getURL({ id: projectId, collectionId: 'projects', collectionName: 'projects' }, filename);
    };

    return (
        <>
            {/* Masonry Grid Layout */}
            <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
                {images.map((image, index) => (
                    <motion.div
                        key={`${projectId}-${image}-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ 
                            duration: 0.6, 
                            delay: index * 0.15,
                            ease: [0.22, 1, 0.36, 1]
                        }}
                        className="break-inside-avoid mb-4 group cursor-pointer"
                        onClick={() => setSelectedImage(index)}
                    >
                        <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-2xl transition-shadow duration-300">
                            {/* Overlay on hover */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                            
                            {/* Image */}
                            <motion.img
                                src={getImageUrl(image)}
                                alt={`${projectTitle} - Gallery ${index + 1}`}
                                className="w-full h-auto object-cover"
                                loading="lazy"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.3 }}
                            />

                            {/* Image number badge */}
                            <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                {index + 1} / {images.length}
                            </div>

                            {/* Zoom indicator */}
                            <div className="absolute top-3 right-3 bg-black/70 text-white p-2 rounded-full backdrop-blur-sm z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                                </svg>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {selectedImage !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedImage(null)}
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-50 bg-white/10 hover:bg-white/20 rounded-full p-2"
                            aria-label="Close lightbox"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {/* Image counter */}
                        <div className="absolute top-4 left-4 text-white text-lg font-semibold bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm z-50">
                            {selectedImage + 1} / {images.length}
                        </div>

                        {/* Navigation buttons */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (selectedImage > 0) {
                                    setSelectedImage(selectedImage - 1);
                                } else {
                                    // 첫 이미지에서 왼쪽 클릭 → 닫기
                                    setSelectedImage(null);
                                }
                            }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-50 bg-white/10 hover:bg-white/20 rounded-full w-12 h-12 flex items-center justify-center"
                            aria-label={selectedImage > 0 ? "Previous image" : "Close"}
                        >
                            {selectedImage > 0 ? (
                                <ChevronLeft className="w-6 h-6" />
                            ) : (
                                <X className="w-6 h-6" />
                            )}
                        </button>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (selectedImage < images.length - 1) {
                                    setSelectedImage(selectedImage + 1);
                                } else {
                                    // 마지막 이미지에서 오른쪽 클릭 → 닫기
                                    setSelectedImage(null);
                                }
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-50 bg-white/10 hover:bg-white/20 rounded-full w-12 h-12 flex items-center justify-center"
                            aria-label={selectedImage < images.length - 1 ? "Next image" : "Close"}
                        >
                            {selectedImage < images.length - 1 ? (
                                <ChevronRight className="w-6 h-6" />
                            ) : (
                                <X className="w-6 h-6" />
                            )}
                        </button>

                        {/* Image */}
                        <motion.div
                            key={selectedImage}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="max-w-7xl max-h-[90vh] relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={getImageUrl(images[selectedImage])}
                                alt={`${projectTitle} - Gallery ${selectedImage + 1}`}
                                className="max-w-full max-h-[90vh] object-contain rounded-lg"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

