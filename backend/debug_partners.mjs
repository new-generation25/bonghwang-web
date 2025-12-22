import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

const ADMIN_EMAIL = 'admin@bonghwangdae.com';
const ADMIN_PASS = 'bonghwangdae1234';

async function main() {
    try {
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);
        const collection = await pb.collections.getOne('partners');
        console.log('Partners Fields:', JSON.stringify(collection.fields, null, 2));
    } catch (err) {
        console.error('Error:', err);
    }
}

main();
