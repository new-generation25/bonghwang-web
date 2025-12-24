import PocketBase from 'pocketbase';

const RAILWAY_URL = 'https://bonghwang-web-production.up.railway.app';
const pb = new PocketBase(RAILWAY_URL);

async function checkRailwayStatus() {
    console.log('🔍 Railway PocketBase 상태 확인 중...\n');
    console.log(`📍 URL: ${RAILWAY_URL}\n`);

    try {
        // 1. Health Check
        console.log('1️⃣ Health Check...');
        const healthResponse = await fetch(`${RAILWAY_URL}/api/health`);
        console.log(`   상태 코드: ${healthResponse.status}`);

        if (healthResponse.ok) {
            const health = await healthResponse.json();
            console.log(`   ✅ PocketBase 서버가 실행 중입니다!`);
            console.log(`   응답:`, health);
        } else {
            console.log(`   ❌ PocketBase 서버에 접근할 수 없습니다.`);
        }
    } catch (error) {
        console.log(`   ❌ Health Check 실패: ${error.message}`);
    }

    console.log('\n');

    try {
        // 2. Collections 목록 확인 (인증 없이)
        console.log('2️⃣ Collections 확인 (인증 없음)...');

        // notices 컬렉션 확인
        try {
            const notices = await pb.collection('notices').getList(1, 1);
            console.log(`   ✅ notices 컬렉션: ${notices.totalItems}개 항목 존재`);
        } catch (error) {
            console.log(`   ❌ notices 컬렉션 접근 실패: ${error.status} - ${error.message}`);
        }

        // partners 컬렉션 확인
        try {
            const partners = await pb.collection('partners').getList(1, 1);
            console.log(`   ✅ partners 컬렉션: ${partners.totalItems}개 항목 존재`);
        } catch (error) {
            console.log(`   ❌ partners 컬렉션 접근 실패: ${error.status} - ${error.message}`);
        }

        // projects 컬렉션 확인
        try {
            const projects = await pb.collection('projects').getList(1, 1);
            console.log(`   ✅ projects 컬렉션: ${projects.totalItems}개 항목 존재`);
        } catch (error) {
            console.log(`   ❌ projects 컬렉션 접근 실패: ${error.status} - ${error.message}`);
        }

    } catch (error) {
        console.log(`   ❌ Collections 확인 실패: ${error.message}`);
    }

    console.log('\n');

    try {
        // 3. Admin 인증 시도
        console.log('3️⃣ Admin 인증 확인...');
        const ADMIN_EMAIL = 'admin@bonghwangdae.com';
        const RAILWAY_PASS = 'bonghwang1935';

        await pb.admins.authWithPassword(ADMIN_EMAIL, RAILWAY_PASS);
        console.log(`   ✅ 관리자 인증 성공!`);
        console.log(`   관리자: ${pb.authStore.record?.email}`);

        // 인증 후 컬렉션 목록 가져오기
        console.log('\n4️⃣ 인증 후 전체 데이터 확인...');

        const noticesAuth = await pb.collection('notices').getFullList();
        console.log(`   notices: ${noticesAuth.length}개`);

        const partnersAuth = await pb.collection('partners').getFullList();
        console.log(`   partners: ${partnersAuth.length}개`);

        const projectsAuth = await pb.collection('projects').getFullList();
        console.log(`   projects: ${projectsAuth.length}개`);

    } catch (error) {
        console.log(`   ❌ 관리자 인증 실패: ${error.status} - ${error.message}`);
    }

    console.log('\n✅ 진단 완료!');
}

checkRailwayStatus();
