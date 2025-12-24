/**
 * 로컬 PocketBase에서 프로젝트 데이터를 가져와 Railway로 업로드
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
            // 단일 파일
            formData.append(key, value);
        } else if (Array.isArray(value) && value.length > 0 && value[0] instanceof File) {
            // 여러 파일 (PocketBase는 각 파일을 개별적으로 append)
            value.forEach(file => {
                formData.append(key, file);
            });
        } else if (value !== null && value !== undefined) {
            // 일반 데이터
            formData.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
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
        const errorText = await response.text();
        let error;
        try {
            error = JSON.parse(errorText);
        } catch {
            error = { message: errorText };
        }
        throw new Error(`레코드 업데이트 실패: ${error.message || response.statusText}`);
    }

    return await response.json();
}

async function createRecord(collection, data, token) {
    const formData = new FormData();
    
    for (const [key, value] of Object.entries(data)) {
        if (value instanceof File || value instanceof Blob) {
            // 단일 파일
            formData.append(key, value);
        } else if (Array.isArray(value) && value.length > 0 && value[0] instanceof File) {
            // 여러 파일 (PocketBase는 각 파일을 개별적으로 append)
            value.forEach(file => {
                formData.append(key, file);
            });
        } else if (value !== null && value !== undefined) {
            // 일반 데이터
            formData.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
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
        const errorText = await response.text();
        let error;
        try {
            error = JSON.parse(errorText);
        } catch {
            error = { message: errorText };
        }
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

        // 로컬에서 프로젝트 데이터 가져오기
        console.log('📦 로컬에서 프로젝트 데이터 가져오는 중...');
        const localProjects = await LOCAL_PB.collection('projects').getFullList();
        console.log(`   ${localProjects.length}개의 프로젝트 발견\n`);

        // Railway에서 기존 프로젝트 가져오기
        console.log('📦 Railway에서 기존 프로젝트 가져오는 중...');
        const railwayProjectsResponse = await fetch(`${RAILWAY_URL}/api/collections/projects/records`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        const railwayProjectsData = await railwayProjectsResponse.json();
        const railwayProjects = railwayProjectsData.items || [];
        console.log(`   ${railwayProjects.length}개의 프로젝트 발견\n`);

        // 로컬 프로젝트를 Railway에 업로드
        console.log('📤 Railway에 프로젝트 업로드 중...');
        for (const localProject of localProjects) {
            try {
                // 기존 프로젝트 찾기 (제목으로)
                const existingProject = railwayProjects.find(p => p.title === localProject.title);
                
                const projectData = {
                    title: localProject.title,
                    category: localProject.category,
                    year: localProject.year,
                    client: localProject.client || '',
                    description: localProject.description || '',
                };

                // 썸네일 파일이 있으면 다운로드 후 업로드
                if (localProject.thumbnail) {
                    try {
                        console.log(`   📥 ${localProject.title} 썸네일 다운로드 중...`);
                        const thumbnailUrl = LOCAL_PB.files.getURL(localProject, localProject.thumbnail);
                        console.log(`   📥 썸네일 URL: ${thumbnailUrl}`);
                        const response = await fetch(thumbnailUrl);
                        if (!response.ok) {
                            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                        }
                        const blob = await response.blob();
                        const file = new File([blob], localProject.thumbnail, { type: blob.type || 'image/jpeg' });
                        projectData.thumbnail = file;
                        console.log(`   ✅ ${localProject.title} 썸네일 다운로드 완료 (${(blob.size / 1024).toFixed(2)} KB)`);
                    } catch (e) {
                        console.error(`   ❌ ${localProject.title}의 썸네일을 가져오지 못했습니다:`, e.message);
                    }
                }

                // 갤러리 이미지가 있으면 다운로드 후 업로드
                if (localProject.images && localProject.images.length > 0) {
                    try {
                        console.log(`   📥 ${localProject.title} 갤러리 이미지 ${localProject.images.length}개 다운로드 중...`);
                        const imageFiles = [];
                        for (let i = 0; i < localProject.images.length; i++) {
                            const imageName = localProject.images[i];
                            try {
                                const imageUrl = LOCAL_PB.files.getURL(localProject, imageName);
                                const response = await fetch(imageUrl);
                                if (!response.ok) {
                                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                                }
                                const blob = await response.blob();
                                const file = new File([blob], imageName, { type: blob.type || 'image/jpeg' });
                                imageFiles.push(file);
                                console.log(`   ✅ 이미지 ${i + 1}/${localProject.images.length}: ${imageName} (${(blob.size / 1024).toFixed(2)} KB)`);
                            } catch (e) {
                                console.error(`   ❌ 이미지 ${i + 1}/${localProject.images.length} (${imageName}) 다운로드 실패:`, e.message);
                            }
                        }
                        if (imageFiles.length > 0) {
                            projectData.images = imageFiles;
                            console.log(`   ✅ ${localProject.title} 갤러리 이미지 ${imageFiles.length}개 다운로드 완료`);
                        }
                    } catch (e) {
                        console.error(`   ❌ ${localProject.title}의 갤러리 이미지를 가져오지 못했습니다:`, e.message);
                    }
                }

                if (existingProject) {
                    // 기존 프로젝트 업데이트
                    console.log(`   📤 ${localProject.title} 업데이트 중...`);
                    const result = await updateRecord('projects', existingProject.id, projectData, token);
                    console.log(`   ✅ ${localProject.title} 업데이트 완료`);
                    if (result.thumbnail) {
                        console.log(`   📷 썸네일 업로드 확인: ${result.thumbnail}`);
                    }
                    if (result.images && result.images.length > 0) {
                        console.log(`   📷 갤러리 이미지 ${result.images.length}개 업로드 확인`);
                    }
                } else {
                    // 새 프로젝트 생성
                    console.log(`   📤 ${localProject.title} 생성 중...`);
                    const result = await createRecord('projects', projectData, token);
                    console.log(`   ✅ ${localProject.title} 생성 완료`);
                    if (result.thumbnail) {
                        console.log(`   📷 썸네일 업로드 확인: ${result.thumbnail}`);
                    }
                    if (result.images && result.images.length > 0) {
                        console.log(`   📷 갤러리 이미지 ${result.images.length}개 업로드 확인`);
                    }
                }
            } catch (e) {
                console.error(`   ❌ ${localProject.title} 업로드 실패:`, e.message);
            }
        }

        console.log('\n🎉 프로젝트 마이그레이션 완료!');

    } catch (e) {
        console.error('❌ 마이그레이션 실패:', e.message);
        console.error(e);
    }
}

main();

