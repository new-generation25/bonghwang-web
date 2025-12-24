// PocketBase 이미지 URL의 캐시 헤더 확인
const RAILWAY_URL = 'https://bonghwang-web-production.up.railway.app';

async function checkImageCaching() {
    try {
        // 테스트용 이미지 URL (실제 프로젝트 ID와 이미지 사용)
        const testImageUrl = `${RAILWAY_URL}/api/files/projects/YOUR_PROJECT_ID/YOUR_IMAGE.jpg`;

        console.log('🔍 이미지 캐시 헤더 확인 중...\n');
        console.log(`URL: ${testImageUrl}\n`);

        const response = await fetch(testImageUrl);

        console.log('📊 응답 헤더:');
        console.log('---');

        const headers = {
            'Cache-Control': response.headers.get('cache-control'),
            'ETag': response.headers.get('etag'),
            'Last-Modified': response.headers.get('last-modified'),
            'Expires': response.headers.get('expires'),
            'Content-Type': response.headers.get('content-type'),
        };

        Object.entries(headers).forEach(([key, value]) => {
            if (value) {
                console.log(`${key}: ${value}`);
            } else {
                console.log(`${key}: ❌ 없음`);
            }
        });

        console.log('\n📝 분석:');

        if (!headers['Cache-Control']) {
            console.log('❌ Cache-Control 헤더가 없습니다!');
            console.log('   → 브라우저가 캐싱하지 않을 수 있습니다.');
        } else if (headers['Cache-Control'].includes('no-cache') || headers['Cache-Control'].includes('no-store')) {
            console.log('❌ Cache-Control이 캐싱을 막고 있습니다!');
            console.log(`   → ${headers['Cache-Control']}`);
        } else {
            console.log('✅ Cache-Control이 설정되어 있습니다.');
        }

        if (headers['ETag']) {
            console.log('✅ ETag가 있어 조건부 요청 가능');
        }

        if (headers['Last-Modified']) {
            console.log('✅ Last-Modified가 있어 조건부 요청 가능');
        }

    } catch (e) {
        console.error('❌ 확인 실패:', e.message);
        console.log('\n💡 실제 이미지 URL을 사용하려면:');
        console.log('1. Railway PocketBase Admin UI에서 프로젝트 열기');
        console.log('2. 이미지 URL 복사');
        console.log('3. 이 스크립트의 testImageUrl 수정 후 재실행');
    }
}

checkImageCaching();
