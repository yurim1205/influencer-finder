'use client';

import SearchBar from "@/components/common/mainSearchBar";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function Home() {
  const router = useRouter();

  // 검색 키워드 받는 부모 함수
  const handleSearch = (keyword: string) => {
    if (!keyword.trim()) {
      toast.error(`검색어를 입력해주세요!` , {   // toast.error: 에러 메시지 출력
        duration: 2000, 
        position: "top-center" 
      }); 
      return;
    }
      router.push(`/search?keyword=${encodeURIComponent(keyword)}`);
  };

  return (
    <>
    <Toaster position="top-center" />
    <main className="relative bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 min-h-screen flex flex-col items-center justify-center px-6">
    <div className="flex flex-wrap justify-center gap-2 mb-10 opacity-60 max-w-xs">
    {[
  { label: '#뷰티', top: '12%', left: '15%' },
  { label: '#게임', top: '20%', right: '8%' },
  { label: '#음악', top: '58%', left: '5%' },
  { label: '#요리', bottom: '20%', right: '15%' },
  { label: '#여행', top: '75%', left: '20%' },
  { label: '#패션', top: '35%', right: '3%' },
  { label: '#운동', bottom: '10%', left: '8%' },
  { label: '#브이로그', top: '15%', right: '19%' },
].map((tag, i) => (
  <span
    key={i}
    className="hidden sm:block absolute px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full text-sm text-gray-800 shadow-lg shadow-black/10 pointer-events-none select-none opacity-60"
    style={{ top: tag.top, left: tag.left, right: tag.right, bottom: tag.bottom }}
  >
    {tag.label}
  </span>
))}
</div>

    <h1 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text mb-10 text-center">
      키워드로 원하는 채널을 탐색해보세요 ✨
    </h1>

    <div className="w-full max-w-3xl">
      <SearchBar onSearch={handleSearch}/> 
    </div>
  </main>
    </>
  )
}