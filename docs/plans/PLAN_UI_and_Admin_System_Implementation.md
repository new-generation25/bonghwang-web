# Implementation Plan: UI 개선 및 관리자 시스템 구현

**Status**: ✅ Complete
**Started**: 2025-01-XX
**Last Updated**: 2025-01-XX
**Completed**: 2025-01-XX

---

## 📋 Overview

### Feature Description
봉황대협동조합 웹사이트의 UI 개선, 공지사항 관리 시스템 구현, 그리고 SEO 최적화를 포함한 종합적인 웹사이트 개선 작업입니다. 주요 작업 내용:

1. UI 스타일 조정 (폰트 크기, 링크 추가)
2. 공지사항 폰트 크기 및 접근성 개선
3. 관리자 페이지 공지사항 등록 시스템 구현 (Tiptap 에디터 통합)
4. 데이터 페칭 및 캐싱 최적화
5. SEO 및 소셜 미디어 공유 최적화

### Success Criteria
- [x] 모든 UI 스타일 변경사항 적용 완료
- [x] 관리자 페이지에서 공지사항 등록/수정 가능
- [x] 프론트엔드에서 공지사항 실시간 반영
- [x] SEO 메타데이터 최적화 완료
- [x] 모든 접근성 경고 해결

### User Impact
- 관리자가 웹사이트에서 공지사항을 쉽게 등록하고 수정할 수 있게 됨
- 사용자가 링크를 공유할 때 올바른 미리보기가 표시됨
- 텍스트 선택 시 가독성이 향상됨
- 공지사항이 실시간으로 반영되어 최신 정보를 제공

---

## 🏗️ Architecture Decisions

| Decision | Rationale | Trade-offs |
|----------|-----------|------------|
| Tiptap 에디터 사용 | 오픈소스 리치 텍스트 에디터로 이미지, 파일 첨부, 텍스트 서식 지원 | 초기 설정이 복잡하지만 확장성이 좋음 |
| PocketBase를 백엔드로 사용 | 간단한 설정으로 CMS 기능 제공 | 확장성 측면에서 제한이 있을 수 있음 |
| Client-side 데이터 페칭 | Next.js App Router와 React Server Components 호환성 | SSR 장점을 완전히 활용하지 못함 |
| 캐시 제어 헤더 추가 | 실시간 데이터 반영을 위한 필수 조치 | 네트워크 요청이 증가할 수 있음 |

---

## 📦 Dependencies

### External Dependencies
- `@tiptap/react`: ^3.14.0 (리치 텍스트 에디터)
- `@tiptap/extension-*`: 여러 확장 패키지
- `pocketbase`: ^0.26.5 (백엔드 데이터베이스)
- `@radix-ui/react-dialog`: ^1.1.15 (다이얼로그 컴포넌트)
- `date-fns`: ^4.1.0 (날짜 포맷팅)

---

## 🚀 Implementation Phases

### Phase 1: UI 스타일 및 링크 개선
**Goal**: 홈페이지의 폰트 크기 조정 및 Footer 링크 추가/수정
**Estimated Time**: 1시간
**Status**: ✅ Complete

#### Tasks

- [x] **Task 1.1**: Partners 컴포넌트 "Network" 텍스트 폰트 크기 조정
  - File(s): `src/components/home/Partners.tsx`
  - 변경: `text-sm` → `text-base`
  - 로딩/에러 상태 처리 추가

- [x] **Task 1.2**: Navbar "Projects" 링크 폰트 크기 조정
  - File(s): `src/components/layout/Navbar.tsx`
  - 변경: `text-[13px]` → `text-sm`

- [x] **Task 1.3**: Footer 링크 추가 및 수정
  - File(s): `src/components/layout/Footer.tsx`
  - Instagram 링크: `https://www.instagram.com/gimhae.dmo/`
  - Blog 링크: `https://blog.naver.com/bonghwang-dae`
  - Email 링크: `mailto:contact@bonghwangdae.com`

- [x] **Task 1.4**: About 섹션 태그 수정
  - File(s): `src/components/home/About.tsx`
  - 변경: `#DMO` → `#지역관광`

#### Quality Gate ✋

**Build & Tests**:
- [x] **Build**: 프로젝트 빌드 성공
- [x] **Linting**: 린트 오류 없음

