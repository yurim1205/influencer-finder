'use client';

import { convertToChannel, getChannelDetails, getChannelLatestVideos, YoutubeVideo, Channel } from "@/lib/youtube";
import { ArrowLeft, Home, Bookmark, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatCount } from '@/lib/utils';
import { useAuthStore } from "@/app/stores/useAuthStore";
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import Header from '@/components/Header';
import ViewsChart from "@/components/ViewsChart";

interface ChannelPageProps {
  params: Promise<{ id: string }>;
}

export default function ChannelPage({ params }: ChannelPageProps) {
  const [channel, setChannel] = useState<Channel | null>(null);
  const [loading, setLoading] = useState(true);
  const [latestVideos, setLatestVideos] = useState<YoutubeVideo[]>([]);
  const router = useRouter();
  const [videoPage, setVideoPage] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const user = useAuthStore((state) => state.user);
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

  useEffect(() => {
    if (!user || !channel) return;

    const checkSaved = async () => {
      const { data } = await supabase
        .from('my_influencers')
        .select('id')
        .eq('user_id', user.id)
        .eq('channel_id', channel.id)
        .maybeSingle();

      setIsSaved(!!data);
    };

    checkSaved();
  }, [user, channel]);

  if (loading) {
    return (
      <div className="min-h-screen bg-page-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-xl text-gray-600">채널 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="min-h-screen bg-page-gradient flex items-center justify-center">
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

  const handleSave = async () => {
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(`/channel/${channel.id}`)}`);
      return;
    }
    if (isSaving) return;

    setIsSaving(true);
    const { error } = await supabase
      .from('my_influencers')
      .insert({
        user_id: user.id,
        channel_id: channel.id,
        name: channel.name,
        subscribers: channel.subscribers || 0,
        avg_views: avgViews || 0,
        description: channel.description || '',
        gender: 'M',
        contact_point: '',
        contact_note: '',
        contact_status: '미컨택',
        note: '',
      });
    setIsSaving(false);

    if (error) {
      if (error.code === '23505') {
        setIsSaved(true);
        toast('이미 저장된 채널이에요');
      } else {
        toast.error('저장에 실패했습니다.');
      }
      return;
    }
    setIsSaved(true);
    toast.success('마이페이지에 저장되었습니다');
  };

  const totalVideoPages = Math.ceil(latestVideos.length / videosPerPage);

  return (
    <div className="min-h-screen bg-page-gradient px-6 py-10">
      <Header />
      <div className="max-w-4xl mx-auto">

        {/* 뒤로가기 + 홈 */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => router.back()}
            aria-label="뒤로가기"
            className="text-gray-500 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Link href="/" aria-label="홈" className="text-gray-500 hover:text-gray-800 transition-colors">
            <Home className="w-5 h-5" />
          </Link>
        </div>

        {/* 맨 위 카드 */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 
          flex flex-col-reverse sm:flex-row sm:items-stretch justify-between gap-6">

          <div className="flex flex-col gap-8 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-bold text-black">{channel.name}</h1>

              <button
                onClick={handleSave}
                disabled={isSaving || isSaved}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all
                  ${isSaved
                    ? 'bg-white text-[#6A4F6A] border border-[#6A4F6A]/30 cursor-default'
                    : 'bg-[#6A4F6A] text-white hover:shadow-md'}
                  disabled:opacity-80`}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#6A4F6A]' : ''}`} />
                {isSaving ? '저장 중...' : isSaved ? '저장됨' : '저장하기'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-base text-gray-600 mb-1">구독자</p>
                <p className="text-3xl font-bold text-black">{formatCount(channel.subscribers || 0)}</p>
              </div>
              <div>
                <p className="text-base text-gray-600 mb-1">평균 조회수</p>
                <p className="text-3xl font-bold text-black">
                  {latestVideos.length > 0 ? formatCount(avgViews || 0) : '-'}
                </p>
              </div>
            </div>
          </div>

          {channel.thumbnail && (
            <a
              href={`https://www.youtube.com/channel/${channel.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 self-center sm:self-auto"
            >
              <img
                src={channel.thumbnail}
                alt={channel.name}
                referrerPolicy="no-referrer"
                className="w-28 h-28 sm:w-44 sm:h-44 object-cover rounded-2xl"
              />
            </a>
          )}
        </div>

        {/* 채널 설명 카드 */}
        <div className="mt-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
          <h2 className="text-base text-gray-600 mb-3">채널 설명</h2>
          <p className="text-black leading-relaxed text-base whitespace-pre-line line-clamp-4">
            {(channel.description || '채널 설명이 없습니다.').replace(/\n{2,}/g, '\n')}
          </p>
        </div>

        {latestVideos.length > 0 && (
          <div className="mt-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
            <h2 className="text-base text-gray-600 mb-4">최근 영상 조회수</h2>
            <ViewsChart videos={latestVideos} avgViews={avgViews} />
          </div>
        )}

        {/* 최신 영상 카드 */}
        <div className="mt-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
          <h2 className="text-base text-gray-600 mb-4">최신 영상</h2>

          {latestVideos.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 font-bold text-xl">이 채널은 영상 정보를 제공하지 않습니다</p>
            </div>
          ) : (
            <div className="relative lg:px-12">
              {/* 왼쪽 화살표 */}
              <button
                onClick={() => setVideoPage((prev) => Math.max(prev - 1, 0))}
                disabled={videoPage === 0}
                className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 disabled:opacity-30 z-10 
                cursor-pointer hover:scale-105 transition-all duration-300 text-purple-400 hover:text-purple-600"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {latestVideos
                  .slice(videoPage * videosPerPage, videoPage * videosPerPage + videosPerPage)
                  .map((video) => (
                    <a
                      key={video.id.videoId}
                      href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-2xl p-2 hover:bg-gray-50 transition-all"
                    >
                      <img
                        src={video.snippet.thumbnails.medium.url}
                        alt={video.snippet.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-40 object-cover rounded-xl mb-3"
                      />
                      <p className="font-semibold text-gray-800 line-clamp-2">{video.snippet.title}</p>
                      <p className="text-sm text-gray-500 mt-1">{video.snippet.publishedAt.slice(0, 10)}</p>
                    </a>
                  ))}
              </div>

              {/* 모바일: 아래쪽 버튼 */}
              <div className="flex justify-center gap-4 mt-4 lg:hidden">
                <button
                  onClick={() => setVideoPage((prev) => Math.max(prev - 1, 0))}
                  disabled={videoPage === 0}
                  className="p-2 text-purple-400 hover:text-purple-600 disabled:opacity-30 transition-all"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={() => setVideoPage((prev) => Math.min(prev + 1, totalVideoPages - 1))}
                  disabled={videoPage === totalVideoPages - 1}
                  className="p-2 text-purple-400 hover:text-purple-600 disabled:opacity-30 transition-all"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </div>

              {/* 오른쪽 화살표 */}
              <button
                onClick={() => setVideoPage((prev) => Math.min(prev + 1, totalVideoPages - 1))}
                disabled={videoPage === totalVideoPages - 1}
                className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 disabled:opacity-30 z-10 cursor-pointer hover:scale-105 transition-all duration-300 text-purple-400 hover:text-purple-600"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}