'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { 
  Channel, searchChannelsHybrid 
} from '@/lib/youtube';

const searchCache = new Map<string, Channel[]>();

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

      // 결과가 캐시에 있으면 바로 사용하기
      if (searchCache.has(keyword)) {
        setChannels(searchCache.get(keyword) || []);
        return; // 캐시 있으면 api 호출 안 하고 바로 사용함
      }

      setLoading(true);

      try {
        const searchResults = await searchChannelsHybrid(keyword);
        
        // 이미 Channel 타입이므로 그대로 사용
        const validChannels = searchResults.filter((ch): ch is Channel => ch !== null);
  
        // 캐시에 결과 저장
        searchCache.set(keyword, validChannels);
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
  const filteredChannels = [...channels]
  .filter((channel, index, self) =>
     index === self.findIndex((ch) => ch.id === channel.id))
  .sort((a, b) => {
    if (sortType === 'subscribers') {
      return b.subscribers - a.subscribers;
    }
    return 0;
  });

  const formatCount = (num: number) => {
    if (num >= 100000000) return `${(num / 100000000).toFixed(0)}억`;
    if (num >= 10000) return `${(num / 10000).toFixed(0)}만`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}천`;
    return num.toString();
  };

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

<div className='flex justify-end'>
        {filteredChannels.length > 0 && !loading && (
           <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value as 'default' | 'subscribers')}
              className="
                px-4 py-2
                bg-white/80 backdrop-blur-sm
                border border-purple-200
                rounded-xl
                font-semibold
                text-gray-600
                focus:outline-none focus:ring-2 focus:ring-purple-400
                shadow-sm shadow-purple-200
              "
            >
              <option value="default">기본 순서</option>
              <option value="subscribers">구독자 많은 순</option>
            </select>
          )}
        </div>
        </div>
      </div>

        {/* 로딩 중 */}
        {loading && channels.length === 0 && (
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
        { filteredChannels.length > 0 && (
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

                {channel.matchVideo?.thumbnail ? (
                  <div className="relative">
                    <img 
                      src={channel.matchVideo.thumbnail}
                      alt={channel.matchVideo.title}
                      className="w-full h-40 object-cover rounded-lg mb-4"
                    />
                  
                      <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                        <span>영상</span>
                      </div>
                    </div>
                  ) : channel.thumbnail ? (
                  <img 
                    src={channel.thumbnail} 
                    alt={channel.name} 
                    className="w-full h-40 object-cover" 
                  />
                ) : null}

                <div className='p-6'>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {channel.name}
                </h3>

                {channel.matchVideo && (
                  <div className="mb-3 flex items-start gap-2">
                    <span className="text-purple-600 text-sm">📹</span>
                    <p className="text-sm text-purple-600 font-medium line-clamp-2">
                      {channel.matchVideo.title}
                    </p>
                  </div>
                )}

                <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
                  {channel.description}
                </p>

                <div className="flex flex-col gap-2 text-sm text-gray-500">
                  <span>👥 구독자: {formatCount(channel.subscribers || 0)}</span>
                  <span>👁️ 총 조회수: {formatCount(channel.averageViews || 0)}</span>
                </div>
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