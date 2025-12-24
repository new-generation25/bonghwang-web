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

        // 2. Notices 컬렉션 전체 삭제 및 재생성
        console.log('🗑️  Notices 컬렉션 데이터 삭제 중...');
        const noticesResponse = await fetch(`${RAILWAY_URL}/api/collections/notices/records`, {
            headers: { 'Authorization': token }
        });
        const noticesData = await noticesResponse.json();

        for (const notice of noticesData.items) {
            await fetch(`${RAILWAY_URL}/api/collections/notices/records/${notice.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': token }
            });
        }
        console.log(`✅ Notices ${noticesData.items.length}개 삭제 완료\n`);

        // 3. Partners 컬렉션 전체 삭제 및 재생성
        console.log('🗑️  Partners 컬렉션 데이터 삭제 중...');
        const partnersResponse = await fetch(`${RAILWAY_URL}/api/collections/partners/records`, {
            headers: { 'Authorization': token }
        });
        const partnersData = await partnersResponse.json();

        for (const partner of partnersData.items) {
            await fetch(`${RAILWAY_URL}/api/collections/partners/records/${partner.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': token }
            });
        }
        console.log(`✅ Partners ${partnersData.items.length}개 삭제 완료\n`);

        // 4. Projects 컬렉션 전체 삭제 및 재생성
        console.log('🗑️  Projects 컬렉션 데이터 삭제 중...');
        const projectsResponse = await fetch(`${RAILWAY_URL}/api/collections/projects/records`, {
            headers: { 'Authorization': token }
        });
        const projectsData = await projectsResponse.json();

        for (const project of projectsData.items) {
            await fetch(`${RAILWAY_URL}/api/collections/projects/records/${project.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': token }
            });
        }
        console.log(`✅ Projects ${projectsData.items.length}개 삭제 완료\n`);

        console.log('🎉 모든 데이터 삭제 완료!');
        console.log('\n이제 migrate_to_railway.mjs를 실행하여 깨끗한 데이터를 업로드하세요.');

    } catch (e) {
        console.error('❌ 실패:', e.message);
        console.error(e);
    }
}

main();