**Functionality**:
- [x] **Manual Testing**: 모든 UI 변경사항 확인 완료

---

### Phase 2: 공지사항 폰트 및 접근성 개선
**Goal**: 공지사항 표시 영역의 폰트 크기 조정 및 접근성 개선
**Estimated Time**: 2시간
**Status**: ✅ Complete

#### Tasks

- [x] **Task 2.1**: RecentNews 컴포넌트 폰트 크기 조정
  - File(s): `src/components/home/RecentNews.tsx`
  - 변경: 제목/날짜 `text-[11px]` → `text-[13px]`
  - DialogDescription 추가 (접근성 개선)

- [x] **Task 2.2**: notices 페이지 폰트 크기 조정
  - File(s): `src/app/notices/page.tsx`
  - 변경: 제목/날짜 `text-[11px]` → `text-[13px]`
  - DialogDescription 추가 (접근성 개선)

- [x] **Task 2.3**: 텍스트 선택 가독성 개선
  - File(s): `src/app/globals.css`
  - `::selection` 스타일 추가
  - 배경색: accent 색상 30% 투명도
  - 텍스트 색상 유지

- [x] **Task 2.4**: Tiptap 에디터 스타일 추가
  - File(s): `src/app/globals.css`
  - `.ProseMirror` 클래스 스타일 정의
  - 제목, 리스트, 링크, 이미지 등 기본 서식 스타일

#### Quality Gate ✋

**Build & Tests**:
- [x] **Build**: 프로젝트 빌드 성공
- [x] **Linting**: 린트 오류 없음

**Functionality**:
- [x] **Manual Testing**: 폰트 크기 및 텍스트 선택 확인 완료
- [x] **Accessibility**: DialogDescription 추가로 경고 해결

---

### Phase 3: 관리자 페이지 공지사항 등록 시스템 구현
**Goal**: Tiptap 에디터를 사용한 공지사항 등록/수정 시스템 구현
**Estimated Time**: 6시간
**Status**: ✅ Complete

#### Tasks

- [x] **Task 3.1**: RichTextEditor 컴포넌트 생성
  - File(s): `src/components/admin/RichTextEditor.tsx`
  - Tiptap 에디터 통합
  - 이미지 업로드, 파일 첨부, 텍스트 서식 기능
  - SSR 이슈 해결 (`isMounted` 상태 추가)
  - 중복 확장 경고 해결 (StarterKit 대신 개별 확장 사용)

- [x] **Task 3.2**: 공지사항 등록 페이지 구현
  - File(s): `src/app/admin/notices/new/page.tsx`
  - RichTextEditor 통합
  - PocketBase를 통한 데이터 저장

- [x] **Task 3.3**: 공지사항 수정 페이지 구현
  - File(s): `src/app/admin/notices/[id]/page.tsx`
  - RichTextEditor 통합
  - 기존 데이터 로드 및 업데이트
  - 날짜 파싱 로직 개선

- [x] **Task 3.4**: PocketBase SDK 권장사항 적용
  - File(s): `src/app/admin/layout.tsx`
  - `pb.authStore.isAdmin` → `pb.authStore.model?.collectionName === '_superusers'`

#### Quality Gate ✋

**Build & Tests**:
- [x] **Build**: 프로젝트 빌드 성공
- [x] **Linting**: 린트 오류 없음
- [x] **Type Safety**: TypeScript 타입 체크 통과

**Functionality**:
- [x] **Manual Testing**: 공지사항 등록/수정 기능 확인 완료
- [x] **SSR**: 하이드레이션 오류 해결
- [x] **Console Warnings**: 중복 확장 경고 해결

**Issues Resolved**:
- [x] SSR 하이드레이션 불일치 해결
- [x] Tiptap 확장 중복 경고 해결
- [x] Label htmlFor 경고 해결
- [x] DialogDescription 경고 해결

---

### Phase 4: 데이터 페칭 및 캐싱 최적화
**Goal**: 실시간 데이터 반영을 위한 캐시 제어 및 자동 새로고침 구현
**Estimated Time**: 2시간
**Status**: ✅ Complete

#### Tasks

- [x] **Task 4.1**: PocketBase 클라이언트 캐시 제어 추가
  - File(s): `src/lib/pocketbase.ts`
  - `cache: 'no-store'` 옵션 추가
  - `Cache-Control: no-cache` 헤더 추가

