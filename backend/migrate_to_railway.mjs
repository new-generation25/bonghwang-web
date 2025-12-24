import PocketBase from 'pocketbase';

const LOCAL_PB = new PocketBase('http://127.0.0.1:8090');
const RAILWAY_PB = new PocketBase('https://bonghwang-web-production.up.railway.app');

const ADMIN_EMAIL = 'admin@bonghwangdae.com';
const LOCAL_PASS = 'bonghwang1935'; // Railway와 동일한 비밀번호 사용
const RAILWAY_PASS = 'bonghwang1935';

async function main() {
    try {
        console.log('🔐 로컬 PocketBase 인증 중...');
        await LOCAL_PB.admins.authWithPassword(ADMIN_EMAIL, LOCAL_PASS);
        console.log('✅ 로컬 인증 성공');

        console.log('🔐 Railway PocketBase 인증 중...');
        // Railway는 fetch로 직접 인증
        const authResponse = await fetch(`${RAILWAY_PB.baseUrl}/api/admins/auth-with-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identity: ADMIN_EMAIL, password: RAILWAY_PASS })
        });

        if (!authResponse.ok) {
            const error = await authResponse.json();
            throw new Error(`Railway 인증 실패: ${error.message || authResponse.statusText}`);
        }

        const authData = await authResponse.json();
        RAILWAY_PB.authStore.save(authData.token, authData.admin);
        console.log('✅ Railway 인증 성공\n');

        // 1. 프로젝트 마이그레이션
        console.log('📦 프로젝트 데이터 가져오는 중...');
        const projects = await LOCAL_PB.collection('projects').getFullList();
        console.log(`   ${projects.length}개의 프로젝트 발견\n`);

        console.log('📤 Railway에 프로젝트 업로드 중...');
        for (const project of projects) {
            try {
                // 파일 필드 제외하고 데이터 준비
                const projectData = {
                    title: project.title,
                    category: project.category,
                    year: project.year,
                    client: project.client,
                    description: project.description,
                };

                // 썸네일 파일이 있으면 다운로드 후 업로드
                if (project.thumbnail) {
                    const thumbnailUrl = LOCAL_PB.files.getURL(project, project.thumbnail);
                    const response = await fetch(thumbnailUrl);
                    const blob = await response.blob();
                    const file = new File([blob], project.thumbnail, { type: blob.type });
                    projectData.thumbnail = file;
                }

                // 갤러리 이미지가 있으면 다운로드 후 업로드
                if (project.images && project.images.length > 0) {
                    const imageFiles = [];
                    for (const imageName of project.images) {
                        const imageUrl = LOCAL_PB.files.getURL(project, imageName);
                        const response = await fetch(imageUrl);
                        const blob = await response.blob();
                        const file = new File([blob], imageName, { type: blob.type });
                        imageFiles.push(file);
                    }
                    projectData.images = imageFiles;
                }

                await RAILWAY_PB.collection('projects').create(projectData);
                console.log(`   ✅ ${project.title} 업로드 완료`);
            } catch (e) {
                console.error(`   ❌ ${project.title} 업로드 실패:`, e.message);
            }
        }

        // 2. 뉴스 게시물 마이그레이션
        console.log('\n📦 뉴스 게시물 데이터 가져오는 중...');
        const notices = await LOCAL_PB.collection('notices').getFullList();
        console.log(`   ${notices.length}개의 뉴스 게시물 발견\n`);

        console.log('📤 Railway에 뉴스 게시물 업로드 중...');
        for (const notice of notices) {
            try {
                const noticeData = {
                    title: notice.title,
                    content: notice.content,
                    is_pinned: notice.is_pinned,
                    date: notice.date,
                };
                await RAILWAY_PB.collection('notices').create(noticeData);
                console.log(`   ✅ ${notice.title} 업로드 완료`);
            } catch (e) {
                console.error(`   ❌ ${notice.title} 업로드 실패:`, e.message);
            }
        }

        // 3. 파트너사 마이그레이션
        console.log('\n📦 파트너사 데이터 가져오는 중...');
        const partners = await LOCAL_PB.collection('partners').getFullList();
        console.log(`   ${partners.length}개의 파트너사 발견\n`);

        console.log('📤 Railway에 파트너사 업로드 중...');
        for (const partner of partners) {
            try {
                const partnerData = {
                    name: partner.name,
                    link: partner.link,
                    sort: partner.sort,
                };

                // 로고 파일이 있으면 다운로드 후 업로드
                if (partner.logo) {
                    const logoUrl = LOCAL_PB.files.getURL(partner, partner.logo);
                    const response = await fetch(logoUrl);
                    const blob = await response.blob();
                    const file = new File([blob], partner.logo, { type: blob.type });
                    partnerData.logo = file;
                }

                await RAILWAY_PB.collection('partners').create(partnerData);
                console.log(`   ✅ ${partner.name} 업로드 완료`);
            } catch (e) {
                console.error(`   ❌ ${partner.name} 업로드 실패:`, e.message);
            }
        }

        console.log('\n🎉 마이그레이션 완료!');

    } catch (e) {
        console.error('❌ 마이그레이션 실패:', e);
    }
}

main();

