'use client';

import SearchBar from "@/components/mainSearchBar";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Header from "@/components/Header";

export default function Home() {
  const router = useRouter();

  // 검색 키워드 받는 부모 함수
  const handleSearch = (keyword: string) => {
    if (!keyword.trim()) {
      toast.error(`검색어를 입력해주세요!` , {      // toast.error: 에러 메시지 출력
        duration: 2000, 
        position: "top-center" 
      }); 
      return;
    }
      router.push(`/search?keyword=${encodeURIComponent(keyword)}`);
  };

  const categories = ['#뷰티', '#게임', '#음악', '#요리', '#여행', '#브이로그'];

  return (
    <>
    <Toaster position="top-center" />
    <Header />
    <main className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-[12vh] bg-page-gradient">
      <h1 className="mb-16 lg:mb-28 text-center text-2xl sm:text-3xl lg:text-4xl font-medium text-black">
        키워드로 원하는 채널을 탐색해보세요
      </h1>

      <div className="w-full max-w-3xl">
        <SearchBar onSearch={handleSearch} />

        <div className="mt-6 flex flex-wrap justify-center gap-3 lg:gap-4">
          {categories.map((category, i) => (
            <button
              key={i}
              onClick={() => handleSearch(category.replace('#', ''))}
              className="h-10 lg:h-12 px-5 lg:px-6 text-sm lg:text-base 
              rounded-full bg-white text-[#3f3f3f]
              transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </main>
    </>
  )
}