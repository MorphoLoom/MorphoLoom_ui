import React from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

// QueryClient 인스턴스 생성
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2, // 실패 시 2번 재시도
      staleTime: 5 * 60 * 1000, // 기본 5분
      gcTime: 10 * 60 * 1000, // 기본 10분 캐시 유지
      refetchOnWindowFocus: false, // 윈도우 포커스 시 자동 리프레시 비활성화 (모바일에서는 불필요)
      refetchOnReconnect: true, // 네트워크 재연결 시 자동 리프레시
    },
    mutations: {
      retry: 1, // mutation은 1번만 재시도
    },
  },
});

interface QueryProviderProps {
  children: React.ReactNode;
}

export const QueryProvider: React.FC<QueryProviderProps> = ({children}) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default QueryProvider;
