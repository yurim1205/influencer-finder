'use client';

import { convertToChannel, getChannelDetails } from "@/lib/youtube";
import { ArrowLeft } from "lucide-react";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ChannelPageProps {
  params: Promise<{ id: string }>;
}

export default function ChannelPage({ params }: ChannelPageProps) {
  const [channel, setChannel] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchChannel() {
      const { id } = await params;
      const channelData = await getChannelDetails(id);

      if (channelData) {
        setChannel(convertToChannel(channelData));
      }
      setLoading(false);
    }
    fetchChannel();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-xl text-gray-600">채널 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            채널을 찾을 수 없습니다 😢
          </h1>
          <Link href="/" className="text-purple-600 hover:underline">
            메인으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 px-6 py-10">
      <div className="max-w-4xl mx-auto">
        {/* 뒤로가기 */}
        <button
          onClick={() => router.back()}
          className="text-purple-600 hover:text-purple-800 mb-6 inline-block font-semibold"
        >
          <ArrowLeft className="w-5 h-5 text-purple-600" />
        </button>

        <div className="mb-0">
          <h1 className="text-4xl font-bold text-black mb-6">
            {channel.name}
          </h1>
          {/* 구분선 */}
          <div className="border-t-2 border-black"></div>
        </div>

        {/* 메인 컨테이너 */}
        <div className="bg-white border-2 border-black mt-12">
          {/* 썸네일/이미지 영역 */}
          <div className="border-b border-black">
            {channel.thumbnail ? (
              <img 
                src={channel.thumbnail} 
                alt={channel.name}
                className="w-full h-96 object-cover"
              />
            ) : (
              <div className="bg-gray-100 h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-9xl mb-4">🎥</div>
                  <p className="text-gray-500 text-lg font-medium">채널 썸네일</p>
                </div>
              </div>
            )}
          </div>

          {/* 주요 정보 섹션 */}
          <div className="px-8 py-6 border-b-2 border-black">
            <div className="flex gap-4">
              
              {/* 정보 내용 */}
              <div className="flex-1">
                <div className="space-y-2">
                  <p className="text-base text-gray-700">
                    <span className="font-semibold">👥 구독자:</span> {channel.subscribers.toLocaleString()}명
                  </p>
                  <p className="text-base text-gray-700">
                    <span className="font-semibold">👁️ 평균 조회수:</span> {channel.averageViews.toLocaleString()}회
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 채널 설명 섹션 */}
          <div className="px-8 py-6 border-b border-gray-300">
            <div className="space-y-4">
              <p className="text-base text-gray-800 leading-relaxed">
                {channel.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}