- [x] **Task 4.2**: RecentNews 컴포넌트 자동 새로고침 추가
  - File(s): `src/components/home/RecentNews.tsx`
  - 10초마다 자동 새로고침 구현
  - `setInterval` 및 `clearInterval` 사용

- [x] **Task 4.3**: notices 페이지 자동 새로고침 추가
  - File(s): `src/app/notices/page.tsx`
  - 10초마다 자동 새로고침 구현

- [x] **Task 4.4**: Partners 컴포넌트 데이터 페칭 개선
  - File(s): `src/components/home/Partners.tsx`
  - `requestKey: null` 추가하여 자동 취소 방지
  - 로딩/에러 상태 처리

- [x] **Task 4.5**: 공지사항 상세 페이지 데이터 페칭 개선
  - File(s): `src/app/admin/notices/[id]/page.tsx`
  - `requestKey: null` 추가

#### Quality Gate ✋

**Build & Tests**:
- [x] **Build**: 프로젝트 빌드 성공
- [x] **Linting**: 린트 오류 없음

**Functionality**:
- [x] **Manual Testing**: 실시간 데이터 반영 확인 완료
- [x] **Performance**: 자동 새로고침으로 인한 성능 영향 최소화

**Issues Resolved**:
- [x] 백엔드 수정 후 프론트엔드 반영 지연 문제 해결
- [x] ClientResponseError 0 (autocancelled) 오류 해결

---

### Phase 5: SEO 및 소셜 미디어 최적화
**Goal**: 검색 엔진 최적화 및 소셜 미디어 링크 미리보기 개선
**Estimated Time**: 2시간
**Status**: ✅ Complete

#### Tasks

- [x] **Task 5.1**: metadata 개선
  - File(s): `src/app/layout.tsx`
  - title: "Create Next App" → "봉황대협동조합"
  - description 추가
  - metadataBase 추가

- [x] **Task 5.2**: Open Graph 메타데이터 추가
  - File(s): `src/app/layout.tsx`
  - og:title, og:description, og:type, og:locale, og:siteName 추가

- [x] **Task 5.3**: Twitter Card 메타데이터 추가
  - File(s): `src/app/layout.tsx`
  - twitter:card, twitter:title, twitter:description 추가

- [x] **Task 5.4**: 추가 SEO 메타데이터
  - File(s): `src/app/layout.tsx`
  - keywords, authors, alternates.canonical 추가

#### Quality Gate ✋

**Build & Tests**:
- [x] **Build**: 프로젝트 빌드 성공
- [x] **Linting**: 린트 오류 없음

**Functionality**:
- [x] **Manual Testing**: 노션에서 메타데이터 확인 완료
- [x] **Social Media**: 카카오톡 캐시 삭제 안내 제공

**Note**: 카카오톡은 강력한 캐싱을 사용하므로 개발자 도구를 통해 캐시를 삭제해야 변경사항이 반영됨

---

## ⚠️ Risk Assessment

| Risk | Probability | Impact | Mitigation Strategy |
|------|-------------|--------|---------------------|
| Tiptap SSR 하이드레이션 불일치 | Medium | High | `isMounted` 상태 및 조건부 렌더링으로 해결 |
| PocketBase 캐싱으로 인한 실시간 반영 지연 | High | Medium | `cache: 'no-store'` 및 자동 새로고침으로 해결 |
| 카카오톡 메타데이터 캐시 | High | Low | 개발자 도구를 통한 캐시 삭제 안내 |
| Tiptap 확장 중복 경고 | Medium | Low | StarterKit 대신 개별 확장 사용으로 해결 |

---

## 🔄 Rollback Strategy

모든 변경사항은 Git으로 버전 관리되어 있으므로, 문제 발생 시 이전 커밋으로 롤백 가능합니다.

### Git Rollback Commands
```bash
# 특정 커밋으로 되돌리기
git log  # 커밋 히스토리 확인
git checkout <commit-hash>  # 특정 커밋으로 이동

# 변경사항 취소 (로컬)
git reset --hard HEAD~1  # 마지막 커밋 취소
```

---

## 📊 Progress Tracking

