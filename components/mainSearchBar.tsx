'use client';

import { Search } from 'lucide-react';
import { useState } from 'react';

interface SearchBarProps {
  onSearch: (keyword: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // 부모 함수에 검색 키워드 전달
  const handleSearch = () => {
    onSearch(searchQuery); // searchQuery: 사용자가 입력한 검색 키워드임
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="relative w-full flex items-center">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="검색어를 입력해주세요"
        className="
          w-full h-14 lg:h-16 
          pl-6 pr-16 lg:pl-8 lg:pr-20
          bg-white rounded-full
          text-base font-medium text-gray-800
          placeholder:text-[#a9a9a9]
          shadow-[0px_30px_60px_0px_rgba(0,0,0,0.1)]
          focus:outline-none focus:ring-2 focus:ring-[#6A4F6A]/20
          transition-all duration-300
        "
      />
    
      <button
        type="button"
        onClick={handleSearch}
        aria-label="검색"
        className="absolute right-5 text-black hover:text-[#6A4F6A] transition-colors cursor-pointer"
      >
        <Search className="w-5 h-5 lg:w-6 lg:h-6" />
      </button>
  </div>
  );
}