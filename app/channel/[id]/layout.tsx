import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '채널 상세',
  description: '유튜브 채널의 구독자 수, 평균 조회수, 최근 영상 조회수 추이를 확인해보세요.',
};

export default function ChannelLayout({ children }: { children: React.ReactNode }) {
  return children;
}