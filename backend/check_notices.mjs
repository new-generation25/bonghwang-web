import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

async function main() {
    try {
        await pb.admins.authWithPassword('admin@bonghwangdae.com', 'bonghwangdae1234');
        const notices = await pb.collection('notices').getFullList({ sort: '-date' });
        console.log('Total notices:', notices.length);
        notices.forEach((n, i) => {
            console.log(`${i+1}. ${n.title} - ${n.date} - Updated: ${n.updated}`);
        });
    } catch(e) {
        console.error('Error:', e.message);
    }
}

main();

