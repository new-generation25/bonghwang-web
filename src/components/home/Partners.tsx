'use client';

import { useEffect, useState } from 'react';
import pb from '@/lib/pocketbase';
import { RecordModel } from 'pocketbase';

export function Partners() {
    const [partners, setPartners] = useState<RecordModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        pb.collection('partners').getList(1, 50, { requestKey: null })
            .then((res) => {
                setPartners(res.items);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch partners:", err);
                setError(err.message || "파트너사를 불러오는데 실패했습니다.");
                setLoading(false);
            });
    }, []);

    return (
        <section className="py-24 bg-white px-6 md:px-12">
            <div className="container mx-auto text-center">
                <span className="text-accent text-base font-bold tracking-widest uppercase mb-2 block">Network</span>
                <h2 className="text-3xl font-bold tracking-tight mb-16">Partners & Members</h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                    {loading ? (
                        <div className="col-span-full text-muted-foreground">파트너사를 불러오는 중...</div>
                    ) : error ? (
                        <div className="col-span-full text-muted-foreground">
                            {error}
                            <br />
                            <span className="text-xs mt-2 block">PocketBase 연결을 확인해주세요.</span>
                        </div>
                    ) : partners.length === 0 ? (
                        <div className="col-span-full text-muted-foreground">등록된 파트너사가 없습니다.</div>
                    ) : (
                        partners.map((partner) => (
                            <a
                                key={partner.id}
                                href={partner.link || '#'}
                                target={partner.link ? "_blank" : "_self"}
                                rel="noopener noreferrer"
                                className="flex items-center justify-center p-6 grayscale hover:grayscale-0 transition-all opacity-50 hover:opacity-100 duration-300"
                            >
                                {partner.logo ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={pb.files.getUrl(partner, partner.logo)}
                                        alt={partner.name}
                                        className="max-h-16 w-auto object-contain"
                                    />
                                ) : (
                                    <div className="text-xl font-bold text-foreground/80 border-2 border-border p-4 w-full h-32 flex items-center justify-center rounded-lg bg-secondary/20">
                                        {partner.name}
                                    </div>
                                )}
                            </a>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}
