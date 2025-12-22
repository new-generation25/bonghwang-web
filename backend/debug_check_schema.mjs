import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

const ADMIN_EMAIL = 'admin@bonghwangdae.com';
const ADMIN_PASS = 'bonghwangdae1234';

async function main() {
    try {
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);

        try {
            const collection = await pb.collections.getOne('notices');
            console.log('Notices Collection:', JSON.stringify(collection, null, 2));
        } catch (e) {
            console.error('Failed to get notices collection:', e.message);
        }

    } catch (err) {
        console.error('Auth failed:', err);
    }
}

main();
