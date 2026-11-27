import type { Metadata } from "next";

export const metadata: Metadata = {
    title: '채널 검색',
    description: '키워드로 찾은 유튜브 채널의 구독자 수와 관련 영상을 확인해보세요.',
  };
  
  export default function SearchLayout({ children }: { children: React.ReactNode }) {
    return children;
  }