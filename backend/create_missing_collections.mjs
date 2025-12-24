const RAILWAY_URL = 'https://bonghwang-web-production.up.railway.app';
const ADMIN_EMAIL = 'admin@bonghwangdae.com';
const RAILWAY_PASS = 'bonghwang1935';

async function getAdminToken() {
    const response = await fetch(`${RAILWAY_URL}/api/admins/auth-with-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identity: ADMIN_EMAIL, password: RAILWAY_PASS }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`인증 실패: ${error.message || response.statusText}`);
    }

    const data = await response.json();
    return data.token;
}

async function createCollection(collectionData, token) {
    const response = await fetch(`${RAILWAY_URL}/api/collections`, {
        method: 'POST',
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(collectionData),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`컬렉션 생성 실패: ${JSON.stringify(error)}`);
    }

    return await response.json();
}

async function main() {
    try {
        console.log('🔐 Railway PocketBase 인증 중...');
        const token = await getAdminToken();
        console.log('✅ 인증 성공\n');

        // 1. Projects 컬렉션 생성
        console.log('📦 Projects 컬렉션 생성 중...');
        try {
            await createCollection({
                name: 'projects',
                type: 'base',
                listRule: '',
                viewRule: '',
                schema: [
                    { name: 'title', type: 'text', required: true },
                    { name: 'category', type: 'select', required: true, options: { maxSelect: 1, values: ['DMO', 'Festival', 'Education', 'Space'] } },
                    { name: 'year', type: 'number' },
                    { name: 'thumbnail', type: 'file', options: { maxSelect: 1, maxSize: 5242880 } },
                    { name: 'images', type: 'file', options: { maxSelect: 10, maxSize: 5242880 } },
                    { name: 'description', type: 'editor' },
                    { name: 'client', type: 'text' }
                ]
            }, token);
            console.log('✅ Projects 컬렉션 생성 완료');
        } catch (e) {
            console.log(`❌ Projects 컬렉션 생성 실패: ${e.message}`);
        }

        // 2. Partners 컬렉션 생성
        console.log('\n📦 Partners 컬렉션 생성 중...');
        try {
            await createCollection({
                name: 'partners',
                type: 'base',
                listRule: '',
                viewRule: '',
                schema: [
                    { name: 'name', type: 'text', required: true },
                    { name: 'logo', type: 'file', options: { maxSelect: 1, maxSize: 5242880 } },
                    { name: 'link', type: 'url' },
                    { name: 'sort', type: 'number' }
                ]
            }, token);
            console.log('✅ Partners 컬렉션 생성 완료');
        } catch (e) {
            console.log(`❌ Partners 컬렉션 생성 실패: ${e.message}`);
        }

        console.log('\n🎉 컬렉션 생성 완료!');
    } catch (e) {
        console.error('❌ 실패:', e.message);
    }
}

main();
