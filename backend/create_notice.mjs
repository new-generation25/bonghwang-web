import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

const ADMIN_EMAIL = 'admin@bonghwangdae.com';
const ADMIN_PASS = 'bonghwangdae1234';

async function main() {
    try {
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);
        console.log("Authenticated as Admin");

        // Create a sample notice
        const notice = {
            title: '봉황대협동조합 웹사이트 오픈 안내',
            content: '<p>안녕하세요, 봉황대협동조합입니다.</p><p><br></p><p>저희 협동조합의 새로운 웹사이트가 오픈되었습니다. 앞으로 다양한 소식과 프로젝트 정보를 이곳에서 확인하실 수 있습니다.</p><p><br></p><p>많은 관심과 참여 부탁드립니다.</p>',
            is_pinned: false,
            date: new Date()
        };

        const created = await pb.collection('notices').create(notice);
        console.log(`Created notice: ${created.title}`);
        console.log(`Notice ID: ${created.id}`);

    } catch (e) {
        console.error("Failed to create notice:", e);
    }
}

main();

