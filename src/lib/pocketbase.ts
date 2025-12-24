import PocketBase from 'pocketbase';

// 환경 변수에서 baseUrl 가져오기 및 정규화
const getBaseUrl = () => {
    const envUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL;
    
    if (!envUrl) {
        return 'http://127.0.0.1:8090';
    }
    
    // 프로토콜이 없으면 https:// 추가
    if (!envUrl.startsWith('http://') && !envUrl.startsWith('https://')) {
        return `https://${envUrl}`;
    }
    
    return envUrl;
};

const pb = new PocketBase(getBaseUrl());

// 클라이언트 사이드에서 baseUrl 확실하게 설정
if (typeof window !== 'undefined') {
    const envUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL;
    if (envUrl) {
        // 프로토콜이 없으면 https:// 추가
        const normalizedUrl = envUrl.startsWith('http://') || envUrl.startsWith('https://') 
            ? envUrl 
            : `https://${envUrl}`;
        pb.baseUrl = normalizedUrl;
    }
}

// 자동 취소 비활성화
pb.autoCancellation(false);

// 캐시 비활성화를 위한 beforeSend 훅
pb.beforeSend = function (url, options) {
    options.cache = 'no-store';
    options.headers = {
        ...options.headers,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
    };
    return { url, options };
};

export default pb;
