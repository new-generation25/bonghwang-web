/**
 * 로컬 PocketBase에서 스키마를 가져와 Railway에 복사
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

async function updateCollectionSchema(collectionName, schema, token) {
    // 먼저 기존 컬렉션 정보 가져오기
    const getResponse = await fetch(`${RAILWAY_URL}/api/collections/${collectionName}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!getResponse.ok) {
        throw new Error(`컬렉션 정보 가져오기 실패: ${getResponse.statusText}`);
    }

    const collection = await getResponse.json();

    // 기존 필드에 새 필드 추가 (id 필드는 유지)
    const existingFields = collection.fields || collection.schema || [];
    const existingFieldNames = existingFields.map(f => f.name);
    
    // 새 필드만 추가 (이미 존재하는 필드는 건너뛰기)
    const fieldsToAdd = schema.filter(field => !existingFieldNames.includes(field.name));
    
    if (fieldsToAdd.length === 0) {
        console.log(`   ⚠️  추가할 필드가 없습니다. 모든 필드가 이미 존재합니다.`);
        return collection;
    }

    console.log(`   추가할 필드: ${fieldsToAdd.map(f => f.name).join(', ')}`);

    // 기존 필드 + 새 필드
    const updatedFields = [...existingFields, ...fieldsToAdd];

    // 스키마 업데이트 (fields 사용)
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
        throw new Error(`스키마 업데이트 실패: ${error.message || updateResponse.statusText}`);
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

        // 복사할 컬렉션 목록
        const collectionsToCopy = ['projects', 'notices', 'partners'];

        for (const collectionName of collectionsToCopy) {
            try {
                console.log(`📦 ${collectionName} 컬렉션 스키마 가져오는 중...`);
                
                // 로컬에서 스키마 가져오기
                const localCollection = await LOCAL_PB.collections.getOne(collectionName);
                
                // 컬렉션 구조 확인
                console.log(`   컬렉션 키:`, Object.keys(localCollection));
                
                // schema 또는 fields 확인
                const allFields = localCollection.schema || localCollection.fields || [];
                
                // 시스템 필드(id) 제외하고 사용자 정의 필드만 추출
                const userFields = allFields.filter(field => field.name !== 'id');
                console.log(`   로컬 스키마 필드 수: ${userFields.length} (시스템 필드 제외)`);
                
                // 필드 정보 출력
                userFields.forEach((field, index) => {
                    console.log(`   필드 ${index + 1}: ${field.name} (${field.type})`);
                });

                // Railway에 스키마 업데이트
                console.log(`\n📤 Railway에 ${collectionName} 스키마 업데이트 중...`);
                await updateCollectionSchema(collectionName, userFields, token);
                console.log(`   ✅ ${collectionName} 스키마 업데이트 완료\n`);

            } catch (e) {
                console.error(`   ❌ ${collectionName} 스키마 복사 실패:`, e.message);
                console.error(e);
            }
        }

        console.log('🎉 스키마 복사 완료!');

    } catch (e) {
        console.error('❌ 스키마 복사 실패:', e.message);
        console.error(e);
    }
}

main();

