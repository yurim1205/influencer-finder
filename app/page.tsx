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
    <main className=" bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 min-h-screen">
      <section className="mb-12 text-center pt-60">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text mb-16">
           키워드로 원하는 채널을 탐색해보세요 ✨
        </h1>
      </section>

      <div className="flex flex-col items-center gap-6 py-10">
        <div className="w-full max-w-3xl">
          <SearchBar onSearch={handleSearch}/> 
        </div>
        
        {/* 추천 키워드 */}
        <div className="mt-6 flex gap-3 justify-center flex-wrap">
          <button 
            onClick={() => handleSearch('뷰티')}
            className="
            px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full text-sm 
            hover:scale-105 transition-all duration-300
            shadow-lg shadow-black/10 hover:cursor-pointer
            "
          >
            #뷰티
          </button>
          <button 
            onClick={() => handleSearch('게임')}
            className="
            px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full text-sm 
            hover:scale-105 transition-all duration-300 shadow-lg shadow-black/10
            hover:cursor-pointer
            "
          >
            #게임
          </button>
          <button 
            onClick={() => handleSearch('음악')}
            className="   
            px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full text-sm 
            hover:scale-105 transition-all duration-300
            shadow-lg shadow-black/10
            hover:cursor-pointer
            "
          >
            #음악
          </button>
          <button 
            onClick={() => handleSearch('요리')}
            className="
            px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full text-sm 
            hover:scale-105 transition-all duration-300
            shadow-lg shadow-black/10
            hover:cursor-pointer
            "
          >
            #요리
          </button>
          <button 
            onClick={() => handleSearch('브이로그')}
            className="
            px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full text-sm 
            hover:scale-105 transition-all duration-300
            shadow-lg shadow-black/10
            hover:cursor-pointer
            "
          >
            #브이로그
          </button>
          <button 
            onClick={() => handleSearch('운동')}
            className="
            px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full text-sm 
            hover:scale-105 transition-all duration-300
            shadow-lg shadow-black/10
            hover:cursor-pointer
            "
          >
            #운동
          </button>
        </div>
      </div>
    </main>
    </>
  )
}