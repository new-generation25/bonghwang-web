# 봉황대협동조합 웹사이트

봉황대협동조합 공식 웹사이트입니다. Next.js로 구축되었습니다.

This is a [Next.js](https://nextjs.org) project for Bonghwangdae Cooperative website.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## 백엔드 서버 실행

이 프로젝트는 PocketBase를 백엔드로 사용합니다. 개발 시 백엔드 서버도 함께 실행해야 합니다:

```bash
cd backend
.\pocketbase.exe serve
```

백엔드 서버는 기본적으로 `http://localhost:8090`에서 실행됩니다.

## 이미지 파일 저장 위치

웹사이트에서 사용할 이미지 파일은 **`public` 폴더**에 저장하세요.

### 사용 방법

1. **정적 이미지**: `public` 폴더에 이미지를 저장하고, 다음과 같이 참조합니다:
   ```tsx
   <img src="/images/hero.jpg" alt="Hero Image" />
   ```

2. **예시 구조**:
   ```
   public/
   ├── images/
   │   ├── hero.jpg          # Hero 섹션 배경 이미지
   │   ├── logo.png          # 로고 이미지
   │   └── projects/         # 프로젝트 이미지들
   │       ├── project1.jpg
   │       └── project2.jpg
   └── favicon.ico
   ```

3. **PocketBase를 통한 이미지**: 
   - 프로젝트 썸네일, 갤러리 이미지 등은 PocketBase에 업로드하여 관리합니다.
   - 관리자 페이지에서 이미지를 업로드할 수 있습니다.

### 이미지 최적화

- Next.js는 자동으로 이미지를 최적화합니다 (`next/image` 컴포넌트 사용 시)
- 권장 이미지 형식: WebP, JPEG, PNG
- 권장 크기: Hero 이미지는 1920x1080px 이상

## 다크 모드 / 라이트 모드

웹사이트는 사용자의 시스템 설정에 따라 자동으로 다크 모드 또는 라이트 모드를 적용합니다.

- **시스템 설정 감지**: 운영체제의 다크 모드 설정을 자동으로 감지합니다.
- **수동 설정**: 브라우저 개발자 도구에서 `localStorage.setItem('theme', 'dark')` 또는 `localStorage.setItem('theme', 'light')`로 수동 설정 가능합니다.
- **Hero 섹션**: 첫 화면의 Hero 섹션은 항상 검정색 배경으로 시작합니다.

## 기능 개발 프로세스

이 프로젝트는 TDD(Test-Driven Development) 원칙에 따라 기능을 개발합니다. 새로운 기능을 추가하기 전에 다음 가이드를 참조하세요:

- **[기능 계획 가이드](docs/plans/README.md)**: 계획 문서 작성 방법
- **[plan-template.md](plan-template.md)**: 계획 문서 템플릿
- **[SKILL.md](SKILL.md)**: Feature Planner 가이드라인

### 빠른 시작

1. `plan-template.md`를 기반으로 `docs/plans/PLAN_<feature-name>.md` 생성
2. SKILL.md의 가이드라인에 따라 단계별 계획 작성
3. 각 단계는 RED-GREEN-REFACTOR 사이클로 진행
4. 각 단계 완료 후 품질 게이트 통과 확인

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
