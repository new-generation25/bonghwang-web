import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

const ADMIN_EMAIL = 'admin@bonghwangdae.com';
const ADMIN_PASS = 'bonghwangdae1234';

async function main() {
    try {
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);
        console.log('Admin authenticated.');

        // 1. Projects: Public Read
        try {
            const collection = await pb.collections.getOne('projects');
            collection.listRule = "";
            collection.viewRule = "";
            await pb.collections.update('projects', collection);
            console.log('Updated rules for: projects (Public Read)');
        } catch (e) {
            console.error('Failed to update projects:', e.message);
        }

        // 2. Notices: Public Read
        try {
            const collection = await pb.collections.getOne('notices');
            collection.listRule = "";
            collection.viewRule = "";
            await pb.collections.update('notices', collection);
            console.log('Updated rules for: notices (Public Read)');
        } catch (e) {
            console.error('Failed to update notices:', e.message);
        }

        // 3. Partners: Public Read
        try {
            const collection = await pb.collections.getOne('partners');
            collection.listRule = "";
            collection.viewRule = "";
            await pb.collections.update('partners', collection);
            console.log('Updated rules for: partners (Public Read)');
        } catch (e) {
            console.error('Failed to update partners:', e.message);
        }

        // 4. Inquiries: Public Create
        try {
            const collection = await pb.collections.getOne('inquiries');
            collection.createRule = "";
            await pb.collections.update('inquiries', collection);
            console.log('Updated rules for: inquiries (Public Create)');
        } catch (e) {
            console.error('Failed to update inquiries:', e.message);
        }

    } catch (err) {
        console.error('Script failed:', err);
    }
}

main();
