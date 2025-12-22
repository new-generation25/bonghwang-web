import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

async function main() {
    try {
        console.log("Fetching notices...");
        const result = await pb.collection('notices').getList(1, 3, {
            sort: '-date',
        });
        console.log("Success:", JSON.stringify(result, null, 2));
    } catch (e) {
        console.error("Fetch failed:", JSON.stringify(e, null, 2));
        if (e.originalError) {
            console.error("Original Error:", e.originalError);
        }
    }
}

main();
