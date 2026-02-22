import Link from "next/link";
import type { Channel } from "@/lib/youtube";

interface ChannelCardProps {
  channel: Channel;
}

export default function ChannelCard({ channel }: ChannelCardProps) {
    
// 채널 구독자, 평균 조회수 포맷팅 함수
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <Link href={`/channel/${channel.id}`}>
      <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
        <h3 className="text-xl font-bold mb-3">{channel.name}</h3>
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">구독자</span>
            <span className="font-semibold">{formatNumber(channel.subscribers)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">평균 조회수</span>
            <span className="font-semibold">{formatNumber(channel.averageViews)}</span>
          </div>
        </div>
        <p className="text-gray-500 text-sm">{channel.description}</p>
      </div>
    </Link>
  );
}

