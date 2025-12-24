import PocketBase from 'pocketbase';
import { readFileSync } from 'fs';
import { join } from 'path';

const pb = new PocketBase('http://127.0.0.1:8090');

const ADMIN_EMAIL = 'admin@bonghwangdae.com';
const ADMIN_PASS = 'bonghwangdae1234';

async function main() {
    try {
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);
        console.log('✅ 로그인 성공');

        // Partner A 찾기
        const partners = await pb.collection('partners').getList(1, 50, {
            filter: `name = "Partner A"`
        });

        if (partners.items.length === 0) {
            console.log('❌ Partner A를 찾을 수 없습니다. 먼저 파트너를 생성해주세요.');
            return;
        }

        const partnerA = partners.items[0];
        console.log(`✅ Partner A 찾음: ${partnerA.id}`);

        // 이미지 파일 읽기
        const imagePath = join(process.cwd(), '..', 'public', 'bonghwang1935.png');
        const imageFile = readFileSync(imagePath);
        const blob = new Blob([imageFile], { type: 'image/png' });
        const file = new File([blob], 'bonghwang1935.png', { type: 'image/png' });

        // FormData 생성
        const formData = new FormData();
        formData.append('logo', file);

        // Partner A 업데이트
        await pb.collection('partners').update(partnerA.id, formData);
        console.log('✅ Partner A 로고 업데이트 완료!');

        // 업데이트된 레코드 확인
        const updated = await pb.collection('partners').getOne(partnerA.id);
        console.log('업데이트된 파트너:', updated);

    } catch (err) {
        console.error('❌ 스크립트 실패:', err);
        if (err.response) {
            console.error('응답 데이터:', err.response);
        }
    }
}

main();

