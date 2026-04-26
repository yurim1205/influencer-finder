'use client';

import { convertToChannel, getChannelDetails, getChannelLatestVideos, YoutubeVideo , Channel } from "@/lib/youtube";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { formatCount } from '@/lib/utils';
interface ChannelPageProps {
  params: Promise<{ id: string }>;
}

export default function ChannelPage({ params }: ChannelPageProps) {
  const [channel, setChannel] = useState<Channel | null>(null);
  const [loading, setLoading] = useState(true);
  const [latestVideos, setLatestVideos] = useState<YoutubeVideo[]>([]);
  const router = useRouter();
  const [videoPage, setVideoPage] = useState(0);    
  const videosPerPage = 3;
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

  const avgViews = latestVideos.length > 0
  ? Math.round(latestVideos.slice(0, 5).reduce((sum, v) => sum + v.viewCount, 0) / Math.min(latestVideos.length, 5))
  : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          className="text-purple-600 hover:text-purple-800 mb-6 inline-block font-semibold"
        >
          <ArrowLeft className="w-5 h-5 text-purple-600" />
        </button>

        {/* 모바일: 채널명 + 프로필 사진 */}
          <div className="flex items-center gap-4 mb-8 lg:hidden">
            {channel.thumbnail && (
              <img
                src={channel.thumbnail}
                alt={channel.name}
                className="w-14 h-14 object-cover rounded-full flex-shrink-0"
              />
            )}
            <h1 className="font-semibold text-black">{channel.name}</h1>
          </div>

          <h1 className="hidden lg:block font-semibold text-black mb-8">
            {channel.name}
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* 왼쪽 썸네일 - 모바일에서 숨김 */}
            <div className="hidden lg:block bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200">
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
                    {formatCount(channel.subscribers || 0)}
                  </p>
                </div>
                <div>
                  <p className="text-lg text-gray-600">조회수 (최근 5개 영상 기준)</p>
                  <p className="text-3xl font-bold text-black">
                    {formatCount(avgViews || 0)}
                  </p>
                </div>
              </div>
            </div>
          </div> 
        </div> 

        <div className="mt-14">
          <h2 className="text-xl font-bold text-black mb-6">
            채널의 최신 영상
          </h2>
          
          <div className="relative">
          <button
            onClick={() => {
              setVideoPage((prev) => Math.max(prev - 1, 0));
            }}
            disabled={videoPage === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-14 disabled:opacity-30 z-10 cursor-pointer hover:scale-105 transition-all 
            duration-300 text-purple-400 hover:text-purple-600"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {latestVideos.slice(videoPage * videosPerPage, videoPage * videosPerPage + videosPerPage).map((video) => (
                <a
                  key={video.id.videoId}
                  href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200 hover:shadow-md transition-all hover:scale-[1.01]"
                >
                  <img src={video.snippet.thumbnails.medium.url} alt={video.snippet.title} className="w-full h-40 object-cover rounded-xl mb-3" />
                  <p className="font-semibold text-gray-800 line-clamp-2">{video.snippet.title}</p>
                  <p className="text-sm text-gray-500 mt-1">{video.snippet.publishedAt.slice(0, 10)}</p>
                </a>
              ))}
            </div>
            
             {/* 모바일: 아래 버튼 / 데스크탑: 양옆 버튼 */}
            <div className="flex justify-center gap-4 mt-4 lg:hidden">
              <button
                onClick={() => setVideoPage((prev) => Math.max(prev - 1, 0))}
                disabled={videoPage === 0}
                className="p-2 text-purple-400 hover:text-purple-600 disabled:opacity-30 transition-all"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={() => setVideoPage((prev) => Math.min(prev + 1, Math.ceil(latestVideos.length / 3) - 1))}
                disabled={videoPage === Math.ceil(latestVideos.length / 3) - 1}
                className="p-2 text-purple-400 hover:text-purple-600 disabled:opacity-30 transition-all"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </div>

            <button
              onClick={() => {
                setVideoPage((prev) => Math.min(prev + 1, Math.ceil(latestVideos.length / 3) - 1));
              }}
              disabled={videoPage === Math.ceil(latestVideos.length / 3) - 1}
              className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-14 disabled:opacity-30 z-10 cursor-pointer hover:scale-105 transition-all 
              duration-300 text-purple-400 hover:text-purple-600"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}