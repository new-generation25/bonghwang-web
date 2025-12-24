import PocketBase from 'pocketbase';

// 클라이언트 사이드에서 환경 변수 확인
const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
        // 클라이언트 사이드: 런타임에 환경 변수 확인
        return process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';
    }
    // 서버 사이드: 빌드 타임 환경 변수 사용
    return process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';
};

const pb = new PocketBase(getBaseUrl());

// 클라이언트 사이드에서 baseUrl 동적 설정
if (typeof window !== 'undefined') {
    const envUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL;
    if (envUrl) {
        pb.baseUrl = envUrl;
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
