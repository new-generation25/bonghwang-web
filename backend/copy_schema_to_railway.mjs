const RAILWAY_URL = 'https://bonghwang-web-production.up.railway.app';
const ADMIN_EMAIL = 'admin@bonghwangdae.com';
const RAILWAY_PASS = 'bonghwang1935';

async function getAdminToken() {
    const response = await fetch(`${RAILWAY_URL}/api/admins/auth-with-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            identity: ADMIN_EMAIL,
            password: RAILWAY_PASS,
        }),
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
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(collectionData),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`컬렉션 생성 실패: ${error.message || response.statusText}`);
    }

    return await response.json();
}

async function main() {
    try {
        console.log('🔐 Railway PocketBase 인증 중...');
        const token = await getAdminToken();
        console.log('✅ 인증 성공\n');

        // 1. Create Projects Collection
        console.log('📦 Projects 컬렉션 생성 중...');
        try {
            await createCollection({
                name: 'projects',
                type: 'base',
                schema: [
                    { name: 'title', type: 'text', required: true },
                    {
                        name: 'category',
                        type: 'select',
                        options: { values: ['DMO', 'Festival', 'Education', 'Space'] },
                        required: true
                    },
                    { name: 'year', type: 'number' },
                    { name: 'thumbnail', type: 'file', maxSelect: 1 },
                    { name: 'images', type: 'file', maxSelect: 10 },
                    { name: 'description', type: 'editor' },
                    { name: 'client', type: 'text' }
                ]
            }, token);
            console.log('✅ Projects 컬렉션 생성 완료');
        } catch (e) {
            if (e.message.includes('already exists') || e.message.includes('duplicate')) {
                console.log('⚠️  Projects 컬렉션이 이미 존재합니다.');
            } else {
                console.error('❌ Projects 컬렉션 생성 실패:', e.message);
            }
        }

        // 2. Create Notices Collection
        console.log('\n📦 Notices 컬렉션 생성 중...');
        try {
            await createCollection({
                name: 'notices',
                type: 'base',
                schema: [
                    { name: 'title', type: 'text', required: true },
                    { name: 'content', type: 'editor' },
                    { name: 'is_pinned', type: 'bool' },
                    { name: 'date', type: 'date' }
                ]
            }, token);
            console.log('✅ Notices 컬렉션 생성 완료');
        } catch (e) {
            if (e.message.includes('already exists') || e.message.includes('duplicate')) {
                console.log('⚠️  Notices 컬렉션이 이미 존재합니다.');
            } else {
                console.error('❌ Notices 컬렉션 생성 실패:', e.message);
            }
        }

        // 3. Create Partners Collection
        console.log('\n📦 Partners 컬렉션 생성 중...');
        try {
            await createCollection({
                name: 'partners',
                type: 'base',
                schema: [
                    { name: 'name', type: 'text', required: true },
                    { name: 'logo', type: 'file', maxSelect: 1 },
                    { name: 'link', type: 'url' },
                    { name: 'sort', type: 'number' }
                ]
            }, token);
            console.log('✅ Partners 컬렉션 생성 완료');
        } catch (e) {
            if (e.message.includes('already exists') || e.message.includes('duplicate')) {
                console.log('⚠️  Partners 컬렉션이 이미 존재합니다.');
            } else {
                console.error('❌ Partners 컬렉션 생성 실패:', e.message);
            }
        }

        console.log('\n🎉 스키마 복사 완료!');
        console.log('이제 upload_direct.mjs를 실행하여 데이터를 업로드하세요.');

    } catch (e) {
        console.error('❌ 스키마 복사 실패:', e.message);
        console.error(e);
    }
}

main();

