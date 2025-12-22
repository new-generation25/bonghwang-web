import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

async function main() {
    try {
        console.log("Fetching partners WITHOUT sort...");
        try {
            const res1 = await pb.collection('partners').getList(1, 5);
            console.log("Success (No Sort). Records:", res1.items.length);
            if (res1.items.length > 0) {
                console.log("Sample Record keys:", Object.keys(res1.items[0]));
            }
        } catch (e) {
            console.error("Failed (No Sort):", e.data);
        }

        console.log("\nFetching partners WITH sort='created'...");
        try {
            const res2 = await pb.collection('partners').getList(1, 5, { sort: 'created' });
            console.log("Success (sort='created').");
        } catch (e) {
            console.error("Failed (sort='created'):", e.data);
        }

        console.log("\nFetching partners WITH sort='-created' (desc)...");
        try {
            const res3 = await pb.collection('partners').getList(1, 5, { sort: '-created' });
            console.log("Success (sort='-created').");
        } catch (e) {
            console.error("Failed (sort='-created'):", e.data);
        }

    } catch (err) {
        console.error('Script error:', err);
    }
}

main();
