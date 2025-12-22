import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

const ADMIN_EMAIL = 'admin@bonghwangdae.com';
const ADMIN_PASS = 'bonghwangdae1234';

async function main() {
    try {
        // 1. Authenticate or create admin
        try {
            await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);
            console.log('Admin authenticated.');
        } catch (e) {
            console.log('Admin auth failed:', e.data || e.message);
            console.log('Trying to create initial admin...');
            // Note: Creating admin via API is only possible if no admins exist.
            // If this fails, user might have to do it manually or we assume it's fresh.
            try {
                await pb.admins.create({
                    email: ADMIN_EMAIL,
                    password: ADMIN_PASS,
                    passwordConfirm: ADMIN_PASS,
                });
                console.log('Admin created.');
                await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);
            } catch (createErr) {
                console.error("Failed to create admin:", createErr.data || createErr.message);
            }
        }

        // 2. Create Projects Collection
        try {
            await pb.collections.create({
                name: 'projects',
                type: 'base',
                schema: [
                    { name: 'title', type: 'text', required: true },
                    {
                        name: 'category',
                        type: 'select',
                        options: { values: ['DMO', 'Festival', 'Education', 'Space'] },
                        required: true
                    },
                    { name: 'year', type: 'number' },
                    { name: 'thumbnail', type: 'file', maxSelect: 1 },
                    { name: 'images', type: 'file', maxSelect: 10 },
                    { name: 'description', type: 'editor' },
                    { name: 'client', type: 'text' }
                ]
            });
            console.log('Collection "projects" created.');
        } catch (e) {
            console.log('Collection "projects" might already exist or error:', e.message);
        }

        // 3. Create Notices Collection
        try {
            await pb.collections.create({
                name: 'notices',
                type: 'base',
                schema: [
                    { name: 'title', type: 'text', required: true },
                    { name: 'content', type: 'editor' },
                    { name: 'is_pinned', type: 'bool' },
                    { name: 'date', type: 'date' }
                ]
            });
            console.log('Collection "notices" created.');
        } catch (e) {
            console.log('Collection "notices" might already exist or error:', e.message);
        }

        // 4. Create Partners Collection
        try {
            await pb.collections.create({
                name: 'partners',
                type: 'base',
                schema: [
                    { name: 'name', type: 'text', required: true },
                    { name: 'logo', type: 'file', maxSelect: 1 },
                    { name: 'link', type: 'url' }
                ]
            });
            console.log('Collection "partners" created.');
        } catch (e) {
            console.log('Collection "partners" might already exist or error:', e.message);
        }

        // 5. Create Inquiries Collection
        try {
            await pb.collections.create({
                name: 'inquiries',
                type: 'base',
                schema: [
                    { name: 'name', type: 'text', required: true },
                    { name: 'affiliation', type: 'text' },
                    { name: 'contact', type: 'text', required: true },
                    { name: 'message', type: 'text' }
                ]
            });
            console.log('Collection "inquiries" created.');
        } catch (e) {
            console.log('Collection "inquiries" might already exist or error:', e.message);
        }

    } catch (err) {
        console.error('Script failed:', err);
    }
}

main();
