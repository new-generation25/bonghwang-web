import PocketBase from 'pocketbase';
const pb = new PocketBase('http://127.0.0.1:8090');

const ADMIN_EMAIL = 'admin@bonghwangdae.com';
const ADMIN_PASS = 'bonghwangdae1234';

async function main() {
    try {
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);
        console.log("Authenticated as Admin");

        // 1. Seed Notices
        const notices = [
            {
                title: '2025 봉황대협동조합 정기총회 안내',
                content: '<p>2025년도 정기총회를 아래와 같이 개최하오니 조합원 여러분의 많은 참석 바랍니다.</p><p><br></p><p><strong>일시:</strong> 2025년 2월 28일 (금) 14:00<br><strong>장소:</strong> 봉황대협동조합 2층 회의실<br><strong>안건:</strong> 2024년 결산 및 2025년 사업계획 승인</p>',
                is_pinned: true,
                date: new Date('2025-02-15')
            },
            {
                title: '신규 조합원 모집 공고',
                content: '<p>봉리단길 활성화를 함께 이끌어갈 신규 조합원을 모집합니다. 자세한 사항은 문의 바랍니다.</p>',
                is_pinned: false,
                date: new Date('2025-01-10')
            },
            {
                title: '환경개선 프로젝트 결과 보고',
                content: '<p>지난 3개월간 진행된 환경개선 프로젝트가 성공적으로 마무리되었습니다.</p>',
                is_pinned: false,
                date: new Date('2024-12-20')
            }
        ];

        for (const notice of notices) {
            await pb.collection('notices').create(notice);
            console.log(`Created notice: ${notice.title}`);
        }

        // 2. Seed Partners
        const partners = [
            { name: "Partner A", link: "https://example.com" },
            { name: "Partner B", link: "" },
            { name: "Member C", link: "https://example.com" },
            { name: "Member D", link: "" }
        ];

        for (const partner of partners) {
            await pb.collection('partners').create(partner);
            console.log(`Created partner: ${partner.name}`);
        }

        // 3. Seed Projects
        const projects = [
            {
                title: 'Bonghwangdae Festival',
                category: 'Festival',
                year: 2024,
                client: 'Gimhae CIty',
                description: '<p>A successful local festival bringing together 5000+ visitors.</p>'
            },
            {
                title: 'Local Creator Education',
                category: 'Education',
                year: 2024,
                client: 'Internal',
                description: '<p>Educating the next generation of local creators.</p>'
            },
            {
                title: 'Community Space Design',
                category: 'Space',
                year: 2023,
                client: 'Ministry of Culture',
                description: '<p>Renovating old spaces for community use.</p>'
            }
        ];

        for (const proj of projects) {
            await pb.collection('projects').create(proj);
            console.log(`Created project: ${proj.title}`);
        }

        console.log("Seeding complete!");

    } catch (e) {
        console.error("Seeding failed:", e);
    }
}

main();
