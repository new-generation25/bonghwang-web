const RAILWAY_URL = 'https://bonghwang-web-production.up.railway.app';
const ADMIN_EMAIL = 'admin@bonghwangdae.com';
const RAILWAY_PASS = 'bonghwang1935';

async function main() {
    try {
        // 1. 인증
        console.log('🔐 Railway PocketBase 인증 중...');
        const authResponse = await fetch(`${RAILWAY_URL}/api/admins/auth-with-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identity: ADMIN_EMAIL, password: RAILWAY_PASS }),
        });

        if (!authResponse.ok) {
            throw new Error('인증 실패');
        }

        const authData = await authResponse.json();
        const token = authData.token;
        console.log('✅ 인증 성공\n');

        // 2. Projects 컬렉션 조회
        console.log('📦 Projects 컬렉션 스키마 조회 중...\n');
        const collectionResponse = await fetch(`${RAILWAY_URL}/api/collections/projects`, {
            headers: { 'Authorization': token }
        });

        if (!collectionResponse.ok) {
            throw new Error(`컬렉션 조회 실패: ${collectionResponse.statusText}`);
        }

        const projects = await collectionResponse.json();

        console.log('=== Railway Projects 컬렉션 스키마 ===\n');
        console.log(`이름: ${projects.name}`);
        console.log(`타입: ${projects.type}\n`);
        console.log('필드 목록:');

        projects.schema.forEach((field, index) => {
            console.log(`\n${index + 1}. ${field.name}`);
            console.log(`   타입: ${field.type}`);
            console.log(`   필수: ${field.required || false}`);
            if (field.type === 'select' && field.options) {
                console.log(`   옵션: ${JSON.stringify(field.options.values || field.options)}`);
            }
            if (field.type === 'file' && field.options) {
                console.log(`   maxSelect: ${field.options.maxSelect || 1}`);
            }
        });

        // 3. 로컬 스키마와 비교
        console.log('\n\n=== 로컬 스키마 (기대값) ===\n');
        const expectedFields = [
            { name: 'title', type: 'text', required: true },
            { name: 'category', type: 'select', required: true },
            { name: 'year', type: 'number' },
            { name: 'thumbnail', type: 'file' },
            { name: 'images', type: 'file' },
            { name: 'description', type: 'editor' },
            { name: 'client', type: 'text' }
        ];

        expectedFields.forEach((field, index) => {
            console.log(`${index + 1}. ${field.name} (${field.type})${field.required ? ' *필수' : ''}`);
        });

        // 4. 비교  
        console.log('\n\n=== 비교 결과 ===\n');
        const actualFieldNames = projects.schema.map(f => f.name);
        const expectedFieldNames = expectedFields.map(f => f.name);

        const missing = expectedFieldNames.filter(f => !actualFieldNames.includes(f));
        const extra = actualFieldNames.filter(f => !expectedFieldNames.includes(f));

        if (missing.length > 0) {
            console.log(`❌ Railway에 없는 필드: ${missing.join(', ')}`);
        }

        if (extra.length > 0) {
            console.log(`⚠️  Railway에만 있는 필드: ${extra.join(', ')}`);
        }

        if (missing.length === 0 && extra.length === 0) {
            console.log('✅ 필드 목록이 일치합니다!');
        }

    } catch (e) {
        console.error('❌ 실패:', e.message);
        console.error(e);
    }
}

main();
