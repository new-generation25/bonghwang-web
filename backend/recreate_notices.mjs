import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

const ADMIN_EMAIL = 'admin@bonghwangdae.com';
const ADMIN_PASS = 'bonghwangdae1234';

async function main() {
    try {
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);

        // 1. Delete
        try {
            const collection = await pb.collections.getOne('notices');
            if (collection) {
                await pb.collections.delete(collection.id);
                console.log('Deleted existing "notices" collection.');
            }
        } catch (e) {
            // Ignore
        }

        // 2. Create
        try {
            await pb.collections.create({
                name: 'notices',
                type: 'base',
                fields: [
                    { name: 'title', type: 'text', required: true },
                    { name: 'content', type: 'editor' },
                    { name: 'is_pinned', type: 'bool' },
                    { name: 'date', type: 'date' }
                ],
                listRule: "",
                viewRule: ""
            });
            console.log('Created "notices" collection.');
        } catch (e) {
            console.error('Failed to create notices collection:', e.originalError || e);
        }

        // 3. Seed
        const notices = [
            {
                title: '2025 봉황대협동조합 정기총회 안내',
                content: '<p>2025년도 정기총회 안내...</p>',
                is_pinned: true,
                date: new Date('2025-02-15')
            },
            {
                title: '신규 조합원 모집 공고',
                content: '<p>신규 조합원 모집...</p>',
                is_pinned: false,
                date: new Date('2025-01-10')
            },
            {
                title: '환경개선 프로젝트 결과 보고',
                content: '<p>프로젝트 완료...</p>',
                is_pinned: false,
                date: new Date('2024-12-20')
            }
        ];

        for (const notice of notices) {
            await pb.collection('notices').create(notice);
            console.log(`Created notice: ${notice.title}`);
        }

    } catch (err) {
        console.error('Script failed:', err);
    }
}

main();
