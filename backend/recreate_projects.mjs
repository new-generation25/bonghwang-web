import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

const ADMIN_EMAIL = 'admin@bonghwangdae.com';
const ADMIN_PASS = 'bonghwangdae1234';

async function main() {
    try {
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);

        // Try delete again just in case (though it's likely gone)
        try {
            const collection = await pb.collections.getOne('projects');
            if (collection) {
                await pb.collections.delete(collection.id);
            }
        } catch (e) {
            // Ignore not found
        }

        // Create projects collection
        try {
            await pb.collections.create({
                name: 'projects',
                type: 'base',
                fields: [
                    { name: 'title', type: 'text', required: true },
                    {
                        name: 'category',
                        type: 'select',
                        values: ['DMO', 'Festival', 'Education', 'Space'], // Values at top level
                        required: true,
                        maxSelect: 1
                    },
                    { name: 'year', type: 'number' },
                    { name: 'thumbnail', type: 'file', maxSelect: 1 },
                    { name: 'images', type: 'file', maxSelect: 10 },
                    { name: 'description', type: 'editor' },
                    { name: 'client', type: 'text' }
                ],
                listRule: "",
                viewRule: ""
            });
            console.log('Created "projects" collection with correct schema.');
        } catch (e) {
            console.error('Failed to create projects collection:', JSON.stringify(e.data, null, 2));
        }

    } catch (err) {
        console.error('Script failed:', err);
    }
}

main();
