/**
 * 로컬 PocketBase에서 파트너 데이터를 가져와 Railway로 업로드
 */

import PocketBase from 'pocketbase';

const LOCAL_PB = new PocketBase('http://127.0.0.1:8090');
const RAILWAY_URL = 'https://bonghwang-web-production.up.railway.app';

const LOCAL_ADMIN_EMAIL = 'admin@bonghwangdae.com';
const LOCAL_ADMIN_PASS = 'bonghwang1935';
const RAILWAY_ADMIN_PASS = 'bonghwang1935';

async function getRailwayToken() {
    const response = await fetch(`${RAILWAY_URL}/api/admins/auth-with-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            identity: LOCAL_ADMIN_EMAIL,
            password: RAILWAY_ADMIN_PASS,
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

async function createRecord(collection, data, token) {
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

    const response = await fetch(`${RAILWAY_URL}/api/collections/${collection}/records`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`레코드 생성 실패: ${error.message || response.statusText}`);
    }

    return await response.json();
}

async function main() {
    try {
        console.log('🔐 로컬 PocketBase 인증 중...');
        await LOCAL_PB.admins.authWithPassword(LOCAL_ADMIN_EMAIL, LOCAL_ADMIN_PASS);
        console.log('✅ 로컬 인증 성공');

        console.log('🔐 Railway PocketBase 인증 중...');
        const token = await getRailwayToken();
        console.log('✅ Railway 인증 성공\n');

        // 로컬에서 파트너 데이터 가져오기
        console.log('📦 로컬에서 파트너 데이터 가져오는 중...');
        const localPartners = await LOCAL_PB.collection('partners').getFullList();
        console.log(`   ${localPartners.length}개의 파트너 발견\n`);

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

        // 로컬 파트너를 Railway에 업로드
        console.log('📤 Railway에 파트너 업로드 중...');
        for (const localPartner of localPartners) {
            try {
                // 기존 파트너 찾기 (이름으로)
                const existingPartner = railwayPartners.find(p => p.name === localPartner.name);
                
                const partnerData = {
                    name: localPartner.name,
                    link: localPartner.link || '',
                    sort: localPartner.sort || 0,
                };

                // 로고 파일이 있으면 다운로드 후 업로드
                if (localPartner.logo) {
                    try {
                        const logoUrl = LOCAL_PB.files.getURL(localPartner, localPartner.logo);
                        const response = await fetch(logoUrl);
                        const blob = await response.blob();
                        const file = new File([blob], localPartner.logo, { type: blob.type });
                        partnerData.logo = file;
                    } catch (e) {
                        console.log(`   ⚠️  ${localPartner.name}의 로고를 가져오지 못했습니다:`, e.message);
                    }
                }

                if (existingPartner) {
                    // 기존 파트너 업데이트
                    await updateRecord('partners', existingPartner.id, partnerData, token);
                    console.log(`   ✅ ${localPartner.name} 업데이트 완료`);
                } else {
                    // 새 파트너 생성
                    await createRecord('partners', partnerData, token);
                    console.log(`   ✅ ${localPartner.name} 생성 완료`);
                }
            } catch (e) {
                console.error(`   ❌ ${localPartner.name} 업로드 실패:`, e.message);
            }
        }

        console.log('\n🎉 파트너 마이그레이션 완료!');

    } catch (e) {
        console.error('❌ 마이그레이션 실패:', e.message);
        console.error(e);
    }
}

main();

