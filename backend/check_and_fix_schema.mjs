/**
 * 로컬과 Railway의 스키마를 비교하고 Railway에 필드 추가
 */

import PocketBase from 'pocketbase';

const LOCAL_PB = new PocketBase('http://127.0.0.1:8090');
const RAILWAY_URL = 'https://bonghwang-web-production.up.railway.app';

const ADMIN_EMAIL = 'admin@bonghwangdae.com';
const LOCAL_PASS = 'bonghwang1935';
const RAILWAY_PASS = 'bonghwang1935';

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

async function addFieldToCollection(collectionName, field, token) {
    // 기존 컬렉션 정보 가져오기
    const getResponse = await fetch(`${RAILWAY_URL}/api/collections/${collectionName}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!getResponse.ok) {
        throw new Error(`컬렉션 정보 가져오기 실패: ${getResponse.statusText}`);
    }

    const collection = await getResponse.json();
    const existingFields = collection.fields || [];

    // 필드가 이미 존재하는지 확인
    if (existingFields.some(f => f.name === field.name)) {
        console.log(`   ⚠️  필드 "${field.name}"가 이미 존재합니다.`);
        return collection;
    }

    // 새 필드 추가
    const updatedFields = [...existingFields, field];

    // 컬렉션 업데이트
    const updateResponse = await fetch(`${RAILWAY_URL}/api/collections/${collectionName}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            fields: updatedFields,
        }),
    });

    if (!updateResponse.ok) {
        const errorText = await updateResponse.text();
        let error;
        try {
            error = JSON.parse(errorText);
        } catch {
            error = { message: errorText };
        }
        throw new Error(`필드 추가 실패: ${error.message || updateResponse.statusText}`);
    }

    return await updateResponse.json();
}

async function main() {
    try {
        console.log('🔐 로컬 PocketBase 인증 중...');
        await LOCAL_PB.admins.authWithPassword(ADMIN_EMAIL, LOCAL_PASS);
        console.log('✅ 로컬 인증 성공');

        console.log('🔐 Railway PocketBase 인증 중...');
        const token = await getRailwayToken();
        console.log('✅ Railway 인증 성공\n');

        // Partners 컬렉션 확인
        console.log('📦 Partners 컬렉션 스키마 비교 중...\n');
        
        // 로컬 스키마
        const localPartners = await LOCAL_PB.collections.getOne('partners');
        const localFields = (localPartners.fields || []).filter(f => f.name !== 'id');
        console.log('로컬 필드:');
        localFields.forEach(field => {
            console.log(`   - ${field.name} (${field.type})`);
        });

        // Railway 스키마
        const railwayPartnersResponse = await fetch(`${RAILWAY_URL}/api/collections/partners`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        const railwayPartners = await railwayPartnersResponse.json();
        const railwayFields = (railwayPartners.fields || []).filter(f => f.name !== 'id');
        console.log('\nRailway 필드:');
        railwayFields.forEach(field => {
            console.log(`   - ${field.name} (${field.type})`);
        });

        // 누락된 필드 찾기
        const railwayFieldNames = railwayFields.map(f => f.name);
        const missingFields = localFields.filter(f => !railwayFieldNames.includes(f.name));

        if (missingFields.length === 0) {
            console.log('\n✅ 모든 필드가 Railway에 존재합니다.');
            return;
        }

        console.log(`\n📤 누락된 필드 ${missingFields.length}개 추가 중...`);
        for (const field of missingFields) {
            try {
                // 필드 정의 정리 (id 제거)
                const fieldToAdd = {
                    name: field.name,
                    type: field.type,
                    required: field.required || false,
                    options: field.options || {},
                };

                // 타입별 추가 속성
                if (field.type === 'file') {
                    fieldToAdd.maxSelect = field.maxSelect || 1;
                }
                if (field.type === 'select') {
                    fieldToAdd.maxSelect = field.maxSelect || 1;
                }
                if (field.type === 'number') {
                    fieldToAdd.min = field.min;
                    fieldToAdd.max = field.max;
                }
                if (field.type === 'text') {
                    fieldToAdd.min = field.min;
                    fieldToAdd.max = field.max;
                }

                await addFieldToCollection('partners', fieldToAdd, token);
                console.log(`   ✅ 필드 "${field.name}" 추가 완료`);
            } catch (e) {
                console.error(`   ❌ 필드 "${field.name}" 추가 실패:`, e.message);
            }
        }

        console.log('\n🎉 스키마 수정 완료!');

    } catch (e) {
        console.error('❌ 스키마 수정 실패:', e.message);
        console.error(e);
    }
}

main();

