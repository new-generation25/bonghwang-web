'use client';

export function About() {
    return (
        <section className="py-24 bg-white text-foreground px-6 md:px-12">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <span className="text-accent text-[13px] font-bold tracking-widest uppercase mb-2 block">Who We Are</span>
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-8 leading-tight">
                            지속 가능한 로컬을 위한<br />
                            <span className="text-muted-foreground">새로운 실험과 도전</span>
                        </h2>
                        <div className="flex flex-wrap gap-2 mb-8">
                            {['#지역관광', '#도시재생', '#로컬크리에이터', '#커뮤니티'].map((tag) => (
                                <span key={tag} className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-[13px] font-medium tracking-wide">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6 text-muted-foreground leading-relaxed tracking-wide">
                        <p className="text-[15px]">
                            봉황대협동조합은 지역의 고유한 자원을 발굴하고 재해석하여 새로운 가치를 만들어냅니다.
                            우리는 단순한 공간 운영을 넘어, 사람과 사람, 과거와 현재를 잇는 다양한 프로젝트를 기획합니다.
                        </p>
                        <p className="text-[15px]">
                            로컬 매니지먼트 기업으로서 전문성을 바탕으로 지역 사회와 함께 성장하며,
                            지속 가능한 도시 문화 생태계를 구축하는 것을 목표로 합니다.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
