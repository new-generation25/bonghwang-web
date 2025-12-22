import PocketBase from 'pocketbase';
const pb = new PocketBase('http://127.0.0.1:8090');

const ADMIN_EMAIL = 'admin@bonghwangdae.com';
const ADMIN_PASS = 'bonghwangdae1234';

async function main() {
    try {
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);

        const projects = [
            {
                title: 'Bonghwangdae Festival',
                category: 'Festival',
                year: 2024,
                client: 'Gimhae CIty',
                description: '<p>A successful local festival bringing together 5000+ visitors.</p>'
            },
            {
                title: 'Local Creator Education',
                category: 'Education',
                year: 2024,
                client: 'Internal',
                description: '<p>Educating the next generation of local creators.</p>'
            },
            {
                title: 'Community Space Design',
                category: 'Space',
                year: 2023,
                client: 'Ministry of Culture',
                description: '<p>Renovating old spaces for community use.</p>'
            }
        ];

        for (const proj of projects) {
            await pb.collection('projects').create(proj);
            console.log(`Created project: ${proj.title}`);
        }
        console.log("Projects seeding complete!");

    } catch (e) {
        console.error("Seeding failed:", e);
    }
}

main();
