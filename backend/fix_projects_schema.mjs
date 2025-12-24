const RAILWAY_URL = 'https://bonghwang-web-production.up.railway.app';
const ADMIN_EMAIL = 'admin@bonghwangdae.com';
const RAILWAY_PASS = 'bonghwang1935';

async function main() {
    try {
        //1. 인증
        console.log('🔐 Railway PocketBase 인증 중...');
        const authResponse = await fetch(`${RAILWAY_URL}/api/admins/auth-with-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identity: ADMIN_EMAIL, password: RAILWAY_PASS }),
        });

        const authData = await authResponse.json();
        const token = authData.token;
        console.log('✅ 인증 성공\n');

        // 2. 기존 Projects 컬렉션 삭제
        console.log('🗑️  기존 Projects 컬렉션 삭제 중...');
        const deleteResponse = await fetch(`${RAILWAY_URL}/api/collections/projects`, {
            method: 'DELETE',
            headers: { 'Authorization': token }
        });

        if (deleteResponse.ok) {
            console.log('✅ 기존 컬렉션 삭제 완료\n');
        } else {
            console.log('⚠️  삭제 실패 (이미 없을 수 있음)\n');
        }

        // 3. 올바른 스키마로 Projects 컬렉션 재생성
        console.log('📦 Projects 컬렉션 재생성 중...');
        const createResponse = await fetch(`${RAILWAY_URL}/api/collections`, {
            method: 'POST',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: 'projects',
                type: 'base',
                listRule: '',
                viewRule: '',
                schema: [
                    {
                        name: 'title',
                        type: 'text',
                        required: true
                    },
                    {
                        name: 'category',
                        type: 'select',
                        required: true,
                        options: {
                            maxSelect: 1,
                            values: ['DMO', 'Festival', 'Education', 'Space']
                        }
                    },
                    {
                        name: 'year',
                        type: 'number',
                        options: {}
                    },
                    {
                        name: 'thumbnail',
                        type: 'file',
                        options: {
                            maxSelect: 1,
                            maxSize: 5242880
                        }
                    },
                    {
                        name: 'images',
                        type: 'file',
                        options: {
                            maxSelect: 10,
                            maxSize: 5242880
                        }
                    },
                    {
                        name: 'description',
                        type: 'editor',
                        options: {}
                    },
                    {
                        name: 'client',
                        type: 'text',
                        options: {}
                    }
                ]
            })
        });

        if (!createResponse.ok) {
            const error = await createResponse.json();
            throw new Error(`컬렉션 생성 실패: ${JSON.stringify(error)}`);
        }

        console.log('✅ Projects 컬렉션 재생성 완료!\n');
        console.log('이제 migrate_to_railway.mjs를 다시 실행하여 데이터를 업로드하세요.');

    } catch (e) {
        console.error('❌ 실패:', e.message);
    }
}

main();
