'use client';

import SearchBar from "@/components/common/mainSearchBar";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function Home() {
  const router = useRouter();

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
    <main className="bg-[#f6f3fb] min-h-screen max-w-6xl mx-auto px-6 py-10">
      <section className="mb-12 max-w-xl mx-auto text-center mt-20">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text mb-3">
           키워드로 인플루언서를 탐색해보세요 🔍
        </h1>
      </section>

      <div className="flex justify-center mt-30">
        <div className="
          w-full max-w-[1101px] h-[250px]
          bg-white/60
          backdrop-blur-md
          rounded-[32px]
          border-2 border-white/50
          shadow-2xl shadow-purple-200/50
          flex items-center justify-center
          py-8 px-12
        ">
          <SearchBar onSearch={handleSearch}/>
        </div>
      </div>
    </main>
    </>
  )
}