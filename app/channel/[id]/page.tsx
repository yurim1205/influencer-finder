// app/channel/[id]/page.tsx
import { mockChannels } from "@/mocks/channels";
import { ArrowLeft } from "lucide-react";
import Link from 'next/link';

export default async function ChannelPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const channel = mockChannels.find(
    channel => channel.id === id
  );

  if (!channel) {
    return <div>채널 id 없음</div>;
  }

  return (
    <div className="min-h-screen bg-[#f6f3fb] px-6 py-10">
      <div className="max-w-4xl mx-auto">
        {/* 뒤로가기 */}
        <Link 
          href="/search"
          className="text-purple-600 hover:text-purple-800 mb-6 inline-block font-semibold"
        >
          <ArrowLeft className="w-5 h-5 text-purple-600" />
        </Link>

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
          <div className="border-b-2 border-black">
            <div className="bg-gray-100 h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="text-9xl mb-4">🎥</div>
                <p className="text-gray-500 text-lg font-medium">채널 썸네일</p>
              </div>
            </div>
          </div>

          {/* 주요 정보 섹션 */}
          <div className="px-8 py-6 border-b-2 border-black">
            <div className="flex gap-4">
              
              {/* 정보 내용 */}
              <div className="flex-1">
                {/* <div className="mb-4">
                  <p className="text-lg font-semibold text-gray-800">
                    채널 주요 정보
                  </p>
                </div> */}
                
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