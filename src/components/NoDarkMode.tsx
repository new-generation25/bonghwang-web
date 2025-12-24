'use client';

import { useEffect } from 'react';

export function ThemeProvider() {
  useEffect(() => {
    // 시스템 설정 감지
    const detectSystemTheme = () => {
      if (typeof window === 'undefined') return 'light';
      
      // localStorage에 저장된 테마가 있으면 우선 사용
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark' || savedTheme === 'light') {
        return savedTheme;
      }
      
      // 시스템 설정 감지
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'light';
    };

    const applyTheme = (theme: 'dark' | 'light') => {
      const html = document.documentElement;
      html.classList.remove('dark', 'light');
      html.classList.add(theme);
      html.style.colorScheme = theme;
    };

    // 초기 테마 적용
    const theme = detectSystemTheme();
    applyTheme(theme);

    // localStorage 변경 감지 (Navbar에서 테마 변경 시)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'theme' && (e.newValue === 'dark' || e.newValue === 'light')) {
        applyTheme(e.newValue);
      }
    };

    // 커스텀 이벤트로 Navbar에서 테마 변경 감지
    const handleThemeChange = (e: CustomEvent) => {
      const newTheme = e.detail.theme as 'dark' | 'light';
      applyTheme(newTheme);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('theme-change', handleThemeChange as EventListener);

    // 시스템 설정 변경 감지
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = (e: MediaQueryListEvent) => {
      // localStorage에 저장된 테마가 없을 때만 시스템 설정 따름
      const savedTheme = localStorage.getItem('theme');
      if (!savedTheme) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    };

    // MediaQueryList.addEventListener는 최신 브라우저에서 지원
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemChange);
    } else {
      // 구형 브라우저 호환성
      mediaQuery.addListener(handleSystemChange);
    }

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('theme-change', handleThemeChange as EventListener);
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleSystemChange);
      } else {
        mediaQuery.removeListener(handleSystemChange);
      }
    };
  }, []);

  return null;
}

