'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { Channel, convertToChannel, getChannelDetails, searchChannels } from '@/lib/youtube';

function SearchResults() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get('keyword') || ''; // url 파라미터 이름 받는 부분

  // 상태 관리
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortType, setSortType] = useState<'default' | 'subscribers'>('default');

  useEffect(() => {
    async function fetchChannels() {
      if (!keyword) {
        setChannels([]);
        return;
      }

      setLoading(true);
      try {
        const searchResults = await searchChannels(keyword);
        console.log('검색 결과:', searchResults);

        const channelPromises = searchResults.map(async (result:any) => {
          const channelId = result.id.channelId;
          const details = await getChannelDetails(channelId);
          return details ? convertToChannel(details) : null;
        });
        
        // Promise들을 풀어서 실제 데이터로 변환
        const channelDetails = await Promise.all(channelPromises);

        // 데이터 필러팅 및 빈 데이터 제거
        const validChannels = channelDetails.filter((ch): ch is Channel => ch !== null);

        console.log('채널 데이터:', validChannels);
        setChannels(validChannels);
      } catch (error) {
        console.error('채널 검색 에러:', error);
        setChannels([]);
      } finally {
        setLoading(false);
        }
      }

    fetchChannels();
  }, [keyword]);
  
  // 정렬
  const filteredChannels = [...channels].sort((a, b) => {
    if (sortType === 'subscribers') {
      return b.subscribers - a.subscribers;
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* 상단 헤더 */}
        <div className="mb-8">
          <Link 
            href="/"
            className="text-purple-600 hover:text-purple-800 mb-4 inline-block"
          >
            ← 돌아가기
          </Link>

          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {keyword ? `"${keyword}" 검색 결과` : '전체 채널'}
              </h1>
              <p className="text-gray-600 mt-2">
                {loading ? '검색 중...' : `${filteredChannels.length}개의 채널을 찾았습니다`}
              </p>
            </div>

        {/* 검색 결과가 없을 때 */}
        {filteredChannels.length === 0 && !loading && (
           <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value as 'default' | 'subscribers')}
              className="
                px-4 py-2
                bg-white/80 backdrop-blur-sm
                border border-gray-300
                rounded-xl
                font-semibold
                text-gray-700
                focus:outline-none focus:ring-2 focus:ring-purple-400
                cursor-pointer
              "
            >
              <option value="default">기본 순서</option>
              <option value="subscribers">구독자 많은 순</option>
            </select>
          )}
        </div>
      </div>

        {/* 로딩 중 */}
          {loading && (
                  <div className="text-center py-20">
                    <div className="text-4xl mb-4">🔍</div>
                    <p className="text-xl text-gray-600">채널을 검색하는 중...</p>
                  </div>
                )}

                {/* 검색 결과가 없을 때 */}
                {!loading && keyword && filteredChannels.length === 0 && (
                  <div className="text-center py-20">
                    <p className="text-2xl text-gray-500 mb-4">
                      "{keyword}"에 대한 검색 결과가 없습니다 😢
                    </p>
                    <p className="text-lg text-gray-400">
                      다른 키워드로 검색해보세요
                    </p>
                  </div>
                )}

        {/* 검색 결과 출력 */}
        {!loading && filteredChannels.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChannels.map(channel => (
              <Link
                key={channel.id}
                href={`/channel/${channel.id}`}
                className="
                  bg-white/80 backdrop-blur-sm
                  rounded-2xl p-6
                  border border-gray-200
                  hover:shadow-xl transition-all
                  hover:scale-105
                  cursor-pointer
                "
              >

                {channel.thumbnail && (
                  <img 
                    src={channel.thumbnail} alt={channel.name} 
                    className="w-full h-40 object-cover rounded-lg mb-4" 
                    />
                )}

                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {channel.name}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {channel.description}
                </p>
                <div className="flex flex-col gap-2 text-sm text-gray-500">
                  <span>👥 구독자: {channel.subscribers.toLocaleString()}</span>
                  <span>👁️ 평균 조회수: {channel.averageViews.toLocaleString()}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  ); }  

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchResults />
    </Suspense>
  );
} 