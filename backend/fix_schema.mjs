import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

const ADMIN_EMAIL = 'admin@bonghwangdae.com';
const ADMIN_PASS = 'bonghwangdae1234';

async function main() {
    try {
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);
        console.log('Admin authenticated.');

        // 1. Fix Notices
        try {
            const collection = await pb.collections.getOne('notices');
            collection.fields = [
                { name: 'title', type: 'text', required: true },
                { name: 'content', type: 'editor' },
                { name: 'is_pinned', type: 'bool' },
                { name: 'date', type: 'date' }
            ];
            await pb.collections.update('notices', collection);
            console.log('Fixed schema for: notices');
        } catch (e) {
            console.error('Failed to fix notices:', e.message);
        }

        // 2. Fix Projects
        try {
            const collection = await pb.collections.getOne('projects');
            collection.fields = [
                { name: 'title', type: 'text', required: true },
                {
                    name: 'category',
                    type: 'select',
                    options: { values: ['DMO', 'Festival', 'Education', 'Space'] },
                    required: true,
                    maxSelect: 1
                },
                { name: 'year', type: 'number' },
                { name: 'thumbnail', type: 'file', maxSelect: 1 },
                { name: 'images', type: 'file', maxSelect: 10 },
                { name: 'description', type: 'editor' },
                { name: 'client', type: 'text' }
            ];
            await pb.collections.update('projects', collection);
            console.log('Fixed schema for: projects');
        } catch (e) {
            console.error('Failed to fix projects:', e.message);
        }

        // 3. Fix Partners
        try {
            const collection = await pb.collections.getOne('partners');
            collection.fields = [
                { name: 'name', type: 'text', required: true },
                { name: 'logo', type: 'file', maxSelect: 1 },
                { name: 'link', type: 'url' }
            ];
            await pb.collections.update('partners', collection);
            console.log('Fixed schema for: partners');
        } catch (e) {
            console.error('Failed to fix partners:', e.message);
        }

        // 4. Fix Inquiries
        try {
            const collection = await pb.collections.getOne('inquiries');
            collection.fields = [
                { name: 'name', type: 'text', required: true },
                { name: 'affiliation', type: 'text' },
                { name: 'contact', type: 'text', required: true },
                { name: 'message', type: 'text' }
            ];
            await pb.collections.update('inquiries', collection);
            console.log('Fixed schema for: inquiries');
        } catch (e) {
            console.error('Failed to fix inquiries:', e.message);
        }

    } catch (err) {
        console.error('Script failed:', err);
    }
}

main();
