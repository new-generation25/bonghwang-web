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

        const authData = await authResponse.json();
        const token = authData.token;
        console.log('✅ 인증 성공\n');

        // 2. Projects 컬렉션 접근 권한 설정
        console.log('📦 Projects 컬렉션 접근 권한 설정 중...');
        const projectsResponse = await fetch(`${RAILWAY_URL}/api/collections/projects`, {
            method: 'PATCH',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                listRule: '',  // 모든 사람이 목록 조회 가능
                viewRule: '',  // 모든 사람이 상세 조회 가능
            })
        });

        if (projectsResponse.ok) {
            console.log('✅ Projects public 접근 허용\n');
        } else {
            const error = await projectsResponse.json();
            console.log(`❌ Projects 설정 실패: ${JSON.stringify(error)}\n`);
        }

        // 3. Notices 컬렉션 접근 권한 설정
        console.log('📦 Notices 컬렉션 접근 권한 설정 중...');
        const noticesResponse = await fetch(`${RAILWAY_URL}/api/collections/notices`, {
            method: 'PATCH',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                listRule: '',
                viewRule: '',
            })
        });

        if (noticesResponse.ok) {
            console.log('✅ Notices public 접근 허용\n');
        } else {
            const error = await noticesResponse.json();
            console.log(`❌ Notices 설정 실패: ${JSON.stringify(error)}\n`);
        }

        // 4. Partners 컬렉션 접근 권한 설정 (이미 되어있을 수 있음)
        console.log('📦 Partners 컬렉션 접근 권한 설정 중...');
        const partnersResponse = await fetch(`${RAILWAY_URL}/api/collections/partners`, {
            method: 'PATCH',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                listRule: '',
                viewRule: '',
            })
        });

        if (partnersResponse.ok) {
            console.log('✅ Partners public 접근 허용\n');
        } else {
            const error = await partnersResponse.json();
            console.log(`❌ Partners 설정 실패: ${JSON.stringify(error)}\n`);
        }

        console.log('🎉 모든 컬렉션 접근 권한 설정 완료!');
        console.log('이제 Vercel 페이지에서 데이터가 보일 것입니다.');

    } catch (e) {
        console.error('❌ 실패:', e.message);
    }
}

main();
