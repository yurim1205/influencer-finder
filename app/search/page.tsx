'use client';

import { useSearchParams } from 'next/navigation';
import { mockChannels } from '@/mocks/channels';
import Link from 'next/link';
import { Suspense } from 'react';

function SearchResults() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get('keyword') || ''; // url 파라미터 이름 받는 부분

  // 키워드로 필터링
  const filteredChannels = keyword
    ? mockChannels.filter(channel =>
        channel.name.toLowerCase().includes(keyword.toLowerCase()) ||
        channel.description.toLowerCase().includes(keyword.toLowerCase())
      )
    : mockChannels;

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
          <h1 className="text-3xl font-bold text-gray-800">
            {keyword ? `"${keyword}" 검색 결과` : '전체 채널'}
          </h1>
          <p className="text-gray-600 mt-2">
            {filteredChannels.length}개의 채널을 찾았습니다
          </p>
        </div>

        {/* 검색 결과가 없을 때 */}
        {filteredChannels.length === 0 && (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-500">
              "{keyword}"에 대한 검색 결과가 없습니다 😢
            </p>
            <p className="text-lg text-gray-400 mt-4">
              다른 키워드로 검색해보세요
            </p>
            {/* <Link 
              href="/"
              className="mt-6 inline-block px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition"
            >
              다시 검색하기
            </Link> */}
          </div>
        )}

        {/* 검색 결과 출력 */}
        {filteredChannels.length > 0 && (
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
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchResults />
    </Suspense>
  );
}