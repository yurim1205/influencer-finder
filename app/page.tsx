import SearchBar from "@/components/common/mainSearchBar";

export default function Home() {
  return (
    <main className="bg-[#f6f3fb] min-h-screen max-w-6xl mx-auto px-6 py-10">
      <section className="mb-12 max-w-xl mx-auto text-center mt-20">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text mb-3">
           키워드로 인플루언서를 탐색해보세요 🔍
        </h1>
        {/* <p className="text-gray-500">
          서브 문구 
        </p> */}
      </section>

      <section className="mb-8">

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
          <SearchBar />
        </div>
      </div>
    </main>
  )
}