'use client';

import { convertToChannel, getChannelDetails, getChannelLatestVideos } from "@/lib/youtube";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ChannelPageProps {
  params: Promise<{ id: string }>;
}

export default function ChannelPage({ params }: ChannelPageProps) {
  const [channel, setChannel] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [latestVideos, setLatestVideos] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchChannel() {
      const { id } = await params;
      const channelData = await getChannelDetails(id);

      if (channelData) {
        setChannel(convertToChannel(channelData));
        const latestVideos = await getChannelLatestVideos(id);
        setLatestVideos(latestVideos);
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
          <button onClick={() => router.back()} className="text-purple-600 hover:underline">
            <ArrowLeft className="w-5 h-5 text-purple-600" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          className="text-purple-600 hover:text-purple-800 mb-6 inline-block font-semibold"
        >
          <ArrowLeft className="w-5 h-5 text-purple-600" />
        </button>

        <h1 className="text-[] font-semibold text-black mb-8">
          {channel.name}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* 왼쪽 썸네일 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200">
            {channel.thumbnail ? (
              <img 
                src={channel.thumbnail} 
                alt={channel.name}
                className="w-full aspect-square object-cover rounded-2xl"
              />
            ) : (
              <div className="bg-gray-100 aspect-square flex items-center justify-center rounded-2xl">
                <div className="text-center">
                  <div className="text-9xl mb-4">🎥</div>
                  <p className="text-gray-500 text-lg font-medium">채널 썸네일</p>
                </div>
              </div>
            )}
          </div>

        
        {/* 오른쪽 영역 */}
        <div className="flex flex-col gap-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200">
              <h2 className="text-base text-gray-700 mb-4">채널 설명</h2>
              <p className="text-base text-gray-700 leading-relaxed text-xl font-bold text-black">
                {channel.description || '채널 설명이 없습니다.'}
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200">
              <div className="space-y-4">
                <div>
                  <p className="text-lg text-gray-600">구독자</p>
                  <p className="text-3xl font-bold text-black">
                    {channel.subscribers?.toLocaleString() || '0'}명
                  </p>
                </div>
                <div>
                  <p className="text-lg text-gray-600">조회수</p>
                  <p className="text-3xl font-bold text-black">
                    {channel.averageViews?.toLocaleString() || '0'}회
                  </p>
                </div>
              </div>
            </div>
          </div> 
        </div> 

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-black mb-6">📹 최신 영상</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {latestVideos.map((video) => (
              <a
                key={video.id.videoId}
                href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200 hover:shadow-md transition-all hover:scale-[1.01]"
              >
                <img
                  src={video.snippet.thumbnails.medium.url}
                  alt={video.snippet.title}
                  className="w-full h-40 object-cover rounded-xl mb-3"
                />
                <p className="font-semibold text-gray-800 line-clamp-2">{video.snippet.title}</p>
                <p className="text-sm text-gray-500 mt-1">{video.snippet.publishedAt.slice(0, 10)}</p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}