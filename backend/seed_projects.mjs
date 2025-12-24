import PocketBase from 'pocketbase';
const pb = new PocketBase('https://bonghwang-web-production.up.railway.app');

const ADMIN_EMAIL = 'admin@bonghwangdae.com';
const ADMIN_PASS = 'bonghwangdae1234';

async function main() {
    try {
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);

        const projects = [
            {
                title: '김해 DMO X 봉황대협동조합',
                category: 'DMO',
                year: 2024,
                client: '김해시',
                description: `
<div style="line-height: 1.6;">

<h2 style="font-size: 1.75rem; font-weight: 700; margin-top: 1rem; margin-bottom: 0.5rem; color: #1a1a1a;">주민과 상인이 주도하는 지속 가능한 원도심 체류형 관광 생태계</h2>

<p style="font-size: 1.125rem; line-height: 1.6; margin-bottom: 1rem; color: #4a4a4a;">
봉황대협동조합은 김해 DMO 사업의 주관기관으로서, 경유형 관광에 머물러 있던 김해 원도심을 '머물고 싶은 관광지'로 변화시키기 위한 다각도의 프로젝트를 수행하고 있습니다.
</p>

<hr style="margin: 1.5rem 0; border: none; border-top: 2px solid #e5e5e5;" />

<h2 style="font-size: 1.875rem; font-weight: 700; margin-top: 1.5rem; margin-bottom: 0.75rem; color: #2563eb;">01. SPACE | 공간의 재발견</h2>

<h3 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 0.75rem; color: #1a1a1a;">봉황동 190 : 원도심 체류형 관광의 거점</h3>

<div style="background-color: #f8fafc; padding: 0.75rem; border-radius: 0.5rem; margin-bottom: 0.75rem;">
<p style="margin: 0.25rem 0;"><strong style="color: #64748b;">CATEGORY:</strong> <span style="color: #334155;">Space & Living</span></p>
<p style="margin: 0.25rem 0;"><strong style="color: #64748b;">LOCATION:</strong> <span style="color: #334155;">경남 김해시 봉황동</span></p>
<p style="margin: 0.25rem 0;"><strong style="color: #64748b;">PERIOD:</strong> <span style="color: #334155;">2024 - PRESENT</span></p>
</div>

<p style="font-size: 1.0625rem; line-height: 1.6; margin-bottom: 1rem; color: #4a4a4a;">
원도심 내 방치되어 있던 유휴 빈집을 리모델링하여 김해 로컬의 감성을 담은 숙박 공간 '봉황동 190'으로 재탄생시켰습니다. 단순한 숙소를 넘어 지역 주민과 여행자가 자연스럽게 교류하는 거점을 지향하며, 김해 원도심 관광의 새로운 활력을 불어넣고 있습니다.
</p>

<hr style="margin: 1.5rem 0; border: none; border-top: 2px solid #e5e5e5;" />

<h2 style="font-size: 1.875rem; font-weight: 700; margin-top: 1.5rem; margin-bottom: 0.75rem; color: #2563eb;">02. CONTENTS | 로컬의 재해석</h2>

<h3 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 0.75rem; color: #1a1a1a;">금바다 여행기 : 김해다운 경험의 기록</h3>

<div style="background-color: #f8fafc; padding: 0.75rem; border-radius: 0.5rem; margin-bottom: 0.75rem;">
<p style="margin: 0.25rem 0;"><strong style="color: #64748b;">CATEGORY:</strong> <span style="color: #334155;">Local Contents & Program</span></p>
<p style="margin: 0.25rem 0;"><strong style="color: #64748b;">PARTNERS:</strong> <span style="color: #334155;">로컬 크리에이터 및 지역 소상공인</span></p>
</div>

<p style="font-size: 1.0625rem; line-height: 1.6; margin-bottom: 0.75rem; color: #4a4a4a;">
김해의 역사적 자산인 '가야' 스토리를 현대적인 감각으로 재구성하여, 누구나 쉽고 즐겁게 참여할 수 있는 30여 종의 관광 프로그램을 개발했습니다. 지역의 식재료와 이야기를 결합하여 방문객들에게 잊지 못할 '김해의 시간'을 선물합니다.
</p>

<h4 style="font-size: 1.25rem; font-weight: 600; margin-top: 1rem; margin-bottom: 0.5rem; color: #1a1a1a;">주요 프로그램 소개</h4>

<ul style="list-style: none; padding-left: 0; margin-bottom: 1rem;">
    <li style="margin-bottom: 0.5rem; padding-left: 1.5rem; position: relative;">
        <span style="position: absolute; left: 0; color: #2563eb;">•</span>
        <strong style="color: #1a1a1a;">가야소반 피크닉:</strong> 
        <span style="color: #4a4a4a;">김해의 제철 식재료로 만든 도시락과 함께 원도심의 풍경을 즐기는 미식 체험입니다.</span>
    </li>
    <li style="margin-bottom: 0.5rem; padding-left: 1.5rem; position: relative;">
        <span style="position: absolute; left: 0; color: #2563eb;">•</span>
        <strong style="color: #1a1a1a;">가야숲 탐험대:</strong> 
        <span style="color: #4a4a4a;">유적지와 자연을 연계하여 가족 단위 여행객이 함께 즐기는 생태 교육 프로그램입니다.</span>
    </li>
    <li style="margin-bottom: 0.5rem; padding-left: 1.5rem; position: relative;">
        <span style="position: absolute; left: 0; color: #2563eb;">•</span>
        <strong style="color: #1a1a1a;">금바다 여행에디터:</strong> 
        <span style="color: #4a4a4a;">청년 크리에이터들이 로컬의 숨은 매력을 발굴하고 SNS를 통해 김해의 가치를 확산하는 마케팅 프로젝트입니다.</span>
    </li>
    <li style="margin-bottom: 0.5rem; padding-left: 1.5rem; position: relative;">
        <span style="position: absolute; left: 0; color: #2563eb;">•</span>
        <strong style="color: #1a1a1a;">봉황 메모리즈:</strong> 
        <span style="color: #4a4a4a;">아버지의 메모를 따라 미션을 해결하는 레트로 감성 투어로, 주민들이 직접 참여해 봉황동의 진솔한 이야기를 들려줍니다.</span>
    </li>
    <li style="margin-bottom: 0.5rem; padding-left: 1.5rem; position: relative;">
        <span style="position: absolute; left: 0; color: #2563eb;">•</span>
        <strong style="color: #1a1a1a;">봉황동달빛파티:</strong> 
        <span style="color: #4a4a4a;">밤의 활기를 위해 부활한 야간 축제이며, 빈티지 마켓과 달빛 책바 등 MZ세대를 겨냥한 감성적인 콘텐츠를 선보입니다.</span>
    </li>
    <li style="margin-bottom: 0.5rem; padding-left: 1.5rem; position: relative;">
        <span style="position: absolute; left: 0; color: #2563eb;">•</span>
        <strong style="color: #1a1a1a;">동상식탁:</strong> 
        <span style="color: #4a4a4a;">외국인 사장님과 음식을 매개로 소통하는 다문화 미식 투어로, 동상동 지역을 이색적인 여행지로 소개하는 프로그램입니다.</span>
    </li>
</ul>

<hr style="margin: 1.5rem 0; border: none; border-top: 2px solid #e5e5e5;" />

<h2 style="font-size: 1.875rem; font-weight: 700; margin-top: 1.5rem; margin-bottom: 0.75rem; color: #2563eb;">03. NETWORK | 사람의 연결</h2>

<h3 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 0.75rem; color: #1a1a1a;">연결되는 금바다 : 함께 만드는 로컬 거버넌스</h3>

<div style="background-color: #f8fafc; padding: 0.75rem; border-radius: 0.5rem; margin-bottom: 0.75rem;">
<p style="margin: 0.25rem 0;"><strong style="color: #64748b;">CATEGORY:</strong> <span style="color: #334155;">Community & Festival</span></p>
<p style="margin: 0.25rem 0;"><strong style="color: #64748b;">GOVERNANCE:</strong> <span style="color: #334155;">77개 지역 협의체 참여</span></p>
<p style="margin: 0.25rem 0;"><strong style="color: #64748b;">PERFORMANCE:</strong> <span style="color: #334155;">참여자 1,805명 달성 (달성률 106%)</span></p>
</div>

<p style="font-size: 1.0625rem; line-height: 1.6; margin-bottom: 1rem; color: #4a4a4a;">
지속 가능한 관광은 지역 공동체의 참여에서 시작됩니다. 봉황대협동조합은 77개의 지역 협의체와 손잡고 '봉황동 달빛파티', '김해왕릉길 축제' 등 주민 주도형 행사를 기획·운영하며, 상인과 주민이 상생하는 건강한 관광 생태계를 구축하고 있습니다.
</p>

<hr style="margin: 1.5rem 0; border: none; border-top: 2px solid #e5e5e5;" />

<h2 style="font-size: 1.875rem; font-weight: 700; margin-top: 1.5rem; margin-bottom: 0.75rem; color: #2563eb;">04. PERFORMANCE</h2>

<h3 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 0.75rem; color: #1a1a1a;">데이터로 증명하는 변화</h3>

<p style="font-size: 1.0625rem; line-height: 1.6; margin-bottom: 1rem; color: #4a4a4a;">
2025년 최종 평가 기준, 봉황대협동조합은 모든 지표에서 목표치를 상회하는 유의미한 성과를 거두었습니다.
</p>

<div style="background-color: #f8fafc; padding: 0.75rem; border-radius: 0.5rem; margin-bottom: 0.75rem;">
<p style="margin: 0.25rem 0;"><strong style="color: #64748b;">참여자 수:</strong> <span style="color: #334155;">1,805명 (106% 달성)</span></p>
<p style="margin: 0.25rem 0;"><strong style="color: #64748b;">거버넌스 구축:</strong> <span style="color: #334155;">77개소 (113% 달성)</span></p>
<p style="margin: 0.25rem 0;"><strong style="color: #64748b;">콘텐츠 개발:</strong> <span style="color: #334155;">30건 (125% 달성)</span></p>
<p style="margin: 0.25rem 0;"><strong style="color: #64748b;">협력 파트너:</strong> <span style="color: #334155;">55개사 (115% 달성)</span></p>
</div>

</div>
                `
            },
            {
                title: 'Bonghwangdae Festival',
                category: 'Festival',
                year: 2024,
                client: 'Gimhae City',
                description: '<p>A successful local festival bringing together 5000+ visitors.</p>'
            },
            {
                title: 'Local Creator Education',
                category: 'Education',
                year: 2024,
                client: 'Internal',
                description: '<p>Educating the next generation of local creators.</p>'
            }
        ];

        for (const proj of projects) {
            await pb.collection('projects').create(proj);
            console.log(`Created project: ${proj.title}`);
        }
        console.log("Projects seeding complete!");

    } catch (e) {
        console.error("Seeding failed:", e);
    }
}

main();
