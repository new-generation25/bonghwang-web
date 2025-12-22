import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

const ADMIN_EMAIL = 'admin@bonghwangdae.com';
const ADMIN_PASS = 'bonghwangdae1234';

async function main() {
    try {
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);

        // 1. Delete
        try {
            const collection = await pb.collections.getOne('partners');
            if (collection) {
                await pb.collections.delete(collection.id);
                console.log('Deleted existing "partners" collection.');
            }
        } catch (e) {
            // Ignore
        }

        // 2. Create
        try {
            await pb.collections.create({
                name: 'partners',
                type: 'base',
                fields: [
                    { name: 'name', type: 'text', required: true },
                    { name: 'logo', type: 'file', maxSelect: 1 },
                    { name: 'link', type: 'url' }
                ],
                listRule: "",
                viewRule: ""
            });
            console.log('Created "partners" collection.');
        } catch (e) {
            console.error('Failed to create partners collection:', e.originalError || e);
        }

        // 3. Seed
        const partners = [
            { name: "Partner A", link: "https://example.com" },
            { name: "Partner B", link: "" },
            { name: "Member C", link: "https://example.com" },
            { name: "Member D", link: "" }
        ];

        for (const partner of partners) {
            await pb.collection('partners').create(partner);
            console.log(`Created partner: ${partner.name}`);
        }

    } catch (err) {
        console.error('Script failed:', err);
    }
}

main();