### Completion Status
- **Phase 1**: ✅ 100% (UI 스타일 및 링크 개선)
- **Phase 2**: ✅ 100% (공지사항 폰트 및 접근성 개선)
- **Phase 3**: ✅ 100% (관리자 페이지 공지사항 등록 시스템)
- **Phase 4**: ✅ 100% (데이터 페칭 및 캐싱 최적화)
- **Phase 5**: ✅ 100% (SEO 및 소셜 미디어 최적화)

**Overall Progress**: 100% complete

---

## 📝 Notes & Learnings

### Implementation Notes

1. **Tiptap 에디터 SSR 이슈**
   - Next.js의 SSR 환경에서 Tiptap 에디터를 사용할 때 하이드레이션 불일치가 발생
   - 해결: `isMounted` 상태를 추가하여 클라이언트 사이드에서만 렌더링
   - `immediatelyRender: false` 옵션도 함께 사용

2. **Tiptap 확장 중복 경고**
   - StarterKit을 사용하면 내부적으로 여러 확장을 포함하고 있어 중복 경고 발생
   - 해결: StarterKit 대신 필요한 개별 확장만 직접 import하여 사용
   - Document, Paragraph, Text 등 기본 확장도 명시적으로 추가 필요

3. **PocketBase 캐싱 문제**
   - 브라우저와 PocketBase 클라이언트의 캐싱으로 인해 데이터 변경사항이 즉시 반영되지 않음
   - 해결: `cache: 'no-store'` 옵션과 `Cache-Control: no-cache` 헤더 추가
   - 추가로 클라이언트 사이드에서 10초마다 자동 새로고침 구현

4. **React Strict Mode와 PocketBase**
   - React Strict Mode는 개발 환경에서 컴포넌트를 두 번 렌더링하여 중복 요청 발생
   - PocketBase의 `requestKey: null` 옵션을 사용하여 자동 취소 방지

5. **카카오톡 메타데이터 캐싱**
   - 카카오톡은 매우 강력한 캐싱을 사용하여 메타데이터 변경사항이 즉시 반영되지 않음
   - 개발자 도구(https://developers.kakao.com/tool/clear/og)를 통해 캐시 삭제 필요
   - 또는 URL에 쿼리 파라미터를 추가하여 새 URL로 인식하게 할 수 있음

### Blockers Encountered

- **Blocker 1**: Tiptap SSR 하이드레이션 오류
  - → `isMounted` 상태 및 조건부 렌더링으로 해결

- **Blocker 2**: PocketBase 데이터 실시간 반영 지연
  - → 캐시 제어 헤더 및 자동 새로고침으로 해결

- **Blocker 3**: Tiptap 확장 중복 경고
  - → StarterKit 대신 개별 확장 사용으로 해결

### Improvements for Future Plans

1. **테스트 코드 추가**
   - 현재는 수동 테스트만 수행
   - 향후 단위 테스트 및 통합 테스트 추가 고려

2. **에러 처리 개선**
   - PocketBase 에러 처리 로직 강화
   - 사용자 친화적인 에러 메시지 표시

3. **성능 최적화**
   - 이미지 최적화 (Base64 대신 파일 서버 사용)
   - 불필요한 리렌더링 최소화

4. **접근성 개선**
   - 키보드 네비게이션 지원
   - 스크린 리더 호환성 개선

---

## 📚 References

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Tiptap Documentation](https://tiptap.dev/docs/editor/getting-started/overview)
- [PocketBase Documentation](https://pocketbase.io/docs/)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Card Documentation](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)

### Related Commits
- UI 스타일 수정 및 Footer 링크 추가
- 공지사항 폰트 크기 조정 및 접근성 개선
- 관리자 페이지 공지사항 등록 시스템 구현
- 데이터 페칭 및 캐싱 최적화
- SEO 및 소셜 미디어 최적화

---

## ✅ Final Checklist

**Plan Completion Status**:
- [x] All phases completed with quality gates passed
- [x] Full integration testing performed (manual)
- [x] Code committed to Git
- [x] All console warnings resolved
- [x] Accessibility improvements implemented
- [x] SEO optimization completed
- [x] Documentation updated (this plan document)

---

**Plan Status**: ✅ Complete
**Next Action**: 향후 기능 추가 시 새로운 계획 문서 생성
**Blocked By**: None
