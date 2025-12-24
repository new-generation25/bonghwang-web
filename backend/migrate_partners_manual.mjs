/**
 * 로컬 PocketBase Admin UI에서 확인한 파트너 데이터를 Railway로 업로드
 * 로컬 PocketBase Admin UI (http://127.0.0.1:8090/_/)에서 파트너 데이터를 확인하고
 * 아래 배열에 입력한 후 이 스크립트를 실행하세요.
 */

const RAILWAY_URL = 'https://bonghwang-web-production.up.railway.app';
const ADMIN_EMAIL = 'admin@bonghwangdae.com';
const RAILWAY_PASS = 'bonghwang1935';

// 로컬 PocketBase Admin UI에서 확인한 파트너 데이터를 여기에 입력하세요
// 예시:
const partners = [
    {
        name: '파트너 이름 1',
        link: 'https://example.com',
        sort: 1,
        // logo는 파일 경로 또는 URL (선택사항)
    },
    // ... 더 많은 파트너
];

async function getRailwayToken() {
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

async function updateRecord(collection, id, data, token) {
    const formData = new FormData();
    
    for (const [key, value] of Object.entries(data)) {
        if (value instanceof File || value instanceof Blob) {
            formData.append(key, value);
        } else if (Array.isArray(value) && value[0] instanceof File) {
            value.forEach(file => formData.append(key, file));
        } else {
            formData.append(key, typeof value === 'object' ? JSON.stringify(value) : value);
        }
    }

    const response = await fetch(`${RAILWAY_URL}/api/collections/${collection}/records/${id}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`레코드 업데이트 실패: ${error.message || response.statusText}`);
    }

    return await response.json();
}

async function main() {
    try {
        console.log('🔐 Railway PocketBase 인증 중...');
        const token = await getRailwayToken();
        console.log('✅ 인증 성공\n');

        // Railway에서 기존 파트너 가져오기
        console.log('📦 Railway에서 기존 파트너 가져오는 중...');
        const railwayPartnersResponse = await fetch(`${RAILWAY_URL}/api/collections/partners/records`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        const railwayPartnersData = await railwayPartnersResponse.json();
        const railwayPartners = railwayPartnersData.items || [];
        console.log(`   ${railwayPartners.length}개의 파트너 발견\n`);

        if (partners.length === 0 || partners[0].name === '파트너 이름 1') {
            console.log('⚠️  파트너 데이터를 먼저 입력하세요!');
            console.log('로컬 PocketBase Admin UI (http://127.0.0.1:8090/_/)에서 파트너 데이터를 확인하고');
            console.log('이 스크립트의 partners 배열에 입력한 후 다시 실행하세요.');
            return;
        }

        // 파트너 업데이트
        console.log('📤 Railway에 파트너 업데이트 중...');
        for (const partner of partners) {
            try {
                // 기존 파트너 찾기 (이름으로)
                const existingPartner = railwayPartners.find(p => p.name === partner.name);
                
                if (existingPartner) {
                    const partnerData = {
                        name: partner.name,
                        link: partner.link || '',
                        sort: partner.sort || 0,
                    };

                    // 로고 파일이 있으면 추가
                    if (partner.logo) {
                        // 파일 경로인 경우
                        if (typeof partner.logo === 'string' && partner.logo.startsWith('http')) {
                            // URL에서 파일 다운로드
                            const response = await fetch(partner.logo);
                            const blob = await response.blob();
                            const file = new File([blob], 'logo.png', { type: blob.type });
                            partnerData.logo = file;
                        }
                    }

                    await updateRecord('partners', existingPartner.id, partnerData, token);
                    console.log(`   ✅ ${partner.name} 업데이트 완료`);
                } else {
                    console.log(`   ⚠️  ${partner.name}를 Railway에서 찾을 수 없습니다.`);
                }
            } catch (e) {
                console.error(`   ❌ ${partner.name} 업데이트 실패:`, e.message);
            }
        }

        console.log('\n🎉 파트너 업데이트 완료!');

    } catch (e) {
        console.error('❌ 업데이트 실패:', e.message);
        console.error(e);
    }
}

main();

